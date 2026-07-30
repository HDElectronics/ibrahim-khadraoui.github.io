import Image from 'next/image';
import Link from 'next/link';

import { Project } from '@/types';

import styles from '@/styles/ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const heroImage = project.images?.[0];

  return (
    <Link href={project.link} className={styles.card}>
      {heroImage && (
        <div className={styles.thumb}>
          <Image
            src={heroImage}
            alt={project.title}
            fill
            sizes="(max-width: 700px) 100vw, 340px"
            className={styles.image}
          />
        </div>
      )}

      <div className={styles.body}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.text}>{project.hook ?? project.description}</p>
        <p className={styles.tags}>{project.tags.slice(0, 4).join(' · ')}</p>
        {project.comingSoon && <span className={styles.badge}>Work in progress</span>}
      </div>
    </Link>
  );
};

export default ProjectCard;
