"""
Chroma Key Protocol - Backend API Tests v3
Tests for: Auth, License, Payment, Progress, Reflections, Journal, Protocol Engine
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_USER_ADMIN = {"email": "test@demo.com", "password": "test123"}  # is_admin=true, act3_unlocked=true
TEST_USER_REGULAR = {"email": "test2@demo.com", "password": "test123"}  # act3_unlocked=true


class TestHealthAndRoot:
    """Basic API health checks"""
    
    def test_api_root_accessible(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"API root response: {data}")


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_login_admin_user(self):
        """Test login with admin user test@demo.com"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_ADMIN)
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "user_id" in data
        assert data["email"] == TEST_USER_ADMIN["email"]
        assert data.get("is_admin") == True
        assert data.get("act3_unlocked") == True
        print(f"Admin login success: {data['email']}, is_admin={data.get('is_admin')}")
    
    def test_login_regular_user(self):
        """Test login with regular user test2@demo.com"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_REGULAR)
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "user_id" in data
        assert data["email"] == TEST_USER_REGULAR["email"]
        print(f"Regular user login success: {data['email']}")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "invalid@test.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("Invalid credentials correctly rejected")
    
    def test_auth_me_without_token(self):
        """Test /auth/me without authentication"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("Unauthenticated /auth/me correctly rejected")


class TestAuthenticatedEndpoints:
    """Tests requiring authentication"""
    
    @pytest.fixture
    def auth_session_admin(self):
        """Get authenticated session for admin user"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_ADMIN)
        if response.status_code != 200:
            pytest.skip(f"Login failed for admin user: {response.text}")
        return session
    
    @pytest.fixture
    def auth_session_regular(self):
        """Get authenticated session for regular user"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_REGULAR)
        if response.status_code != 200:
            pytest.skip(f"Login failed for regular user: {response.text}")
        return session
    
    def test_auth_me_with_session(self, auth_session_admin):
        """Test /auth/me with valid session"""
        response = auth_session_admin.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data
        assert "email" in data
        print(f"Auth me success: {data['email']}")
    
    def test_progress_get(self, auth_session_admin):
        """Test GET /progress endpoint"""
        response = auth_session_admin.get(f"{BASE_URL}/api/progress")
        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data
        assert "current_act" in data
        assert "level" in data
        print(f"Progress: level={data['level']}, current_act={data['current_act']}")
    
    def test_reflections_get(self, auth_session_admin):
        """Test GET /reflections/{act} endpoint"""
        response = auth_session_admin.get(f"{BASE_URL}/api/reflections/1")
        assert response.status_code == 200
        data = response.json()
        assert "act" in data or "items" in data
        print(f"Reflections for Act 1: {data}")
    
    def test_reflections_update(self, auth_session_admin):
        """Test PUT /reflections endpoint"""
        response = auth_session_admin.put(f"{BASE_URL}/api/reflections", json={
            "act": 1,
            "item_id": "test_item",
            "checked": True
        })
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print("Reflection update success")
    
    def test_journal_crud(self, auth_session_admin):
        """Test Journal CRUD operations"""
        # CREATE
        create_response = auth_session_admin.post(f"{BASE_URL}/api/journal", json={
            "title": "TEST_Journal Entry",
            "content": "Test content for journal",
            "act": 1
        })
        assert create_response.status_code == 200
        created = create_response.json()
        assert "id" in created
        entry_id = created["id"]
        print(f"Journal created: {entry_id}")
        
        # READ
        read_response = auth_session_admin.get(f"{BASE_URL}/api/journal")
        assert read_response.status_code == 200
        entries = read_response.json()
        assert isinstance(entries, list)
        print(f"Journal entries count: {len(entries)}")
        
        # UPDATE
        update_response = auth_session_admin.put(f"{BASE_URL}/api/journal/{entry_id}", json={
            "title": "TEST_Updated Journal Entry",
            "content": "Updated content",
            "act": 1
        })
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["title"] == "TEST_Updated Journal Entry"
        print("Journal updated successfully")
        
        # DELETE
        delete_response = auth_session_admin.delete(f"{BASE_URL}/api/journal/{entry_id}")
        assert delete_response.status_code == 200
        print("Journal deleted successfully")
    
    def test_logout(self, auth_session_admin):
        """Test logout endpoint"""
        response = auth_session_admin.post(f"{BASE_URL}/api/auth/logout")
        assert response.status_code == 200
        print("Logout successful")


