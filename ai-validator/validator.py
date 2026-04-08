import yaml
import json
import logging
import requests
import os
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from dataclasses import dataclass
from typing import Dict, Any, Tuple
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
from cryptography.exceptions import InvalidSignature
try:
    from confluent_kafka import Consumer, KafkaError, KafkaException
except ImportError:
    Consumer = None
import numpy as np

from cardano_updater import CardanoUpdater
from base_updater import BaseUpdater

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ValidationResult:
    status: str
    confidence: float
    tampering_prob: float
    uncertainty_bounds: Tuple[float, float]
    action: str

class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status": "UP"}')
        else:
            self.send_response(404)
            self.end_headers()

def start_health_server():
    server = HTTPServer(('0.0.0.0', 8080), HealthHandler)
    server.serve_forever()

class AIDataValidator:
    def __init__(self, config_path="policies/sensor_profiles.yaml"):
        try:
            with open(config_path, "r") as f:
                self.sensor_profiles = yaml.safe_load(f)
        except Exception:
            self.sensor_profiles = {}
            logger.warning("sensor_profiles config empty or missing.")
            
        self.nonce_registry = {} 
        self.historical_data = {} 
        self.spatial_data = {} 
        
        self.opa_url = os.getenv("OPA_URL", "http://localhost:8181/v1/data/malama/sensor")
        self.slack_webhook = os.getenv("SLACK_WEBHOOK")
        
        kafka_broker = os.getenv("KAFKA_BROKER", "localhost:9092")
        if Consumer:
            self.consumer = Consumer({
                'bootstrap.servers': kafka_broker,
                'group.id': 'ai-validator-group',
                'auto.offset.reset': 'earliest',
                'enable.auto.commit': False
            })
            self.consumer.subscribe(['malama-sensor-streams'])
        else:
            self.consumer = None
            
        self.cardano_updater = CardanoUpdater()
        self.base_updater = BaseUpdater()
        
        threading.Thread(target=start_health_server, daemon=True).start()

    def verify_signature(self, did: str, payload: dict, signature_hex: str) -> bool:
        try:
            pub_key_hex = self.cardano_updater.get_sensor_pubkey(did)
            if not pub_key_hex: return False
            
            pub_key_bytes = bytes.fromhex(pub_key_hex)
            vk = ec.EllipticCurvePublicKey.from_encoded_point(ec.SECP256R1(), pub_key_bytes)
            
            payload_bytes = json.dumps(payload, sort_keys=True).encode()
            digest = hashes.Hash(hashes.SHA256())
            digest.update(payload_bytes)
            payload_hash = digest.finalize()
            
            sig_bytes = bytes.fromhex(signature_hex)
            vk.verify(sig_bytes, payload_hash, ec.ECDSA(hashes.SHA256())) 
            return True
        except Exception as e:
            logger.error(f"Signature verification failed: {e}")
            return False

    def check_temporal_drift(self, did: str, current_value: float) -> float:
        history = self.historical_data.get(did, [])
        if len(history) < 5:
            return 1.0 
        median = np.median(history)
        drift = abs(current_value - median) / (median + 1e-6)
        return max(0.0, 1.0 - (drift * 2.0))

    def check_spatial_correlation(self, h3_index: str, current_value: float) -> float:
        spatial = self.spatial_data.get(h3_index, [])
        if len(spatial) < 3:
            return 1.0
        median = np.median(spatial)
        diff = abs(current_value - median) / (median + 1e-6)
        return max(0.0, 1.0 - (diff * 2.5))

    def monte_carlo_uncertainty(self, value: float) -> Tuple[float, float]:
        samples = np.random.normal(value, abs(value) * 0.02, 1000)
        return float(np.percentile(samples, 5)), float(np.percentile(samples, 95))

    def validate_reading(self, sensor_did: str, reading: dict, signature: str) -> ValidationResult:
        nonce = reading.get("timestamp", 0)
        previous_nonce = self.nonce_registry.get(sensor_did, 0)
        
        sig_verified = self.verify_signature(sensor_did, reading, signature)
        val = reading.get("readings", {}).get("temperature", 25.0)
        
        temp_score = self.check_temporal_drift(sensor_did, val)
        h3 = reading.get("location_h3", "8928308280fffff")
        spatial_score = self.check_spatial_correlation(h3, val)
        
        bounds = self.monte_carlo_uncertainty(val)
        
        confidence = (temp_score + spatial_score) / 2.0
        if not sig_verified:
            confidence = 0.0
            
        tampering_prob = 1.0 - confidence
        
        sensor_type = reading.get("sensor_type", "BME680")
        profile = self.sensor_profiles.get(sensor_type, {})

        opa_input = {
            "input": {
                "confidence": confidence,
                "tampering_probability": tampering_prob,
                "nonce": nonce,
                "previous_nonce": previous_nonce,
                "signature_verified": sig_verified,
                "readings": reading.get("readings", {}),
                "sensor_profile": profile
            }
        }
        
        action = "ACCEPT"
        status = "valid"
        
        try:
            resp = requests.post(self.opa_url, json=opa_input).json()
            res = resp.get("result", {})
            
            if res.get("slash", False) or res.get("replay_attack", False) or res.get("signature_invalid", False):
                action = "SLASH"
                status = "invalid"
            elif res.get("quarantine", False) or res.get("out_of_range", False):
                action = "QUARANTINE"
                status = "invalid"
            else:
                action = "ACCEPT"
                status = "valid"
                self.historical_data.setdefault(sensor_did, []).append(val)
                self.historical_data[sensor_did] = self.historical_data[sensor_did][-24:]
                
                self.spatial_data.setdefault(h3, []).append(val)
                self.spatial_data[h3] = self.spatial_data[h3][-50:]
                self.nonce_registry[sensor_did] = nonce
                
        except Exception as e:
            logger.error(f"OPA Evaluation connection failed, defaulting to Quarantined check constraint: {e}")
            action = "QUARANTINE"
            
        return ValidationResult(status, confidence, tampering_prob, bounds, action)

    def trigger_slack(self, msg: str):
        if self.slack_webhook:
            try:
                requests.post(self.slack_webhook, json={"text": msg})
            except Exception:
                pass
            
    def stream_validation_results(self):
        if not self.consumer:
            logger.error("Kafka consumer unavailable. Validation stream exiting.")
            return
            
        logger.info("Starting validation stream...")
        try:
            while True:
                msg = self.consumer.poll(1.0)
                if msg is None: continue
                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        continue
                    else:
                        raise KafkaException(msg.error())
                
                data = json.loads(msg.value().decode('utf-8'))
                payload = data.get("payload", {})
                signature = data.get("signature", "")
                did = payload.get("did", "")
                
                res = self.validate_reading(did, payload, signature)
                logger.info(f"Validated {did}: Action={res.action}")
                
                if res.action == "QUARANTINE":
                    c_success = self.cardano_updater.update_sensor_reputation(did, 40, True)
                    b_success = self.base_updater.update_reputation(did, 40)
                    if c_success and b_success:
                        self.consumer.commit(msg)
                
                elif res.action == "SLASH":
                    self.trigger_slack(f"🚨 SLASH Action Required for Sensor {did} | Tampering Prob: {res.tampering_prob}")
                    c_success = self.cardano_updater.update_sensor_reputation(did, 0, True)
                    b_success = self.base_updater.update_reputation(did, 0)
                    if c_success and b_success:
                        self.consumer.commit(msg)
                else:
                    self.consumer.commit(msg)
                    
        except KeyboardInterrupt:
            logger.info("Shutting down stream...")
        finally:
            self.consumer.close()

if __name__ == "__main__":
    v = AIDataValidator(config_path="/app/policies/sensor_profiles.yaml")
    v.stream_validation_results()
