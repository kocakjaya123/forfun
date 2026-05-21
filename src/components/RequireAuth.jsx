import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const { user, checking } = useAuth();

  useEffect(() => {
    if (!checking && !user) navigate('/auth');
  }, [checking, user]);

  if (checking) return <div className="text-gray-400">Memeriksa autentikasi...</div>;
  if (!user) return null;
  return children;
}
