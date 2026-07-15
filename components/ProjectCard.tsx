import Image from 'next/image';
import Link from 'next/link';
import { VscArrowRight, VscBeaker } from 'react-icons/vsc';

import { Project } from '@/types';

import styles from '@/styles/ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const heroVideo = project.videos?.[0];
  const heroImage = project.images?.[0];

  return (
    <Link href={project.link} className={styles.card}>
      <div className={styles.hero}>
        {heroVideo ? (
          <video
            className={styles.heroMedia}
            src={heroVideo}
            poster={heroImage}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : heroImage ? (
          <Image
            src={heroImage}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, 720px"
            className={
              heroImage.endsWith('.svg')
                ? `${styles.heroMedia} ${styles.heroMediaDiagram}`
                : styles.heroMedia
            }
          />
        ) : (
          <div className={styles.heroPlaceholder}>
            <VscBeaker size={28} />
            <span>Visuals coming soon</span>
          </div>
        )}
        <div className={styles.number}>
          <span>{String(index).padStart(2, '0')}</span>
        </div>
        {project.comingSoon && (
          <div className={styles.comingSoonBadge}>Work in progress</div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.main}>
          <div className={styles.header}>
            <div className={styles.logoWrapper}>
              <Image
                src={project.logo}
                alt={`${project.title} logo`}
                width={16}
                height={16}
                className={styles.logo}
              />
            </div>
            <h3 className={styles.title}>{project.title}</h3>
          </div>

          {project.hook && <p className={styles.hook}>{project.hook}</p>}
          <p className={styles.description}>{project.description}</p>

          <div className={styles.tags}>
            {project.tags.slice(0, 5).map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.action}>
          <span className={styles.link}>
            View Project
            <VscArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
