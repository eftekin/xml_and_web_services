/**
 * Week 7: REST API Client Examples in JavaScript/Node.js
 *
 * This file demonstrates different ways to consume REST APIs using:
 * - Fetch API (Node.js 18+)
 * - Axios library (if npm packages are installed)
 * - Error handling and retry patterns
 */

// ============================================================================
// Example 1: Using Fetch API (Built-in, Node.js 18+)
// ============================================================================

/**
 * Basic GET request using Fetch
 */
async function getPostsWithFetch() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1",
    );

    // Check if response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const post = await response.json();
    console.log("GET /posts/1:", post);
    return post;
  } catch (error) {
    console.error("Error fetching post:", error.message);
  }
}

/**
 * POST request with request body
 */
async function createPostWithFetch(title, body) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        body: body,
        userId: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newPost = await response.json();
    console.log("POST /posts - Created:", newPost);
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error.message);
  }
}

/**
 * PUT request to update a resource
 */
async function updatePostWithFetch(postId, title, body) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: postId,
          title: title,
          body: body,
          userId: 1,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedPost = await response.json();
    console.log("PUT /posts/:id - Updated:", updatedPost);
    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error.message);
  }
}

/**
 * PATCH request to partially update a resource
 */
async function partialUpdateWithFetch(postId, updates) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("PATCH /posts/:id - Updated:", result);
    return result;
  } catch (error) {
    console.error("Error partially updating:", error.message);
  }
}

/**
 * DELETE request
 */
async function deletePostWithFetch(postId) {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // DELETE often returns 200 with empty or confirmation body
    console.log(`DELETE /posts/${postId} - Deleted successfully`);
    return true;
  } catch (error) {
    console.error("Error deleting post:", error.message);
  }
}

// ============================================================================
// Example 2: Working with Query Parameters
// ============================================================================

/**
 * GET with query parameters
 */
async function getPostsWithParams(userId, limit = 5) {
  try {
    const params = new URLSearchParams({
      userId: userId,
      _limit: limit,
    });

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?${params}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();
    console.log(
      `GET /posts with params (userId=${userId}, limit=${limit}):`,
      posts,
    );
    return posts;
  } catch (error) {
    console.error("Error fetching with params:", error.message);
  }
}

// ============================================================================
// Example 3: Error Handling and Retry Logic
// ============================================================================

/**
 * Fetch with retry logic
 */
async function fetchWithRetry(url, options = {}, retries = 3) {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.log(`Attempt ${i + 1} failed: ${error.message}`);

      // Don't retry on the last attempt
      if (i < retries - 1) {
        const waitTime = Math.pow(2, i) * 1000; // Exponential backoff
        console.log(`Retrying in ${waitTime}ms...`);
        await delay(waitTime);
      } else {
        throw error; // Re-throw on final attempt
      }
    }
  }
}

// ============================================================================
// Example 4: Working with Headers and Authentication
// ============================================================================

/**
 * Request with custom headers and Bearer token (for JWT)
 */
async function getWithAuthentication(url, token) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Custom-Header": "MyValue",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Authenticated request successful:", data);
    return data;
  } catch (error) {
    console.error("Error with authenticated request:", error.message);
  }
}

// ============================================================================
// Example 5: Handling Different Response Types
// ============================================================================

/**
 * Handle JSON response
 */
async function getJsonResponse(url) {
  const response = await fetch(url);
  return await response.json();
}

/**
 * Handle text response
 */
async function getTextResponse(url) {
  const response = await fetch(url);
  return await response.text();
}

/**
 * Handle blob response (for files, images, etc)
 */
async function getBlobResponse(url) {
  const response = await fetch(url);
  return await response.blob();
}

/**
 * Get response headers
 */
async function getResponseHeaders(url) {
  try {
    const response = await fetch(url);

    console.log("Response Headers:");
    for (let [key, value] of response.headers) {
      console.log(`${key}: ${value}`);
    }

    return response.headers;
  } catch (error) {
    console.error("Error getting headers:", error.message);
  }
}

// ============================================================================
// Example 6: REST Best Practices
// ============================================================================

/**
 * API Client class for better organization
 */
class RESTClient {
  constructor(baseURL, defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };
  }

  /**
   * Helper method for all requests
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP ${response.status}: ${error.message || response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Request failed: ${error.message}`);
      throw error;
    }
  }

  // Convenience methods for common HTTP verbs
  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

// ============================================================================
// Example 7: Real-World Usage Example
// ============================================================================

/**
 * Complete example: Fetch, create, update, and delete a post
 */
async function completeExample() {
  const client = new RESTClient("https://jsonplaceholder.typicode.com");

  try {
    // Get a post
    console.log("\n1. Getting post #1:");
    const post = await client.get("/posts/1");
    console.log(post);

    // Create a new post
    console.log("\n2. Creating new post:");
    const newPost = await client.post("/posts", {
      title: "My New Post",
      body: "This is the content of my post",
      userId: 1,
    });
    console.log(newPost);

    // Update the post
    console.log("\n3. Updating post:");
    const updated = await client.patch("/posts/1", {
      title: "Updated Title",
    });
    console.log(updated);

    // Delete the post
    console.log("\n4. Deleting post:");
    await client.delete("/posts/1");
    console.log("Post deleted");
  } catch (error) {
    console.error("Example failed:", error.message);
  }
}

// ============================================================================
// Main: Run examples if this file is executed directly
// ============================================================================

if (require.main === module) {
  // Uncomment any example you want to run:

  // getPostsWithFetch();
  // createPostWithFetch('Test Post', 'This is a test');
  // updatePostWithFetch(1, 'Updated', 'Updated body');
  // partialUpdateWithFetch(1, { title: 'Partially Updated' });
  // deletePostWithFetch(1);
  // getPostsWithParams(1, 10);
  // getResponseHeaders('https://jsonplaceholder.typicode.com/posts/1');

  // Run the complete example
  completeExample();
}

// ============================================================================
// Export for use in other modules (if using module systems)
// ============================================================================

module.exports = {
  getPostsWithFetch,
  createPostWithFetch,
  updatePostWithFetch,
  partialUpdateWithFetch,
  deletePostWithFetch,
  getPostsWithParams,
  fetchWithRetry,
  getWithAuthentication,
  RESTClient,
  completeExample,
};
