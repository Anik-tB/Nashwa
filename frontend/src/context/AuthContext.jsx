import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nashwa_token') || null);
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('nashwa_token')));

  // Security brute-force protection
  const [failedAttempts, setFailedAttempts] = useState(() => {
    return Number(sessionStorage.getItem('nashwa_failed_attempts') || 0);
  });
  const [lockoutTime, setLockoutTime] = useState(() => {
    return Number(sessionStorage.getItem('nashwa_lockout_until') || 0);
  });

  const recordFailedAttempt = () => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    sessionStorage.setItem('nashwa_failed_attempts', String(nextAttempts));

    if (nextAttempts >= 5) {
      const lockUntil = Date.now() + 30000; // 30s lock
      setLockoutTime(lockUntil);
      sessionStorage.setItem('nashwa_lockout_until', String(lockUntil));
    }
  };

  const resetFailedAttempts = () => {
    setFailedAttempts(0);
    setLockoutTime(0);
    sessionStorage.removeItem('nashwa_failed_attempts');
    sessionStorage.removeItem('nashwa_lockout_until');
  };

  // Helper to construct enriched user object
  const formatUser = (rawUser, provider = 'email') => {
    if (!rawUser) return null;
    return {
      id: rawUser.id,
      name: rawUser.user_metadata?.full_name || rawUser.user_metadata?.name || rawUser.name || rawUser.email?.split('@')[0],
      email: rawUser.email,
      role: rawUser.role || 'customer',
      avatar: rawUser.user_metadata?.avatar_url || null,
      provider: rawUser.app_metadata?.provider || provider,
      guildTier: 'Artisan Fellow',
      patronPoints: 340,
      joinedAt: rawUser.created_at || new Date().toISOString()
    };
  };

  useEffect(() => {
    let isMounted = true;

    // 1. If Supabase client is configured, synchronize with Supabase Auth session
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!isMounted) return;
        if (session) {
          setUser(formatUser(session.user, session.user.app_metadata?.provider || 'supabase'));
          setToken(session.access_token);
        }
        setIsLoading(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isMounted) return;
        if (session) {
          setUser(formatUser(session.user, session.user.app_metadata?.provider || 'supabase'));
          setToken(session.access_token);
          localStorage.setItem('nashwa_token', session.access_token);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('nashwa_token');
        }
        setIsLoading(false);
      });

      return () => {
        isMounted = false;
        authListener?.subscription?.unsubscribe();
      };
    }

    // 2. Fallback: synchronize with API /api/auth/me using token
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Token expired or invalid');
        })
        .then((data) => {
          if (isMounted) setUser(formatUser(data.user, 'local'));
        })
        .catch(() => {
          localStorage.removeItem('nashwa_token');
          if (isMounted) {
            setToken(null);
            setUser(null);
          }
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    if (lockoutTime && Date.now() < lockoutTime) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
      throw new Error(`Security lock active. Too many failed attempts. Try again in ${remaining}s.`);
    }

    // If Supabase is configured directly on frontend
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        recordFailedAttempt();
        throw new Error(error.message);
      }
      resetFailedAttempts();
      const userData = formatUser(data.user, 'supabase');
      setUser(userData);
      setToken(data.session.access_token);
      localStorage.setItem('nashwa_token', data.session.access_token);
      return data;
    }

    // Fallback: API backend login
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        recordFailedAttempt();
        throw new Error(data.error || 'Login failed');
      }

      resetFailedAttempts();
      localStorage.setItem('nashwa_token', data.token);
      setToken(data.token);
      setUser(formatUser(data.user, 'local'));
      return data;
    } catch (err) {
      recordFailedAttempt();
      throw err;
    }
  };

  // One-click Google Login via Supabase OAuth
  const loginWithGoogle = async () => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw new Error(error.message);
      return data;
    } else {
      // Simulate or mock Google Auth for preview demo if credentials not yet connected
      const mockGoogleUser = {
        id: 'google-oauth-demo-' + Date.now(),
        name: 'Artisan Collector (Google)',
        email: 'collector@gmail.com',
        role: 'customer',
        app_metadata: { provider: 'google' }
      };
      const formatted = formatUser(mockGoogleUser, 'google');
      setUser(formatted);
      setToken('mock-google-token');
      localStorage.setItem('nashwa_token', 'mock-google-token');
      return { user: formatted };
    }
  };

  // Passwordless Magic Link Login via Supabase Auth
  const loginWithMagicLink = async (email) => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw new Error(error.message);
      return data;
    } else {
      // Mock magic link sent
      return { message: `Magic link dispatched to ${email}. (Simulated)` };
    }
  };

  const register = async (name, email, password) => {
    // If Supabase is configured directly on frontend
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, full_name: name }
        }
      });
      if (error) throw new Error(error.message);

      const userData = formatUser(data.user, 'supabase');
      setUser(userData);
      if (data.session) {
        setToken(data.session.access_token);
        localStorage.setItem('nashwa_token', data.session.access_token);
      }
      return data;
    }

    // Fallback: API backend register
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    localStorage.setItem('nashwa_token', data.token);
    setToken(data.token);
    setUser(formatUser(data.user, 'local'));
    return data;
  };

  const logout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('nashwa_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        loginWithMagicLink,
        register,
        logout,
        failedAttempts,
        lockoutTime
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
