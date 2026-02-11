# Week 7: JSON & REST APIs

## What You're Learning

REST is how modern APIs work. HTTP methods (GET, POST, PUT, DELETE) map to actual operations on data. JSON is the lightweight format everyone uses to send that data around.

## Core Idea

REST isn't magic—it's just HTTP rules. Here's how it works:

**GET** - Fetch data

```
GET /posts/1
→ Returns the post with id=1
```

**POST** - Create something new

```
POST /posts
Content-Type: application/json

{ "title": "My Post", "body": "Content here" }
→ Creates post, returns 201 Created with location of new resource
```

**PUT** - Replace entire resource

```
PUT /posts/1
{ "title": "Updated", "body": "New content" }
→ Replaces post 1 completely
```

**PATCH** - Update just specific fields

```
PATCH /posts/1
{ "title": "Only update this" }
→ Keeps other fields, updates only what's sent
```

**DELETE** - Remove it

```
DELETE /posts/1
→ Returns 204 No Content when successful
```

Status codes tell you what happened:

- **2xx** (200, 201) - Success
- **4xx** (400, 401, 404) - Client error
- **5xx** (500) - Server error

## Code Examples

See how to actually do this:

**Python:** `01_json_and_rest_complete.ipynb`

**JavaScript:** `02_rest_with_node.js`

Both files show:

- How to make requests
- How to handle responses
- How to deal with errors
- Real examples using actual APIs

## The Pattern

Most REST APIs follow this same pattern. Once you understand GET/POST/PUT/DELETE, you understand REST. Pick either Python or JavaScript example and work through it—they're the same ideas, different syntax.

---

**Previous:** [Week 6 - DOM & SAX](../week06_dom_sax/)  
**Next:** [Week 8 - OpenAPI](../week08_openapi/)
