import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

export default function Footer() {
  const { settings } = useSite();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <img src="/logo.png" alt="فرست هاوس" />
            <div>
              <strong>فرست هاوس</strong>
              <span>للمقاولات</span>
            </div>
          </div>
          <p>شريكك الموثوق لتنفيذ أعمال المقاولات والتشطيبات وإدارة المشروعات باحترافية وجودة.</p>
          <div className="socials">
            <a href={settings.facebook || '#'}>
              <Facebook />
            </a>
            <a href={settings.instagram || '#'}>
              <Instagram />
            </a>
          </div>
        </div>

        <div>
          <h4>روابط سريعة</h4>
          <Link to="/about">من نحن</Link>
          <Link to="/team">فريق العمل</Link>
          <Link to="/services">خدماتنا</Link>
          <Link to="/projects">مشروعاتنا</Link>
          <Link to="/contact">اطلب عرض سعر</Link>
        </div>

        <div>
          <h4>تواصل معنا</h4>
          <p>
            <Phone size={17} /> {settings.phone}
          </p>
          <p>
            <Mail size={17} /> {settings.email}
          </p>
          <p>
            <MapPin size={17} /> {settings.address}
          </p>
        </div>
      </div>

      <div className="footer-bottom">© {new Date().getFullYear()} فرست هاوس للمقاولات - جميع الحقوق محفوظة</div>
    </footer>
  );
}
