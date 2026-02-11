# Week 11: GraphQL

## Why This Matters

You've learned REST—multiple endpoints, fixed responses, over-fetching or under-fetching data. GraphQL solves these problems with a different approach: one endpoint, clients specify exactly what they need, strongly typed schemas. Companies like Facebook, GitHub, Shopify, and Twitter use GraphQL in production.

## Quick Start - See It In Action

Run the practical example to see real GraphQL queries in action:

```bash
node week11_graphql/01_graphql_with_node.js
```

This will query the SpaceX GraphQL API and fetch:

- Company information
- Latest launch details with nested rocket data
- Upcoming launches
- Complete rocket specifications

Watch how GraphQL fetches complex, nested data in single requests!

## The Problem GraphQL Solves

### REST Pain Points

Imagine building a blog post page. You need:

- Post details
- Author information
- Comments
- Each comment's author

**With REST, you'd make multiple requests:**

```javascript
// Request 1: Get the post
GET / api / posts / 123;
// Returns: { id: 123, title: "...", body: "...", author_id: 5 }

// Request 2: Get the author
GET / api / users / 5;
// Returns: { id: 5, name: "Alice", email: "...", bio: "...", ... }

// Request 3: Get comments
GET / api / posts / 123 / comments;
// Returns: [{ id: 1, text: "...", author_id: 7 }, ...]

// Request 4, 5, 6: Get each comment's author
GET / api / users / 7;
GET / api / users / 8;
GET / api / users / 9;
```

**Problems:**

