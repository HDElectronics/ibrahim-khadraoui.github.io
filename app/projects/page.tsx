import { Metadata } from 'next';

import Container from '@/components/Container';
import ProjectFilter from '@/components/ProjectFilter';
import { projects } from '@/data/projects';

import styles from '@/styles/ProjectsPage.module.css';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Projects by Ibrahim Khadraoui — edge AI inference, robotics, UAV systems, and custom hardware.',
};

const ProjectsPage = () => (
  <Container className={styles.page}>
    <header className={styles.header}>
      <h1 className={styles.title}>Projects</h1>
      <p className={styles.subtitle}>
        Systems I&apos;ve built end to end — from model inference on edge
        hardware to the boards the models run on.
      </p>
    </header>

    <ProjectFilter projects={projects} />
  </Container>
);

export default ProjectsPage;
