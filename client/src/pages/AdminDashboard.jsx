import { BarChart3, Building2, Check, Edit3, Eye, ImagePlus, Images, Inbox, LogOut, Menu, Plus, Save, Settings, Trash2, Wrench, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, mediaUrl } from '../utils/api';

const emptyService = { title: '', description: '', icon: 'Building2' };
const emptyProject = { title: '', category: '', location: '', description: '', image: '/project-villa.svg', featured: true };
const emptyBanner = { title: '', link: '', image: '', active: true };

const settingsFields = [
  ['companyName', 'اسم الشركة'],
  ['tagline', 'الشعار المختصر'],
  ['heroTitle', 'عنوان الواجهة الرئيسية'],
  ['heroText', 'وصف الواجهة الرئيسية'],
  ['phone', 'رقم الهاتف'],
  ['whatsapp', 'رقم واتساب بدون +'],
  ['email', 'البريد الإلكتروني'],
  ['address', 'العنوان'],
  ['facebook', 'رابط فيسبوك'],
  ['instagram', 'رابط إنستجرام'],
  ['yearsExperience', 'سنوات الخبرة'],
  ['completedProjects', 'المشروعات المكتملة'],
  ['happyClients', 'العملاء'],
  ['engineers', 'المهندسون والفنيون']
];

