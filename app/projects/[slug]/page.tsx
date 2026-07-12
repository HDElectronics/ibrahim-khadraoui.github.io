import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { VscArrowLeft } from 'react-icons/vsc';

import { projects } from '@/data/projects';

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
  return { title: project?.title ?? 'Project' };
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Link href="/projects" className={styles.back}>
          <VscArrowLeft size={14} />
          <span>Back to Projects</span>
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.description}>{project.description}</p>
          <div className={styles.tags}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </header>

        {project.images.length > 0 && (
          <div className={styles.gallery}>
            {project.images.map((src) => (
              <div key={src} className={styles.imageWrapper}>
                <Image
                  src={src}
                  alt={project.title}
                  width={600}
                  height={450}
                  className={styles.image}
                />
              </div>
            ))}
          </div>
        )}

        {project.videos && project.videos.length > 0 && (
          <div className={styles.videos}>
            {project.videos.map((src) => (
              <video
                key={src}
                className={styles.video}
                controls
                preload="metadata"
                playsInline
              >
                <source src={src} type="video/mp4" />
              </video>
            ))}
          </div>
        )}

        {project.content && (
          <div className={styles.content}>
            {project.content.map((block, index) => {
              switch (block.type) {
                case 'h2':
                  return (
                    <h2 key={index} className={styles.blockH2}>
                      {block.text}
                    </h2>
                  );
                case 'h3':
                  return (
                    <h3 key={index} className={styles.blockH3}>
                      {block.text}
                    </h3>
                  );
                case 'h4':
                  return (
                    <h4 key={index} className={styles.blockH4}>
                      {block.text}
                    </h4>
                  );
                case 'li':
                  return (
                    <p key={index} className={styles.blockLi}>
                      {block.text}
                    </p>
                  );
                case 'img':
                  return block.src ? (
                    <div key={index} className={styles.imageWrapper}>
                      <Image
                        src={block.src}
                        alt={project.title}
                        width={600}
                        height={450}
                        className={styles.image}
                      />
                    </div>
                  ) : null;
                case 'p':
                default:
                  return (
                    <p key={index} className={styles.blockP}>
                      {block.text}
                    </p>
                  );
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
