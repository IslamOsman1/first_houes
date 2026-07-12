import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import PageHero from '../components/PageHero';
import { useSite } from '../context/SiteContext';
import { api } from '../utils/api';

export default function Contact() {
  const { settings } = useSite();
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);
  const submit = async e => {
    e.preventDefault(); setSending(true); setStatus({ type: '', text: '' });
    try { const { data } = await api.post('/api/contact', form); setStatus({ type: 'success', text: data.message }); setForm({ name: '', phone: '', email: '', subject: '', message: '' }); }
    catch (error) { setStatus({ type: 'error', text: error.response?.data?.message || 'تعذر إرسال الرسالة' }); }
    finally { setSending(false); }
  };
  return (
    <main>
      <PageHero title="تواصل معنا" text="أرسل تفاصيل مشروعك وسيتواصل معك فريقنا لمناقشة الخطوات القادمة." />
      <section className="section"><div className="container contact-grid"><div className="contact-info"><span className="section-kicker">بيانات التواصل</span><h2>يسعدنا سماع تفاصيل مشروعك</h2><p>يمكنك التواصل معنا هاتفيًا أو عبر واتساب أو إرسال رسالة من النموذج.</p><div className="contact-item"><div><Phone /></div><span><small>الهاتف</small><strong>{settings.phone}</strong></span></div><div className="contact-item"><div><Mail /></div><span><small>البريد الإلكتروني</small><strong>{settings.email}</strong></span></div><div className="contact-item"><div><MapPin /></div><span><small>العنوان</small><strong>{settings.address}</strong></span></div><div className="contact-item"><div><Clock3 /></div><span><small>مواعيد العمل</small><strong>السبت - الخميس، 9 ص - 6 م</strong></span></div><a className="whatsapp-btn" target="_blank" rel="noreferrer" href={`https://wa.me/${settings.whatsapp}`}><MessageCircle /> تواصل عبر واتساب</a></div><form className="contact-form" onSubmit={submit}><h3>اطلب عرض سعر</h3><div className="form-row"><label>الاسم الكامل<input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></label><label>رقم الهاتف<input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required /></label></div><div className="form-row"><label>البريد الإلكتروني<input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></label><label>نوع المشروع<input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="مثال: تشطيب فيلا" /></label></div><label>تفاصيل المشروع<textarea rows="6" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required /></label>{status.text && <div className={`alert ${status.type}`}>{status.text}</div>}<button className="btn btn-primary" disabled={sending}>{sending ? 'جاري الإرسال...' : 'إرسال الطلب'}</button></form></div></section>
    </main>
  );
}