- **Multiple round trips** (slow, especially on mobile)
- **Over-fetching** (getting fields you don't need)
- **Under-fetching** (need additional requests)
- **Versioning headaches** (breaking changes)

### GraphQL Solution

**One request, exactly what you need:**

```graphql
query {
  post(id: 123) {
    title
    body
    author {
      name
    }
    comments {
      text
      author {
        name
      }
    }
  }
}
```

**Response:**

```json
{
  "data": {
    "post": {
      "title": "GraphQL is Cool",
      "body": "Here's why...",
      "author": {
        "name": "Alice"
      },
      "comments": [
        {
          "text": "Great post!",
          "author": { "name": "Bob" }
        },
        {
          "text": "Thanks for sharing",
          "author": { "name": "Charlie" }
        }
      ]
    }
  }
}
```

One request. Exactly the fields you asked for. Nothing more.

## Core Concepts

### 1. Schema - The Contract

GraphQL uses a **schema** to define what data exists and what operations are allowed. It's like a DTD or XSD, but for APIs.

```graphql
type Post {
  id: ID!
  title: String!
  body: String!
  published: Boolean!
  author: User!
  comments: [Comment!]!
  createdAt: DateTime!
}

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Comment {
  id: ID!
  text: String!
  author: User!
  post: Post!
}

type Query {
  post(id: ID!): Post
  posts: [Post!]!
  user(id: ID!): User
}

type Mutation {
  createPost(title: String!, body: String!): Post!
  updatePost(id: ID!, title: String, body: String): Post
  deletePost(id: ID!): Boolean!
}
```

**Key notation:**

- `String!` - Required (non-null)
- `String` - Optional (can be null)
- `[Post!]!` - Required array of required Posts (never null, elements never null)
- `[Post]` - Optional array of optional Posts

### 2. Types

**Scalar Types** (built-in):

- `Int` - 32-bit integer
- `Float` - Floating point number
- `String` - UTF-8 text
- `Boolean` - true/false
- `ID` - Unique identifier (serialized as string)

**Object Types** (custom):

```graphql
type Book {
  isbn: ID!
  title: String!
  author: Author!
  pages: Int!
  rating: Float
}
```

**Enum Types**:

```graphql
enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

**Input Types** (for mutations):

```graphql
input CreatePostInput {
  title: String!
  body: String!
  authorId: ID!
}
```

### 3. Queries - Reading Data

Queries fetch data. Think of them as GET requests.

**Simple query:**

```graphql
query {
  posts {
    title
    author {
      name
    }
  }
}
```

**Query with arguments:**

```graphql
query {
  post(id: "123") {
    title
    body
  }
}
```

**Query with variables:**

```graphql
query GetPost($postId: ID!) {
  post(id: $postId) {
    title
    author {
      name
      email
    }
  }
}
```

Variables passed separately:

```json
{
  "postId": "123"
}
```

**Aliases** (rename fields in response):

```graphql
query {
  firstPost: post(id: "1") {
    title
  }
  secondPost: post(id: "2") {
    title
  }
}
```

**Fragments** (reusable field sets):

```graphql
fragment PostFields on Post {
  id
  title
  createdAt
}

query {
  post(id: "123") {
    ...PostFields
    author {
      name
    }
  }
}
```

### 4. Mutations - Changing Data

Mutations modify data. Think POST/PUT/DELETE.

**Create:**

```graphql
mutation {
  createPost(title: "New Post", body: "Content here") {
    id
    title
    createdAt
  }
}
```

**Update:**

```graphql
mutation {
  updatePost(id: "123", title: "Updated Title") {
    id
    title
    updatedAt
  }
}
```

**Delete:**

```graphql
mutation {
  deletePost(id: "123")
}
```

**With variables:**

```graphql
mutation CreatePost($title: String!, $body: String!) {
  createPost(title: $title, body: $body) {
    id
    title
  }
}
```

### 5. Subscriptions - Real-time Updates

Subscriptions push updates to clients (WebSocket-based).

```graphql
subscription {
  commentAdded(postId: "123") {
    id
    text
    author {
      name
    }
  }
}
```

When a comment is added to post 123, subscribers get notified immediately.

## Resolvers - How It Actually Works

The schema defines **what** data exists. Resolvers define **how** to get it.

```javascript
const resolvers = {
  Query: {
    post: (parent, args, context) => {
      // args.id contains the post ID
      return database.posts.findById(args.id);
    },
    posts: () => {
      return database.posts.findAll();
    },
  },

  Post: {
    author: (post, args, context) => {
      // post.author_id comes from parent resolver
      return database.users.findById(post.author_id);
    },
    comments: (post) => {
      return database.comments.findByPostId(post.id);
    },
  },

  Mutation: {
    createPost: (parent, args, context) => {
      return database.posts.create({
        title: args.title,
        body: args.body,
        author_id: context.userId,
      });
    },
  },
};
```

**Resolver arguments:**

- `parent` - Result from parent resolver
- `args` - Arguments passed in query
- `context` - Shared context (user, database, etc.)
- `info` - Query metadata

## GraphQL vs REST

| Feature                | REST                      | GraphQL                         |
| ---------------------- | ------------------------- | ------------------------------- |
| **Endpoints**          | Many (`/posts`, `/users`) | One (`/graphql`)                |
| **Data fetching**      | Fixed responses           | Client specifies fields         |
| **Multiple resources** | Multiple requests         | Single request                  |
| **Over-fetching**      | Common                    | No (ask for what you need)      |
| **Under-fetching**     | Common                    | No (get related data in one go) |
| **Versioning**         | URL/header versions       | Schema evolution                |
| **Documentation**      | Separate (OpenAPI)        | Built-in (introspection)        |
| **Caching**            | HTTP caching works        | Needs custom solution           |
| **Learning curve**     | Lower                     | Higher                          |

## Schema Design Best Practices

### 1. Design for clients, not database

❌ **Bad** (exposes database structure):

```graphql
type User {
  id: ID!
  first_name: String
  last_name: String
  created_at: DateTime
  updated_at: DateTime
}
```

✅ **Good** (client-friendly):

```graphql
type User {
  id: ID!
  name: String!
  fullName: String!
  joinedDate: DateTime!
}
```

### 2. Make illegal states unrepresentable

Use unions and interfaces:

```graphql
interface SearchResult {
  id: ID!
}

type Post implements SearchResult {
  id: ID!
  title: String!
}

type User implements SearchResult {
  id: ID!
  name: String!
}

type Query {
  search(term: String!): [SearchResult!]!
}
```

### 3. Pagination

**Offset-based:**

```graphql
type Query {
  posts(limit: Int = 10, offset: Int = 0): [Post!]!
}
```

**Cursor-based (Relay spec):**

```graphql
type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
}

type PostEdge {
  cursor: String!
  node: Post!
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}

