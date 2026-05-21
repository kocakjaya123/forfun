import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getCurrentUser } from '../utils/supabaseClient';

export default function FabAdd() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await getCurrentUser();
        if (mounted && u) setShow(true);
      } catch (e) {
        setShow(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (!show) return null;

  return (
    <Link to="/add" className="fixed z-50 bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-soft bg-brand-emerald text-black hover:scale-105 transition-transform">
      <Plus size={20} />
    </Link>
  );
}
