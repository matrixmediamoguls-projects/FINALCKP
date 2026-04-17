"""
Chroma Key Protocol - Backend API Tests
Tests for: Auth, License validation, Payment checkout, Progress, Reflections, Journal
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from requirements
TEST_USER_LOCKED = {"email": "test2@demo.com", "password": "test123"}  # act3_unlocked: false
TEST_USER_UNLOCKED = {"email": "test@demo.com", "password": "test123"}  # act3_unlocked: true
VALID_LICENSE_KEY = "RECLAIM-2026-BETA"
USED_LICENSE_KEY = "CHROMA-FIRE-001"


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
    
    def test_login_success_locked_user(self):
        """Test login with test2@demo.com (act3_unlocked: false)"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_LOCKED)
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "user_id" in data
        assert data["email"] == TEST_USER_LOCKED["email"]
        assert data.get("act3_unlocked", False) == False
        print(f"Login success for locked user: {data['email']}, act3_unlocked: {data.get('act3_unlocked')}")
    
    def test_login_success_unlocked_user(self):
        """Test login with test@demo.com (act3_unlocked: true)"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_UNLOCKED)
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "user_id" in data
        assert data["email"] == TEST_USER_UNLOCKED["email"]
        assert data.get("act3_unlocked", False) == True
        print(f"Login success for unlocked user: {data['email']}, act3_unlocked: {data.get('act3_unlocked')}")
    
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
    def auth_session_locked(self):
        """Get authenticated session for locked user"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_LOCKED)
        if response.status_code != 200:
            pytest.skip(f"Login failed for locked user: {response.text}")
        return session
    
    @pytest.fixture
    def auth_session_unlocked(self):
        """Get authenticated session for unlocked user"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_UNLOCKED)
        if response.status_code != 200:
            pytest.skip(f"Login failed for unlocked user: {response.text}")
        return session
    
    def test_auth_me_with_session(self, auth_session_locked):
        """Test /auth/me with valid session"""
        response = auth_session_locked.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data
        assert "email" in data
        print(f"Auth me success: {data['email']}")
    
    def test_progress_get(self, auth_session_locked):
        """Test GET /progress endpoint"""
        response = auth_session_locked.get(f"{BASE_URL}/api/progress")
        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data
        assert "current_act" in data
        assert "level" in data
        print(f"Progress: level={data['level']}, current_act={data['current_act']}")
    
    def test_reflections_get(self, auth_session_locked):
        """Test GET /reflections/{act} endpoint"""
        response = auth_session_locked.get(f"{BASE_URL}/api/reflections/1")
        assert response.status_code == 200
        data = response.json()
        assert "act" in data or "items" in data
        print(f"Reflections for Act 1: {data}")
    
    def test_reflections_update(self, auth_session_locked):
        """Test PUT /reflections endpoint"""
        response = auth_session_locked.put(f"{BASE_URL}/api/reflections", json={
            "act": 1,
            "item_id": "test_item",
            "checked": True
        })
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print("Reflection update success")
    
    def test_journal_crud(self, auth_session_locked):
        """Test Journal CRUD operations"""
        # CREATE
        create_response = auth_session_locked.post(f"{BASE_URL}/api/journal", json={
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
        read_response = auth_session_locked.get(f"{BASE_URL}/api/journal")
        assert read_response.status_code == 200
        entries = read_response.json()
        assert isinstance(entries, list)
        print(f"Journal entries count: {len(entries)}")
        
        # UPDATE
        update_response = auth_session_locked.put(f"{BASE_URL}/api/journal/{entry_id}", json={
            "title": "TEST_Updated Journal Entry",
            "content": "Updated content",
            "act": 1
        })
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["title"] == "TEST_Updated Journal Entry"
        print("Journal updated successfully")
        
        # DELETE
        delete_response = auth_session_locked.delete(f"{BASE_URL}/api/journal/{entry_id}")
        assert delete_response.status_code == 200
        print("Journal deleted successfully")
    
    def test_logout(self, auth_session_locked):
        """Test logout endpoint"""
        response = auth_session_locked.post(f"{BASE_URL}/api/auth/logout")
        assert response.status_code == 200
        print("Logout successful")


class TestLicenseValidation:
    """License key validation tests"""
    
    @pytest.fixture
    def auth_session_locked(self):
        """Get authenticated session for locked user"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_LOCKED)
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.text}")
        return session
    
    @pytest.fixture
    def auth_session_unlocked(self):
        """Get authenticated session for unlocked user"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_UNLOCKED)
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.text}")
        return session
    
    def test_license_status_locked_user(self, auth_session_locked):
        """Test GET /license/status for locked user"""
        response = auth_session_locked.get(f"{BASE_URL}/api/license/status")
        assert response.status_code == 200
        data = response.json()
        assert "act3_unlocked" in data
        # Note: This user may have been unlocked in previous tests
        print(f"License status for locked user: act3_unlocked={data['act3_unlocked']}")
    
    def test_license_status_unlocked_user(self, auth_session_unlocked):
        """Test GET /license/status for unlocked user"""
        response = auth_session_unlocked.get(f"{BASE_URL}/api/license/status")
        assert response.status_code == 200
        data = response.json()
        assert "act3_unlocked" in data
        assert data["act3_unlocked"] == True
        print(f"License status for unlocked user: act3_unlocked={data['act3_unlocked']}")
    
    def test_license_validate_invalid_key(self, auth_session_locked):
        """Test POST /license/validate with invalid key"""
        response = auth_session_locked.post(f"{BASE_URL}/api/license/validate", json={
            "license_key": "INVALID-KEY-12345"
        })
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        print(f"Invalid key rejected: {data['detail']}")
    
    def test_license_validate_used_key(self, auth_session_locked):
        """Test POST /license/validate with already used key"""
        response = auth_session_locked.post(f"{BASE_URL}/api/license/validate", json={
            "license_key": USED_LICENSE_KEY
        })
        # Should return 400 because key is already used
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        print(f"Used key rejected: {data['detail']}")
    
    def test_license_validate_already_unlocked(self, auth_session_unlocked):
        """Test POST /license/validate when already unlocked"""
        response = auth_session_unlocked.post(f"{BASE_URL}/api/license/validate", json={
            "license_key": "ANY-KEY"
        })
        # Should return success since already unlocked
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        assert "already unlocked" in data.get("message", "").lower()
        print(f"Already unlocked response: {data}")


class TestPaymentCheckout:
    """Payment/Stripe checkout tests"""
    
    @pytest.fixture
    def auth_session_locked(self):
        """Get authenticated session for locked user"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_LOCKED)
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.text}")
        return session
    
    @pytest.fixture
    def auth_session_unlocked(self):
        """Get authenticated session for unlocked user"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_UNLOCKED)
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.text}")
        return session
    
    def test_checkout_creates_session(self, auth_session_locked):
        """Test POST /payments/checkout creates checkout session"""
        response = auth_session_locked.post(f"{BASE_URL}/api/payments/checkout", json={
            "origin_url": "https://chroma-key-protocol.preview.emergentagent.com"
        })
        # May fail if user already unlocked, or succeed with checkout URL
        if response.status_code == 400:
            data = response.json()
            assert "already unlocked" in data.get("detail", "").lower()
            print("Checkout blocked - user already unlocked")
        else:
            assert response.status_code == 200
            data = response.json()
            assert "url" in data
            assert "session_id" in data
            print(f"Checkout session created: {data['session_id'][:20]}...")
    
    def test_checkout_already_unlocked(self, auth_session_unlocked):
        """Test POST /payments/checkout when already unlocked"""
        response = auth_session_unlocked.post(f"{BASE_URL}/api/payments/checkout", json={
            "origin_url": "https://chroma-key-protocol.preview.emergentagent.com"
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
        response = session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER_LOCKED)
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.text}")
        return session
    
    def test_progress_update(self, auth_session):
        """Test PUT /progress endpoint"""
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
            "current_act": 1,
            "level": 1
        })


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
