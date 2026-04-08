"""
Test suite for ai-validator/validator.py
Targets 80%+ coverage of AIDataValidator and supporting code.
"""

import json
import pytest
import numpy as np
from unittest.mock import patch, MagicMock, PropertyMock

from validator import AIDataValidator, ValidationResult, HealthHandler, start_health_server


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def validator():
    """Create an AIDataValidator with all external deps mocked out."""
    with patch("validator.CardanoUpdater") as MockCardano, \
         patch("validator.BaseUpdater") as MockBase, \
         patch("validator.threading.Thread"):  # suppress health-server thread
        mock_cardano = MockCardano.return_value
        mock_cardano.get_sensor_pubkey.return_value = None
        mock_cardano.update_sensor_reputation.return_value = True

        mock_base = MockBase.return_value
        mock_base.update_reputation.return_value = True

        # config_path intentionally invalid -> empty sensor_profiles
        v = AIDataValidator(config_path="/nonexistent.yaml")
        # force consumer to None (kafka not available in test)
        v.consumer = None
        yield v


@pytest.fixture
def validator_with_profiles(tmp_path):
    """Validator loaded with a real sensor_profiles YAML file."""
    profiles = {
        "BME680": {
            "temperature": {"min": 5.0, "max": 45.0},
            "humidity": {"min": 10.0, "max": 95.0},
        }
    }
    import yaml
    config = tmp_path / "profiles.yaml"
    config.write_text(yaml.dump(profiles))

    with patch("validator.CardanoUpdater") as MockCardano, \
         patch("validator.BaseUpdater"), \
         patch("validator.threading.Thread"):
        MockCardano.return_value.get_sensor_pubkey.return_value = None
        MockCardano.return_value.update_sensor_reputation.return_value = True
        v = AIDataValidator(config_path=str(config))
        v.consumer = None
        yield v


@pytest.fixture
def sample_reading():
    return {
        "timestamp": 1000,
        "readings": {"temperature": 25.0},
        "location_h3": "8928308280fffff",
        "sensor_type": "BME680",
    }


# ---------------------------------------------------------------------------
# ValidationResult dataclass
# ---------------------------------------------------------------------------

class TestValidationResult:
    def test_fields(self):
        r = ValidationResult("valid", 0.95, 0.05, (24.5, 25.5), "ACCEPT")
        assert r.status == "valid"
        assert r.confidence == 0.95
        assert r.tampering_prob == 0.05
        assert r.uncertainty_bounds == (24.5, 25.5)
        assert r.action == "ACCEPT"


# ---------------------------------------------------------------------------
# Signature verification
# ---------------------------------------------------------------------------

class TestVerifySignature:
    def test_returns_false_when_no_pubkey(self, validator):
        """No public key found -> False."""
        assert validator.verify_signature("did:malama:1234", {}, "aabb") is False

    def test_returns_false_on_invalid_hex(self, validator):
        """Bad hex in signature -> exception caught -> False."""
        validator.cardano_updater.get_sensor_pubkey.return_value = "deadbeef"
        assert validator.verify_signature("did:malama:1234", {"a": 1}, "not_hex!!") is False

    def test_returns_false_on_bad_point(self, validator):
        """Valid hex but not a valid EC point -> False."""
        validator.cardano_updater.get_sensor_pubkey.return_value = "aa" * 33
        assert validator.verify_signature("did:malama:x", {}, "bb" * 64) is False

    def test_valid_ecdsa_signature(self, validator):
        """Generate a real ECDSA key-pair, sign, and verify."""
        from cryptography.hazmat.primitives.asymmetric import ec
        from cryptography.hazmat.primitives import hashes

        private_key = ec.generate_private_key(ec.SECP256R1())
        pub_bytes = private_key.public_key().public_bytes(
            encoding=__import__("cryptography.hazmat.primitives.serialization",
                                fromlist=["Encoding"]).Encoding.X962,
            format=__import__("cryptography.hazmat.primitives.serialization",
                              fromlist=["PublicFormat"]).PublicFormat.UncompressedPoint,
        )
        pub_hex = pub_bytes.hex()
        validator.cardano_updater.get_sensor_pubkey.return_value = pub_hex

        payload = {"sensor": "abc", "value": 42}
        payload_bytes = json.dumps(payload, sort_keys=True).encode()
        digest = hashes.Hash(hashes.SHA256())
        digest.update(payload_bytes)
        payload_hash = digest.finalize()

        sig = private_key.sign(payload_hash, ec.ECDSA(hashes.SHA256()))
        sig_hex = sig.hex()

        assert validator.verify_signature("did:malama:abc", payload, sig_hex) is True

    def test_wrong_signature_fails(self, validator):
        """Valid key but wrong signature bytes -> False."""
        from cryptography.hazmat.primitives.asymmetric import ec
        from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

        private_key = ec.generate_private_key(ec.SECP256R1())
        pub_hex = private_key.public_key().public_bytes(
            Encoding.X962, PublicFormat.UncompressedPoint
        ).hex()
        validator.cardano_updater.get_sensor_pubkey.return_value = pub_hex

        # signature is random garbage
        assert validator.verify_signature("did:malama:abc", {"x": 1}, "ab" * 64) is False


