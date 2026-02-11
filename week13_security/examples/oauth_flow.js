/**
 * Week 13 Security: OAuth 2.0 Flow Examples
 *
 * OAuth 2.0 is an authorization (not authentication) framework.
 * It allows users to grant applications access to their data
 * without sharing passwords.
 *
 * Main Grant Types:
 * 1. Authorization Code: Most common, for web apps
 * 2. Implicit: For browser-based apps (less secure)
 * 3. Client Credentials: For server-to-server
 * 4. Resource Owner Password: Legacy, not recommended
 *
 * This example simulates OAuth 2.0 Authorization Code flow
 */

// ============================================================================
// Example 1: OAuth Authorization Code Flow (Server-Side)
// ============================================================================

/**
 * Step 1: User clicks "Login with Google/GitHub" button
 * The app redirects to OAuth provider with client_id, redirect_uri, scope, state
 */
const auth_code_flow_step1 = {
  description: "User initiates OAuth login",

  // In your app:
  loginButton: `
    <button onclick="initiateOAuth()">Login with GitHub</button>
  `,

  initiateOAuth: function () {
    const clientId = "your-client-id";
    const redirectUri = "http://localhost:3000/callback";
    const scope = "user:email,user:profile";
    const state = generateRandomState(); // For CSRF protection

    // Store state in session
    sessionStorage.setItem("oauth_state", state);

    // Redirect to OAuth provider
    const authUrl =
      `https://github.com/login/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scope}&` +
      `state=${state}`;

    window.location.href = authUrl;
  },
};

/**
 * Step 2: OAuth provider redirects back to your callback URL with authorization code
 * Your server receives the code and exchanges it for access token
 */
const auth_code_flow_step2 = {
  description: "Server exchanges authorization code for access token",

  callbackHandler: async function (req, res) {
    const code = req.query.code;
    const state = req.query.state;

    // Verify state matches (prevent CSRF)
    const storedState = req.session.oauth_state;
    if (state !== storedState) {
      return res.status(400).json({ error: "Invalid state parameter" });
    }

    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(code);

    // Use access token to get user info
    const userInfo = await getUserInfo(tokenResponse.access_token);

    // Create or update user in database
    const user = await User.findOrCreate({
      email: userInfo.email,
      profile: userInfo,
    });

    // Create session/JWT for user
    const sessionToken = createSessionToken(user.id);

    // Redirect to app with token
    res.redirect(`${process.env.APP_URL}/dashboard?token=${sessionToken}`);
  },

  async exchangeCodeForToken(code) {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      },
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(`OAuth error: ${data.error}`);
    }

    return {
      access_token: data.access_token,
      token_type: data.token_type,
      scope: data.scope,
    };
  },

  async getUserInfo(accessToken) {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get user info");
    }

    return response.json();
  },
};

/**
 * Step 3: Client uses access token to make authenticated requests
 */
const auth_code_flow_step3 = {
  description: "Client uses access token to access protected resources",

  protectedApiCall: async function (accessToken) {
    const response = await fetch("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const repos = await response.json();
    return repos;
  },
};

// ============================================================================
// Example 2: OAuth Server Implementation (Express.js Example)
// ============================================================================

const oauth_server_implementation = {
  setupEndpoints: function () {
    // Install: npm install express-session passport passport-github

    const express = require("express");
    const session = require("express-session");
    const passport = require("passport");
    const GitHubStrategy = require("passport-github").Strategy;

    const app = express();

    // Configure session
    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: true, // HTTPS only in production
          httpOnly: true,
          sameSite: "lax",
        },
      }),
    );

    // Configure Passport with GitHub strategy
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: "http://localhost:3000/auth/github/callback",
        },
        (accessToken, refreshToken, profile, done) => {
          // Find or create user
          User.findOrCreate(
            {
              githubId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
            },
            (err, user) => {
              return done(err, user);
            },
          );
        },
      ),
    );

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
        done(err, user);
      });
    });

    // Routes
    app.get(
      "/auth/github",
      passport.authenticate("github", { scope: ["user:email"] }),
    );

    app.get(
      "/auth/github/callback",
      passport.authenticate("github", { failureRedirect: "/login" }),
      (req, res) => {
        res.redirect("/dashboard");
      },
    );

    app.get("/logout", (req, res) => {
      req.logOut((err) => {
        if (err) return next(err);
        res.redirect("/");
      });
    });

    app.get("/protected", (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      res.json({ message: "Protected data", user: req.user });
    });

    return app;
  },
};

// ============================================================================
// Example 3: OAuth Client Implementation (Browser)
// ============================================================================

class OAuthClient {
  constructor(config) {
    this.clientId = config.clientId;
    this.redirectUri = config.redirectUri;
    this.authorizationUrl = config.authorizationUrl;
    this.tokenUrl = config.tokenUrl;
    this.scope = config.scope || "";
  }

