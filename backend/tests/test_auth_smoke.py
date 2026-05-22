import os
import sys
import importlib
from pathlib import Path
from typing import Any

import pytest
from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


class _Result:
    def __init__(self, data):
        self.data = data


class _Query:
    def __init__(self, table_name: str, store: dict[str, list[dict[str, Any]]]):
        self.table_name = table_name
        self.store = store
        self._rows = store[table_name]
        self._pending_insert = None
        self._limit = None

    def select(self, _fields: str):
        return self

    def eq(self, key: str, value: Any):
        self._rows = [r for r in self._rows if r.get(key) == value]
        return self

    def limit(self, n: int):
        self._limit = n
        return self

    def insert(self, doc: dict[str, Any]):
        self._pending_insert = doc
        return self

    async def execute(self):
        if self._pending_insert is not None:
            self.store[self.table_name].append(self._pending_insert)
            return _Result([self._pending_insert])

        rows = self._rows[: self._limit] if self._limit else self._rows
        return _Result(rows)


class _FakeDB:
    def __init__(self):
        self.store = {"users": []}

    def table(self, name: str):
        return _Query(name, self.store)


@pytest.fixture
def client_and_db(monkeypatch):
    monkeypatch.setenv("JWT_SECRET", "test-secret")

    import server
    importlib.reload(server)

    fake_db = _FakeDB()

    async def _fake_get_db():
        return fake_db

    monkeypatch.setattr(server, "get_db", _fake_get_db)

    async def _fake_init_db():
        return fake_db

    monkeypatch.setattr(server, "init_db", _fake_init_db)

    with TestClient(server.app) as client:
        yield client, fake_db


def test_register_success_sets_cookie(client_and_db):
    client, _db = client_and_db
    payload = {"name": "Jane", "email": "jane@example.com", "password": "1234"}

    response = client.post("/api/auth/register", json=payload)

    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "jane@example.com"
    assert body["name"] == "Jane"
    assert "session_token" in response.headers.get("set-cookie", "")


def test_login_invalid_credentials_returns_401(client_and_db):
    client, _db = client_and_db

    response = client.post("/api/auth/login", json={"email": "nope@example.com", "password": "bad"})

    assert response.status_code == 401
    assert response.json().get("detail") == "Invalid credentials"


def test_auth_me_unauthenticated_returns_401(client_and_db):
    client, _db = client_and_db

    response = client.get("/api/auth/me")

    assert response.status_code == 401
    assert response.json().get("detail") == "Not authenticated"


def test_logout_clears_cookie(client_and_db):
    client, _db = client_and_db

    response = client.post("/api/auth/logout")

    assert response.status_code == 200
    assert response.json().get("message") == "Logged out successfully"
    assert "session_token=" in response.headers.get("set-cookie", "")