# ---------------------------------------------------------------------------
# Temporal drift
# ---------------------------------------------------------------------------

class TestTemporalDrift:
    def test_insufficient_history_returns_1(self, validator):
        assert validator.check_temporal_drift("sensor_a", 25.0) == 1.0

    def test_stable_history(self, validator):
        validator.historical_data["s1"] = [25.0] * 10
        score = validator.check_temporal_drift("s1", 25.0)
        assert score == pytest.approx(1.0, abs=0.01)

    def test_large_drift_clamps_to_zero(self, validator):
        validator.historical_data["s2"] = [10.0] * 10
        score = validator.check_temporal_drift("s2", 100.0)
        assert score == 0.0

    @pytest.mark.parametrize("value,expected_low", [
        (26.0, 0.5),   # moderate drift from median=25
        (30.0, 0.0),   # large drift
    ])
    def test_drift_scaling(self, validator, value, expected_low):
        validator.historical_data["s3"] = [25.0] * 10
        score = validator.check_temporal_drift("s3", value)
        assert score <= 1.0
        assert score >= 0.0


# ---------------------------------------------------------------------------
# Spatial correlation
# ---------------------------------------------------------------------------

class TestSpatialCorrelation:
    def test_insufficient_neighbors_returns_1(self, validator):
        assert validator.check_spatial_correlation("h3_idx", 25.0) == 1.0

    def test_stable_neighbors(self, validator):
        validator.spatial_data["h3"] = [25.0] * 5
        score = validator.check_spatial_correlation("h3", 25.0)
        assert score == pytest.approx(1.0, abs=0.01)

    def test_outlier_clamps_to_zero(self, validator):
        validator.spatial_data["h3"] = [10.0] * 5
        score = validator.check_spatial_correlation("h3", 100.0)
        assert score == 0.0


# ---------------------------------------------------------------------------
# Monte Carlo uncertainty
# ---------------------------------------------------------------------------

class TestMonteCarloUncertainty:
    def test_returns_tuple(self, validator):
        low, high = validator.monte_carlo_uncertainty(25.0)
        assert isinstance(low, float)
        assert isinstance(high, float)
        assert low < high

    def test_bounds_near_value(self, validator):
        low, high = validator.monte_carlo_uncertainty(100.0)
        # 2% std dev => 90% CI should be within ~5% of value
        assert low > 90.0
        assert high < 110.0

    def test_zero_value(self, validator):
        low, high = validator.monte_carlo_uncertainty(0.0)
        # zero * 0.02 = 0 std dev => all samples = 0
        assert low == pytest.approx(0.0, abs=0.01)
        assert high == pytest.approx(0.0, abs=0.01)


# ---------------------------------------------------------------------------
# validate_reading — OPA integration
# ---------------------------------------------------------------------------

