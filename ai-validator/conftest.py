"""Pre-mock heavy external dependencies that may not be installed in CI/test."""
import sys
from unittest.mock import MagicMock

# pycardano is not installed in the test environment — stub it before any
# module in the test graph tries to import it.
if "pycardano" not in sys.modules:
    sys.modules["pycardano"] = MagicMock()

# confluent_kafka may not be installed — stub it so main.py can import.
if "confluent_kafka" not in sys.modules:
    kafka_mock = MagicMock()
    # Give KafkaError._PARTITION_EOF a real int value so comparisons work.
    kafka_mock.KafkaError._PARTITION_EOF = -191
    sys.modules["confluent_kafka"] = kafka_mock

# web3 >= 7 removed geth_poa_middleware from web3.middleware.
# Patch it in so base_updater.py can import without error.
try:
    from web3.middleware import geth_poa_middleware  # noqa: F401
except ImportError:
    import web3.middleware as _wm
    _wm.geth_poa_middleware = MagicMock()
