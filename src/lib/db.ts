import { openDB, type IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import type { Post, Settings, ExportData, Comment, BookmarkCategory, SharedPost, MediaItem } from './types';
import { getUser, getTheme } from './storage';
import { encryptData, decryptData, encryptSharedData, decryptSharedData } from './crypto';

const DB_NAME = 'SelfXDatabase';
const DB_VERSION = 3;

const DEFAULT_CATEGORIES: BookmarkCategory[] = [
  { id: 'important', name: 'Penting', color: '#EF4444', isDefault: true },
  { id: 'favorite', name: 'Favorit', color: '#F59E0B', isDefault: true },
  { id: 'later', name: 'Nanti dibaca', color: '#3B82F6', isDefault: true },
];

let dbInstance: IDBPDatabase | null = null;

export async function initDB(): Promise<IDBPDatabase> {
  if (dbInstance) return dbInstance;
  
  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      // Create posts store
      if (!db.objectStoreNames.contains('posts')) {
        const postsStore = db.createObjectStore('posts', { keyPath: 'id' });
        postsStore.createIndex('createdAt', 'createdAt');
        postsStore.createIndex('bookmarkCategory', 'bookmarkCategory');
      }
      
      // Create settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    },
  });
  
  // Initialize default settings if not exists
  const settings = await dbInstance.get('settings', 'app-settings');
  if (!settings) {
    await dbInstance.put('settings', {
      id: 'app-settings',
      theme: getTheme(),
      bookmarkCategories: DEFAULT_CATEGORIES,
    });
  } else if (!settings.bookmarkCategories) {
    await dbInstance.put('settings', {
      ...settings,
      bookmarkCategories: DEFAULT_CATEGORIES,
    });
  }
  
  return dbInstance;
}

// Migrate post if needed
function migratePost(post: any): Post {
  const migrated = {
    ...post,
    comments: post.comments || [],
    media: post.media || [],
  };
  
  // Migrate legacy single media to media array if needed
  if (!migrated.media.length && (post.image || post.video)) {
    if (post.image) {
      migrated.media.push({
        id: 'legacy-image',
        data: post.image,
        type: 'image' as const,
        dimension: post.imageDimension
      });
    }
    if (post.video) {
      migrated.media.push({
        id: 'legacy-video',
        data: post.video,
        type: 'video' as const
      });
    }
  }
  
  return migrated;
}

