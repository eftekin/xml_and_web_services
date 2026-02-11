# Week 8: OpenAPI

## The Problem

You're building an API. Someone needs to know how to use it. What endpoints exist? What parameters do they take? What do you get back? You could write documentation by hand (which always gets stale), or you could define your API formally—then generate the docs automatically.

OpenAPI (formerly Swagger) does exactly that. It's a specification for describing REST APIs in a structured, machine-readable format.

## Why OpenAPI Matters

Consider two API teams:

**Team A (No OpenAPI):**

- Build API
- Write README with examples
- README gets out of sync when code changes
- New developer can't figure out correct usage
- Integration breaks when endpoint changes
- Supports 15 different client libraries, all slightly different

**Team B (With OpenAPI):**

- Define API spec in OpenAPI
- Generate code, docs, client libraries automatically
- Spec is source of truth (code matches it)
- New developers see interactive docs (Swagger UI)
- Break changes are caught immediately
- Generate clients for JavaScript, Python, Java automatically

OpenAPI eliminates documentation as a separate chore—it's generated from your spec.

## OpenAPI Structure

An OpenAPI document describes your entire API:

```yaml
openapi: 3.0.0 # OpenAPI version
info: # Metadata
  title: Blog API
  version: 1.0.0
  description: A simple blog API
paths: # The endpoints
  /posts:
    get:
      summary: List posts
      responses:
        "200":
          description: List of posts
components: # Reusable pieces
  schemas:
    Post:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
```

Each section defines a piece of your API contract.

## Paths: Your API Endpoints

Every endpoint is a path with operations:

```yaml
paths:
  /posts: # Path
    get: # Operation
      operationId: listPosts
      summary: Get all posts
      responses:
        "200":
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Post"

    post: # Another operation on same path
      operationId: createPost
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Post"
      responses:
        "201":
          description: Created

  /posts/{id}: # Path with parameter
    get:
      operationId: getPost
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        "200":
          description: A single post
```

## Parameters: Inputs to Your Endpoints

Where can parameters come from?

```yaml
parameters:
  # Path parameter: /users/{id}
  - name: id
    in: path
    required: true
    schema:
      type: integer
      description: User ID

  # Query parameter: ?search=hello&limit=10
  - name: search
    in: query
    required: false
    schema:
      type: string
      description: Search term

  - name: limit
    in: query
    required: false
    schema:
      type: integer
      default: 10
      minimum: 1
      maximum: 100

  # Header: Authorization header
  - name: Authorization
    in: header
    required: true
    schema:
      type: string
      pattern: "^Bearer [A-Za-z0-9-._~+/]+=*$"
```

## Request Bodies: What Clients Send

```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          title:
            type: string
            minLength: 1
            maxLength: 200
          content:
            type: string
            minLength: 10
          author:
            type: string
          published:
            type: boolean
        required:
          - title
          - content
        example:
          title: "My First Post"
          content: "This is the content of my post"
          author: "John Doe"
          published: true
```

## Responses: What Your API Returns

```yaml
responses:
  "200":
    description: Success - post created
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/Post"
        example:
          id: 1
          title: "My First Post"
          content: "Content here"
          author: "John"
          published: true
          createdAt: "2024-01-15T10:30:00Z"

  "400":
    description: Bad Request - validation failed
    content:
      application/json:
        schema:
          $ref: "#/components/schemas/Error"
        example:
          code: "VALIDATION_ERROR"
          message: "Title is required"

  "401":
    description: Unauthorized - missing token

  "500":
    description: Server Error
```

## Components: Reusable Schemas

Define schemas once, reuse everywhere:

```yaml
components:
  schemas:
    Post:
      type: object
      properties:
        id:
          type: integer
          format: int64
        title:
          type: string
        content:
          type: string
        author:
          type: string
        published:
          type: boolean
        tags:
          type: array
          items:
            type: string
        createdAt:
          type: string
          format: date-time
        metadata:
          type: object
          additionalProperties: true
      required:
        - id
        - title
        - content

    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: string
      required:
        - code
        - message

    # Reference in responses
  responses:
    Created:
      description: Resource created
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Post"
```

Now anywhere you need a Post schema, use: `$ref: '#/components/schemas/Post'`

## Complete Small API Example

```yaml
openapi: 3.0.0
info:
  title: Todo API
  version: 1.0.0
  description: Simple task management API

servers:
  - url: https://api.example.com/v1

paths:
  /todos:
    get:
      summary: List all todos
      parameters:
        - name: completed
          in: query
          schema:
            type: boolean
      responses:
        "200":
          description: List of todos
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Todo"

    post:
      summary: Create a new todo
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                  minLength: 1
              required:
                - title
      responses:
        "201":
          description: Todo created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Todo"

  /todos/{id}:
    get:
      summary: Get a single todo
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        "200":
          description: A todo
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Todo"
        "404":
          description: Not found

components:
  schemas:
    Todo:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
        completed:
          type: boolean
          default: false
        createdAt:
          type: string
          format: date-time
      required:
        - id
        - title
```

## Tools That Work With OpenAPI

- **Swagger UI** - Interactive documentation (test endpoints in browser)
- **ReDoc** - Beautiful static docs
- **Postman** - Import spec, get all endpoints ready to test
- **Code Generators** - Generate client libraries for any language
- **API Gateways** - Kong, AWS API Gateway validate requests against spec
- **Testing Tools** - Validate responses match schema

## Industry Standard

OpenAPI is THE way to document REST APIs:

- GitHub uses it
- AWS uses it
- Google uses it
- Stripe uses it
- Almost every major API uses OpenAPI

If a company says "we have API docs," they probably use OpenAPI.

---

**Previous:** [Week 7 - REST](../week07_rest/)  
**Next:** [Week 10 - SOAP](../week10_soap_wsdl/)