class TestProtocolEngine:
    """Protocol Engine (AI-guided chat) tests"""
    
    @pytest.fixture
    def auth_session(self):
        """Get authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_ADMIN)
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.text}")
        return session
    
    def test_protocol_sessions_list(self, auth_session):
        """Test GET /protocol/sessions endpoint returns session list"""
        response = auth_session.get(f"{BASE_URL}/api/protocol/sessions")
        assert response.status_code == 200
        data = response.json()
        assert "sessions" in data
        assert isinstance(data["sessions"], list)
        print(f"Protocol sessions count: {len(data['sessions'])}")
    
    def test_protocol_chat_endpoint_structure(self, auth_session):
        """Test POST /protocol/chat endpoint structure (may get budget error)"""
        response = auth_session.post(f"{BASE_URL}/api/protocol/chat", json={
            "message": "Hello, I'm testing the protocol",
            "act": 1
        })
        
        # Accept 200 (success), 402 (budget exceeded), or 500 (LLM error)
        assert response.status_code in [200, 402, 500], f"Unexpected status: {response.status_code}, {response.text}"
        
        if response.status_code == 200:
            data = response.json()
            assert "response" in data
            assert "session_id" in data
            assert "phase" in data
            assert "scores" in data
            print(f"Protocol chat success: session_id={data['session_id']}, phase={data['phase']}")
        elif response.status_code == 402:
            data = response.json()
            assert "detail" in data
            assert "budget" in data["detail"].lower() or "Budget" in data["detail"]
            print(f"Protocol chat budget exceeded (expected): {data['detail']}")
        else:
            print(f"Protocol chat error (LLM unavailable): {response.text}")
    
    def test_protocol_chat_without_auth(self):
        """Test POST /protocol/chat without authentication"""
        response = requests.post(f"{BASE_URL}/api/protocol/chat", json={
            "message": "Test message",
            "act": 1
        })
        assert response.status_code == 401
        print("Unauthenticated protocol chat correctly rejected")
    
    def test_protocol_sessions_without_auth(self):
        """Test GET /protocol/sessions without authentication"""
        response = requests.get(f"{BASE_URL}/api/protocol/sessions")
        assert response.status_code == 401
        print("Unauthenticated protocol sessions correctly rejected")


class TestLicenseValidation:
    """License key validation tests"""
    
    @pytest.fixture
    def auth_session_regular(self):
        """Get authenticated session for regular user"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_REGULAR)
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.text}")
        return session
    
    @pytest.fixture
    def auth_session_admin(self):
        """Get authenticated session for admin user"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_ADMIN)
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.text}")
        return session
    
    def test_license_status(self, auth_session_admin):
        """Test GET /license/status"""
        response = auth_session_admin.get(f"{BASE_URL}/api/license/status")
        assert response.status_code == 200
        data = response.json()
        assert "act3_unlocked" in data
        print(f"License status: act3_unlocked={data['act3_unlocked']}")
    
    def test_license_validate_invalid_key(self, auth_session_regular):
        """Test POST /license/validate with invalid key"""
        response = auth_session_regular.post(f"{BASE_URL}/api/license/validate", json={
            "license_key": "INVALID-KEY-12345"
        })
        # May return 400 (invalid) or 200 (already unlocked)
        if response.status_code == 400:
            data = response.json()
            assert "detail" in data
            print(f"Invalid key rejected: {data['detail']}")
        else:
            assert response.status_code == 200
            print("User already unlocked, key validation skipped")


class TestPaymentCheckout:
    """Payment/Stripe checkout tests"""
    
    @pytest.fixture
    def auth_session_admin(self):
        """Get authenticated session for admin user"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_ADMIN)
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.text}")
        return session
    
    def test_checkout_already_unlocked(self, auth_session_admin):
        """Test POST /payments/checkout when already unlocked"""
        response = auth_session_admin.post(f"{BASE_URL}/api/payments/checkout", json={
            "origin_url": "http://localhost:3000"
        })
        assert response.status_code == 400
        data = response.json()
        assert "already unlocked" in data.get("detail", "").lower()
        print("Checkout correctly blocked for unlocked user")
    
    def test_checkout_without_auth(self):
        """Test POST /payments/checkout without authentication"""
        response = requests.post(f"{BASE_URL}/api/payments/checkout", json={
            "origin_url": "https://example.com"
        })
        assert response.status_code == 401
        print("Unauthenticated checkout correctly rejected")


class TestProgressUpdate:
    """Progress update tests"""
    
    @pytest.fixture
    def auth_session(self):
        """Get authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_REGULAR)
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.text}")
        return session
    
    def test_progress_update(self, auth_session):
        """Test PUT /progress endpoint"""
        # Get current progress first
        get_response = auth_session.get(f"{BASE_URL}/api/progress")
        original = get_response.json()
        
        # Update progress
        response = auth_session.put(f"{BASE_URL}/api/progress", json={
            "current_act": 2,
            "level": 2
        })
        assert response.status_code == 200
        data = response.json()
        assert data["current_act"] == 2
        assert data["level"] == 2
        print(f"Progress updated: current_act={data['current_act']}, level={data['level']}")
        
        # Reset to original
        auth_session.put(f"{BASE_URL}/api/progress", json={
            "current_act": original.get("current_act", 1),
            "level": original.get("level", 1)
        })


class TestAdminEndpoints:
    """Admin panel endpoint tests"""
    
    @pytest.fixture
    def auth_session_admin(self):
        """Get authenticated session for admin user"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_ADMIN)
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.text}")
        return session
    
    def test_admin_users_list(self, auth_session_admin):
        """Test GET /admin/users endpoint"""
        response = auth_session_admin.get(f"{BASE_URL}/api/admin/users")
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
        assert isinstance(data["users"], list)
        print(f"Admin users count: {len(data['users'])}")
    
    def test_admin_license_keys_list(self, auth_session_admin):
        """Test GET /admin/license-keys endpoint"""
        response = auth_session_admin.get(f"{BASE_URL}/api/admin/license-keys")
        assert response.status_code == 200
        data = response.json()
        assert "keys" in data
        assert isinstance(data["keys"], list)
        print(f"Admin license keys count: {len(data['keys'])}")
    
    def test_admin_tracks_list(self, auth_session_admin):
        """Test GET /tracks endpoint (audio bank)"""
        response = auth_session_admin.get(f"{BASE_URL}/api/tracks")
        assert response.status_code == 200
        data = response.json()
        assert "tracks" in data
        print(f"Tracks count: {len(data['tracks'])}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
