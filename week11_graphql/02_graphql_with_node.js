/**
 * Week 11: GraphQL with Apollo Server and Client
 *
 * Examples using Apollo Server and Apollo Client for GraphQL
 * This demonstrates:
 * - Setting up an Apollo GraphQL server
 * - Defining schemas with resolvers
 * - Executing queries and mutations
 * - Using Apollo Client for frontend queries
 */

// ============================================================================
// Example 1: Apollo Server Setup and Schema Definition
// ============================================================================

/**
 * Note: To run this, you need to install dependencies:
 * npm install apollo-server graphql
 *
 * Then uncomment and run the server setup below
 */

const apollo_server_example = `
// server.js
const { ApolloServer, gql } = require('apollo-server');

// Define GraphQL Schema using SDL (Schema Definition Language)
const typeDefs = gql\`
  type Query {
    posts: [Post!]!
    post(id: ID!): Post
    users: [User!]!
    user(id: ID!): User
  }
  
  type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post
    deletePost(id: ID!): Boolean!
    createUser(input: CreateUserInput!): User!
  }
  
  type Post {
    id: ID!
    title: String!
    body: String!
    userId: ID!
    user: User!
    comments: [Comment!]!
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
    postId: ID!
  }
  
  input CreatePostInput {
    title: String!
    body: String!
    userId: ID!
  }
  
  input UpdatePostInput {
    title: String
    body: String
  }
  
  input CreateUserInput {
    name: String!
    email: String!
  }
\`;

// Sample data (in real app, this would be a database)
const posts = [
  { id: '1', title: 'First Post', body: 'Content 1', userId: '1' },
  { id: '2', title: 'Second Post', body: 'Content 2', userId: '1' },
  { id: '3', title: 'Third Post', body: 'Content 3', userId: '2' }
];

const users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' }
];

const comments = [
  { id: '1', text: 'Great post!', postId: '1' },
  { id: '2', text: 'Thanks for sharing', postId: '1' }
];

// Define resolvers (functions that return data for each field)
const resolvers = {
  Query: {
    posts: () => posts,
    post: (parent, args) => posts.find(p => p.id === args.id),
    users: () => users,
    user: (parent, args) => users.find(u => u.id === args.id)
  },
  
  Mutation: {
    createPost: (parent, args) => {
      const newPost = {
        id: String(posts.length + 1),
        ...args.input
      };
      posts.push(newPost);
      return newPost;
    },
    
    updatePost: (parent, args) => {
      const post = posts.find(p => p.id === args.id);
      if (post) {
        Object.assign(post, args.input);
      }
      return post;
    },
    
    deletePost: (parent, args) => {
      const index = posts.findIndex(p => p.id === args.id);
      if (index !== -1) {
        posts.splice(index, 1);
        return true;
      }
      return false;
    },
    
    createUser: (parent, args) => {
      const newUser = {
        id: String(users.length + 1),
        ...args.input
      };
      users.push(newUser);
      return newUser;
    }
  },
  
  // Nested resolvers for related data
  Post: {
    user: (parent) => users.find(u => u.id === parent.userId),
    comments: (parent) => comments.filter(c => c.postId === parent.id)
  },
  
  User: {
    posts: (parent) => posts.filter(p => p.userId === parent.id)
  }
};

// Create and start Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Apollo Sandbox will be available at http://localhost:4000
});

server.listen({ port: 4000 }, () => {
  console.log('GraphQL server running at http://localhost:4000');
});
`;

// ============================================================================
// Example 2: Client-Side GraphQL Queries
// ============================================================================

/**
 * GraphQL Query Examples
 * These can be sent to the Apollo Server above
 */

const graphql_queries = {
  // Simple query to get all posts
  getAllPosts: `
    query GetAllPosts {
      posts {
        id
        title
        body
      }
    }
  `,

  // Query with arguments
  getPostById: `
    query GetPost($postId: ID!) {
      post(id: $postId) {
        id
        title
        body
      }
    }
  `,

  // Query with nested fields (relationships)
  getPostsWithUsers: `
    query GetPostsWithUsers {
      posts {
        id
        title
        body
        user {
          id
          name
          email
        }
      }
    }
  `,

  // Query with nested comments
  getPostWithComments: `
    query GetPostWithComments($postId: ID!) {
      post(id: $postId) {
        id
        title
        body
        user {
          name
        }
        comments {
          id
          text
        }
      }
    }
  `,

  // Query user with their posts
  getUserWithPosts: `
    query GetUserWithPosts($userId: ID!) {
      user(id: $userId) {
        id
        name
        email
        posts {
          id
          title
          body
        }
      }
    }
  `,
};

// ============================================================================
// Example 3: GraphQL Mutations
// ============================================================================

const graphql_mutations = {
  // Create a new post
  createPost: `
    mutation CreatePost($title: String!, $body: String!, $userId: ID!) {
      createPost(input: {
        title: $title
        body: $body
        userId: $userId
      }) {
        id
        title
        body
        user {
          name
        }
      }
    }
  `,

  // Update a post
  updatePost: `
    mutation UpdatePost($postId: ID!, $title: String!, $body: String!) {
      updatePost(id: $postId, input: {
        title: $title
        body: $body
      }) {
        id
        title
        body
      }
    }
  `,

  // Delete a post
  deletePost: `
    mutation DeletePost($postId: ID!) {
      deletePost(id: $postId)
    }
  `,

  // Create a new user
  createUser: `
    mutation CreateUser($name: String!, $email: String!) {
      createUser(input: {
        name: $name
        email: $email
      }) {
        id
        name
        email
      }
    }
  `,
};

