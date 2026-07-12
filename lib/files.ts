export interface FileInfo {
  name: string;
  path: string;
  icon: string;
}

export const PORTFOLIO_FILES: FileInfo[] = [
  {
    name: 'home.tsx',
    path: '/',
    icon: '/logos/react_icon.svg',
  },
  {
    name: 'about.html',
    path: '/about',
    icon: '/logos/html_icon.svg',
  },
  {
    name: 'contact.css',
    path: '/contact',
    icon: '/logos/css_icon.svg',
  },
  {
    name: 'projects.js',
    path: '/projects',
    icon: '/logos/js_icon.svg',
  },
  {
    name: 'articles.json',
    path: '/articles',
    icon: '/logos/json_icon.svg',
  },
  {
    name: 'github.md',
    path: '/github',
    icon: '/logos/markdown_icon.svg',
  },
  {
    name: 'awards.md',
    path: '/awards',
    icon: '/logos/markdown_icon.svg',
  },
];

const EXTRA_FILES: FileInfo[] = [
  {
    name: 'settings.json',
    path: '/settings',
    icon: '/logos/json_icon.svg',
  },
];

export function getFileInfo(path: string): FileInfo {
  const known = [...PORTFOLIO_FILES, ...EXTRA_FILES].find(
    (file) => file.path === path
  );
  if (known) return known;

  const segments = path.split('/').filter(Boolean);
  const slug = segments[segments.length - 1] ?? 'file';
  return {
    name: `${slug}.md`,
    path,
    icon: '/logos/markdown_icon.svg',
  };
}
