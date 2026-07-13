import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [data, setData] = useState({ settings: {}, services: [], projects: [], team: [], banners: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = async () => {
    try {
      setError('');
      const response = await api.get('/api/public');
      setData(response.data);
    } catch {
      setError('تعذر تحميل بيانات الموقع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const value = useMemo(() => ({ ...data, loading, error, refresh }), [data, loading, error]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