// ============================================================================
// Example 4: Apollo Client Usage (Browser/Frontend)
// ============================================================================

const apollo_client_example = `
// Install: npm install @apollo/client graphql

import { ApolloClient, InMemoryCache, gql, useQuery, useMutation } from '@apollo/client';

// Create Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});

// Define query
const GET_POSTS = gql\`
  query GetPosts {
    posts {
      id
      title
      body
      user {
        name
      }
    }
  }
\`;

// Use in React component
function Posts() {
  const { loading, error, data } = useQuery(GET_POSTS);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <ul>
      {data.posts.map(post => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
          <small>By {post.user.name}</small>
        </li>
      ))}
    </ul>
  );
}

// Mutation example
const CREATE_POST = gql\`
  mutation CreatePost($title: String!, $body: String!, $userId: ID!) {
    createPost(input: {
      title: $title
      body: $body
      userId: $userId
    }) {
      id
      title
    }
  }
\`;

function CreatePostForm() {
  const [createPost] = useMutation(CREATE_POST);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    await createPost({
      variables: {
        title: formData.get('title'),
        body: formData.get('body'),
        userId: '1'
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <textarea name="body" placeholder="Content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
`;

// ============================================================================
// Example 5: GraphQL Best Practices
// ============================================================================

const best_practices = {
  naming_conventions: `
    // Use camelCase for field names
    type User {
      userId: ID!          // Use camelCase
      firstName: String!   // Not: first_name or FirstName
      emailAddress: String!
      createdAt: String!
    }
  `,

  proper_types: `
    // Always use proper types
    type Post {
      id: ID!              // Use ! for required fields
      title: String!       // Never use String when String! needed
      body: String!
      createdAt: String!
      views: Int!          // Use Int for numbers
      featured: Boolean!   // Use Boolean for flags
    }
  `,

  error_handling: `
    // Return consistent error responses
    type Mutation {
      createPost(input: CreatePostInput!): CreatePostPayload!
    }
    
    type CreatePostPayload {
      success: Boolean!
      post: Post
      errors: [Error!]
    }
    
    type Error {
      field: String!
      message: String!
    }
  `,

  pagination: `
    // Use standard pagination pattern
    type Query {
      posts(limit: Int, offset: Int): PostConnection!
    }
    
    type PostConnection {
      edges: [PostEdge!]!
      pageInfo: PageInfo!
      totalCount: Int!
    }
    
    type PostEdge {
      cursor: String!
      node: Post!
    }
    
    type PageInfo {
      hasNextPage: Boolean!
      hasPreviousPage: Boolean!
      startCursor: String
      endCursor: String
    }
  `,

  fragment_usage: `
    // Use fragments for reusable field selections
    fragment PostFields on Post {
      id
      title
      body
      user {
        id
        name
      }
    }
    
    query GetPosts {
      posts {
        ...PostFields
      }
    }
  `,
};

// ============================================================================
// Example 6: Variable Usage in Queries/Mutations
// ============================================================================

const variable_examples = {
  query_with_variables: `
    query GetData($userId: ID!, $limit: Int!) {
      user(id: $userId) {
        id
        name
        posts(limit: $limit) {
          id
          title
        }
      }
    }
  `,

  variables_object: {
    userId: "1",
    limit: 10,
  },

  mutation_with_variables: `
    mutation UpdatePost($postId: ID!, $input: UpdatePostInput!) {
      updatePost(id: $postId, input: $input) {
        id
        title
        body
      }
    }
  `,

  mutation_variables: {
    postId: "1",
    input: {
      title: "Updated Title",
      body: "Updated content",
    },
  },
};

// ============================================================================
// Example 7: Node.js GraphQL Client (using fetch)
// ============================================================================

/**
 * Make GraphQL requests with Fetch API
 */
class GraphQLClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async query(queryString, variables = {}) {
    return this.request(queryString, variables);
  }

  async mutation(mutationString, variables = {}) {
    return this.request(mutationString, variables);
  }

  async request(query, variables) {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(
          `GraphQL Error: ${result.errors.map((e) => e.message).join(", ")}`,
        );
      }

      return result.data;
    } catch (error) {
      console.error("GraphQL request failed:", error.message);
      throw error;
    }
  }
}

// Usage example
const client = new GraphQLClient("http://localhost:4000");

async function example() {
  try {
    // Get posts
    const posts = await client.query(`
      query {
        posts {
          id
          title
          user {
            name
          }
        }
      }
    `);

    console.log("Posts:", posts);

    // Create post
    const newPost = await client.mutation(
      `
      mutation CreatePost($title: String!, $body: String!, $userId: ID!) {
        createPost(input: {
          title: $title
          body: $body
          userId: $userId
        }) {
          id
          title
        }
      }
    `,
      {
        title: "New Post",
        body: "Content here",
        userId: "1",
      },
    );

    console.log("Created post:", newPost);
  } catch (error) {
    console.error("Example failed:", error);
  }
}

// Export for use
module.exports = {
  graphql_queries,
  graphql_mutations,
  best_practices,
  variable_examples,
  GraphQLClient,
  apollo_server_example,
  apollo_client_example,
};
