'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { VscClose } from 'react-icons/vsc';

import styles from '@/styles/Tab.module.css';

interface TabProps {
  icon: string;
  filename: string;
  path: string;
  onClose?: (path: string) => void;
}

const Tab = ({ icon, filename, path, onClose }: TabProps) => {
  const pathname = usePathname();

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose?.(path);
  };

  const handleAuxClick = (e: React.MouseEvent) => {
    // middle-click closes the tab, like VSCode
    if (e.button === 1) {
      handleClose(e);
    }
  };

  return (
    <Link href={path} onAuxClick={handleAuxClick}>
      <div
        className={`${styles.tab} ${pathname === path ? styles.active : ''}`}
      >
        <Image src={icon} alt={filename} height={16} width={16} />
        <p>{filename}</p>
        {onClose && (
          <button
            className={styles.close}
            onClick={handleClose}
            aria-label={`Close ${filename}`}
            title="Close"
          >
            <VscClose size={16} />
          </button>
        )}
      </div>
    </Link>
  );
};

export default Tab;
