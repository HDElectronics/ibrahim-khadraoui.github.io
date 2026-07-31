import Image from 'next/image';
import Link from 'next/link';

import AutoplayVideo from '@/components/AutoplayVideo';
import { Project } from '@/types';

import styles from '@/styles/ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const hero =
    project.hero ??
    (project.images[0] ? { type: 'img' as const, src: project.images[0] } : undefined);

  return (
    <Link href={project.link} className={styles.card}>
      {hero && (
        <div className={styles.thumb}>
          {hero.type === 'video' ? (
            <AutoplayVideo src={hero.src} className={styles.video} controls={false} />
          ) : (
            <Image
              src={hero.src}
              alt={project.title}
              fill
              sizes="(max-width: 700px) 100vw, 340px"
              unoptimized={hero.src.endsWith('.gif')}
              className={styles.image}
            />
          )}
        </div>
      )}

      <div className={styles.body}>
        <h2 className={styles.title}>{project.title}</h2>
        <p className={styles.text}>{project.hook ?? project.description}</p>
        <p className={styles.tags}>{project.tags.slice(0, 4).join(' · ')}</p>
        {project.comingSoon && <span className={styles.badge}>Work in progress</span>}
      </div>
    </Link>
  );
};

export default ProjectCard;
