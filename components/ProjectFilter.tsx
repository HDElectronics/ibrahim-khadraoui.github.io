'use client';

import { useState } from 'react';

import ProjectCard from '@/components/ProjectCard';
import { Project, ProjectCategory } from '@/types';

import styles from '@/styles/ProjectFilter.module.css';

type Filter = ProjectCategory | 'all';

const FILTERS: Filter[] = ['all', 'professional', 'hardware', 'hobby', 'open-source'];

interface ProjectFilterProps {
  projects: Project[];
}

const ProjectFilter = ({ projects }: ProjectFilterProps) => {
  const [filter, setFilter] = useState<Filter>('all');

  const visible =
    filter === 'all'
      ? projects
      : projects.filter((project) => project.category === filter);

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Filter projects by category">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={
              filter === option ? `${styles.filter} ${styles.active}` : styles.filter
            }
          >
            {option}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {visible.length === 0 && <p className={styles.empty}>Nothing here yet.</p>}
    </>
  );
};

export default ProjectFilter;