class TestValidateReading:

    def _mock_opa_accept(self):
        """OPA returns all-clear result."""
        resp = MagicMock()
        resp.json.return_value = {"result": {
            "slash": False, "replay_attack": False,
            "signature_invalid": False, "quarantine": False,
            "out_of_range": False,
        }}
        return resp

    def _mock_opa_slash(self):
        resp = MagicMock()
        resp.json.return_value = {"result": {
            "slash": True, "replay_attack": False,
            "signature_invalid": False, "quarantine": False,
            "out_of_range": False,
        }}
        return resp

    def _mock_opa_quarantine(self):
        resp = MagicMock()
        resp.json.return_value = {"result": {
            "slash": False, "replay_attack": False,
            "signature_invalid": False, "quarantine": True,
            "out_of_range": False,
        }}
        return resp

    @patch("validator.requests.post")
    def test_accept_path(self, mock_post, validator, sample_reading):
        mock_post.return_value = self._mock_opa_accept()
        result = validator.validate_reading("did:malama:s1", sample_reading, "bad_sig")
        assert result.action == "ACCEPT"
        assert result.status == "valid"
        # confidence is 0 because sig verification fails
        assert result.confidence == 0.0

    @patch("validator.requests.post")
    def test_accept_updates_history(self, mock_post, validator, sample_reading):
        """On ACCEPT, historical_data and spatial_data should be updated."""
        mock_post.return_value = self._mock_opa_accept()
        did = "did:malama:hist"
        validator.validate_reading(did, sample_reading, "sig")
        assert did in validator.historical_data
        assert len(validator.historical_data[did]) == 1
        h3 = sample_reading["location_h3"]
        assert h3 in validator.spatial_data

    @patch("validator.requests.post")
    def test_accept_caps_history_at_24(self, mock_post, validator, sample_reading):
        """History should be capped at 24 entries."""
        mock_post.return_value = self._mock_opa_accept()
        did = "did:malama:cap"
        for i in range(30):
            sample_reading["timestamp"] = i
            validator.validate_reading(did, sample_reading, "sig")
        assert len(validator.historical_data[did]) == 24

    @patch("validator.requests.post")
    def test_accept_caps_spatial_at_50(self, mock_post, validator, sample_reading):
        mock_post.return_value = self._mock_opa_accept()
        did = "did:malama:sp"
        for i in range(60):
            sample_reading["timestamp"] = i
            validator.validate_reading(did, sample_reading, "sig")
        h3 = sample_reading["location_h3"]
        assert len(validator.spatial_data[h3]) == 50

    @patch("validator.requests.post")
    def test_slash_path(self, mock_post, validator, sample_reading):
        mock_post.return_value = self._mock_opa_slash()
        result = validator.validate_reading("did:malama:s1", sample_reading, "sig")
        assert result.action == "SLASH"
        assert result.status == "invalid"

    @patch("validator.requests.post")
    def test_quarantine_path(self, mock_post, validator, sample_reading):
        mock_post.return_value = self._mock_opa_quarantine()
        result = validator.validate_reading("did:malama:s1", sample_reading, "sig")
        assert result.action == "QUARANTINE"
        assert result.status == "invalid"

    @patch("validator.requests.post")
    def test_replay_attack(self, mock_post, validator, sample_reading):
        resp = MagicMock()
        resp.json.return_value = {"result": {"replay_attack": True, "slash": False,
                                             "signature_invalid": False, "quarantine": False,
                                             "out_of_range": False}}
        mock_post.return_value = resp
        result = validator.validate_reading("did:malama:r", sample_reading, "sig")
        assert result.action == "SLASH"
        assert result.status == "invalid"

    @patch("validator.requests.post")
    def test_signature_invalid_flag(self, mock_post, validator, sample_reading):
        resp = MagicMock()
        resp.json.return_value = {"result": {"signature_invalid": True, "slash": False,
                                             "replay_attack": False, "quarantine": False,
                                             "out_of_range": False}}
        mock_post.return_value = resp
        result = validator.validate_reading("did:malama:si", sample_reading, "sig")
        assert result.action == "SLASH"
        assert result.status == "invalid"

    @patch("validator.requests.post")
    def test_out_of_range_flag(self, mock_post, validator, sample_reading):
        resp = MagicMock()
        resp.json.return_value = {"result": {"out_of_range": True, "slash": False,
                                             "replay_attack": False, "signature_invalid": False,
                                             "quarantine": False}}
        mock_post.return_value = resp
        result = validator.validate_reading("did:malama:oor", sample_reading, "sig")
        assert result.action == "QUARANTINE"
        assert result.status == "invalid"

    @patch("validator.requests.post", side_effect=Exception("connection refused"))
    def test_opa_connection_failure_quarantines(self, mock_post, validator, sample_reading):
        result = validator.validate_reading("did:malama:fail", sample_reading, "sig")
        assert result.action == "QUARANTINE"

    @patch("validator.requests.post")
    def test_nonce_registry_updated_on_accept(self, mock_post, validator, sample_reading):
        mock_post.return_value = self._mock_opa_accept()
        sample_reading["timestamp"] = 42
        validator.validate_reading("did:malama:n", sample_reading, "sig")
        assert validator.nonce_registry["did:malama:n"] == 42

    @patch("validator.requests.post")
    def test_nonce_registry_not_updated_on_slash(self, mock_post, validator, sample_reading):
        mock_post.return_value = self._mock_opa_slash()
        sample_reading["timestamp"] = 99
        validator.validate_reading("did:malama:ns", sample_reading, "sig")
        assert "did:malama:ns" not in validator.nonce_registry


