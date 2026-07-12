import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Phone, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { settings } = useSite();
  const links = [
    ['/', 'الرئيسية'],
    ['/about', 'من نحن'],
    ['/team', 'فريق العمل'],
    ['/services', 'خدماتنا'],
    ['/projects', 'مشروعاتنا'],
    ['/contact', 'تواصل معنا']
  ];

  return (
    <header className="navbar-wrap">
      <div className="container navbar">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="فرست هاوس" />
          <div>
            <strong>فرست هاوس</strong>
            <span>للمقاولات</span>
          </div>
        </Link>

        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {links.map(([to, text]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              {text}
            </NavLink>
          ))}
          <a className="nav-call" href={`tel:${settings.phone || ''}`}>
            <Phone size={17} />
            اتصل الآن
          </a>
        </nav>

        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="القائمة">
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
