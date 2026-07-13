import { ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { useSite } from '../context/SiteContext';
import { mediaUrl, projectCover, projectImages } from '../utils/api';

export default function Projects() {
  const { projects } = useSite();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState('الكل');
  const [activeProject, setActiveProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const categories = useMemo(() => ['الكل', ...new Set(projects.map(p => p.category))], [projects]);
  const filtered = filter === 'الكل' ? projects : projects.filter(p => p.category === filter);
  const activeImages = activeProject ? projectImages(activeProject) : [];
  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    if (!selectedCategory) {
      setFilter('الكل');
      return;
    }

    setFilter(categories.includes(selectedCategory) ? selectedCategory : 'الكل');
  }, [categories, selectedCategory]);

  const openProjectGallery = project => {
    setActiveProject(project);
    setActiveImageIndex(0);
  };

  const closeProjectGallery = () => {
    setActiveProject(null);
    setActiveImageIndex(0);
  };

  const showNextImage = () => {
    if (activeImages.length <= 1) return;
    setActiveImageIndex(prev => (prev + 1) % activeImages.length);
  };

  const showPrevImage = () => {
    if (activeImages.length <= 1) return;
    setActiveImageIndex(prev => (prev - 1 + activeImages.length) % activeImages.length);
  };

  const changeFilter = category => {
    setFilter(category);
    if (category === 'الكل') {
      setSearchParams({});
      return;
    }

    setSearchParams({ category });
  };

  return (
    <main>
      <PageHero title="مشروعاتنا" text="نماذج من أعمالنا في المشروعات السكنية والإدارية والتشطيبات." />

      <section className="section">
        <div className="container">
          <div className="filter-tabs">
            {categories.map(category => (
              <button className={filter === category ? 'active' : ''} key={category} onClick={() => changeFilter(category)}>
                {category}
              </button>
            ))}
          </div>

          <div className="projects-page-grid">
            {filtered.map(project => (
              <article
                key={project.id}
                className="project-full-card clickable"
                onClick={() => openProjectGallery(project)}
              >
                <img src={projectCover(project)} alt={project.title} />
                <div>
                  <span>{project.category}</span>
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                  <small>
                    <MapPin size={16} /> {project.location}
                  </small>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && <div className="empty-state">لا توجد مشروعات في هذا القسم حاليًا.</div>}
        </div>
      </section>

      {activeProject && (
        <div className="project-gallery-modal" onClick={closeProjectGallery}>
          <div className="project-gallery-dialog" onClick={e => e.stopPropagation()}>
            <button type="button" className="project-gallery-close" onClick={closeProjectGallery} aria-label="إغلاق">
              <X size={20} />
            </button>

            <div className="project-gallery-stage">
              <img
                src={mediaUrl(activeImages[activeImageIndex] || '')}
                alt={`${activeProject.title} ${activeImageIndex + 1}`}
              />

              {activeImages.length > 1 && (
                <>
                  <button type="button" className="project-gallery-nav next" onClick={showNextImage} aria-label="التالي">
                    <ChevronRight size={22} />
                  </button>
                  <button type="button" className="project-gallery-nav prev" onClick={showPrevImage} aria-label="السابق">
                    <ChevronLeft size={22} />
                  </button>
                </>
              )}
            </div>

            <div className="project-gallery-info">
              <span>{activeProject.category}</span>
              <h2>{activeProject.title}</h2>
              <p>{activeProject.description}</p>
              <small>
                <MapPin size={16} /> {activeProject.location}
              </small>
            </div>

            {activeImages.length > 1 && (
              <div className="project-gallery-thumbs">
                {activeImages.map((image, index) => (
                  <button
                    key={`${activeProject.id}-${index}`}
                    type="button"
                    className={index === activeImageIndex ? 'active' : ''}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={mediaUrl(image)} alt={`${activeProject.title} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
