def authenticate_user(username: str, password: str):
    # replace with real DB call
    if username == "admin" and password == "1234":
        return {
            "id": 1,
            "username": username,
            "role": "seeker"
        }
    return None