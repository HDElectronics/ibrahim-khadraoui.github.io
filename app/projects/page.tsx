import { Metadata } from 'next';
import { VscFolderOpened, VscGithub, VscLinkExternal } from 'react-icons/vsc';

import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/projects';

import styles from '@/styles/ProjectsPage.module.css';

export const metadata: Metadata = {
  title: 'Projects',
};

const groups = [
  {
    id: 'professional',
    label: 'Professional & Research',
    blurb: 'Work at the Technology Innovation Institute and my Master’s thesis — VR teleoperation, on-device AI, autonomous racing, and robotics.',
    items: projects.filter((p) => p.category === 'professional'),
  },
  {
    id: 'hobby',
    label: 'Hobby & Side Projects',
    blurb: 'Personal robotics builds outside work — full systems designed and shipped for fun.',
    items: projects.filter((p) => p.category === 'hobby'),
  },
  {
    id: 'open-source',
    label: 'Open Source Contributions',
    blurb: 'Code I’ve contributed back to widely used open-source projects.',
    items: projects.filter((p) => p.category === 'open-source'),
  },
  {
    id: 'hardware',
    label: 'Hardware & PCB',
    blurb: 'Personal embedded-systems and PCB projects built from scratch.',
    items: projects.filter((p) => p.category === 'hardware'),
  },
];

const ProjectsPage = () => {
  const totalProjects = projects.length;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.iconWrapper}>
              <VscFolderOpened className={styles.icon} size={24} />
            </div>
            <div className={styles.meta}>
              <span className={styles.count}>{totalProjects} Projects</span>
            </div>
          </div>

          <div className={styles.headerContent}>
            <h1 className={styles.title}>Featured Work</h1>
            <p className={styles.subtitle}>
              A curated collection of projects I&apos;ve built. Each represents
              a unique challenge and learning experience.
            </p>
          </div>
        </header>

        {groups
          .filter((group) => group.items.length > 0)
          .map((group) => (
            <section key={group.id} className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{group.label}</h2>
                <span className={styles.sectionCount}>{group.items.length}</span>
              </div>
              <p className={styles.sectionBlurb}>{group.blurb}</p>
              <div className={styles.timeline}>
                {group.items.map((project, index) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                    index={index + 1}
                  />
                ))}
              </div>
            </section>
          ))}

        <footer className={styles.footer}>
          <div className={styles.footerLine} />
          <a
            href="https://github.com/HDElectronics?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            <VscGithub size={18} />
            <span>Explore more on GitHub</span>
            <VscLinkExternal size={14} />
          </a>
        </footer>
      </div>
    </div>
  );
};

export default ProjectsPage;
