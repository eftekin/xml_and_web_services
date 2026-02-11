"""
Week 13 Security: JWT (JSON Web Token) Examples

JWT is a stateless authentication approach. It consists of:
1. Header: Token type and algorithm used
2. Payload: Claims (data) about the user
3. Signature: Ensures the token hasn't been tampered with

Structure: header.payload.signature (all base64-encoded)

This example uses PyJWT library.
Install with: pip install PyJWT
"""

import jwt
import json
from datetime import datetime, timedelta
from typing import Dict, Optional
import hmac
import hashlib
import base64


# ============================================================================
# Example 1: Creating JWT Tokens
# ============================================================================

def create_basic_token(user_id: str, secret_key: str) -> str:
    """
    Create a basic JWT token with minimal claims.
    
    Args:
        user_id: The user identifier
        secret_key: Secret key for signing (keep this safe!)
    
    Returns:
        Encoded JWT token as string
    """
    payload = {
        'user_id': user_id,
        'iat': datetime.utcnow(),  # Issued at time
    }
    
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    return token


def create_token_with_expiration(user_id: str, email: str, secret_key: str, 
                                 expires_in_hours: int = 24) -> str:
    """
    Create JWT token with expiration time.
    
    Args:
        user_id: The user identifier
        email: User's email address
        secret_key: Secret key for signing
        expires_in_hours: Token expiration time in hours
    
    Returns:
        Encoded JWT token as string
    """
    now = datetime.utcnow()
    payload = {
        'user_id': user_id,
        'email': email,
        'iat': now,                    # Issued at time
        'exp': now + timedelta(hours=expires_in_hours),  # Expiration time
        'type': 'access'               # Token type
    }
    
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    return token


def create_token_with_roles(user_id: str, email: str, roles: list, 
                           secret_key: str) -> str:
    """
    Create JWT token with user roles/permissions.
    
    Args:
        user_id: The user identifier
        email: User's email address
        roles: List of roles (e.g., ['user', 'admin'])
        secret_key: Secret key for signing
    
    Returns:
        Encoded JWT token as string
    """
    payload = {
        'user_id': user_id,
        'email': email,
        'roles': roles,                # User permissions
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=24),
    }
    
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    return token


# ============================================================================
# Example 2: Verifying and Decoding JWT Tokens
# ============================================================================

def verify_and_decode_token(token: str, secret_key: str) -> Optional[Dict]:
    """
    Verify JWT token signature and decode payload.
    
    Args:
        token: The JWT token string
        secret_key: Secret key used for signing
    
    Returns:
        Decoded payload dict if valid, None if invalid
    """
    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return None
    except jwt.InvalidTokenError as e:
        print(f"Invalid token: {e}")
        return None


def decode_token_without_verification(token: str) -> Optional[Dict]:
    """
    Decode token WITHOUT verifying signature (for inspection only).
    WARNING: Never use for authentication! This is only for debugging.
    
    Args:
        token: The JWT token string
    
    Returns:
        Decoded payload dict
    """
    try:
        # jwt.decode with options to skip verification
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except Exception as e:
        print(f"Failed to decode token: {e}")
        return None


# ============================================================================
# Example 3: Refresh Tokens Pattern
# ============================================================================

def create_token_pair(user_id: str, email: str, secret_key: str) -> Dict[str, str]:
    """
    Create both access and refresh tokens.
    
    Access token: Short-lived, used for API requests
    Refresh token: Long-lived, used to get new access tokens
    
    Args:
        user_id: The user identifier
        email: User's email address
        secret_key: Secret key for signing
    
    Returns:
        Dict with 'access_token' and 'refresh_token'
    """
    now = datetime.utcnow()
    
    # Access token: 15 minutes
    access_payload = {
        'user_id': user_id,
        'email': email,
        'type': 'access',
        'iat': now,
        'exp': now + timedelta(minutes=15)
    }
    
    # Refresh token: 7 days
    refresh_payload = {
        'user_id': user_id,
        'type': 'refresh',
        'iat': now,
        'exp': now + timedelta(days=7)
    }
    
    access_token = jwt.encode(access_payload, secret_key, algorithm='HS256')
    refresh_token = jwt.encode(refresh_payload, secret_key, algorithm='HS256')
    
    return {
        'access_token': access_token,
        'refresh_token': refresh_token
    }