# ---------------------------------------------------------------------------
# Confidence scoring
# ---------------------------------------------------------------------------

class TestConfidenceScoring:

    @patch("validator.requests.post")
    def test_confidence_zero_when_sig_fails(self, mock_post, validator, sample_reading):
        """Signature failure forces confidence to 0."""
        mock_post.return_value = MagicMock()
        mock_post.return_value.json.return_value = {"result": {}}
        result = validator.validate_reading("did:malama:c0", sample_reading, "bad")
        assert result.confidence == 0.0
        assert result.tampering_prob == 1.0

    @patch("validator.requests.post")
    def test_confidence_1_with_stable_data(self, mock_post, validator, sample_reading):
        """With verified sig and stable history, confidence should be 1.0."""
        mock_post.return_value = MagicMock()
        mock_post.return_value.json.return_value = {"result": {}}

        # Mock verify_signature to return True
        with patch.object(validator, "verify_signature", return_value=True):
            result = validator.validate_reading("did:malama:c1", sample_reading, "sig")
            # No history => temporal_score=1.0, spatial_score=1.0 => confidence=1.0
            assert result.confidence == 1.0
            assert result.tampering_prob == 0.0

    @patch("validator.requests.post")
    def test_confidence_degrades_with_drift(self, mock_post, validator, sample_reading):
        """Temporal drift should reduce confidence below 1.0."""
        mock_post.return_value = MagicMock()
        mock_post.return_value.json.return_value = {"result": {}}

        validator.historical_data["did:malama:d"] = [10.0] * 10
        sample_reading["readings"]["temperature"] = 20.0

        with patch.object(validator, "verify_signature", return_value=True):
            result = validator.validate_reading("did:malama:d", sample_reading, "sig")
            assert result.confidence < 1.0


# ---------------------------------------------------------------------------
# Edge cases: missing fields
# ---------------------------------------------------------------------------

class TestEdgeCases:

    @patch("validator.requests.post")
    def test_missing_readings_key(self, mock_post, validator):
        """Reading dict with no 'readings' key should default to temperature=25."""
        mock_post.return_value = MagicMock()
        mock_post.return_value.json.return_value = {"result": {}}
        reading = {"timestamp": 1}
        result = validator.validate_reading("did:malama:m", reading, "sig")
        assert isinstance(result, ValidationResult)

    @patch("validator.requests.post")
    def test_missing_timestamp(self, mock_post, validator):
        """No timestamp -> nonce defaults to 0."""
        mock_post.return_value = MagicMock()
        mock_post.return_value.json.return_value = {"result": {}}
        reading = {"readings": {"temperature": 20.0}}
        result = validator.validate_reading("did:malama:ts", reading, "sig")
        assert isinstance(result, ValidationResult)

    @patch("validator.requests.post")
    def test_missing_sensor_type(self, mock_post, validator_with_profiles, sample_reading):
        """Unknown sensor_type -> empty profile."""
        mock_post.return_value = MagicMock()
        mock_post.return_value.json.return_value = {"result": {}}
        sample_reading["sensor_type"] = "UNKNOWN_SENSOR"
        result = validator_with_profiles.validate_reading("did:malama:u", sample_reading, "sig")
        assert isinstance(result, ValidationResult)

    @patch("validator.requests.post")
    def test_empty_opa_result(self, mock_post, validator, sample_reading):
        """OPA returns empty result dict -> ACCEPT path."""
        mock_post.return_value = MagicMock()
        mock_post.return_value.json.return_value = {"result": {}}
        result = validator.validate_reading("did:malama:e", sample_reading, "sig")
        assert result.action == "ACCEPT"

    @patch("validator.requests.post")
    def test_negative_temperature(self, mock_post, validator):
        """Negative temperature value should still produce a result."""
        mock_post.return_value = MagicMock()
        mock_post.return_value.json.return_value = {"result": {}}
        reading = {"timestamp": 1, "readings": {"temperature": -20.0}}
        result = validator.validate_reading("did:malama:neg", reading, "sig")
        assert isinstance(result, ValidationResult)


