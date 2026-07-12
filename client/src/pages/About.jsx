import { CheckCircle2, Eye, Goal, ShieldCheck, Users } from 'lucide-react';
import PageHero from '../components/PageHero';
import { useSite } from '../context/SiteContext';

export default function About() {
  const { settings } = useSite();
  return (
    <main>
      <PageHero title="من نحن" text="شركة مقاولات متخصصة في تقديم حلول تنفيذ متكاملة بمعايير احترافية." />
      <section className="section"><div className="container story-grid"><div><span className="section-kicker">قصتنا</span><h2>نبني مشروعات تدوم وتحقق قيمة</h2><p>بدأت فرست هاوس بهدف واضح: تقديم تجربة مقاولات أكثر التزامًا وشفافية. ومنذ انطلاقنا، نجحنا في تنفيذ مشروعات متنوعة بفضل فريقنا المتخصص وشبكة الموردين الموثوقين.</p><p>نضع العميل في قلب كل قرار، ونحوّل احتياجاته إلى خطة تنفيذ واضحة تشمل التكلفة والوقت والجودة، مع متابعة مستمرة حتى التسليم.</p><div className="check-list"><span><CheckCircle2 /> دراسة دقيقة قبل التنفيذ</span><span><CheckCircle2 /> عقود ومراحل عمل واضحة</span><span><CheckCircle2 /> تسليم وفق المواصفات المتفق عليها</span></div></div><div className="story-card"><img src="/logo.png" alt="فرست هاوس" /><div><strong>{settings.completedProjects}</strong><span>مشروع مكتمل بنجاح</span></div></div></div></section>
      <section className="section muted-section"><div className="container values-grid"><article><div className="icon-box"><Eye /></div><h3>رؤيتنا</h3><p>أن نكون من الشركات الأكثر ثقة في قطاع المقاولات من خلال الجودة والابتكار والالتزام.</p></article><article><div className="icon-box"><Goal /></div><h3>رسالتنا</h3><p>تحويل أفكار عملائنا إلى مشروعات واقعية ذات قيمة باستخدام أفضل الممارسات الهندسية.</p></article><article><div className="icon-box"><ShieldCheck /></div><h3>قيمنا</h3><p>الشفافية، الجودة، الأمان، احترام الوقت، والمسؤولية في كل مرحلة من مراحل المشروع.</p></article></div></section>
      <section className="section"><div className="container process"><div className="section-heading"><span>طريقة عملنا</span><h2>خطوات واضحة من البداية للنهاية</h2></div><div className="process-grid">{[['01','المعاينة والاستشارة'],['02','التصميم وعرض السعر'],['03','التنفيذ والمتابعة'],['04','الفحص والتسليم']].map(([n,t]) => <div key={n}><strong>{n}</strong><h3>{t}</h3><p>مرحلة منظمة ومتابعة دقيقة تضمن سير المشروع بكفاءة.</p></div>)}</div></div></section>
      <section className="team-banner"><div className="container"><Users size={52} /><h2>فريق واحد يعمل لنجاح مشروعك</h2><p>مهندسون وفنيون ومشرفون يجمعهم هدف واحد: تنفيذ مشروعك بأفضل صورة.</p></div></section>
    </main>
  );
}
