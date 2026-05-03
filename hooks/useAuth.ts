"use client";

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for session in localStorage or make an API call
    const checkAuth = async () => {
      try {
        // First try to get session from localStorage as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setLoading(false);
          return;
        }

        // Try API call (this will fail if database isn't set up)
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const session = await response.json();
          if (session.user) {
            setUser(session.user);
            localStorage.setItem('user', JSON.stringify(session.user));
          }
        }
      } catch (error) {
        console.log('Auth check failed (expected if database not set up):', error);
        // Fallback to demo mode for UI testing
        const demoUser = {
          id: 'demo-user',
          email: 'demo@example.com',
          role: 'admin',
          name: 'Demo User'
        };
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.log('Logout API failed (expected if database not set up):', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return { user, loading, logout };
}
