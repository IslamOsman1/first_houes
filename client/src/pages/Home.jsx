import { ArrowLeft, Building2, CheckCircle2, HardHat, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading';
import ServiceIcon from '../components/ServiceIcon';
import { useSite } from '../context/SiteContext';
import { mediaUrl, projectCover } from '../utils/api';

export default function Home() {
  const { settings, services, projects, banners, loading } = useSite();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const activeBanners = useMemo(() => (banners || []).filter(banner => banner.active && banner.image), [banners]);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBannerIndex(prev => (prev + 1) % activeBanners.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [activeBanners]);

  useEffect(() => {
    setActiveBannerIndex(0);
  }, [activeBanners.length]);

  if (loading) return <Loading />;

  const currentBanner = activeBanners[activeBannerIndex];

  const stats = [
    [settings.yearsExperience, 'سنوات خبرة'],
    [settings.completedProjects, 'مشروع مكتمل'],
    [settings.happyClients, 'عميل سعيد'],
    [settings.engineers, 'مهندس وفني']
  ];

  return (
    <main>
      {currentBanner && (
        <section className="home-banner-slider">
          <div className="container">
            <div className="home-banner-frame">
              <a
                href={currentBanner.link || '#'}
                className="home-banner-slide"
                aria-label={currentBanner.title || 'بنر رئيسي'}
              >
                <img src={mediaUrl(currentBanner.image)} alt={currentBanner.title || 'بنر رئيسي'} />
              </a>

              {activeBanners.length > 1 && (
                <div className="home-banner-dots">
                  {activeBanners.map((banner, index) => (
                    <button
                      key={banner.id}
                      type="button"
                      className={index === activeBannerIndex ? 'active' : ''}
                      onClick={() => setActiveBannerIndex(index)}
                      aria-label={`عرض البنر ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="hero">
        <div className="hero-pattern" />
        <div className="container">
          <div className="hero-copy">
            <span className="eyebrow">
              <HardHat size={18} /> {settings.companyName}
            </span>
            <h1>{settings.heroTitle}</h1>
            <p>{settings.heroText}</p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary">
                اطلب عرض سعر <ArrowLeft size={19} />
              </Link>
              <Link to="/projects" className="btn btn-outline">
                شاهد مشروعاتنا
              </Link>
            </div>
            <div className="hero-points">
              <span>
                <CheckCircle2 /> التزام بالمواعيد
              </span>
              <span>
                <CheckCircle2 /> جودة مضمونة
              </span>
              <span>
                <CheckCircle2 /> إشراف هندسي
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats-grid">
          {stats.map(([number, label]) => (
            <div key={label}>
              <strong>{number}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span>خدماتنا</span>
            <h2>حلول متكاملة لكل مشروع</h2>
            <p>من الفكرة والتخطيط وحتى التسليم، ندير مشروعك بخبرة واهتمام بالتفاصيل.</p>
          </div>
          <div className="services-grid">
            {services.slice(0, 4).map(service => (
              <article className="service-card" key={service.id}>
                <div className="icon-box">
                  <ServiceIcon name={service.icon} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link to="/services">
                  اعرف المزيد <ArrowLeft size={17} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section muted-section">
        <div className="container about-preview">
          <div className="about-visual">
            <div className="blueprint-card">
              <Building2 size={70} />
              <span>FIRST HOUSE</span>
              <strong>نبني بثقة</strong>
            </div>
            <div className="experience-badge">
              <strong>{settings.yearsExperience}</strong>
              <span>سنوات من الخبرة</span>
            </div>
          </div>
          <div className="about-copy">
            <span className="section-kicker">من نحن</span>
            <h2>خبرة هندسية تصنع فرقًا حقيقيًا</h2>
            <p>
              في فرست هاوس نؤمن أن نجاح أي مشروع يبدأ بالتخطيط الصحيح وينتهي بالتنفيذ المتقن.
              نعمل بفريق متخصص ونلتزم بالشفافية والجودة في كل خطوة.
            </p>
            <ul>
              <li>
                <ShieldCheck /> خامات معتمدة وجودة يمكن قياسها
              </li>
              <li>
                <HardHat /> فريق هندسي وفني ذو خبرة
              </li>
              <li>
                <CheckCircle2 /> متابعة وتقارير دورية للعميل
              </li>
            </ul>
            <Link to="/about" className="btn btn-primary">
              اعرف قصتنا <ArrowLeft size={19} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <span>أعمالنا</span>
              <h2>مشروعات نفتخر بها</h2>
            </div>
            <Link to="/projects" className="text-link">
              عرض كل المشروعات <ArrowLeft />
            </Link>
          </div>
          <div className="projects-grid">
            {projects.slice(0, 3).map(project => (
              <article className="project-card" key={project.id}>
                <img src={projectCover(project)} alt={project.title} />
                <div className="project-overlay">
                  <span>{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.location}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <span>ابدأ مشروعك معنا</span>
            <h2>لديك فكرة أو مشروع جديد؟</h2>
            <p>تواصل معنا الآن واحصل على استشارة أولية وعرض سعر مناسب لاحتياجاتك.</p>
          </div>
          <Link to="/contact" className="btn btn-light">
            تواصل معنا <ArrowLeft />
          </Link>
        </div>
      </section>
    </main>
  );
}
