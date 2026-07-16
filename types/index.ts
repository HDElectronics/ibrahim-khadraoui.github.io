export interface Article {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  url: string;
  page_views_count: number;
  public_reactions_count: number;
  comments_count: number;
}

export type ProjectCategory = 'professional' | 'hardware' | 'hobby' | 'open-source';

export interface Project {
  title: string;
  description: string;
  hook?: string;
  logo: string;
  link: string;
  slug: string;
  tags: string[];
  images: string[];
  videos?: string[];
  category?: ProjectCategory;
  content?: ContentBlock[];
  comingSoon?: boolean;
  externalUrl?: string;
}

export interface Award {
  title: string;
  organization: string;
  date: string;
  description: string;
  project?: string;
  images: string[];
  videos?: string[];
}

export interface ContentBlock {
  type: 'h2' | 'h3' | 'h4' | 'p' | 'li' | 'img' | 'video';
  text?: string;
  src?: string;
}

export interface WPArticle {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: string;
  images: string[];
  content: ContentBlock[];
}

export interface Repo {
  id: number;
  name: string;
  description: string;
  language: string;
  watchers: number;
  forks: number;
  stargazers_count: number;
  html_url: string;
  homepage: string;
}

export interface User {
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
}
