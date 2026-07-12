import Tab from '@/components/Tab';
import { getFileInfo } from '@/lib/files';

import styles from '@/styles/Tabsbar.module.css';

interface TabsbarProps {
  openTabs: string[];
  onCloseTab: (path: string) => void;
}

const Tabsbar = ({ openTabs, onCloseTab }: TabsbarProps) => {
  return (
    <div className={styles.tabs}>
      {openTabs.map((path) => {
        const file = getFileInfo(path);
        return (
          <Tab
            key={path}
            icon={file.icon}
            filename={file.name}
            path={path}
            onClose={onCloseTab}
          />
        );
      })}
    </div>
  );
};

export default Tabsbar;
