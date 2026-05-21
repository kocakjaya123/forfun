import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCurrentUser, onAuthStateChange, signIn as supabaseSignIn, signOut as supabaseSignOut } from '../utils/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let sub;
    (async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch (e) {
        setUser(null);
      } finally {
        setChecking(false);
      }
    })();

    sub = onAuthStateChange((event, session) => {
      if (session?.user) setUser(session.user);
      else if (event === 'SIGNED_OUT') setUser(null);
    });

    return () => { try { sub?.unsubscribe?.(); } catch (e) {} };
  }, []);

  const signin = async ({ email, password }) => {
    // Temporary hardcoded demo login
    if (email === 'kocakjaya123' && password === 'ursafirst123') {
      const demoUser = { id: 'local-' + Date.now(), email: 'kocakjaya123', isDemo: true };
      try { localStorage.setItem('isLoggedIn', 'true'); } catch (e) {}
      try { localStorage.setItem('user', JSON.stringify({ email: 'kocakjaya123' })); } catch (e) {}
      try { localStorage.setItem('ff_user', JSON.stringify(demoUser)); } catch (e) {}
      try { window.dispatchEvent(new CustomEvent('ff:auth', { detail: { event: 'SIGNED_IN', session: { user: demoUser } } })); } catch (e) {}
      setUser(demoUser);
      return demoUser;
    }

    // Use Supabase auth (will throw on error)
    const res = await supabaseSignIn({ email, password });
    // After successful sign in, fetch current user and update state
    const u = await getCurrentUser();
    if (u) {
      try { localStorage.setItem('isLoggedIn', 'true'); } catch (e) {}
      try { localStorage.setItem('user', JSON.stringify({ email: u.email || email })); } catch (e) {}
      setUser(u);
    }
    return u;
  };

  const signout = async () => {
    try { await supabaseSignOut(); } catch (e) {}
    try { localStorage.removeItem('isLoggedIn'); } catch (e) {}
    try { localStorage.removeItem('user'); } catch (e) {}
    try { localStorage.removeItem('ff_user'); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('ff:auth', { detail: { event: 'SIGNED_OUT', session: null } })); } catch (e) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, checking, signin, signout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