const fullWidthSettingsFields = ['heroText', 'address'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [openMenu, setOpenMenu] = useState(false);
  const [data, setData] = useState({ settings: {}, services: [], projects: [], messages: [], banners: [] });
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [serviceEditId, setServiceEditId] = useState(null);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [projectEditId, setProjectEditId] = useState(null);
  const [bannerForm, setBannerForm] = useState(emptyBanner);
  const [bannerEditId, setBannerEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  const loadData = async () => {
    try {
      const response = await api.get('/api/admin/data');
      setData({
        ...response.data,
        banners: response.data.banners || []
      });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('firsthouse_token');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotice = text => {
    setNotice(text);
    setTimeout(() => setNotice(''), 2500);
  };

  const logout = () => {
    localStorage.removeItem('firsthouse_token');
    navigate('/admin/login');
  };

  const changeTab = value => {
    setTab(value);
    setOpenMenu(false);
  };

  const updateSettingField = (key, value) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  };

  const saveSettings = async e => {
    e.preventDefault();
    const response = await api.put('/api/admin/settings', data.settings);
    setData(prev => ({ ...prev, settings: response.data }));
    showNotice('تم حفظ إعدادات الموقع');
  };

  const submitService = async e => {
    e.preventDefault();
    const response = serviceEditId
      ? await api.put(`/api/admin/services/${serviceEditId}`, serviceForm)
      : await api.post('/api/admin/services', serviceForm);

    setData(prev => ({ ...prev, services: response.data }));
    setServiceForm(emptyService);
    setServiceEditId(null);
    showNotice(serviceEditId ? 'تم تعديل الخدمة' : 'تمت إضافة الخدمة');
  };

  const editService = item => {
    setServiceForm(item);
    setServiceEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteService = async id => {
    if (!confirm('هل تريد حذف هذه الخدمة؟')) return;
    const response = await api.delete(`/api/admin/services/${id}`);
    setData(prev => ({ ...prev, services: response.data }));
    showNotice('تم حذف الخدمة');
  };

  const submitProject = async e => {
    e.preventDefault();
    const response = projectEditId
      ? await api.put(`/api/admin/projects/${projectEditId}`, projectForm)
      : await api.post('/api/admin/projects', projectForm);

    setData(prev => ({ ...prev, projects: response.data }));
    setProjectForm(emptyProject);
    setProjectEditId(null);
    showNotice(projectEditId ? 'تم تعديل المشروع' : 'تمت إضافة المشروع');
  };

  const editProject = item => {
    setProjectForm(item);
    setProjectEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProject = async id => {
    if (!confirm('هل تريد حذف هذا المشروع؟')) return;
    const response = await api.delete(`/api/admin/projects/${id}`);
    setData(prev => ({ ...prev, projects: response.data }));
    showNotice('تم حذف المشروع');
  };

  const uploadImage = async e => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append('image', file);
      const response = await api.post('/api/admin/upload', body);
      setProjectForm(prev => ({ ...prev, image: response.data.url }));
      showNotice('تم رفع الصورة');
    } catch (error) {
      showNotice(error.response?.data?.message || 'تعذر رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const uploadBannerImage = async e => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBannerUploading(true);
    try {
      const body = new FormData();
      body.append('image', file);
      const response = await api.post('/api/admin/upload', body);
      setBannerForm(prev => ({ ...prev, image: response.data.url }));
      showNotice('تم رفع صورة البنر');
    } catch (error) {
      showNotice(error.response?.data?.message || 'تعذر رفع صورة البنر');
    } finally {
      setBannerUploading(false);
    }
  };

  const submitBanner = async e => {
    e.preventDefault();
    const response = bannerEditId
      ? await api.put(`/api/admin/banners/${bannerEditId}`, bannerForm)
      : await api.post('/api/admin/banners', bannerForm);

    setData(prev => ({ ...prev, banners: response.data }));
    setBannerForm(emptyBanner);
    setBannerEditId(null);
    showNotice(bannerEditId ? 'تم تعديل البنر' : 'تمت إضافة البنر');
  };

  const editBanner = item => {
    setBannerForm(item);
    setBannerEditId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteBanner = async id => {
    if (!confirm('هل تريد حذف هذا البنر؟')) return;
    const response = await api.delete(`/api/admin/banners/${id}`);
    setData(prev => ({ ...prev, banners: response.data }));
    showNotice('تم حذف البنر');
  };

  const readMessage = async id => {
    const response = await api.put(`/api/admin/messages/${id}/read`);
    setData(prev => ({ ...prev, messages: response.data }));
  };

  const deleteMessage = async id => {
    if (!confirm('هل تريد حذف الرسالة؟')) return;
    const response = await api.delete(`/api/admin/messages/${id}`);
    setData(prev => ({ ...prev, messages: response.data }));
  };

  const unread = useMemo(() => data.messages.filter(message => !message.read).length, [data.messages]);
  const activeBannersCount = useMemo(() => (data.banners || []).filter(banner => banner.active).length, [data.banners]);

  if (loading) return <div className="admin-loading">جاري تحميل لوحة التحكم...</div>;

  const nav = [
    ['overview', 'نظرة عامة', BarChart3],
    ['settings', 'إعدادات الموقع', Settings],
    ['banners', 'البنرات', Images],
    ['services', 'الخدمات', Wrench],
    ['projects', 'المشروعات', Building2],
    ['messages', 'الرسائل', Inbox]
  ];

  return (
    <main className="admin-shell">
      <aside className={openMenu ? 'admin-sidebar open' : 'admin-sidebar'}>
        <div className="admin-brand">
          <img src="/logo.png" alt="فرست هاوس" />
          <div>
            <strong>فرست هاوس</strong>
            <span>لوحة التحكم</span>
          </div>
          <button onClick={() => setOpenMenu(false)}>
            <X />
          </button>
        </div>

        <nav>
          {nav.map(([id, label, Icon]) => (
            <button className={tab === id ? 'active' : ''} key={id} onClick={() => changeTab(id)}>
              <Icon size={20} />
              {label}
              {id === 'messages' && unread > 0 && <b>{unread}</b>}
            </button>
          ))}
        </nav>

        <button className="admin-site-link" onClick={() => window.open('/', '_blank')}>
          <Eye size={19} />
          عرض الموقع
        </button>
        <button className="admin-logout" onClick={logout}>
          <LogOut size={19} />
          تسجيل الخروج
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-button" onClick={() => setOpenMenu(true)}>
            <Menu />
          </button>
          <div>
            <small>مرحبًا بك</small>
            <h1>{nav.find(item => item[0] === tab)?.[1]}</h1>
          </div>
          <img src="/logo.png" alt="فرست هاوس" />
        </header>

        {notice && (
          <div className="admin-notice">
            <Check /> {notice}
          </div>
        )}

        {tab === 'overview' && (
          <section className="admin-content">
            <div className="dashboard-cards">
              <article>
                <div>
                  <span>الخدمات</span>
                  <strong>{data.services.length}</strong>
                </div>
                <Wrench />
              </article>
              <article>
                <div>
                  <span>المشروعات</span>
                  <strong>{data.projects.length}</strong>
                </div>
                <Building2 />
              </article>
              <article>
                <div>
                  <span>البنرات النشطة</span>
                  <strong>{activeBannersCount}</strong>
                </div>
                <Images />
              </article>
              <article>
                <div>
                  <span>الرسائل الجديدة</span>
                  <strong>{unread}</strong>
                </div>
                <Inbox />
              </article>
            </div>

            <div className="admin-panel">
              <div className="panel-title">
                <div>
                  <h2>أحدث الرسائل</h2>
                  <p>آخر طلبات العملاء الواردة من الموقع</p>
                </div>
                <button onClick={() => setTab('messages')}>عرض الكل</button>
              </div>

              {data.messages.slice(0, 5).map(message => (
                <div className="mini-message" key={message.id}>
                  <div className={message.read ? 'message-dot read' : 'message-dot'} />
                  <div>
                    <strong>{message.name}</strong>
                    <span>{message.subject || 'طلب تواصل'} - {message.phone}</span>
                  </div>
                  <small>{new Date(message.createdAt).toLocaleDateString('ar-EG')}</small>
                </div>
              ))}

              {data.messages.length === 0 && <div className="empty-state">لا توجد رسائل حتى الآن.</div>}
            </div>
          </section>
        )}

        {tab === 'settings' && (
          <section className="admin-content">
            <form className="admin-panel admin-form" onSubmit={saveSettings}>
              <div className="panel-title">
                <div>
                  <h2>بيانات الشركة والموقع</h2>
                  <p>تظهر هذه البيانات في صفحات الموقع الرئيسية.</p>
                </div>
                <button className="btn btn-primary">
                  <Save size={18} /> حفظ التعديلات
                </button>
              </div>

              <div className="admin-form-grid">
                {settingsFields.map(([key, label]) => (
                  <label className={fullWidthSettingsFields.includes(key) ? 'full' : ''} key={key}>
                    {label}
                    {key === 'heroText' ? (
                      <textarea
                        rows="4"
                        value={data.settings[key] || ''}
                        onChange={e => updateSettingField(key, e.target.value)}
                      />
                    ) : (
                      <input
                        value={data.settings[key] || ''}
                        onChange={e => updateSettingField(key, e.target.value)}
                      />
                    )}
                  </label>
                ))}
              </div>
            </form>
          </section>
        )}

        {tab === 'banners' && (
          <section className="admin-content two-column-admin">
            <form className="admin-panel admin-form sticky-form" onSubmit={submitBanner}>
              <div className="panel-title">
                <div>
                  <h2>{bannerEditId ? 'تعديل البنر' : 'إضافة بنر'}</h2>
                  <p>أضف صور البنرات التي تظهر أعلى الصفحة الرئيسية وتتغير تلقائيًا.</p>
                </div>
              </div>

              <label>
                عنوان البنر
                <input
                  value={bannerForm.title}
                  onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                />
              </label>

              <label>
                رابط البنر
                <input
                  value={bannerForm.link}
                  onChange={e => setBannerForm({ ...bannerForm, link: e.target.value })}
                  placeholder="/contact"
                />
              </label>

              <label className="upload-box">
                <ImagePlus />
                <span>{bannerUploading ? 'جاري رفع صورة البنر...' : 'رفع صورة البنر'}</span>
                <input type="file" accept="image/*" onChange={uploadBannerImage} disabled={bannerUploading} />
              </label>

              {bannerForm.image && <img className="image-preview" src={mediaUrl(bannerForm.image)} alt="معاينة البنر" />}

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(bannerForm.active)}
                  onChange={e => setBannerForm({ ...bannerForm, active: e.target.checked })}
                />
                بنر نشط
              </label>

              <div className="form-actions">
                <button className="btn btn-primary" disabled={!bannerForm.image}>
                  <Plus size={18} /> {bannerEditId ? 'حفظ التعديل' : 'إضافة البنر'}
                </button>
                {bannerEditId && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setBannerForm(emptyBanner);
                      setBannerEditId(null);
                    }}
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>

            <div className="admin-panel">
              <div className="panel-title">
                <div>
                  <h2>البنرات الحالية</h2>
                  <p>{data.banners.length} بنرات مضافة</p>
                </div>
              </div>

              <div className="admin-project-list">
                {data.banners.map(item => (
                  <article key={item.id}>
                    <img src={mediaUrl(item.image)} alt={item.title || 'بنر'} />
                    <div>
                      <span>{item.active ? 'نشط' : 'مخفي'}</span>
                      <h3>{item.title || 'بنر بدون عنوان'}</h3>
                      <p>{item.link || 'بدون رابط'}</p>
                    </div>
                    <div className="list-actions">
                      <button onClick={() => editBanner(item)}>
                        <Edit3 />
                      </button>
                      <button className="danger" onClick={() => deleteBanner(item.id)}>
                        <Trash2 />
                      </button>
                    </div>
                  </article>
                ))}
                {data.banners.length === 0 && <div className="empty-state">لا توجد بنرات مضافة حتى الآن.</div>}
              </div>
            </div>
          </section>
        )}

        {tab === 'services' && (
          <section className="admin-content two-column-admin">
            <form className="admin-panel admin-form sticky-form" onSubmit={submitService}>
              <div className="panel-title">
                <div>
                  <h2>{serviceEditId ? 'تعديل الخدمة' : 'إضافة خدمة'}</h2>
                  <p>أضف خدمة جديدة إلى الموقع.</p>
                </div>
              </div>

              <label>
                اسم الخدمة
                <input
                  value={serviceForm.title}
                  onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })}
                  required
                />
              </label>

              <label>
                أيقونة الخدمة
                <select value={serviceForm.icon} onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })}>
                  <option>Building2</option>
                  <option>Paintbrush</option>
                  <option>ClipboardCheck</option>
                  <option>Wrench</option>
                  <option>HardHat</option>
                  <option>Hammer</option>
                  <option>House</option>
                </select>
              </label>

              <label>
                الوصف
                <textarea
                  rows="5"
                  value={serviceForm.description}
                  onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                  required
                />
              </label>

              <div className="form-actions">
                <button className="btn btn-primary">
                  <Plus size={18} /> {serviceEditId ? 'حفظ التعديل' : 'إضافة الخدمة'}
                </button>
                {serviceEditId && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setServiceForm(emptyService);
                      setServiceEditId(null);
                    }}
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>

            <div className="admin-panel">
              <div className="panel-title">
                <div>
                  <h2>الخدمات الحالية</h2>
                  <p>{data.services.length} خدمات منشورة</p>
                </div>
              </div>

              <div className="admin-list">
                {data.services.map(item => (
                  <article key={item.id}>
                    <div className="list-icon">
                      <Wrench />
                    </div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div className="list-actions">
                      <button onClick={() => editService(item)}>
                        <Edit3 />
                      </button>
                      <button className="danger" onClick={() => deleteService(item.id)}>
                        <Trash2 />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {tab === 'projects' && (
          <section className="admin-content two-column-admin">
            <form className="admin-panel admin-form sticky-form" onSubmit={submitProject}>
              <div className="panel-title">
                <div>
                  <h2>{projectEditId ? 'تعديل المشروع' : 'إضافة مشروع'}</h2>
                  <p>أضف مشروعًا إلى معرض الأعمال.</p>
                </div>
              </div>

              <label>
                اسم المشروع
                <input
                  value={projectForm.title}
                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                  required
                />
              </label>

              <div className="form-row">
                <label>
                  التصنيف
                  <input
                    value={projectForm.category}
                    onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                    required
                  />
                </label>
                <label>
                  الموقع
                  <input
                    value={projectForm.location}
                    onChange={e => setProjectForm({ ...projectForm, location: e.target.value })}
                    required
                  />
                </label>
              </div>

              <label>
                الوصف
                <textarea
                  rows="4"
                  value={projectForm.description}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  required
                />
              </label>

              <label className="upload-box">
                <ImagePlus />
                <span>{uploading ? 'جاري رفع الصورة...' : 'رفع صورة للمشروع'}</span>
                <input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} />
              </label>

              {projectForm.image && <img className="image-preview" src={mediaUrl(projectForm.image)} alt="معاينة" />}

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={Boolean(projectForm.featured)}
                  onChange={e => setProjectForm({ ...projectForm, featured: e.target.checked })}
                />
                مشروع مميز
              </label>

              <div className="form-actions">
                <button className="btn btn-primary">
                  <Plus size={18} /> {projectEditId ? 'حفظ التعديل' : 'إضافة المشروع'}
                </button>
                {projectEditId && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      setProjectForm(emptyProject);
                      setProjectEditId(null);
                    }}
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>

            <div className="admin-panel">
              <div className="panel-title">
                <div>
                  <h2>المشروعات الحالية</h2>
                  <p>{data.projects.length} مشروعات منشورة</p>
                </div>
              </div>

              <div className="admin-project-list">
                {data.projects.map(item => (
                  <article key={item.id}>
                    <img src={mediaUrl(item.image)} alt={item.title} />
                    <div>
                      <span>{item.category}</span>
                      <h3>{item.title}</h3>
                      <p>{item.location}</p>
                    </div>
                    <div className="list-actions">
                      <button onClick={() => editProject(item)}>
                        <Edit3 />
                      </button>
                      <button className="danger" onClick={() => deleteProject(item.id)}>
                        <Trash2 />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {tab === 'messages' && (
          <section className="admin-content">
            <div className="admin-panel">
              <div className="panel-title">
                <div>
                  <h2>رسائل العملاء</h2>
                  <p>طلبات التواصل وعروض الأسعار الواردة من الموقع.</p>
                </div>
              </div>

              <div className="messages-list">
                {data.messages.map(message => (
                  <article
                    className={message.read ? 'read' : ''}
                    key={message.id}
                    onClick={() => !message.read && readMessage(message.id)}
                  >
                    <div className="message-head">
                      <div>
                        <strong>{message.name}</strong>
                        <span>{message.subject || 'طلب تواصل'}</span>
                      </div>
                      <small>{new Date(message.createdAt).toLocaleString('ar-EG')}</small>
                    </div>

                    <div className="message-contacts">
                      <a href={`tel:${message.phone}`}>{message.phone}</a>
                      {message.email && <a href={`mailto:${message.email}`}>{message.email}</a>}
                    </div>

                    <p>{message.message}</p>

                    <button
                      className="delete-message"
                      onClick={e => {
                        e.stopPropagation();
                        deleteMessage(message.id);
                      }}
                    >
                      <Trash2 size={17} /> حذف الرسالة
                    </button>
                  </article>
                ))}

                {data.messages.length === 0 && <div className="empty-state">لا توجد رسائل حتى الآن.</div>}
              </div>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
