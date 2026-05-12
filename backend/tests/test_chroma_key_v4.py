"""
Chroma Key Protocol v4 Tests
Testing new features: GuidedListen, SpinWheel social sharing, Admin Panel 6 tabs
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8000')

# Test credentials
ADMIN_EMAIL = "test@demo.com"
ADMIN_PASSWORD = "password123"


class TestAPIRoot:
    """Basic API health check"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"API root response: {data}")


class TestAuthentication:
    """Authentication flow tests"""
    
    def test_login_admin_user(self):
        """Test admin user login with test@demo.com"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data
        assert data["email"] == ADMIN_EMAIL
        assert data.get("is_admin") == True
        assert data.get("act3_unlocked") == True
        print(f"Admin login successful: {data['email']}, is_admin={data.get('is_admin')}")
    
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
        print("Auth me without token correctly returns 401")


class TestTracksAPI:
    """Tests for /api/tracks endpoint - critical for GuidedListen"""
    
    @pytest.fixture
    def auth_session(self):
        """Get authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return session
    
    def test_tracks_returns_required_fields(self, auth_session):
        """Test GET /api/tracks returns tracks with lightcodes, shadowcodes, lore, spotify_uri"""
        response = auth_session.get(f"{BASE_URL}/api/tracks")
        assert response.status_code == 200
        data = response.json()
        
        assert "tracks" in data
        tracks = data["tracks"]
        assert len(tracks) > 0
        print(f"Found {len(tracks)} tracks")
        
        # Check first track has all required fields
        track = tracks[0]
        required_fields = ["track_id", "name", "act", "type", "color", "has_audio"]
        for field in required_fields:
            assert field in track, f"Missing required field: {field}"
        
        # Check for new content fields (may be empty but should exist)
        content_fields = ["lore", "lightcodes", "shadowcodes", "spotify_uri"]
        for field in content_fields:
            assert field in track, f"Missing content field: {field}"
        
        print(f"Track fields verified: {list(track.keys())}")
        print(f"Sample track: {track['name']}, lore={bool(track.get('lore'))}, lightcodes={bool(track.get('lightcodes'))}")
    
    def test_tracks_without_auth(self):
        """Test /api/tracks requires authentication"""
        response = requests.get(f"{BASE_URL}/api/tracks")
        assert response.status_code == 401
        print("Tracks endpoint correctly requires authentication")


class TestAdminTracksAPI:
    """Tests for admin track management"""
    
    @pytest.fixture
    def admin_session(self):
        """Get admin authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return session
    
    def test_admin_tracks_list(self, admin_session):
        """Test GET /api/admin/tracks returns all tracks"""
        response = admin_session.get(f"{BASE_URL}/api/admin/tracks")
        assert response.status_code == 200
        data = response.json()
        assert "tracks" in data
        print(f"Admin tracks: {len(data['tracks'])} tracks found")
    
    def test_admin_tracks_update_content(self, admin_session):
        """Test PUT /api/admin/tracks/{track_id} can update content fields"""
        # First get a track
        response = admin_session.get(f"{BASE_URL}/api/admin/tracks")
        assert response.status_code == 200
        tracks = response.json()["tracks"]
        
        if len(tracks) > 0:
            track_id = tracks[0]["track_id"]
            
            # Update content fields
            update_data = {
                "lore": "Test lore content",
                "lightcodes": "Test lightcodes",
                "shadowcodes": "Test shadowcodes",
                "spotify_uri": "spotify:track:test123"
            }
            
            response = admin_session.put(f"{BASE_URL}/api/admin/tracks/{track_id}", json=update_data)
            assert response.status_code == 200
            updated = response.json()
            
            # Verify update
            assert updated.get("lore") == "Test lore content"
            assert updated.get("lightcodes") == "Test lightcodes"
            assert updated.get("shadowcodes") == "Test shadowcodes"
            assert updated.get("spotify_uri") == "spotify:track:test123"
            print(f"Track content update successful for {track_id}")
            
            # Revert changes
            revert_data = {
                "lore": "",
                "lightcodes": "",
                "shadowcodes": "",
                "spotify_uri": ""
            }
            admin_session.put(f"{BASE_URL}/api/admin/tracks/{track_id}", json=revert_data)
            print("Reverted test changes")


class TestAdminLicenseKeys:
    """Tests for admin license key management"""
    
    @pytest.fixture
    def admin_session(self):
        """Get admin authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return session
    
    def test_admin_license_keys_list(self, admin_session):
        """Test GET /api/admin/license-keys"""
        response = admin_session.get(f"{BASE_URL}/api/admin/license-keys")
        assert response.status_code == 200
        data = response.json()
        assert "keys" in data
        print(f"License keys: {len(data['keys'])} keys found")


