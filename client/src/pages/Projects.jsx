import { MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import PageHero from '../components/PageHero';
import { useSite } from '../context/SiteContext';
import { mediaUrl } from '../utils/api';

export default function Projects() {
  const { projects } = useSite();
  const [filter, setFilter] = useState('الكل');
  const categories = useMemo(() => ['الكل', ...new Set(projects.map(p => p.category))], [projects]);
  const filtered = filter === 'الكل' ? projects : projects.filter(p => p.category === filter);
  return (
    <main>
      <PageHero title="مشروعاتنا" text="نماذج من أعمالنا في المشروعات السكنية والإدارية والتشطيبات." />
      <section className="section"><div className="container"><div className="filter-tabs">{categories.map(category => <button className={filter === category ? 'active' : ''} key={category} onClick={() => setFilter(category)}>{category}</button>)}</div><div className="projects-page-grid">{filtered.map(project => <article key={project.id} className="project-full-card"><img src={mediaUrl(project.image)} alt={project.title} /><div><span>{project.category}</span><h2>{project.title}</h2><p>{project.description}</p><small><MapPin size={16} /> {project.location}</small></div></article>)}</div>{filtered.length === 0 && <div className="empty-state">لا توجد مشروعات في هذا القسم حاليًا.</div>}</div></section>
    </main>
  );
}
