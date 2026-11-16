import { useEffect, useRef, useState } from 'react';
import { projects, type Project } from './projects';
import Contact from './Contact';
import ProjectImage from './ProjectImage';
import ImageViewer from './ImageViewer';
import { containDialogFocus } from './dialog-focus';

const navigation = [
  { href: '/projects', label: 'Projects' },
  { href: '/studio', label: 'Services / About' },
  { href: '/contact', label: 'Contact' },
];

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Header() {
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!header.current) return;
    const element = header.current;
    const root = document.documentElement;
    const updateOffset = () => root.style.setProperty('--header-height', `${element.getBoundingClientRect().height}px`);
    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(element);
    return () => { observer.disconnect(); root.style.removeProperty('--header-height'); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const desktop = window.matchMedia('(min-width: 800px)');
    const closeOnDesktop = () => {
      if (desktop.matches) menu.current?.close();
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <header className="site-header" ref={header}>
      <a className="wordmark" href="/" aria-label="Oriel and Reed home">Oriel &amp; Reed</a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation.map(({ href, label }) => <a href={href} key={href}>{label}</a>)}
      </nav>
      <a className="header-cta" href="/contact">Request a consultation <Arrow /></a>
      <button
        className="menu-toggle"
        type="button"
        aria-controls="mobile-menu"
        aria-expanded={menuOpen}
        onClick={event => {
          event.currentTarget.focus({ preventScroll: true });
          menu.current?.showModal();
          setMenuOpen(true);
        }}
      >Menu <span aria-hidden="true">+</span></button>
      <dialog
        id="mobile-menu"
        className="mobile-dialog"
        ref={menu}
        aria-labelledby="menu-title"
        onKeyDown={containDialogFocus}
        onClose={() => setMenuOpen(false)}
      >
        <div className="menu-heading">
          <span className="wordmark" id="menu-title">Oriel &amp; Reed</span>
          <button className="menu-close" type="button" onClick={() => menu.current?.close()} autoFocus>
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <a href="/">Home <Arrow /></a>
          {navigation.map(({ href, label }) => <a href={href} key={href}>{label} <Arrow /></a>)}
        </nav>
        <a className="button-link menu-cta" href="/contact">Request a consultation <Arrow /></a>
        <p className="menu-note">Fictional studio · Portfolio concept</p>
      </dialog>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <h1 className="hero-title" id="hero-title">Oriel &amp; Reed</h1>
      <div className="hero-intro">
        <p>Interior design, space planning and furnishing, shaped around your home.</p>
        <div className="hero-actions">
          <a className="text-link" href="/projects">View projects <Arrow /></a>
          <a className="text-link" href="/contact">Discuss your space <Arrow /></a>
        </div>
      </div>
      <div className="hero-image">
        {/* The portrait crop needs a wider source than its visible box. */}
        <img
          src="/images/living-room-1280.webp"
          srcSet="/images/living-room-640.webp 640w, /images/living-room-1280.webp 1280w, /images/living-room-1920.webp 1920w"
          sizes="(max-width: 599px) calc(171vw - 68.4px), (max-width: 799px) calc(103vw - 41.2px), (min-width: 1778px) calc(100vw - 160px), 91vw"
          width="1920"
          height="1406"
          alt="A sunlit living room with a linen sofa, woven mirrors and a pale green armchair."
          fetchPriority="high"
          data-source="https://unsplash.com/photos/c0JoR_-2x3E"
          data-subject="Neutral living room with natural materials"
        />
      </div>
    </section>
  );
}

function StudioIntro() {
  return (
    <section className="studio-intro" aria-labelledby="approach-title">
      <div>
        <p className="eyebrow">Our approach</p>
        <h2 id="approach-title">A home, room by room.</h2>
      </div>
      <p className="approach-copy">We start with the rooms you use most: where you sit, what you need to store, and how light moves through the day. Layout comes first, followed by materials and furnishings that suit the space.</p>
    </section>
  );
}

