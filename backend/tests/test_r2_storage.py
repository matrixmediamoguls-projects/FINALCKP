import importlib
import sys
from pathlib import Path
from unittest.mock import Mock


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


def load_server(monkeypatch, **environment):
    monkeypatch.setenv("JWT_SECRET", "test-secret")
    for name in (
        "R2_ACCOUNT_ID",
        "R2_ENDPOINT",
        "R2_ACCESS_KEY_ID",
        "R2_SECRET_ACCESS_KEY",
        "R2_BUCKET_NAME",
    ):
        monkeypatch.setenv(name, "")
    for name, value in environment.items():
        monkeypatch.setenv(name, value)

    import server
    return importlib.reload(server)


def test_init_storage_uses_explicit_r2_endpoint(monkeypatch):
    server = load_server(
        monkeypatch,
        R2_ENDPOINT="https://custom.example.test/",
        R2_ACCESS_KEY_ID="access-key",
        R2_SECRET_ACCESS_KEY="secret-key",
        R2_BUCKET_NAME="bucket",
    )
    client = Mock()
    boto_client = Mock(return_value=client)
    monkeypatch.setattr(server.boto3, "client", boto_client)

    assert server.init_storage() is client
    assert boto_client.call_args.kwargs["endpoint_url"] == "https://custom.example.test"


def test_init_storage_derives_endpoint_from_account_id(monkeypatch):
    server = load_server(
        monkeypatch,
        R2_ACCOUNT_ID="account-id",
        R2_ACCESS_KEY_ID="access-key",
        R2_SECRET_ACCESS_KEY="secret-key",
        R2_BUCKET_NAME="bucket",
    )
    boto_client = Mock(return_value=Mock())
    monkeypatch.setattr(server.boto3, "client", boto_client)

    server.init_storage()

    assert boto_client.call_args.kwargs["endpoint_url"] == (
        "https://account-id.r2.cloudflarestorage.com"
    )


def test_verify_storage_connection_checks_configured_bucket(monkeypatch):
    server = load_server(
        monkeypatch,
        R2_ENDPOINT="https://custom.example.test",
        R2_ACCESS_KEY_ID="access-key",
        R2_SECRET_ACCESS_KEY="secret-key",
        R2_BUCKET_NAME="bucket",
    )
    client = Mock()
    monkeypatch.setattr(server, "init_storage", lambda: client)

    assert server.verify_storage_connection() is True
    client.head_bucket.assert_called_once_with(Bucket="bucket")


def test_init_storage_returns_none_when_bucket_is_missing(monkeypatch):
    server = load_server(
        monkeypatch,
        R2_ENDPOINT="https://custom.example.test",
        R2_ACCESS_KEY_ID="access-key",
        R2_SECRET_ACCESS_KEY="secret-key",
    )
    boto_client = Mock()
    monkeypatch.setattr(server.boto3, "client", boto_client)

    assert server.init_storage() is None
    boto_client.assert_not_called()
