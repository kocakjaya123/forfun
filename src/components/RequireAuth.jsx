import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, onAuthStateChange } from '../utils/supabaseClient';

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let sub;
    (async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
        if (!u) navigate('/auth');
      } catch (e) {
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    })();

    sub = onAuthStateChange((event, session) => {
      if (session?.user) setUser(session.user);
      else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/auth');
      }
    });

    return () => { try { sub?.unsubscribe?.(); } catch (e) {} };
  }, []);

  if (loading) return <div className="text-gray-400">Memeriksa autentikasi...</div>;
  if (!user) return null;
  return children;
}