export async function getAllPosts(): Promise<Post[]> {
  const db = await initDB();
  const posts = await db.getAll('posts');
  // Sort by createdAt DESC and migrate
  return posts
    .map(migratePost)
    .sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function getPost(id: string): Promise<Post | null> {
  const db = await initDB();
  const post = await db.get('posts', id);
  return post ? migratePost(post) : null;
}

export async function addPost(
  content: string, 
  media?: MediaItem[], 
  title?: string
): Promise<Post> {
  const db = await initDB();
  const post: Post = {
    id: uuidv4(),
    title: title?.trim() || undefined,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    liked: false,
    media: media || [],
    // Legacy fields for backward compatibility
    image: media?.find(m => m.type === 'image')?.data,
    video: media?.find(m => m.type === 'video')?.data,
    imageDimension: media?.find(m => m.type === 'image')?.dimension,
    comments: [],
  };
  await db.add('posts', post);
  return post;
}

export async function updatePost(
  id: string, 
  updates: { 
    title?: string; 
    content?: string; 
    media?: MediaItem[];
    image?: string; 
    video?: string;
    imageDimension?: '4:5' | '1:1' | 'original';
  }
): Promise<Post | null> {
  const db = await initDB();
  const post = await db.get('posts', id);
  if (!post) return null;
  
  if (updates.title !== undefined) post.title = updates.title.trim() || undefined;
  if (updates.content !== undefined) post.content = updates.content.trim();
  if (updates.media !== undefined) {
    post.media = updates.media;
    // Update legacy fields for backward compatibility
    post.image = updates.media.find(m => m.type === 'image')?.data || undefined;
    post.video = updates.media.find(m => m.type === 'video')?.data || undefined;
    post.imageDimension = updates.media.find(m => m.type === 'image')?.dimension;
  }
  if (updates.image !== undefined) post.image = updates.image || undefined;
  if (updates.video !== undefined) post.video = updates.video || undefined;
  if (updates.imageDimension !== undefined) post.imageDimension = updates.imageDimension;
  post.updatedAt = new Date().toISOString();
  
  await db.put('posts', post);
  return migratePost(post);
}

export async function deletePost(id: string): Promise<void> {
  const db = await initDB();
  await db.delete('posts', id);
}

export async function toggleLike(id: string): Promise<Post | null> {
  const db = await initDB();
  const post = await db.get('posts', id);
  if (!post) return null;
  
  post.liked = !post.liked;
  await db.put('posts', post);
  return migratePost(post);
}

// Comments
export async function addComment(postId: string, content: string): Promise<Post | null> {
  const db = await initDB();
  const post = await db.get('posts', postId);
  if (!post) return null;
  
  const comment: Comment = {
    id: uuidv4(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };
  
  if (!post.comments) post.comments = [];
  post.comments.push(comment);
  await db.put('posts', post);
  return migratePost(post);
}

export async function deleteComment(postId: string, commentId: string): Promise<Post | null> {
  const db = await initDB();
  const post = await db.get('posts', postId);
  if (!post || !post.comments) return null;
  
  post.comments = post.comments.filter((c: Comment) => c.id !== commentId);
  await db.put('posts', post);
  return migratePost(post);
}

// Bookmarks
export async function setBookmark(postId: string, categoryId: string | null): Promise<Post | null> {
  const db = await initDB();
  const post = await db.get('posts', postId);
  if (!post) return null;
  
  post.bookmarkCategory = categoryId || undefined;
  await db.put('posts', post);
  return migratePost(post);
}

export async function getBookmarkedPosts(categoryId?: string): Promise<Post[]> {
  const db = await initDB();
  const posts = await db.getAll('posts');
  return posts
    .map(migratePost)
    .filter((p) => {
      if (!p.bookmarkCategory) return false;
      if (categoryId) return p.bookmarkCategory === categoryId;
      return true;
    })
    .sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

// Bookmark Categories
export async function getBookmarkCategories(): Promise<BookmarkCategory[]> {
  const db = await initDB();
  const settings = await db.get('settings', 'app-settings');
  return settings?.bookmarkCategories || DEFAULT_CATEGORIES;
}

export async function addBookmarkCategory(name: string, color: string): Promise<BookmarkCategory> {
  const db = await initDB();
  const settings = await db.get('settings', 'app-settings') || { id: 'app-settings', bookmarkCategories: [] };
  
  const category: BookmarkCategory = {
    id: uuidv4(),
    name: name.trim(),
    color,
    isDefault: false,
  };
  
  settings.bookmarkCategories = [...(settings.bookmarkCategories || []), category];
  await db.put('settings', settings);
  return category;
}

export async function deleteBookmarkCategory(categoryId: string): Promise<void> {
  const db = await initDB();
  const settings = await db.get('settings', 'app-settings');
  if (!settings) return;
  
  settings.bookmarkCategories = (settings.bookmarkCategories || []).filter(
    (c: BookmarkCategory) => c.id !== categoryId || c.isDefault
  );
  await db.put('settings', settings);
  
  // Remove bookmark from posts with this category
  const posts = await db.getAll('posts');
  for (const post of posts) {
    if (post.bookmarkCategory === categoryId) {
      post.bookmarkCategory = undefined;
      await db.put('posts', post);
    }
  }
}

export async function getSettings(): Promise<Settings | null> {
  const db = await initDB();
  return db.get('settings', 'app-settings');
}

export async function updateSettings(updates: Partial<Settings>): Promise<void> {
  const db = await initDB();
  const current = await db.get('settings', 'app-settings') || { id: 'app-settings' };
  await db.put('settings', { ...current, ...updates });
}

// Export with encryption
export async function exportAllData(): Promise<string> {
  const db = await initDB();
  const posts = await db.getAll('posts');
  const settings = await db.get('settings', 'app-settings');
  const user = getUser();
  
  if (!user) {
    throw new Error('No user data found');
  }
  
  const exportData: ExportData = {
    version: '2.0',
    exportDate: new Date().toISOString(),
    encrypted: true,
    user,
    posts: posts.map(migratePost),
    settings: {
      theme: settings?.theme || 'light',
      bookmarkCategories: settings?.bookmarkCategories || DEFAULT_CATEGORIES,
    },
  };
  
  // Update last export time
  await updateSettings({ lastExport: exportData.exportDate });
  
  // Encrypt the data
  return encryptData(exportData);
}

// Import with decryption
export async function importAllData(encryptedData: string): Promise<void> {
  // Decrypt the data
  const data = await decryptData<ExportData>(encryptedData);
  
  // Validate data structure
  if (!data.version || !data.user || !Array.isArray(data.posts)) {
    throw new Error('Invalid backup file format');
  }
  
  const db = await initDB();
  
  // Clear existing posts
  const existingPosts = await db.getAllKeys('posts');
  for (const key of existingPosts) {
    await db.delete('posts', key);
  }
  
  // Import posts
  for (const post of data.posts) {
    await db.put('posts', migratePost(post));
  }
  
  // Update settings
  if (data.settings) {
    await updateSettings({ 
      theme: data.settings.theme,
      bookmarkCategories: data.settings.bookmarkCategories || DEFAULT_CATEGORIES,
    });
  }
  
  // Update user in localStorage
  localStorage.setItem('selfx-user', JSON.stringify(data.user));
  if (data.settings?.theme) {
    localStorage.setItem('selfx-theme', data.settings.theme);
  }
}

// Share single post (encrypted with share signature)
export async function sharePost(postId: string): Promise<string> {
  const post = await getPost(postId);
  if (!post) throw new Error('Post not found');
  
  const user = getUser();
  
  const sharedData: SharedPost = {
    version: '1.0',
    shareDate: new Date().toISOString(),
    encrypted: true,
    post,
    sharedBy: user?.name || 'Unknown',
  };
  
  return encryptSharedData(sharedData);
}

// Import shared post with validation
export async function importSharedPost(encryptedData: string): Promise<Post> {
  const sharedData = await decryptSharedData<SharedPost>(encryptedData);
  
  if (!sharedData.version || !sharedData.post || !sharedData.encrypted) {
    throw new Error('Invalid shared post format');
  }
  
  const db = await initDB();
  
  // Create new post with new ID and shared info
  const newPost: Post = {
    ...sharedData.post,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    liked: false,
    comments: [],
    bookmarkCategory: undefined,
    sharedFrom: {
      name: sharedData.sharedBy,
      sharedAt: sharedData.shareDate,
    },
  };
  
  await db.add('posts', newPost);
  return newPost;
}

export async function clearAllData(): Promise<void> {
  const db = await initDB();
  
  // Clear posts
  const posts = await db.getAllKeys('posts');
  for (const key of posts) {
    await db.delete('posts', key);
  }
  
  // Clear settings
  await db.delete('settings', 'app-settings');
  
  // Clear localStorage
  localStorage.removeItem('selfx-user');
  localStorage.removeItem('selfx-theme');
  localStorage.removeItem('selfx-onboarded');
  localStorage.removeItem('selfx-terms-accepted');
}
