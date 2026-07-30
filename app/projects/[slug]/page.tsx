import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Container from '@/components/Container';
import ContentBlocks from '@/components/ContentBlocks';
import MediaCarousel from '@/components/MediaCarousel';
import { projects } from '@/data/projects';
import { MediaItem } from '@/types';

import styles from '@/styles/ProjectDetailPage.module.css';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return {
    title: project?.title ?? 'Project',
    description: project?.description,
  };
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const galleryItems: MediaItem[] = [
    ...project.images.map((src) => ({ type: 'img' as const, src })),
    ...(project.videos ?? []).map((src) => ({ type: 'video' as const, src })),
  ];

  return (
    <Container className={styles.page}>
      <Link href="/projects" className={styles.back}>
        ← Back to projects
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.description}>{project.description}</p>
        <p className={styles.tags}>{project.tags.join(' · ')}</p>
        {project.externalUrl && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.external}
          >
            View source on GitHub →
          </a>
        )}
      </header>

      {project.content && (
        <ContentBlocks blocks={project.content} alt={project.title} />
      )}

      {galleryItems.length > 0 && (
        <section className={styles.gallery}>
          <h2 className={styles.galleryTitle}>Gallery</h2>
          <MediaCarousel items={galleryItems} alt={project.title} />
        </section>
      )}
    </Container>
  );
};

export default ProjectDetailPage;
