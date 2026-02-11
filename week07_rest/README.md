# Week 7: JSON & REST APIs

## Why This Matters

You've learned XML—a structured, verbose way to represent data. But modern web APIs mostly use JSON with REST. Why? JSON is lighter, easier to parse in JavaScript, and REST leverages HTTP that's already everywhere. Understanding REST and JSON means you can consume almost any modern web API.

## From XML to JSON

XML was the standard for data exchange. Then JSON came along and changed everything.

**XML version:**

```xml
<book>
  <title>1984</title>
  <author>George Orwell</author>
  <year>1949</year>
  <price>13.99</price>
</book>
```

**JSON version:**

```json
{
  "title": "1984",
  "author": "George Orwell",
  "year": 1949,
  "price": 13.99
}
```

Spot the differences:

- No closing tags (less verbose)
- Actual data types (1949 is a number, not text)
- Native support in JavaScript
- Easier to read for most developers

JSON = **JavaScript Object Notation**. It's literally JavaScript object syntax that became a data format standard.

## JSON Fundamentals

JSON has only 6 data types:

### 1. String

```json
"hello world"
"user@example.com"
```

### 2. Number

```json
42
3.14
-17
1.2e5
```

No separate integer/float types—just numbers.

### 3. Boolean

```json
true
false
```

### 4. Null

```json
null
```

### 5. Array (ordered list)

```json
["apple", "banana", "orange"]
[1, 2, 3, 4, 5]
["mixed", 42, true, null]
```

### 6. Object (key-value pairs)

```json
{
  "name": "Alice",
  "age": 30,
  "active": true
}
```

**Nested structures:**

```json
{
  "book": {
    "title": "The Great Gatsby",
    "author": {
      "firstName": "F. Scott",
      "lastName": "Fitzgerald"
    },
    "tags": ["classic", "fiction", "american"]
  }
}
```

## What is REST?

REST = **Representational State Transfer**

It's not a protocol or standard—it's an architectural style. REST says: "Use HTTP the way it was designed."

### The Core Principles

**1. Resources are identified by URLs**

```
https://api.example.com/books/123
https://api.example.com/users/alice
https://api.example.com/orders/2024-001
```

Each URL points to a specific resource. The URL itself describes what you're accessing.

**2. HTTP methods indicate operations**

Think of HTTP methods as verbs:

- **GET** = Read (fetch data, no changes)
- **POST** = Create (add new resource)
- **PUT** = Replace (update entire resource)
- **PATCH** = Modify (update specific fields)
- **DELETE** = Remove (delete resource)

**3. Stateless communication**

Every request is independent. The server doesn't remember previous requests. All context must be in each request (via headers, tokens, etc.).

**4. Representations**

The same resource can be returned in different formats (JSON, XML, HTML), usually negotiated via headers:

```
Accept: application/json
Accept: application/xml
```

## HTTP Methods in Detail

### GET - Retrieve Data

```http
GET /api/books/123
Host: api.example.com
```

**Response:**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 123,
  "title": "1984",
  "author": "George Orwell",
  "year": 1949
}
```

**Key points:**

- Safe (doesn't change anything)
- Idempotent (calling it 100 times = calling it once)
- Can be cached
- Parameters go in URL query string: `/api/books?year=1949&author=Orwell`

### POST - Create New Resource

```http
POST /api/books
Host: api.example.com
Content-Type: application/json

{
  "title": "Brave New World",
  "author": "Aldous Huxley",
  "year": 1932
}
```

**Response:**

```http
HTTP/1.1 201 Created
Location: /api/books/124
Content-Type: application/json

