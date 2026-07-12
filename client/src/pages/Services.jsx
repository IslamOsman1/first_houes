import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ServiceIcon from '../components/ServiceIcon';
import { useSite } from '../context/SiteContext';

export default function Services() {
  const { services } = useSite();
  return (
    <main>
      <PageHero title="خدماتنا" text="نغطي جميع مراحل البناء والتشطيب والصيانة من خلال فريق متخصص." />
      <section className="section"><div className="container services-page-grid">{services.map((service, index) => <article key={service.id} className="service-detail"><div className="service-number">{String(index + 1).padStart(2, '0')}</div><div className="icon-box"><ServiceIcon name={service.icon} size={34} /></div><h2>{service.title}</h2><p>{service.description}</p><ul><li><CheckCircle2 /> خطة عمل واضحة</li><li><CheckCircle2 /> متابعة هندسية</li><li><CheckCircle2 /> خامات موثوقة</li></ul><Link to="/contact">اطلب عرض سعر <ArrowLeft /></Link></article>)}</div></section>
      <section className="cta-section"><div className="container cta-inner"><div><span>خدمة مصممة لاحتياجك</span><h2>لم تجد الخدمة التي تبحث عنها؟</h2><p>أرسل تفاصيل مشروعك وسيقوم فريقنا بتقديم الحل المناسب.</p></div><Link to="/contact" className="btn btn-light">تحدث معنا <ArrowLeft /></Link></div></section>
    </main>
  );
}
