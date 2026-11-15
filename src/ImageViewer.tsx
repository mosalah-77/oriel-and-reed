import { useEffect, useRef, useState } from 'react';
import type { Project } from './projects';
import ProjectImage from './ProjectImage';
import { containDialogFocus } from './dialog-focus';

export default function ImageViewer({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    if (!project || !dialog.current) return;
    const viewer = dialog.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    setStatus('loading');
    viewer.showModal();
    document.body.style.overflow = 'hidden';
    const image = viewer.querySelector('img');
    if (image?.complete) setStatus(image.naturalWidth ? 'loaded' : 'error');
    return () => {
      viewer.close();
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [project]);

  return (
    <dialog ref={dialog} className="image-viewer" aria-labelledby="image-viewer-title" aria-modal="true"
      onKeyDown={containDialogFocus}
      onClose={() => { if (!dialog.current?.open) onClose(); }}>
      {project && <>
        <div className="viewer-heading">
          <h2 id="image-viewer-title">{project.title}</h2>
          <button type="button" className="viewer-close" autoFocus onClick={() => dialog.current?.close()}>Close image</button>
        </div>
        <figure className="viewer-figure">
          <div className="viewer-frame" data-state={status} aria-busy={status === 'loading'}>
            <ProjectImage key={project.slug} project={project} wide eager
              onLoad={() => setStatus('loaded')} onError={() => setStatus('error')} />
            {status === 'loading' && <p className="viewer-message" role="status">Loading image…</p>}
            {status === 'error' && <p className="viewer-message" role="alert">The image could not load. Close the viewer and try again.</p>}
          </div>
          <figcaption>Reference {project.imageType} by <a href={project.source}>{project.creator} / Unsplash</a>. Fictional concept.</figcaption>
        </figure>
      </>}
    </dialog>
  );
}