  /**
   * Initiate OAuth flow
   */
  initiateLogin() {
    const state = this.generateState();
    sessionStorage.setItem("oauth_state", state);

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      state: state,
      response_type: "code",
    });

    window.location.href = `${this.authorizationUrl}?${params.toString()}`;
  }

  /**
   * Handle OAuth callback (extract code from URL)
   */
  handleCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    // Verify state
    const storedState = sessionStorage.getItem("oauth_state");
    if (state !== storedState) {
      throw new Error("Invalid state parameter - possible CSRF attack");
    }

    return code;
  }

  /**
   * Exchange authorization code for tokens (server-side call)
   */
  async exchangeCodeForToken(code) {
    const response = await fetch("/api/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const data = await response.json();

    // Store tokens
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    return data;
  }

  /**
   * Get stored access token
   */
  getAccessToken() {
    return localStorage.getItem("access_token");
  }

  /**
   * Make authenticated request
   */
  async authenticatedFetch(url, options = {}) {
    const accessToken = this.getAccessToken();

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If token expired, try refreshing
    if (response.status === 401) {
      await this.refreshAccessToken();
      return this.authenticatedFetch(url, options); // Retry
    }

    return response;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem("refresh_token");

    const response = await fetch("/api/oauth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();

    localStorage.setItem("access_token", data.access_token);
    return data;
  }

  /**
   * Logout and cleanup
   */
  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.removeItem("oauth_state");

    // Call server logout endpoint
    fetch("/api/logout", { method: "POST" });
  }

  /**
   * Generate random state for CSRF protection
   */
  generateState() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}

// ============================================================================
// Example 4: Usage Example
// ============================================================================

// Initialize client
const oauthClient = new OAuthClient({
  clientId: "your-client-id",
  redirectUri: "http://localhost:3000/callback",
  authorizationUrl: "https://github.com/login/oauth/authorize",
  tokenUrl: "https://github.com/login/oauth/access_token",
  scope: "user:email,user:profile",
});

// HTML
const htmlExample = `
  <div id="login-section">
    <button onclick="initiateGitHubLogin()">Login with GitHub</button>
    <button onclick="initiateGoogleLogin()">Login with Google</button>
  </div>
  
  <div id="app-section" style="display:none;">
    <h1>Welcome!</h1>
    <button onclick="logout()">Logout</button>
  </div>
`;

function initiateGitHubLogin() {
  oauthClient.initiateLogin();
}

async function handleOAuthCallback() {
  try {
    const code = oauthClient.handleCallback();
    const tokens = await oauthClient.exchangeCodeForToken(code);

    document.getElementById("login-section").style.display = "none";
    document.getElementById("app-section").style.display = "block";
  } catch (error) {
    console.error("OAuth login failed:", error);
  }
}

async function logout() {
  oauthClient.logout();

  document.getElementById("login-section").style.display = "block";
  document.getElementById("app-section").style.display = "none";
}

// ============================================================================
// Example 5: OAuth Token Refresh Pattern
// ============================================================================

class TokenManager {
  constructor() {
    this.accessToken = localStorage.getItem("access_token");
    this.refreshToken = localStorage.getItem("refresh_token");
    this.expiresAt = localStorage.getItem("token_expires_at");
  }

  /**
   * Check if token needs refresh (before expiration)
   */
  shouldRefresh() {
    if (!this.expiresAt) return false;

    const expiresAt = new Date(this.expiresAt);
    const now = new Date();
    const buffering = 5 * 60 * 1000; // Refresh 5 minutes before expiration

    return now.getTime() > expiresAt.getTime() - buffering;
  }

  /**
   * Store tokens with expiration
   */
  setTokens(accessToken, refreshToken, expiresIn) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    this.expiresAt = expiresAt.toISOString();

    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("token_expires_at", this.expiresAt);
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getValidAccessToken() {
    if (this.shouldRefresh()) {
      await this.refresh();
    }

    return this.accessToken;
  }

  /**
   * Refresh token
   */
  async refresh() {
    const response = await fetch("/api/token/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: this.refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    this.setTokens(data.access_token, data.refresh_token, data.expires_in);
  }

  /**
   * Clear tokens
   */
  clear() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires_at");
  }
}

// ============================================================================
// Example 6: Security Best Practices
// ============================================================================

const security_best_practices = {
  use_https: "Always use HTTPS in production to prevent token interception",

  validate_state: "Validate state parameter to prevent CSRF attacks",

  secure_storage: `
    // Use httpOnly cookies for tokens (prevent XSS access)
    // NOT localStorage (vulnerable to XSS)
    app.post('/api/oauth/token', (req, res) => {
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000  // 15 minutes
      });
    });
  `,

  token_rotation: "Use short-lived access tokens with refresh tokens",

  scope_minimization: "Request only necessary scopes: ",
  example: "scope: 'user:email' (not full access)",

  redirect_uri_validation:
    "Always validate redirect_uri matches registered value",

  client_id_protection:
    "Never expose client_secret in browser (keep on server)",

  pkce_flow: `
    // For mobile/SPA: Use PKCE (Proof Key for Code Exchange)
    // Especially important for public clients
  `,
};

// ============================================================================
// Example 7: Complete Fetch Wrapper with OAuth
// ============================================================================

class OAuthFetch {
  constructor(tokenManager) {
    this.tokenManager = tokenManager;
  }

  async fetch(url, options = {}) {
    // Get valid token (refreshing if needed)
    const token = await this.tokenManager.getValidAccessToken();

    // Add authorization header
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    // Make request
    let response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 - token might have been revoked/expired
    if (response.status === 401) {
      try {
        await this.tokenManager.refresh();
        const newToken = await this.tokenManager.getValidAccessToken();
        headers["Authorization"] = `Bearer ${newToken}`;
        response = await fetch(url, { ...options, headers });
      } catch (error) {
        console.error("Failed to refresh token:", error);
        // Redirect to login
        window.location.href = "/login";
        throw error;
      }
    }

    return response;
  }
}

// ============================================================================
// Export for use
// ============================================================================

module.exports = {
  OAuthClient,
  TokenManager,
  OAuthFetch,
  auth_code_flow_step1,
  auth_code_flow_step2,
  auth_code_flow_step3,
  oauth_server_implementation,
  security_best_practices,
};
