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

const SERVER_URL = import.meta.env.VITE_SERVER_API_URL
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
    const response = await fetch(`${SERVER_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      authStore.set({
        user: data.user,
        isAuthenticated: true,
        isInitialized: true
      });
      if (shouldRedirect && window.location.href !== '#/map') {
        push('/map');
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
    const response = await fetch(`${SERVER_URL}/login`, {
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
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('data', data);
      push('/dashboard');
      return data;
    } else {
      return data
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
    await fetch(`${SERVER_URL}/logout`, {
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
// Registration function should accept formData object
export async function register(formData: FormData): Promise<User | null> {
  console.log('formData', formData);
  try {
    const response = await fetch(`${SERVER_URL}/register`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log('data', data);
    if (data.status === "success") {
      return data;
    } else {
      return null;
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
    push('/map');
  }
}


