import { Metadata } from 'next';

import Container from '@/components/Container';
import MediaCarousel from '@/components/MediaCarousel';
import { stories } from '@/data/stories';

import styles from '@/styles/StoriesPage.module.css';

export const metadata: Metadata = {
  title: 'Stories',
  description:
    'Snapshots from Ibrahim Khadraoui — the desk, the boards, the builds between the projects.',
};

const StoriesPage = () => (
  <Container className={styles.page}>
    <header className={styles.header}>
      <h1 className={styles.title}>Stories</h1>
      <p className={styles.subtitle}>
        Snapshots between the projects — the desk, the boards, the builds.
      </p>
    </header>

    {stories.length === 0 ? (
      <p className={styles.empty}>Nothing here yet — check back soon.</p>
    ) : (
      <div className={styles.feed}>
        {stories.map((story) => (
          <article key={story.title} className={styles.story}>
            <p className={styles.date}>{story.date}</p>
            <h2 className={styles.storyTitle}>{story.title}</h2>
            {story.text && <p className={styles.text}>{story.text}</p>}
            {story.media.length > 0 && (
              <MediaCarousel items={story.media} alt={story.title} />
            )}
          </article>
        ))}
      </div>
    )}
  </Container>
);

export default StoriesPage;