# ---------------------------------------------------------------------------
# Slack notification
# ---------------------------------------------------------------------------

class TestSlackNotification:

    def test_no_webhook_does_nothing(self, validator):
        validator.slack_webhook = None
        # should not raise
        validator.trigger_slack("test message")

    @patch("validator.requests.post")
    def test_webhook_called(self, mock_post, validator):
        validator.slack_webhook = "https://hooks.slack.com/test"
        validator.trigger_slack("alert!")
        mock_post.assert_called_once_with(
            "https://hooks.slack.com/test",
            json={"text": "alert!"}
        )

    @patch("validator.requests.post", side_effect=Exception("network error"))
    def test_webhook_failure_swallowed(self, mock_post, validator):
        validator.slack_webhook = "https://hooks.slack.com/test"
        # should not raise
        validator.trigger_slack("fail gracefully")


# ---------------------------------------------------------------------------
# stream_validation_results (Kafka consumer loop)
# ---------------------------------------------------------------------------

class TestStreamValidation:

    def test_no_consumer_exits_immediately(self, validator):
        """With consumer=None the method should return without error."""
        validator.consumer = None
        validator.stream_validation_results()

    def test_accept_commits(self, validator):
        """ACCEPT action should commit the message."""
        mock_consumer = MagicMock()
        msg1 = MagicMock()
        msg1.error.return_value = None
        msg1.value.return_value = json.dumps({
            "payload": {"did": "did:malama:a", "timestamp": 1,
                        "readings": {"temperature": 25.0}},
            "signature": "aabb"
        }).encode()

        # first poll returns msg, second raises KeyboardInterrupt
        mock_consumer.poll.side_effect = [msg1, KeyboardInterrupt]
        validator.consumer = mock_consumer

        with patch.object(validator, "validate_reading") as mock_vr:
            mock_vr.return_value = ValidationResult("valid", 1.0, 0.0, (24.5, 25.5), "ACCEPT")
            validator.stream_validation_results()
            mock_consumer.commit.assert_called_once_with(msg1)

    def test_quarantine_updates_reputation_then_commits(self, validator):
        mock_consumer = MagicMock()
        msg1 = MagicMock()
        msg1.error.return_value = None
        msg1.value.return_value = json.dumps({
            "payload": {"did": "did:malama:q", "timestamp": 1,
                        "readings": {"temperature": 25.0}},
            "signature": "aabb"
        }).encode()

        mock_consumer.poll.side_effect = [msg1, KeyboardInterrupt]
        validator.consumer = mock_consumer
        validator.cardano_updater.update_sensor_reputation.return_value = True
        validator.base_updater.update_reputation.return_value = True

        with patch.object(validator, "validate_reading") as mock_vr:
            mock_vr.return_value = ValidationResult("invalid", 0.0, 1.0, (24.5, 25.5), "QUARANTINE")
            validator.stream_validation_results()
            validator.cardano_updater.update_sensor_reputation.assert_called_once_with("did:malama:q", 40, True)
            validator.base_updater.update_reputation.assert_called_once_with("did:malama:q", 40)
            mock_consumer.commit.assert_called_once()

    def test_quarantine_no_commit_if_chain_fails(self, validator):
        mock_consumer = MagicMock()
        msg1 = MagicMock()
        msg1.error.return_value = None
        msg1.value.return_value = json.dumps({
            "payload": {"did": "did:malama:qf", "timestamp": 1,
                        "readings": {"temperature": 25.0}},
            "signature": "aabb"
        }).encode()

        mock_consumer.poll.side_effect = [msg1, KeyboardInterrupt]
        validator.consumer = mock_consumer
        validator.cardano_updater.update_sensor_reputation.return_value = False

        with patch.object(validator, "validate_reading") as mock_vr:
            mock_vr.return_value = ValidationResult("invalid", 0.0, 1.0, (24.5, 25.5), "QUARANTINE")
            validator.stream_validation_results()
            mock_consumer.commit.assert_not_called()

    def test_slash_triggers_slack_and_updates(self, validator):
        mock_consumer = MagicMock()
        msg1 = MagicMock()
        msg1.error.return_value = None
        msg1.value.return_value = json.dumps({
            "payload": {"did": "did:malama:sl", "timestamp": 1,
                        "readings": {"temperature": 25.0}},
            "signature": "aabb"
        }).encode()

        mock_consumer.poll.side_effect = [msg1, KeyboardInterrupt]
        validator.consumer = mock_consumer
        validator.cardano_updater.update_sensor_reputation.return_value = True
        validator.base_updater.update_reputation.return_value = True

        with patch.object(validator, "validate_reading") as mock_vr, \
             patch.object(validator, "trigger_slack") as mock_slack:
            mock_vr.return_value = ValidationResult("invalid", 0.0, 1.0, (24.5, 25.5), "SLASH")
            validator.stream_validation_results()
            mock_slack.assert_called_once()
            validator.cardano_updater.update_sensor_reputation.assert_called_once_with("did:malama:sl", 0, True)
            mock_consumer.commit.assert_called_once()

    def test_partition_eof_continues(self, validator):
        """Partition EOF errors should be skipped."""
        mock_consumer = MagicMock()

        eof_msg = MagicMock()
        eof_error = MagicMock()
        eof_error.code.return_value = -191  # _PARTITION_EOF
        eof_msg.error.return_value = eof_error

        mock_consumer.poll.side_effect = [eof_msg, KeyboardInterrupt]
        validator.consumer = mock_consumer
        # should not raise
        validator.stream_validation_results()

    def test_null_poll_continues(self, validator):
        """None from poll should just continue."""
        mock_consumer = MagicMock()
        mock_consumer.poll.side_effect = [None, None, KeyboardInterrupt]
        validator.consumer = mock_consumer
        validator.stream_validation_results()
        mock_consumer.close.assert_called_once()


