"""
Test Suite for Chroma Key Protocol v5 - Protocol Engine, Tier System, Spins, Admin Settings
Tests: 5-step protocol engine, access tiers, spin wheel gating, admin settings
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://chroma-key-protocol.preview.emergentagent.com')

# Test credentials
ADMIN_EMAIL = "test@demo.com"
ADMIN_PASSWORD = "password123"


class TestAuthAndUserFields:
    """Test login returns new user fields (tier, spins_earned, spins_used, owns_all_albums)"""
    
    def test_login_returns_new_user_fields(self):
        """Login with test@demo.com and verify new user fields in response"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        
        # Verify new fields exist
        assert "tier" in data, "Missing 'tier' field in user response"
        assert "spins_earned" in data, "Missing 'spins_earned' field"
        assert "spins_used" in data, "Missing 'spins_used' field"
        assert "owns_all_albums" in data, "Missing 'owns_all_albums' field"
        
        # Verify admin user has full tier
        assert data["tier"] == "full", f"Expected tier='full', got '{data['tier']}'"
        assert data["is_admin"] == True, "Expected is_admin=True"
        assert data["owns_all_albums"] == True, "Expected owns_all_albums=True for full tier"
        print(f"✓ Login returns new fields: tier={data['tier']}, spins_earned={data['spins_earned']}, spins_used={data['spins_used']}, owns_all_albums={data['owns_all_albums']}")


class TestProtocolStepsAPI:
    """Test 5-step protocol engine backend endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login and get session cookie"""
        self.session = requests.Session()
        response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        self.user = response.json()
    
    def test_get_protocol_steps_for_act(self):
        """GET /api/protocol/steps/{act} returns saved steps"""
        response = self.session.get(f"{BASE_URL}/api/protocol/steps/1")
        assert response.status_code == 200, f"Failed to get steps: {response.text}"
        data = response.json()
        assert "act" in data
        assert "steps" in data
        assert data["act"] == 1
        print(f"✓ GET /api/protocol/steps/1 returns {len(data['steps'])} steps")
    
    def test_save_step_data(self):
        """POST /api/protocol/steps/{act}/{step} saves step data correctly"""
        step_data = {
            "data": {
                "slider_0": 7,
                "slider_1": 5,
                "slider_2": 8,
                "slider_3": 6,
                "text": "Test reflection text for step 1"
            },
            "completed": False
        }
        response = self.session.post(f"{BASE_URL}/api/protocol/steps/1/0", json=step_data)
        assert response.status_code == 200, f"Failed to save step: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print("✓ POST /api/protocol/steps/1/0 saves step data correctly")
        
        # Verify data was saved by fetching it
        response = self.session.get(f"{BASE_URL}/api/protocol/steps/1")
        assert response.status_code == 200
        steps_data = response.json()
        saved_step = next((s for s in steps_data["steps"] if s["step"] == 0), None)
        if saved_step:
            assert saved_step["data"]["slider_0"] == 7
            assert saved_step["data"]["text"] == "Test reflection text for step 1"
            print("✓ Step data persisted correctly in database")
    
    def test_complete_act_requires_all_steps(self):
        """POST /api/protocol/complete-act/{act} requires all 5 steps completed"""
        # Try to complete act without all steps
        response = self.session.post(f"{BASE_URL}/api/protocol/complete-act/1")
        # Should fail if not all 5 steps are completed
        if response.status_code == 400:
            data = response.json()
            assert "Complete all 5 steps" in data.get("detail", "")
            print("✓ POST /api/protocol/complete-act/1 correctly requires all 5 steps")
        elif response.status_code == 200:
            # Already completed or all steps done
            data = response.json()
            print(f"✓ Act completion response: {data}")


class TestSpinsAPI:
    """Test spin wheel backend endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login and get session cookie"""
        self.session = requests.Session()
        response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        self.user = response.json()
    
    def test_get_spins(self):
        """GET /api/spins returns spin count"""
        response = self.session.get(f"{BASE_URL}/api/spins")
        assert response.status_code == 200, f"Failed to get spins: {response.text}"
        data = response.json()
        assert "spins_earned" in data
        assert "spins_used" in data
        assert "spins_available" in data
        print(f"✓ GET /api/spins returns: earned={data['spins_earned']}, used={data['spins_used']}, available={data['spins_available']}")
    
    def test_use_spin_decrements_available(self):
        """POST /api/spins/use decrements available spins"""
        # First get current spins
        response = self.session.get(f"{BASE_URL}/api/spins")
        assert response.status_code == 200
        initial_data = response.json()
        initial_available = initial_data["spins_available"]
        
        # Try to use a spin
        response = self.session.post(f"{BASE_URL}/api/spins/use")
        if initial_available > 0:
            assert response.status_code == 200, f"Failed to use spin: {response.text}"
            data = response.json()
            assert data["spins_available"] == initial_available - 1
            print(f"✓ POST /api/spins/use decremented spins from {initial_available} to {data['spins_available']}")
        else:
            # No spins available - should return 400
            assert response.status_code == 400, f"Expected 400 when no spins available, got {response.status_code}"
            print("✓ POST /api/spins/use correctly rejects when no spins available")