def refresh_access_token(refresh_token: str, secret_key: str) -> Optional[str]:
    """
    Use a refresh token to get a new access token.
    
    Args:
        refresh_token: The refresh token
        secret_key: Secret key for signing
    
    Returns:
        New access token if refresh token is valid, None otherwise
    """
    try:
        payload = jwt.decode(refresh_token, secret_key, algorithms=['HS256'])
        
        # Verify it's actually a refresh token
        if payload.get('type') != 'refresh':
            print("Not a valid refresh token")
            return None
        
        # Create new access token
        new_access_payload = {
            'user_id': payload['user_id'],
            'type': 'access',
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(minutes=15)
        }
        
        new_token = jwt.encode(new_access_payload, secret_key, algorithm='HS256')
        return new_token
    
    except jwt.ExpiredSignatureError:
        print("Refresh token has expired")
        return None
    except jwt.InvalidTokenError as e:
        print(f"Invalid refresh token: {e}")
        return None


# ============================================================================
# Example 4: Token Structure Analysis
# ============================================================================

def analyze_token_structure(token: str) -> Dict:
    """
    Analyze and display JWT structure (header, payload, signature).
    
    Args:
        token: The JWT token string
    
    Returns:
        Dict with header, payload, and signature info
    """
    try:
        parts = token.split('.')
        if len(parts) != 3:
            raise ValueError("Invalid token format")
        
        # Decode parts (add padding if needed)
        def decode_part(part):
            padding = 4 - len(part) % 4
            if padding != 4:
                part += '=' * padding
            return json.loads(base64.urlsafe_b64decode(part))
        
        header = decode_part(parts[0])
        payload = decode_part(parts[1])
        signature = parts[2][:20] + "..."  # Truncate for display
        
        return {
            'header': header,
            'payload': payload,
            'signature': signature,
            'raw_parts': {
                'header': parts[0],
                'payload': parts[1],
                'signature': parts[2]
            }
        }
    except Exception as e:
        print(f"Error analyzing token: {e}")
        return {}


# ============================================================================
# Example 5: Secure Token Validation Function
# ============================================================================

class TokenValidator:
    """
    A more robust token validation class with multiple checks.
    """
    
    def __init__(self, secret_key: str):
        self.secret_key = secret_key
    
    def validate(self, token: str) -> tuple[bool, Optional[Dict], str]:
        """
        Validate token with detailed error messages.
        
        Args:
            token: JWT token to validate
        
        Returns:
            Tuple of (is_valid, payload, error_message)
        """
        if not token:
            return False, None, "Token is empty"
        
        if not isinstance(token, str):
            return False, None, "Token must be a string"
        
        parts = token.split('.')
        if len(parts) != 3:
            return False, None, "Invalid token format (must have 3 parts)"
        
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            
            # Additional validation checks
            if 'user_id' not in payload:
                return False, payload, "Token missing user_id claim"
            
            if 'exp' in payload:
                exp_time = datetime.fromtimestamp(payload['exp'])
                if datetime.utcnow() > exp_time:
                    return False, payload, "Token has expired"
            
            return True, payload, ""
        
        except jwt.InvalidSignatureError:
            return False, None, "Invalid token signature"
        except jwt.ExpiredSignatureError:
            return False, None, "Token has expired"
        except jwt.InvalidTokenError as e:
            return False, None, f"Invalid token: {str(e)}"


# ============================================================================
# Example 6: Real-World Usage Example
# ============================================================================

def login_user(username: str, password: str, secret_key: str) -> Dict[str, str]:
    """
    Simulate user login and token generation.
    
    In a real application:
    - Verify password hash against stored hash
    - Query database for user info
    - Store refresh tokens in database
    
    Args:
        username: User's username
        password: User's password  
        secret_key: Secret key for token signing
    
    Returns:
        Dict with access_token and refresh_token
    """
    # In real app, verify password with: bcrypt.check_password_hash()
    
    # Get user info from database
    user = {
        'id': '12345',
        'email': f'{username}@example.com',
        'roles': ['user']
    }
    
    # Create tokens
    tokens = create_token_pair(user['id'], user['email'], secret_key)
    
    # In real app, store refresh_token in database for revocation
    print(f"Login successful for {username}")
    
    return tokens


