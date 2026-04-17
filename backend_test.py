#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import uuid

class ChromaKeyAPITester:
    def __init__(self, base_url="https://chroma-key-protocol.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})
        self.tests_run = 0
        self.tests_passed = 0
        self.user_data = None
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def test_api_root(self):
        """Test API root endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/")
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Message: {data.get('message', 'No message')}"
            self.log_test("API Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, f"Error: {str(e)}")
            return False

    def test_user_registration(self):
        """Test user registration"""
        timestamp = int(datetime.now().timestamp())
        test_user = {
            "email": f"test.user.{timestamp}@example.com",
            "password": "TestPassword123!",
            "name": f"Test User {timestamp}"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/api/auth/register", json=test_user)
            success = response.status_code == 200
            
            if success:
                self.user_data = response.json()
                details = f"User created: {self.user_data.get('email')}, ID: {self.user_data.get('user_id')}"
                # Store cookies for subsequent requests
                self.session.cookies.update(response.cookies)
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
                
            self.log_test("User Registration", success, details)
            return success, test_user if success else None
        except Exception as e:
            self.log_test("User Registration", False, f"Error: {str(e)}")
            return False, None

    def test_user_login(self, credentials):
        """Test user login"""
        if not credentials:
            self.log_test("User Login", False, "No credentials provided")
            return False
            
        try:
            response = self.session.post(f"{self.base_url}/api/auth/login", json={
                "email": credentials["email"],
                "password": credentials["password"]
            })
            success = response.status_code == 200
            
            if success:
                login_data = response.json()
                details = f"Login successful for: {login_data.get('email')}"
                # Update cookies
                self.session.cookies.update(response.cookies)
                self.user_data = login_data
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
                
            self.log_test("User Login", success, details)
            return success
        except Exception as e:
            self.log_test("User Login", False, f"Error: {str(e)}")
            return False

    def test_auth_me(self):
        """Test /auth/me endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/api/auth/me")
            success = response.status_code == 200
            
            if success:
                user_data = response.json()
                details = f"User: {user_data.get('name')}, Level: {user_data.get('level')}, Current Act: {user_data.get('current_act')}"
            else:
                details = f"Status: {response.status_code}, Response: {response.text[:200]}"
                
            self.log_test("Auth Me Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Auth Me Endpoint", False, f"Error: {str(e)}")
            return False

    def test_journal_crud(self):
        """Test journal CRUD operations"""
        # Test GET (empty journal)
        try:
            response = self.session.get(f"{self.base_url}/api/journal")
            get_success = response.status_code == 200
            if get_success:
                entries = response.json()
                self.log_test("Journal GET (List)", True, f"Retrieved {len(entries)} entries")
            else:
                self.log_test("Journal GET (List)", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Journal GET (List)", False, f"Error: {str(e)}")
            return False

        # Test POST (create entry)
        test_entry = {
            "title": f"Test Entry {datetime.now().strftime('%H:%M:%S')}",
            "content": "This is a test journal entry for the Chroma Key Protocol testing.",
            "act": 1
        }
        
        try:
            response = self.session.post(f"{self.base_url}/api/journal", json=test_entry)
            post_success = response.status_code == 200
            
            if post_success:
                created_entry = response.json()
                entry_id = created_entry.get('id')
                self.log_test("Journal POST (Create)", True, f"Created entry ID: {entry_id}")
                
                # Test PUT (update entry)
                updated_entry = {
                    "title": test_entry["title"] + " (Updated)",
                    "content": test_entry["content"] + " Updated content.",
                    "act": 2
                }
                
                response = self.session.put(f"{self.base_url}/api/journal/{entry_id}", json=updated_entry)
                put_success = response.status_code == 200
                
                if put_success:
                    self.log_test("Journal PUT (Update)", True, f"Updated entry ID: {entry_id}")
                    
                    # Test DELETE
                    response = self.session.delete(f"{self.base_url}/api/journal/{entry_id}")
                    delete_success = response.status_code == 200
                    
                    if delete_success:
                        self.log_test("Journal DELETE", True, f"Deleted entry ID: {entry_id}")
                        return True
                    else:
                        self.log_test("Journal DELETE", False, f"Status: {response.status_code}")
                        return False
                else:
                    self.log_test("Journal PUT (Update)", False, f"Status: {response.status_code}")
                    return False
            else:
                self.log_test("Journal POST (Create)", False, f"Status: {response.status_code}, Response: {response.text[:200]}")
                return False
                
        except Exception as e:
            self.log_test("Journal CRUD Operations", False, f"Error: {str(e)}")
            return False

    def test_reflections(self):
        """Test reflection log functionality"""
        act_number = 1
        
        # Test GET reflections (should return empty initially)
        try:
            response = self.session.get(f"{self.base_url}/api/reflections/{act_number}")
            get_success = response.status_code == 200
            
            if get_success:
                reflections = response.json()
                self.log_test("Reflections GET", True, f"Act {act_number} reflections: {len(reflections.get('items', {}))}")
            else:
                self.log_test("Reflections GET", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Reflections GET", False, f"Error: {str(e)}")
            return False

        # Test PUT (update reflection)
        reflection_update = {
            "act": act_number,
            "item_id": "doubt",
            "checked": True
        }
        
        try:
            response = self.session.put(f"{self.base_url}/api/reflections", json=reflection_update)
            put_success = response.status_code == 200
            
            if put_success:
                self.log_test("Reflections PUT (Update)", True, f"Updated reflection: doubt=True")
                
                # Verify the update
                response = self.session.get(f"{self.base_url}/api/reflections/{act_number}")
                if response.status_code == 200:
                    updated_reflections = response.json()
                    if updated_reflections.get('items', {}).get('doubt') == True:
                        self.log_test("Reflections Verification", True, "Reflection update verified")
                        return True
                    else:
                        self.log_test("Reflections Verification", False, "Reflection not updated correctly")
                        return False
                else:
                    self.log_test("Reflections Verification", False, f"Status: {response.status_code}")
                    return False
            else:
                self.log_test("Reflections PUT (Update)", False, f"Status: {response.status_code}, Response: {response.text[:200]}")
                return False
                
        except Exception as e:
            self.log_test("Reflections Operations", False, f"Error: {str(e)}")
            return False

    def test_progress_tracking(self):
        """Test progress tracking functionality"""
        # Test GET progress
        try:
            response = self.session.get(f"{self.base_url}/api/progress")
            get_success = response.status_code == 200
            
            if get_success:
                progress = response.json()
                current_level = progress.get('level', 1)
                current_act = progress.get('current_act', 1)
                completed_acts = progress.get('completed_acts', [])
                self.log_test("Progress GET", True, f"Level: {current_level}, Current Act: {current_act}, Completed: {completed_acts}")
            else:
                self.log_test("Progress GET", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Progress GET", False, f"Error: {str(e)}")
            return False

        # Test PUT (update progress)
        progress_update = {
            "current_act": 2,
            "completed_acts": [1],
            "level": 2
        }
        
        try:
            response = self.session.put(f"{self.base_url}/api/progress", json=progress_update)
            put_success = response.status_code == 200
            
            if put_success:
                updated_progress = response.json()
                self.log_test("Progress PUT (Update)", True, f"Updated to Level: {updated_progress.get('level')}, Act: {updated_progress.get('current_act')}")
                return True
            else:
                self.log_test("Progress PUT (Update)", False, f"Status: {response.status_code}, Response: {response.text[:200]}")
                return False
                
        except Exception as e:
            self.log_test("Progress Update", False, f"Error: {str(e)}")
            return False

    def test_logout(self):
        """Test logout functionality"""
        try:
            response = self.session.post(f"{self.base_url}/api/auth/logout")
            success = response.status_code == 200
            
            if success:
                # Verify logout by trying to access protected endpoint
                response = self.session.get(f"{self.base_url}/api/auth/me")
                logged_out = response.status_code == 401
                if logged_out:
                    self.log_test("Logout", True, "Successfully logged out")
                    return True
                else:
                    self.log_test("Logout", False, "Still authenticated after logout")
                    return False
            else:
                self.log_test("Logout", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Logout", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🔍 Starting Chroma Key Protocol Backend API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test API availability
        if not self.test_api_root():
            print("❌ API not accessible, stopping tests")
            return False
        
        # Test user registration and login flow
        reg_success, credentials = self.test_user_registration()
        if not reg_success:
            print("❌ Registration failed, stopping tests")
            return False
            
        # Test authentication endpoints
        self.test_auth_me()
        
        # Test core functionality
        self.test_journal_crud()
        self.test_reflections()
        self.test_progress_tracking()
        
        # Test logout
        self.test_logout()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Tests completed: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All backend tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = ChromaKeyAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())