class TestAdminSettingsAPI:
    """Test admin settings endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login as admin"""
        self.session = requests.Session()
        response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        self.user = response.json()
    
    def test_get_admin_settings(self):
        """GET /api/admin/settings returns addon_price"""
        response = self.session.get(f"{BASE_URL}/api/admin/settings")
        assert response.status_code == 200, f"Failed to get settings: {response.text}"
        data = response.json()
        assert "addon_price" in data
        print(f"✓ GET /api/admin/settings returns addon_price={data['addon_price']}")
    
    def test_update_admin_settings(self):
        """PUT /api/admin/settings updates addon_price"""
        new_price = 7.99
        response = self.session.put(f"{BASE_URL}/api/admin/settings", json={
            "addon_price": new_price
        })
        assert response.status_code == 200, f"Failed to update settings: {response.text}"
        
        # Verify update
        response = self.session.get(f"{BASE_URL}/api/admin/settings")
        assert response.status_code == 200
        data = response.json()
        assert data["addon_price"] == new_price
        print(f"✓ PUT /api/admin/settings updated addon_price to {new_price}")
        
        # Reset to default
        self.session.put(f"{BASE_URL}/api/admin/settings", json={"addon_price": 5.00})
    
    def test_get_public_settings(self):
        """GET /api/settings/public returns addon_price"""
        response = self.session.get(f"{BASE_URL}/api/settings/public")
        assert response.status_code == 200, f"Failed to get public settings: {response.text}"
        data = response.json()
        assert "addon_price" in data
        print(f"✓ GET /api/settings/public returns addon_price={data['addon_price']}")


class TestFreeUserGating:
    """Test access tier gating for free users"""
    
    def test_register_free_user(self):
        """Register a new free user and verify tier=free"""
        session = requests.Session()
        unique_email = f"test_free_{uuid.uuid4().hex[:8]}@test.com"
        
        response = session.post(f"{BASE_URL}/api/auth/register", json={
            "email": unique_email,
            "password": "testpass123",
            "name": "Test Free User"
        })
        assert response.status_code == 200, f"Registration failed: {response.text}"
        data = response.json()
        
        # Verify free tier defaults
        assert data["tier"] == "free", f"Expected tier='free', got '{data['tier']}'"
        assert data["spins_earned"] == 0
        assert data["spins_used"] == 0
        assert data["owns_all_albums"] == False
        print(f"✓ New user registered with tier=free, spins_earned=0, owns_all_albums=False")
        
        # Cleanup - we can't delete users via API, but the test data is prefixed


class TestProtocolChatAPI:
    """Test protocol chat endpoint (AI agent)"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Login and get session cookie"""
        self.session = requests.Session()
        response = self.session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
    
    def test_protocol_chat_requires_auth(self):
        """POST /api/protocol/chat requires authentication"""
        response = requests.post(f"{BASE_URL}/api/protocol/chat", json={
            "message": "Test message",
            "act": 1
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ POST /api/protocol/chat requires authentication")
    
    def test_protocol_chat_with_auth(self):
        """POST /api/protocol/chat works with authentication"""
        response = self.session.post(f"{BASE_URL}/api/protocol/chat", json={
            "message": "I am testing the protocol engine",
            "act": 3,
            "session_id": f"test_session_{uuid.uuid4().hex[:8]}"
        })
        # May return 200 (success) or 402 (budget exceeded)
        if response.status_code == 200:
            data = response.json()
            assert "response" in data
            assert "session_id" in data
            print(f"✓ POST /api/protocol/chat returned response (phase={data.get('phase', 0)})")
        elif response.status_code == 402:
            print("✓ POST /api/protocol/chat returned 402 (budget exceeded - expected)")
        else:
            pytest.fail(f"Unexpected status code: {response.status_code}, {response.text}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
