export type ProjectCategory = 'professional' | 'hardware' | 'hobby' | 'open-source';

export interface Project {
  title: string;
  description: string;
  hook?: string;
  link: string;
  slug: string;
  tags: string[];
  images: string[];
  videos?: string[];
  /** Lead media for cards and galleries; defaults to images[0]. */
  hero?: MediaItem;
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

export type SocialIcon = 'github' | 'linkedin' | 'mail' | 'link';

export interface SocialLink {
  label: string;
  url: string;
  icon: SocialIcon;
}

export interface Profile {
  name: string;
  tagline: string;
  shortBio: string;
  email: string;
  resumeUrl: string;
  socials: SocialLink[];
}

export interface ExperienceRole {
  title: string;
  period: string;
}

export interface ExperienceFocus {
  label: string;
  period?: string;
  bullets: string[];
}

export interface Experience {
  company: string;
  location: string;
  period: string;
  roles: ExperienceRole[];
  focuses: ExperienceFocus[];
  tags: string[];
}

export interface Education {
  degree: string;
  institution: string;
  date: string;
  detail?: string;
}

export interface Publication {
  title: string;
  venue: string;
  date: string;
  url?: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Hobby {
  title: string;
  text: string;
}

export interface About {
  bioParagraphs: string[];
  skillGroups: SkillGroup[];
  hobbies: Hobby[];
  languages: string[];
}

export interface MediaItem {
  type: 'img' | 'video';
  src: string;
}

export interface Story {
  title: string;
  date: string;
  text?: string;
  media: MediaItem[];
}
