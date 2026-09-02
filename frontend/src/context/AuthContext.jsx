import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nashwa_token') || null);
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('nashwa_token')));

  useEffect(() => {
    let isMounted = true;

    // 1. If Supabase client is configured, synchronize with Supabase Auth session
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!isMounted) return;
        if (session) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            email: session.user.email,
            role: 'customer'
          });
          setToken(session.access_token);
        }
        setIsLoading(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isMounted) return;
        if (session) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            email: session.user.email,
            role: 'customer'
          });
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
          if (isMounted) setUser(data.user);
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
    // If Supabase is configured directly on frontend
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      const userData = {
        id: data.user.id,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        email: data.user.email,
        role: 'customer'
      };
      setUser(userData);
      setToken(data.session.access_token);
      localStorage.setItem('nashwa_token', data.session.access_token);
      return data;
    }

    // Fallback: API backend login
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('nashwa_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    // If Supabase is configured directly on frontend
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) throw new Error(error.message);
      const userData = {
        id: data.user.id,
        name,
        email: data.user.email,
        role: 'customer'
      };
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
    setUser(data.user);
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
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, register, logout }}>
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