class TestAdminUsers:
    """Tests for admin user management"""
    
    @pytest.fixture
    def admin_session(self):
        """Get admin authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return session
    
    def test_admin_users_list(self, admin_session):
        """Test GET /api/admin/users"""
        response = admin_session.get(f"{BASE_URL}/api/admin/users")
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
        print(f"Users: {len(data['users'])} users found")


class TestProgressAPI:
    """Tests for user progress"""
    
    @pytest.fixture
    def auth_session(self):
        """Get authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return session
    
    def test_get_progress(self, auth_session):
        """Test GET /api/progress"""
        response = auth_session.get(f"{BASE_URL}/api/progress")
        assert response.status_code == 200
        data = response.json()
        assert "user_id" in data
        assert "level" in data
        assert "current_act" in data
        print(f"Progress: level={data['level']}, current_act={data['current_act']}")


class TestLicenseValidation:
    """Tests for license key validation"""
    
    @pytest.fixture
    def auth_session(self):
        """Get authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return session
    
    def test_license_status(self, auth_session):
        """Test GET /api/license/status"""
        response = auth_session.get(f"{BASE_URL}/api/license/status")
        assert response.status_code == 200
        data = response.json()
        assert "act3_unlocked" in data
        print(f"License status: act3_unlocked={data['act3_unlocked']}")
    
    def test_invalid_license_key(self, auth_session):
        """Test POST /api/license/validate with invalid key"""
        response = auth_session.post(f"{BASE_URL}/api/license/validate", json={
            "license_key": "INVALID-KEY-12345"
        })
        # Should return 400 for invalid key or 200 with success message if already unlocked
        assert response.status_code in [400, 200]
        print(f"Invalid license key response: {response.status_code}")


class TestJournalAPI:
    """Tests for journal functionality"""
    
    @pytest.fixture
    def auth_session(self):
        """Get authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return session
    
    def test_journal_crud(self, auth_session):
        """Test journal CRUD operations"""
        # Create
        create_response = auth_session.post(f"{BASE_URL}/api/journal", json={
            "title": "TEST_Journal Entry",
            "content": "Test content for journal",
            "act": 1
        })
        assert create_response.status_code == 200
        entry = create_response.json()
        entry_id = entry["id"]
        print(f"Created journal entry: {entry_id}")
        
        # Read
        list_response = auth_session.get(f"{BASE_URL}/api/journal")
        assert list_response.status_code == 200
        entries = list_response.json()
        assert any(e["id"] == entry_id for e in entries)
        print(f"Journal list contains {len(entries)} entries")
        
        # Delete
        delete_response = auth_session.delete(f"{BASE_URL}/api/journal/{entry_id}")
        assert delete_response.status_code == 200
        print(f"Deleted journal entry: {entry_id}")


class TestReflectionsAPI:
    """Tests for reflections functionality"""
    
    @pytest.fixture
    def auth_session(self):
        """Get authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return session
    
    def test_get_reflections(self, auth_session):
        """Test GET /api/reflections/{act}"""
        response = auth_session.get(f"{BASE_URL}/api/reflections/1")
        assert response.status_code == 200
        data = response.json()
        assert "act" in data or "items" in data
        print(f"Reflections for Act 1: {data}")


class TestProtocolChat:
    """Tests for Protocol Engine chat"""
    
    @pytest.fixture
    def auth_session(self):
        """Get authenticated session"""
        session = requests.Session()
        response = session.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        return session
    
    def test_protocol_sessions_list(self, auth_session):
        """Test GET /api/protocol/sessions"""
        response = auth_session.get(f"{BASE_URL}/api/protocol/sessions")
        assert response.status_code == 200
        data = response.json()
        assert "sessions" in data
        print(f"Protocol sessions: {len(data['sessions'])} sessions found")
    
    def test_protocol_chat_without_auth(self):
        """Test protocol chat requires authentication"""
        response = requests.post(f"{BASE_URL}/api/protocol/chat", json={
            "message": "Hello"
        })
        assert response.status_code == 401
        print("Protocol chat correctly requires authentication")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
