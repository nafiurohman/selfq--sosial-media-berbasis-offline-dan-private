export interface User {
  name: string;
  bio?: string;
  avatar?: string; // base64 encoded
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  data: string; // base64 encoded
  type: 'image' | 'video' | 'audio';
  dimension?: '4:5' | '1:1' | 'original'; // for images only
  duration?: number; // for audio/video in seconds
}

export interface Post {
  id: string;
  title?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  liked: boolean;
  image?: string; // base64 encoded image (legacy)
  imageDimension?: '4:5' | '1:1' | 'original'; // image aspect ratio (legacy)
  video?: string; // base64 encoded video (legacy)
  media?: MediaItem[]; // new multi-media support
  comments: Comment[];
  bookmarkCategory?: string; // null = not bookmarked
  archived?: boolean; // true = archived, hidden from feed
  // Shared post info
  sharedFrom?: {
    name: string;
    sharedAt: string;
  };
}

export interface BookmarkCategory {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

export interface Settings {
  id: string;
  theme: 'light' | 'dark';
  lastExport?: string;
  bookmarkCategories: BookmarkCategory[];
  hasAcceptedTerms?: boolean;
}

export interface ExportData {
  version: string;
  exportDate: string;
  encrypted: boolean;
  user: User;
  posts: Post[];
  settings: {
    theme: 'light' | 'dark';
    bookmarkCategories: BookmarkCategory[];
  };
}

export interface SharedPost {
  version: string;
  shareDate: string;
  encrypted: boolean;
  post: Post;
  sharedBy: string;
}
