# Week 11: GraphQL

## What You're Learning

GraphQL is a query language. Instead of hitting separate endpoints for posts, users, comments, it's one endpoint and the client asks for exactly what it needs.

## Core Idea

With REST:

```
GET /posts/1              → get a post
GET /users/1              → get a user
GET /posts/1/comments     → get comments
```

With GraphQL:

```graphql
query {
  post(id: 1) {
    title
    body
    author {
      name
    }
    comments {
      text
    }
  }
}
```

One request. You get exactly what you asked for—nothing extra. That's the whole point.

## How It Works

**Define the schema** - What data exists and what type it is:

```graphql
type Post {
  id: ID!
  title: String!
  body: String!
  author: User!
  comments: [Comment!]!
}
```

**Write queries** - Ask for the data you want:

```graphql
query GetPost($id: ID!) {
  post(id: $id) {
    title
    author {
      name
    }
  }
}
```

**Write mutations** - Change data:

```graphql
mutation CreatePost($title: String!, $body: String!) {
  createPost(input: { title: $title, body: $body }) {
    id
    title
  }
}
```

## See It In Action

**Python:** `01_graphql_complete_guide.ipynb` - Full guide with examples

**JavaScript:** `02_graphql_with_node.js` - Apollo server and client setup

Both show the same concepts—pick whichever language you prefer.

## Why GraphQL

- Ask for what you need, get exactly that (no wasted data)
- One endpoint instead of many
- Strongly typed (catches errors before runtime)
- Great developer experience with introspection and tooling

---

**Previous:** [Week 10 - SOAP](../week10_soap_wsdl/)  
**Next:** [Week 12 - gRPC](../week12_grpc/)