{
  "id": 124,
  "title": "Brave New World",
  "author": "Aldous Huxley",
  "year": 1932,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Key points:**

- Not idempotent (calling twice creates two resources)
- Returns 201 Created on success
- Location header tells you where the new resource is

### PUT - Replace Entire Resource

```http
PUT /api/books/123
Host: api.example.com
Content-Type: application/json

{
  "title": "1984 (Updated Edition)",
  "author": "George Orwell",
  "year": 1949,
  "edition": 2
}
```

PUT replaces the **entire** resource. If you don't include a field, it gets removed (or set to default).

**Key points:**

- Idempotent (same result every time)
- Client provides complete representation
- Returns 200 OK or 204 No Content

### PATCH - Partial Update

```http
PATCH /api/books/123
Host: api.example.com
Content-Type: application/json

{
  "edition": 2
}
```

Only updates the fields you send. Everything else stays the same.

### DELETE - Remove Resource

```http
DELETE /api/books/123
Host: api.example.com
```

**Response:**

```http
HTTP/1.1 204 No Content
```

**Key points:**

- Idempotent
- Usually returns 204 No Content (success, no body)
- Subsequent DELETEs return 404 Not Found

## HTTP Status Codes

Status codes tell you what happened:

### 2xx Success

- **200 OK** - Request succeeded, here's the data
- **201 Created** - New resource created successfully
- **204 No Content** - Success, but no data to return

### 3xx Redirection

- **301 Moved Permanently** - Resource moved, update your bookmarks
- **304 Not Modified** - Cached version is still good

### 4xx Client Errors

- **400 Bad Request** - Malformed request (invalid JSON, missing fields)
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Authenticated but don't have permission
- **404 Not Found** - Resource doesn't exist
- **409 Conflict** - Resource state conflict (e.g., duplicate)
- **422 Unprocessable Entity** - Valid syntax but semantic errors

### 5xx Server Errors

- **500 Internal Server Error** - Server crashed
- **502 Bad Gateway** - Proxy/gateway issue
- **503 Service Unavailable** - Server overloaded or down

## REST API Design Patterns

### Resource Naming

**Good URLs (noun-based, hierarchical):**

```
GET    /api/books              # List all books
GET    /api/books/123          # Get specific book
POST   /api/books              # Create new book
PUT    /api/books/123          # Update book 123
DELETE /api/books/123          # Delete book 123

GET    /api/books/123/reviews  # Reviews for book 123
POST   /api/books/123/reviews  # Add review to book 123
```

**Bad URLs (verb-based, inconsistent):**

```
GET  /api/getBooks            # Don't use verbs
POST /api/createNewBook       # Method already says "create"
GET  /api/book?id=123         # Use path params, not query for IDs
```

### Query Parameters for Filtering

```
GET /api/books?author=Orwell&year=1949&sort=title&limit=10
```

Use query strings for:

- Filtering
- Sorting
- Pagination
- Search

### Pagination

Handle large result sets:

```
GET /api/books?page=2&limit=20
```

**Response:**

```json
{
  "data": [
    /* 20 books here */
  ],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 156,
    "total_pages": 8,
    "next": "/api/books?page=3&limit=20",
    "prev": "/api/books?page=1&limit=20"
  }
}
```

### Error Responses

Consistent error format helps clients:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      },
      {
        "field": "age",
        "message": "Must be at least 18"
      }
    ]
  }
}
```

## Versioning APIs

APIs evolve. Versioning prevents breaking existing clients:

**URL versioning:**

```
https://api.example.com/v1/books
https://api.example.com/v2/books
```

**Header versioning:**

```http
Accept: application/vnd.example.v2+json
```

## Authentication & Security

REST APIs are stateless, so authentication happens per request:

### API Keys (simplest)

```http
GET /api/books
Authorization: ApiKey abc123xyz
```

### Bearer Tokens (JWT)

```http
GET /api/books
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### OAuth 2.0

More complex, covered in Week 13.

## Real-World Example

Let's build a blog API:

**Get all posts:**

```http
GET /api/posts
```

**Get specific post:**

```http
GET /api/posts/42
```

**Create new post:**

```http
POST /api/posts
Content-Type: application/json

{
  "title": "My First Post",
  "body": "Hello world!",
  "author_id": 123
}
```

**Add comment to post:**

```http
POST /api/posts/42/comments
Content-Type: application/json

{
  "text": "Great post!",
  "author_id": 456
}
```

**Update post:**

```http
PATCH /api/posts/42
Content-Type: application/json

{
  "title": "My First Post (Updated)"
}
```

**Delete post:**

```http
DELETE /api/posts/42
```

## Common Mistakes & Best Practices

❌ **Don't:** Use verbs in URLs (`/getUsers`, `/createPost`)  
✅ **Do:** Use nouns with HTTP methods (`GET /users`, `POST /posts`)

❌ **Don't:** Return HTML from an API  
✅ **Do:** Return structured data (JSON) with proper Content-Type

❌ **Don't:** Use GET for operations that change data  
✅ **Do:** Use POST/PUT/PATCH/DELETE for mutations

❌ **Don't:** Return 200 OK for errors with error message in body  
✅ **Do:** Use appropriate status codes (400, 404, 500, etc.)

❌ **Don't:** Expose internal IDs or sensitive data  
✅ **Do:** Use UUIDs or public IDs, validate access

## Testing REST APIs

Tools you'll use:

- **curl** - Command line HTTP client
- **Postman** - GUI for API testing
- **HTTPie** - User-friendly curl alternative
- **Browser DevTools** - Network tab shows all requests

Example curl request:

```bash
curl -X POST https://api.example.com/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token123" \
  -d '{"title":"New Post","body":"Content here"}'
```

## Code Examples

The file `01_rest_with_node.js` demonstrates:

- Making GET/POST/PUT/DELETE requests with fetch and axios
- Handling responses and errors
- Working with JSON data
- Real API calls to JSONPlaceholder (test API)
- Async/await patterns
- Error handling and retries

Run it:

```bash
node week07_rest/01_rest_with_node.js
```

## What You Should Know

After this week, you should be able to:

1. Explain what REST is and its core principles
2. Choose the correct HTTP method for different operations
3. Design RESTful URL structures
4. Parse and create JSON data
5. Handle HTTP status codes appropriately
6. Consume any REST API with proper authentication
7. Debug API calls using browser tools or curl

---

**Previous:** [Week 6 - DOM & SAX](../week06_dom_sax/)  
**Next:** [Week 8 - OpenAPI](../week08_openapi/)