function ProjectList({ items = projects, heading: Heading = 'h3', onPreview }: { items?: Project[]; heading?: 'h2' | 'h3'; onPreview?: (project: Project) => void }) {
  return (
    <div className="project-grid">
      {items.map((project, index) => (
        <article className={`project-card${index === 0 ? ' project-card-wide' : ''}`} key={project.slug}>
          {onPreview && <button className="project-image-button" type="button" aria-label={`View image: ${project.title}`}
            aria-haspopup="dialog" onClick={event => { event.currentTarget.focus({ preventScroll: true }); onPreview(project); }}>
            <ProjectImage project={project} wide={index === 0} eager={index === 0} />
            <span className="image-button-label" aria-hidden="true">View image</span>
          </button>}
          <a className="project-link" href={`/projects/${project.slug}`} aria-labelledby={`${project.slug}-title`}>
            {!onPreview && <ProjectImage project={project} wide={index === 0} />}
            <div className="project-caption">
              <div>
                <p className="eyebrow">Concept study · {project.room}</p>
                <Heading id={`${project.slug}-title`}>{project.title}</Heading>
              </div>
              <Arrow />
              <p className="project-summary">{project.summary}</p>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}

function Projects({ index = false }: { index?: boolean }) {
  const Heading = index ? 'h1' : 'h2';
  const [room, setRoom] = useState('All rooms');
  const [selectedImage, setSelectedImage] = useState<Project | null>(null);
  const rooms = ['All rooms', ...new Set(projects.map(project => project.room))];
  const visible = index && room !== 'All rooms' ? projects.filter(project => project.room === room) : projects;
  return (
    <section className={`projects-section${index ? ' projects-index' : ''}`} aria-labelledby="projects-title">
      <div className="section-heading">
        <Heading id="projects-title">{index ? 'Project concepts' : 'Selected concepts'}</Heading>
        <p>Fictional room studies, illustrated with licensed reference images.</p>
      </div>
      {index && <div className="project-toolbar">
        <div className="project-filters" role="group" aria-label="Filter projects by room">
          {rooms.map(option => <button type="button" key={option} aria-controls="project-results"
            aria-pressed={room === option} onClick={() => setRoom(option)}>{option}</button>)}
        </div>
        <p className="project-count" role="status" aria-atomic="true">{visible.length} {visible.length === 1 ? 'concept' : 'concepts'} shown</p>
      </div>}
      <div id={index ? 'project-results' : undefined}>
        {visible.length ? <ProjectList items={visible} heading={index ? 'h2' : 'h3'} onPreview={index ? setSelectedImage : undefined} />
          : <p className="project-empty">No concepts in this room category yet. Choose All rooms to see the collection.</p>}
      </div>
      {index && <ImageViewer project={selectedImage} onClose={() => setSelectedImage(null)} />}
    </section>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const [imageOpen, setImageOpen] = useState(false);
  return (
    <article className="project-detail">
      <a className="text-link" href="/projects">Back to projects <Arrow /></a>
      <header className="project-heading">
        <p className="eyebrow">Concept study · {project.room}</p>
        <h1>{project.title}</h1>
        <p>Fictional design proposal. The reference image illustrates the direction; it does not show work completed by Oriel &amp; Reed.</p>
      </header>
      <figure className="project-figure">
        <button className="project-image-button" type="button" aria-label={`View image: ${project.title}`}
          aria-haspopup="dialog" onClick={event => { event.currentTarget.focus({ preventScroll: true }); setImageOpen(true); }}>
          <ProjectImage project={project} wide eager />
          <span className="image-button-label" aria-hidden="true">View image</span>
        </button>
        <figcaption>Reference {project.imageType} by <a href={project.source}>{project.creator} / Unsplash</a>.</figcaption>
      </figure>
      <div className="project-notes">
        <section aria-labelledby="brief-title">
          <h2 id="brief-title">The brief</h2>
          <p>{project.brief}</p>
        </section>
        <section aria-labelledby="direction-title">
          <h2 id="direction-title">Design direction</h2>
          <p>{project.direction}</p>
          <p>{project.materials}</p>
        </section>
      </div>
      <ImageViewer project={imageOpen ? project : null} onClose={() => setImageOpen(false)} />
    </article>
  );
}

function Services() {
  return (
    <section className="services-section" id="services" aria-labelledby="services-title">
      <div className="services-intro">
        <h2 id="services-title">Design services</h2>
        <p>Choose help with a layout, a room scheme or the furniture and finishing touches.</p>
      </div>
      <dl className="service-list">
        <div>
          <dt>Space planning</dt>
          <dd>Furniture layouts and storage ideas, with room to open doors, pull out chairs and move comfortably.</dd>
        </div>
        <div>
          <dt>Interior design</dt>
          <dd>A direction for colors, materials and lighting, brought together in a room scheme you can review.</dd>
        </div>
        <div>
          <dt>Furnishing &amp; styling</dt>
          <dd>Furniture, fabrics and finishing pieces chosen to work together, with a practical list of what to source.</dd>
        </div>
      </dl>
    </section>
  );
}

function Process() {
  return (
    <section className="process-section" id="process" aria-labelledby="process-title">
      <div className="section-heading">
        <h2 id="process-title">From conversation to a plan.</h2>
        <p>A shared brief comes first. The proposal develops from what matters to you.</p>
      </div>
      <ol className="process-list" role="list">
        <li>
          <span className="step-number" aria-hidden="true">01</span>
          <h3>Talk through the space</h3>
          <p>Share how you use the room, what you want to keep, your budget and the changes you have in mind.</p>
        </li>
        <li>
          <span className="step-number" aria-hidden="true">02</span>
          <h3>Agree the direction</h3>
          <p>Review the brief, a layout and material references together. Set the scope before developing the details.</p>
        </li>
        <li>
          <span className="step-number" aria-hidden="true">03</span>
          <h3>Review the proposal</h3>
          <p>Look through the room scheme and suggested pieces. Refine the choices and agree what needs to happen next.</p>
        </li>
      </ol>
    </section>
  );
}

function ConsultationInvitation() {
  return (
    <section className="consultation-invitation" aria-labelledby="invitation-title">
      <h2 id="invitation-title">Have a room in mind?</h2>
      <div>
        <p>Tell us what you would like to change. Start with a few details about your space.</p>
        <a className="button-link" href="/contact">Request a consultation <Arrow /></a>
      </div>
    </section>
  );
}

function Studio() {
  return (
    <>
      <header className="studio-page-heading">
        <h1>Services &amp; approach</h1>
        <p>Designing a room starts with how you live in it. We consider the layout, materials and furniture together, from the first conversation to a proposal you can review.</p>
      </header>
      <Services />
      <Process />
      <ConsultationInvitation />
    </>
  );
}

function Page({ path }: { path: string }) {
  if (path === '/') return <><Hero /><StudioIntro /><Projects /><Services /><Process /><ConsultationInvitation /></>;
  if (path === '/projects') return <Projects index />;
  if (path === '/studio') return <Studio />;
  if (path === '/contact') return <Contact />;
  const project = projects.find(({ slug }) => path === `/projects/${slug}`);
  if (project) return <ProjectDetail project={project} />;
  return (
    <section className="page-preview">
      <h1>Page not found</h1>
      <p>There is no page at this address.</p>
      <a className="text-link" href="/">Return home <Arrow /></a>
    </section>
  );
}

export default function App({ path = '/' }: { path?: string }) {
  path = path.replace(/\/+$/, '') || '/';
  const pageTitles: Record<string, string> = {
    '/': 'Interior design studio', '/projects': 'Project concepts',
    '/studio': 'Services & approach', '/contact': 'Contact',
  };
  const title = pageTitles[path] ?? projects.find(project => path === `/projects/${project.slug}`)?.title ?? 'Page not found';
  return (
    <>
      <title>{`${title} | Oriel & Reed`}</title>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Page path={path} />
      </main>
      <footer className="site-footer">
        <p>Fictional studio · Portfolio concept</p>
        {path === '/' && <a href="https://unsplash.com/photos/c0JoR_-2x3E">Hero image: Spacejoy / Unsplash</a>}
      </footer>
    </>
  );
}
