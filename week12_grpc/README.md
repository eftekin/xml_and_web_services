# Week 12: gRPC

## The Modern RPC

RPC = Remote Procedure Call. You have a function in a remote server. You want to call it from your code as if it were local. Traditionally this was slow and clunky. gRPC makes it fast and practical.

Use REST to talk to browsers and external APIs. Use gRPC for internal microservices talking to each other. It's way more efficient.

## gRPC vs Other Approaches

### REST Example

```
Browser → HTTP GET /users/42 → Server (JSON response)
- Human readable: Yes
- Transport: HTTP/1.1
- Format: JSON
- Speed: OK
- Overhead: Headers, text parsing
```

### gRPC Example

```
Service A → [Binary protobuf] → Service B (HTTP/2, binary response)
- Human readable: No (binary)
- Transport: HTTP/2 (multiplexing)
- Format: Protocol Buffers (efficient)
- Speed: Much faster
- Overhead: Minimal
```

## Protocol Buffers: Efficient Serialization

Protocol Buffers are like JSON, but binary and more efficient:

**JSON:**

```json
{
  "id": 42,
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

**Protocol Buffer (.proto):**

```proto
message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
}
```

The `.proto` defines the structure. gRPC compiles it to code:

- JavaScript
- Python
- Go
- Java
- C++
- Many more

### Why Protobuf is Efficient

1. **Binary format** - JSON is text, protobuf is binary (smaller)
2. **Field numbers** - Uses numbers (1, 2, 3) not field names
3. **Variable encoding** - Small numbers take fewer bytes
4. **No schema embedding** - Only data, structure known from .proto

Example sizes:

- JSON object: ~100 bytes
- Protobuf equivalent: ~20 bytes (5x smaller)

## Defining Services with .proto

```proto
syntax = "proto3";

package blog.api;

// Define data structures
message Post {
  int32 id = 1;
  string title = 2;
  string content = 3;
  string author = 4;
  int64 created_at = 5;
  repeated string tags = 6;  // Array of strings
}

message CreatePostRequest {
  string title = 1;
  string content = 2;
  string author = 3;
}

message ListPostsRequest {
  int32 page = 1;
  int32 limit = 2;
}

message ListPostsResponse {
  repeated Post posts = 1;
  int32 total = 2;
}

// Define the service (RPC methods)
service BlogService {
  // Unary: request → response
  rpc GetPost(GetPostRequest) returns (Post);

  // Server streaming: request → multiple responses
  rpc ListPosts(ListPostsRequest) returns (stream Post);

  // Client streaming: multiple requests → response
  rpc UploadPosts(stream Post) returns (UploadStatus);

  // Bidirectional: multiple requests ↔ multiple responses
  rpc Chat(stream Message) returns (stream Message);
}

message GetPostRequest {
  int32 id = 1;
}

message UploadStatus {
  int32 count = 1;
  string status = 2;
}

message Message {
  string text = 1;
  int64 timestamp = 2;
}
```

This defines:

- Data structures (messages)
- Service operations (RPCs)
- Request/response types
- Whether streaming is involved

## Communication Patterns

### 1. Unary RPC (Simple Request/Response)

```proto
rpc GetUser(GetUserRequest) returns (User);
```

Client:

```javascript
const user = await client.GetUser({ id: 42 });
console.log(user.name);
```

### 2. Server Streaming

```proto
rpc ListUsers(ListRequest) returns (stream User);
```

Client receives multiple users:

```javascript
const stream = client.ListUsers({ limit: 100 });
stream.on("data", (user) => {
  console.log(user.name); // Called for each user
});
```

### 3. Client Streaming

```proto
rpc RecordClicks(stream ClickEvent) returns (AnalyticsSummary);
```

Client sends multiple events:

```javascript
const stream = client.RecordClicks();
stream.write({ x: 100, y: 200, timestamp: Date.now() });
stream.write({ x: 150, y: 210, timestamp: Date.now() });
stream.write({ x: 200, y: 220, timestamp: Date.now() });
const summary = await stream.end();
```

### 4. Bidirectional Streaming

```proto
rpc Chat(stream Message) returns (stream Message);
```

Both sides send and receive continuously.

## Performance Comparison

| Metric             | REST (JSON) | gRPC (Protobuf) |
| ------------------ | ----------- | --------------- |
| Message size       | 100 bytes   | 20 bytes        |
| Serialization time | 50µs        | 5µs             |
| Deserialization    | 50µs        | 5µs             |
| HTTP version       | 1.1         | 2.0             |
| Multiplexing       | No          | Yes             |
| 1000 requests      | ~100ms      | ~10ms           |

gRPC is 10x faster for service-to-service communication.

## Real Use Cases

**Google uses gRPC internally:**

- YouTube services
- Google Maps
- Google Cloud Platform

**Why?**

- Millions of requests/second
- Low latency critical
- Services need to talk to each other efficiently
- Binary format is more efficient than JSON

**When to use gRPC:**

- Microservices talking to each other
- Performance is critical
- Streaming needed (real-time data)
- All services in your control
- Mobile backends (uses less bandwidth)

**When NOT to use gRPC:**

- Public APIs (harder for external developers)
- Need browser support (requires gRPC-web wrapper)
- Simple CRUD (REST is fine)
- Debugging important (hard to debug binary)
- Mixed with legacy systems

## gRPC vs REST vs GraphQL

| Aspect            | REST      | gRPC          | GraphQL       |
| ----------------- | --------- | ------------- | ------------- |
| Speed             | Medium    | Very fast     | Medium        |
| Efficiency        | OK        | Excellent     | Good          |
| Ease of use       | Easy      | Hard          | Medium        |
| Debugging         | Very easy | Hard          | Easy          |
| Browsers          | Native    | Needs wrapper | Native        |
| Public API        | Good      | Bad           | Good          |
| Internal services | OK        | Excellent     | OK            |
| Streaming         | No        | Yes           | Subscriptions |
| Learning curve    | Low       | High          | Medium        |

Choose based on your use case:

- **REST** - Public APIs, simplicity matters
- **gRPC** - Internal microservices, performance matters
- **GraphQL** - Complex data queries, client flexibility matters

## Modern Architecture

Typical modern system:

- **Browser/Mobile** → (REST or GraphQL) → **API Gateway**
- **API Gateway** → (gRPC) → **Microservice A**
- **API Gateway** → (gRPC) → **Microservice B**
- **Service A** ↔ (gRPC) ↔ **Service B**

gRPC handles the fast internal communication. REST/GraphQL handle the public interface.

---

**Previous:** [Week 11 - GraphQL](../week11_graphql/)  
**Next:** [Week 13 - Security](../week13_security/)