type Query {
  posts(first: Int, after: String): PostConnection!
}
```

### 4. Error Handling

GraphQL returns 200 OK even with errors:

```json
{
  "data": {
    "post": null
  },
  "errors": [
    {
      "message": "Post not found",
      "path": ["post"],
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

Custom error handling:

```javascript
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.extensions = { code: "NOT_FOUND" };
  }
}
```

## Authorization & Authentication

**Context-based:**

```javascript
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    const user = verifyToken(token);
    return { user };
  },
});
```

**In resolvers:**

```javascript
const resolvers = {
  Query: {
    me: (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError("Not authenticated");
      }
      return context.user;
    },
  },
  Mutation: {
    deletePost: (parent, { id }, context) => {
      const post = getPost(id);
      if (post.authorId !== context.user.id) {
        throw new ForbiddenError("Not authorized");
      }
      return deletePost(id);
    },
  },
};
```

## Introspection & Tooling

GraphQL APIs are self-documenting:

```graphql
query {
  __schema {
    types {
      name
      description
    }
  }
}
```

**GraphQL Playground / GraphiQL:**

- Auto-completion
- Documentation explorer
- Query history
- Syntax highlighting

## N+1 Problem & DataLoader

**Problem:**

```javascript
// Resolves posts
Query.posts(); // 1 query

// For each post, resolve author
Post.author(); // N queries (one per post!)
```

**Solution: DataLoader (batching)**

```javascript
const userLoader = new DataLoader(async (userIds) => {
  const users = await database.users.findByIds(userIds);
  return userIds.map((id) => users.find((u) => u.id === id));
});

const resolvers = {
  Post: {
    author: (post) => {
      return userLoader.load(post.author_id); // Batched!
    },
  },
};
```

## When to Use GraphQL

**Good fit:**

- Mobile apps (reduce requests)
- Complex data requirements
- Rapidly changing requirements
- Multiple client types (web, mobile, desktop)
- Strong typing needs
- Real-time features (subscriptions)

**Maybe not:**

- Simple CRUD APIs
- File uploads (streaming)
- Heavy HTTP caching needs
- Team unfamiliar with GraphQL

## Code Example

The file `01_graphql_with_node.js` demonstrates:

- Setting up Apollo Server
- Defining schemas and resolvers
- Writing queries and mutations
- Connecting to data sources
- Error handling
- Using Apollo Client to consume the API

Run it:

```bash
node week11_graphql/01_graphql_with_node.js
```

Then open GraphQL Playground at `http://localhost:4000`

## Practical Example: Building a Blog API

**Schema:**

```graphql
type Query {
  posts: [Post!]!
  post(id: ID!): Post
  user(id: ID!): User
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
  addComment(postId: ID!, text: String!): Comment!
}

type Subscription {
  postCreated: Post!
  commentAdded(postId: ID!): Comment!
}

type Post {
  id: ID!
  title: String!
  body: String!
  author: User!
  comments: [Comment!]!
  createdAt: DateTime!
}

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Comment {
  id: ID!
  text: String!
  author: User!
  createdAt: DateTime!
}

input CreatePostInput {
  title: String!
  body: String!
}
```

**Example queries:**

```graphql
# Get all posts with author names
query {
  posts {
    title
    author {
      name
    }
  }
}

# Get specific post with comments
query {
  post(id: "123") {
    title
    body
    comments {
      text
      author {
        name
      }
    }
  }
}

# Create new post
mutation {
  createPost(input: { title: "GraphQL is awesome", body: "Here's why..." }) {
    id
    title
    createdAt
  }
}
```

## Running the Practical Example

The `01_graphql_with_node.js` file contains a practical example that queries the **SpaceX GraphQL API** to fetch real data:

```bash
node week11_graphql/01_graphql_with_node.js
```

**What it does:**

1. **Fetches SpaceX Company Information** - Name, founder, CEO, employees, etc.
2. **Gets Latest Launch Data** - Mission details, rocket info, launch success status
3. **Shows Upcoming Launches** - Next 5 scheduled launches with dates and rockets
4. **Lists All Rockets** - Complete rocket specifications, costs, and success rates

**This demonstrates:**

- Real GraphQL queries against a production API
- Nested field selection (company → details, launch → rocket → details)
- Query parameters (limit for upcoming launches)
- Complex data fetching in single requests
- Practical use of the GraphQLClient class

The SpaceX API is publicly accessible and requires no authentication, making it perfect for learning GraphQL queries.

**Example query used in the code:**

```graphql
query {
  company {
    name
    founder
    founded
    employees
    ceo
    cto
    summary
  }
}
```

**Another example:**

```graphql
query {
  launchLatest {
    mission_name
    launch_date_utc
    launch_success
    rocket {
      rocket_name
      rocket_type
    }
    launch_site {
      site_name_long
    }
  }
}
```

Notice how in a single query, we get the launch data AND nested rocket information AND launch site details - this would require multiple REST API calls!

## What You Should Know

After this week, you should be able to:

1. Explain GraphQL's advantages over REST
2. Write GraphQL schemas with proper types
3. Create queries to fetch exactly the data you need
4. Write mutations to modify data
5. Understand resolvers and the execution model
6. Handle the N+1 problem with DataLoader
7. Design pagination and error handling
8. Set up authentication and authorization

---

**Previous:** [Week 10 - SOAP](../week10_soap_wsdl/)  
**Next:** [Week 12 - gRPC](../week12_grpc/)
