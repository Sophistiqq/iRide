// auth.ts
import { push } from "svelte-spa-router";
import { writable } from "svelte/store";

type User = {
  id: string;
  email: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
};

const serverUrl = "https://elysiajs-hello-world-thhc.onrender.com";
const tokenKey = "secret";

// Single auth store
export const authStore = writable<AuthState>({
  user: null,
  isAuthenticated: false,
  isInitialized: false
});

// Enhanced token management
const TokenManager = {
  set(token: string) {
    localStorage.setItem(tokenKey, token);
  },
  get(): string | null {
    return localStorage.getItem(tokenKey);
  },
  remove() {
    localStorage.removeItem(tokenKey);
  }
};

// Update checkAuth to handle session invalidation
export async function checkAuth(shouldRedirect = true): Promise<boolean> {
  const token = TokenManager.get();

  if (!token) {
    authStore.set({
      user: null,
      isAuthenticated: false,
      isInitialized: true
    });
    if (shouldRedirect) {
      push('/');
    }
    return false;
  }

  try {
    const response = await fetch(`${serverUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      authStore.set({
        user: data.user,
        isAuthenticated: true,
        isInitialized: true
      });
      if (shouldRedirect && window.location.href !== '#/home') {
        push('/home');
      }
      return true;
    } else {
      const data = await response.json();
      // Handle session expired/invalid specifically
      if (data.error === "Session expired or invalid") {
        TokenManager.remove();
        authStore.set({
          user: null,
          isAuthenticated: false,
          isInitialized: true
        });
        // Maybe show a message to the user that they were logged out
      }
      throw new Error('Invalid token');
    }
  } catch (error) {
    TokenManager.remove();
    authStore.set({
      user: null,
      isAuthenticated: false,
      isInitialized: true
    });
    if (shouldRedirect) {
      push('/');
    }
    return false;
  }
}

// Add new error handling in login function
export async function login(username: string, password: string): Promise<User | null> {
  try {
    const response = await fetch(`${serverUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.status === "success") {
      TokenManager.set(data.token);
      authStore.set({
        user: data.user,
        isAuthenticated: true,
        isInitialized: true
      });
      push('/home');
      return data;
    } else {
      // Handle specific error for multiple logins
      if (data.error === "Already logged in on another device") {
        // You might want to show this in your UI
        throw new Error("You are already logged in on another device");
      }
      throw new Error(data.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    // You might want to show this error in your UI
    return null;
  }
}

// Update logout function
export async function logout(): Promise<void> {
  try {
    await fetch(`${serverUrl}/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${TokenManager.get()}` },
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    TokenManager.remove();
    authStore.set({
      user: null,
      isAuthenticated: false,
      isInitialized: true
    });
    push('/');
  }
}
// Registration function should have username, fullname, password, email, mobile_number
export async function register(username: string, password: string, fullname: string, mobile_number: string, email: string): Promise<User | null> {
  try {
    const response = await fetch(`${serverUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, fullname, mobile_number, email }),
    });

    const data = await response.json();

    if (data.status === "success") {
      TokenManager.set(data.token);
      authStore.set({
        user: data.user,
        isAuthenticated: true,
        isInitialized: true
      });
      push('/home');
      return data.user;
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
}

// Navigation guard helper
export function requireAuth(onFailure: () => void = () => window.location.href = '/#/login'): void {
  if (!TokenManager.get()) {
    onFailure();
  }
}
// Add route guards
export function guardAuthenticatedRoute(path: string): void {
  const token = localStorage.getItem('auth_token');
  if (!token && path !== '/login' && path !== '/register') {
    push('/login');
  }
}

export function guardPublicRoute(path: string): void {
  const token = localStorage.getItem('auth_token');
  if (token && (path === '/login' || path === '/register' || path === '/')) {
    push('/home');
  }
}


