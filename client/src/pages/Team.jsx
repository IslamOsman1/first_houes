import { ArrowLeft, Award, Briefcase, HardHat, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';

const teamMembers = [
  {
    name: 'م. أحمد خالد',
    role: 'المدير التنفيذي',
    image: '/team-avatar.svg',
    icon: Briefcase,
    bio: 'يقود التخطيط العام للمشروعات ويضمن وضوح نطاق العمل والالتزام بأهداف العميل من البداية وحتى التسليم.'
  },
  {
    name: 'م. سارة محمد',
    role: 'مديرة التصميم والتنفيذ',
    image: '/team-avatar.svg',
    icon: Award,
    bio: 'تتابع التفاصيل المعمارية والتشطيبات وتعمل على تحويل التصورات إلى حلول عملية قابلة للتنفيذ بدقة.'
  },
  {
    name: 'م. عمر حسن',
    role: 'مهندس موقع',
    image: '/team-avatar.svg',
    icon: HardHat,
    bio: 'يشرف على سير العمل اليومي داخل الموقع وينسق بين الفرق الفنية والموردين لضمان جودة التنفيذ.'
  },
  {
    name: 'أ. نورا علي',
    role: 'مسؤولة خدمة العملاء',
    image: '/team-avatar.svg',
    icon: UserRound,
    bio: 'تتابع استفسارات العملاء وتنسق المواعيد والتحديثات الدورية لضمان تجربة تواصل واضحة وسريعة.'
  }
];

const teamValues = [
  'تنسيق يومي بين الإدارة والهندسة والتنفيذ.',
  'تقارير واضحة ومستمرة عن تقدم المشروع.',
  'التزام بمعايير السلامة والجودة في كل مرحلة.',
  'مرونة في التعامل مع متطلبات المشروع المتغيرة.'
];

export default function Team() {
  return (
    <main>
      <PageHero
        title="فريق العمل"
        text="تعرف على الفريق الذي يقف خلف تنفيذ مشاريع فرست هاوس باحترافية، من التخطيط وحتى التسليم النهائي."
      />

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span>خبرات متكاملة</span>
            <h2>فريق يجمع بين الإدارة والهندسة والتنفيذ</h2>
            <p>
              نجاح أي مشروع لا يعتمد على فرد واحد، بل على فريق منظم يعرف كيف ينسق بين التفاصيل الفنية،
              الجدول الزمني، ومتطلبات العميل في كل خطوة.
            </p>
          </div>

          <div className="team-grid">
            {teamMembers.map(({ name, role, bio, image, icon: Icon }) => (
              <article className="team-card" key={name}>
                <div className="team-card-top">
                  <img className="team-card-photo" src={image} alt={name} />
                  <div className="team-card-icon">
                    <Icon />
                  </div>
                </div>
                <h3>{name}</h3>
                <strong>{role}</strong>
                <p>{bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section muted-section">
        <div className="container team-layout">
          <div className="team-summary-card">
            <span className="section-kicker">كيف نعمل</span>
            <h2>العمل الجماعي هو أساس الجودة</h2>
            <p>
              نؤمن أن أفضل النتائج تأتي عندما تكون الأدوار واضحة، والتواصل سريع، والمتابعة مستمرة
              بين جميع أفراد الفريق.
            </p>
            <div className="check-list">
              {teamValues.map(item => (
                <span key={item}>
                  <ShieldCheck />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="team-highlight">
            <div className="team-highlight-badge">
              <span>FIRST HOUSE TEAM</span>
              <strong>جاهزون لنجاح مشروعك</strong>
            </div>
            <p>
              من أول زيارة معاينة وحتى آخر لمسة في التسليم، يعمل فريقنا بروح واحدة لتقديم تجربة تنفيذ
              أكثر وضوحًا وانضباطًا.
            </p>
          </div>
        </div>
      </section>

      <section className="team-cta">
        <div className="container">
          <h2>تريد العمل معنا في مشروعك القادم؟</h2>
          <p>تواصل مع فريق فرست هاوس وسنرتب معك المعاينة، التصور المبدئي، وخطة التنفيذ المناسبة.</p>
          <Link to="/contact" className="btn btn-light">
            تواصل مع فريق العمل
            <ArrowLeft size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
