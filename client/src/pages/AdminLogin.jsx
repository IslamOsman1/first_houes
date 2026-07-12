import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ email: 'admin@firsthouse.com', password: 'Admin@123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await api.post('/api/auth/login', form);
      localStorage.setItem('firsthouse_token', data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'تعذر تسجيل الدخول');
    } finally { setLoading(false); }
  };
  return (
    <main className="admin-login-page">
      <div className="admin-login-brand"><img src="/logo.png" alt="فرست هاوس" /><h1>لوحة تحكم فرست هاوس</h1><p>إدارة الموقع والخدمات والمشروعات والرسائل</p></div>
      <form className="admin-login-card" onSubmit={submit}>
        <h2>تسجيل دخول المسؤول</h2>
        <label>البريد الإلكتروني<div className="input-icon"><Mail size={19} /><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div></label>
        <label>كلمة المرور<div className="input-icon"><LockKeyhole size={19} /><input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /><button type="button" onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
        {error && <div className="alert error">{error}</div>}
        <button className="btn btn-primary admin-login-btn" disabled={loading}>{loading ? 'جاري الدخول...' : 'دخول لوحة التحكم'}</button>
        <small>بيانات تجريبية: admin@firsthouse.com / Admin@123</small>
      </form>
    </main>
  );
}