def verify_request(token: str, secret_key: str) -> tuple[bool, Optional[str]]:
    """
    Verify incoming request has valid token.
    
    Args:
        token: JWT token from request header
        secret_key: Secret key for verification
    
    Returns:
        Tuple of (is_valid, user_id)
    """
    validator = TokenValidator(secret_key)
    is_valid, payload, error = validator.validate(token)
    
    if not is_valid:
        print(f"Request validation failed: {error}")
        return False, None
    
    return True, payload.get('user_id')


# ============================================================================
# Example 7: Running the Examples
# ============================================================================

if __name__ == '__main__':
    # Secret key (in production, use environment variable)
    SECRET_KEY = 'your-secret-key-keep-this-safe-do-not-hardcode'
    
    print("=" * 70)
    print("JWT Token Examples")
    print("=" * 70)
    
    # Example 1: Create basic token
    print("\n1. Create Basic Token:")
    basic_token = create_basic_token('user123', SECRET_KEY)
    print(f"Token: {basic_token}")
    print(f"Decoded: {decode_token_without_verification(basic_token)}")
    
    # Example 2: Create token with expiration
    print("\n2. Create Token with Expiration:")
    expiring_token = create_token_with_expiration('user456', 'user@example.com', SECRET_KEY, hours=24)
    print(f"Token: {expiring_token}")
    decoded = decode_token_without_verification(expiring_token)
    print(f"Decoded: {decoded}")
    
    # Example 3: Verify token
    print("\n3. Verify Token:")
    is_valid = verify_and_decode_token(expiring_token, SECRET_KEY)
    print(f"Token valid: {is_valid is not None}")
    
    # Example 4: Create tokens with roles
    print("\n4. Create Token with Roles:")
    role_token = create_token_with_roles('admin123', 'admin@example.com', 
                                         ['admin', 'moderator'], SECRET_KEY)
    decoded = decode_token_without_verification(role_token)
    print(f"Roles: {decoded.get('roles')}")
    
    # Example 5: Token pair (access + refresh)
    print("\n5. Token Pair (Access + Refresh):")
    tokens = create_token_pair('user789', 'user@example.com', SECRET_KEY)
    print(f"Access Token: {tokens['access_token'][:50]}...")
    print(f"Refresh Token: {tokens['refresh_token'][:50]}...")
    
    # Example 6: Refresh access token
    print("\n6. Refresh Access Token:")
    new_access = refresh_access_token(tokens['refresh_token'], SECRET_KEY)
    print(f"New Access Token: {new_access[:50] if new_access else 'Failed'}...")
    
    # Example 7: Analyze token structure
    print("\n7. Token Structure Analysis:")
    analysis = analyze_token_structure(expiring_token)
    print(f"Header: {analysis.get('header')}")
    print(f"Payload: {analysis.get('payload')}")
    print(f"Signature: {analysis.get('signature')}")
    
    # Example 8: Token validation with detailed errors
    print("\n8. Token Validation with Error Details:")
    validator = TokenValidator(SECRET_KEY)
    is_valid, payload, error = validator.validate(expiring_token)
    print(f"Valid: {is_valid}, User: {payload.get('user_id') if payload else None}")
    
    # Example 9: Simulate login
    print("\n9. Simulate Login:")
    login_tokens = login_user('alice', 'password123', SECRET_KEY)
    print(f"Access token issued: {login_tokens['access_token'][:50]}...")
    
    # Example 10: Verify request
    print("\n10. Verify API Request:")
    is_valid, user_id = verify_request(login_tokens['access_token'], SECRET_KEY)
    print(f"Request valid: {is_valid}, User ID: {user_id}")
    
    print("\n" + "=" * 70)
    print("Key Takeaways:")
    print("- JWTs are stateless (all data in token)")
    print("- Always verify signature with secret key")
    print("- Check expiration time")
    print("- Use HTTPS to prevent token interception")
    print("- Store secrets in environment variables, not in code")
    print("=" * 70)
