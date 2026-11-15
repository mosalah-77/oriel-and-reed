import type { Project } from './projects';

type Props = {
  project: Project;
  wide?: boolean;
  eager?: boolean;
  onLoad?: () => void;
  onError?: () => void;
};

export default function ProjectImage({ project, wide = false, eager = false, onLoad, onError }: Props) {
  const image = `/images/${project.slug}`;
  return (
    <img
      className="project-image"
      src={`${image}-1280.webp`}
      srcSet={`${image}-640.webp 640w, ${image}-1280.webp 1280w, ${image}-1920.webp 1920w`}
      sizes={wide
        ? '(max-width: 799px) calc(100vw - 40px), (min-width: 1778px) calc(100vw - 160px), 91vw'
        : '(max-width: 799px) calc(100vw - 40px), (min-width: 1778px) calc(50vw - 96px), calc(45.5vw - 16px)'}
      width="1920"
      height="1280"
      alt={project.alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      onLoad={onLoad}
      onError={onError}
    />
  );
}
