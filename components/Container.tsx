import styles from '@/styles/Container.module.css';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => (
  <div className={className ? `${styles.container} ${className}` : styles.container}>
    {children}
  </div>
);

export default Container;
