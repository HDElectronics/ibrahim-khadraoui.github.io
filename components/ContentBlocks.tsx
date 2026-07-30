import MediaCarousel from '@/components/MediaCarousel';
import { ContentBlock, MediaItem } from '@/types';

import styles from '@/styles/ContentBlocks.module.css';

function videoMimeType(src: string): string {
  const ext = src.split('.').pop()?.toLowerCase();
  if (ext === 'webm') return 'video/webm';
  if (ext === 'ogg' || ext === 'ogv') return 'video/ogg';
  return 'video/mp4';
}

interface ContentBlocksProps {
  blocks: ContentBlock[];
  alt: string;
}

type Group =
  | { kind: 'list'; items: string[] }
  | { kind: 'media'; items: MediaItem[] }
  | { kind: 'block'; block: ContentBlock };

function groupBlocks(blocks: ContentBlock[]): Group[] {
  const groups: Group[] = [];

  for (const block of blocks) {
    if (block.type === 'li') {
      const last = groups[groups.length - 1];
      if (last && last.kind === 'list') {
        last.items.push(block.text ?? '');
      } else {
        groups.push({ kind: 'list', items: [block.text ?? ''] });
      }
      continue;
    }

    if (block.type === 'img' || block.type === 'video') {
      if (!block.src) continue;
      const last = groups[groups.length - 1];
      if (last && last.kind === 'media') {
        last.items.push({ type: block.type, src: block.src });
      } else {
        groups.push({ kind: 'media', items: [{ type: block.type, src: block.src }] });
      }
      continue;
    }

    groups.push({ kind: 'block', block });
  }

  return groups;
}

const ContentBlocks = ({ blocks, alt }: ContentBlocksProps) => (
  <div className={styles.content}>
    {groupBlocks(blocks).map((group, index) => {
      if (group.kind === 'list') {
        return (
          <ul key={index} className={styles.list}>
            {group.items.map((item, itemIndex) => (
              <li key={itemIndex} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        );
      }

      if (group.kind === 'media') {
        if (group.items.length === 1) {
          const only = group.items[0];
          return only.type === 'video' ? (
            <video key={index} className={styles.media} controls preload="metadata" playsInline>
              <source src={only.src} type={videoMimeType(only.src)} />
            </video>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={index} src={only.src} alt={alt} className={styles.media} />
          );
        }
        return <MediaCarousel key={index} items={group.items} alt={alt} />;
      }

      const { block } = group;

      switch (block.type) {
        case 'h2':
          return (
            <h2 key={index} className={styles.h2}>
              {block.text}
            </h2>
          );
        case 'h3':
          return (
            <h3 key={index} className={styles.h3}>
              {block.text}
            </h3>
          );
        case 'h4':
          return (
            <h4 key={index} className={styles.h4}>
              {block.text}
            </h4>
          );
        case 'p':
        default:
          return (
            <p key={index} className={styles.p}>
              {block.text}
            </p>
          );
      }
    })}
  </div>
);

export default ContentBlocks;
