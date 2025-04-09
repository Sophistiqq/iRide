// auth.ts (frontend)
import { push } from "svelte-spa-router";
import { writable } from "svelte/store";

type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  account_type: string;
  subscription?: {
    type: string;
    status: string;
    start_date: string;
    expires_at: string;
    device_allowed: number;
  };
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
};

const SERVER_URL = import.meta.env.VITE_SERVER_API_URL;
const tokenKey = "auth_token";

// Single auth store
export const authStore = writable<AuthState>({
  user: null,
  isAuthenticated: false,
  isInitialized: false
});

// Token management
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

export async function checkAuth(shouldRedirect = true): Promise<boolean> {
  const token = TokenManager.get();
  const storedUser = localStorage.getItem('user');
  const currentRoute = window.location.hash.replace(/^#/, '');

  if (!token || !storedUser) {
    authStore.set({
      user: null,
      isAuthenticated: false,
      isInitialized: true
    });

    const publicRoutes = ['/', '/register'];

    if (shouldRedirect && !publicRoutes.includes(currentRoute)) {
      push('/');
    }

    return false;
  }

  try {
    const user = JSON.parse(storedUser);
    authStore.set({
      user,
      isAuthenticated: true,
      isInitialized: true
    });

    if (shouldRedirect && currentRoute === '/') {
      push('/dashboard');
    }

    return true;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    TokenManager.remove();
    localStorage.removeItem('user');
    authStore.set({
      user: null,
      isAuthenticated: false,
      isInitialized: true
    });

    if (shouldRedirect && !['/', '/register'].includes(currentRoute)) {
      push('/');
    }

    return false;
  }
}

// Login function
export async function login(username: string, password: string): Promise<any> {
  try {
    const response = await fetch(`${SERVER_URL}/auth/login`, {
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
      push('/dashboard');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      status: "error",
      message: "Network error, please check your connection"
    };
  }
}

// Updated logout function to use new API endpoint
export async function logout(): Promise<void> {
  try {
    const token = TokenManager.get();
    if (token) {
      await fetch(`${SERVER_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    TokenManager.remove();
    localStorage.removeItem('user');
    authStore.set({
      user: null,
      isAuthenticated: false,
      isInitialized: true
    });
    push('/');
  }
}

// Registration function
export async function register(formData: any): Promise<any> {
  try {
    const response = await fetch(`${SERVER_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    // Return the full response so the component can handle success/error
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    return {
      status: "error",
      message: "Network error, please check your connection"
    };
  }
}