# ---------------------------------------------------------------------------
# HealthHandler
# ---------------------------------------------------------------------------

class TestHealthHandler:

    def test_health_endpoint_200(self):
        handler = MagicMock(spec=HealthHandler)
        handler.path = "/health"
        handler.wfile = MagicMock()
        HealthHandler.do_GET(handler)
        handler.send_response.assert_called_with(200)

    def test_unknown_path_404(self):
        handler = MagicMock(spec=HealthHandler)
        handler.path = "/unknown"
        handler.wfile = MagicMock()
        HealthHandler.do_GET(handler)
        handler.send_response.assert_called_with(404)


# ---------------------------------------------------------------------------
# Sensor profiles YAML loading
# ---------------------------------------------------------------------------

class TestSensorProfiles:

    def test_missing_config_yields_empty(self, validator):
        assert validator.sensor_profiles == {}

    def test_valid_config_loaded(self, validator_with_profiles):
        assert "BME680" in validator_with_profiles.sensor_profiles
        assert validator_with_profiles.sensor_profiles["BME680"]["temperature"]["min"] == 5.0


# ---------------------------------------------------------------------------
# main.py score_reading (standalone function)
# ---------------------------------------------------------------------------

class TestMainScoreReading:
    """Tests for the score_reading function in main.py."""

    def test_nominal_readings(self):
        from main import score_reading
        conf, flags = score_reading({
            "temperature_c": 20.0,
            "humidity_pct": 50.0,
            "pressure_hpa": 1013.0,
            "gas_kohm": 50.0,
        })
        assert conf == 1.0
        assert flags == []

    def test_all_anomalies(self):
        from main import score_reading
        conf, flags = score_reading({
            "temperature_c": -10.0,
            "humidity_pct": 100.0,
            "pressure_hpa": 500.0,
            "gas_kohm": 1000.0,
        })
        assert conf == 0.0
        assert len(flags) == 4

    @pytest.mark.parametrize("key,bad_val", [
        ("temperature_c", 50.0),
        ("humidity_pct", 0.0),
        ("pressure_hpa", 1100.0),
        ("gas_kohm", 600.0),
    ])
    def test_single_anomaly(self, key, bad_val):
        from main import score_reading
        readings = {
            "temperature_c": 20.0,
            "humidity_pct": 50.0,
            "pressure_hpa": 1013.0,
            "gas_kohm": 50.0,
        }
        readings[key] = bad_val
        conf, flags = score_reading(readings)
        assert conf == 0.75
        assert len(flags) == 1
