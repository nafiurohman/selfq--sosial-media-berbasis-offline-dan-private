import type { Post } from './types';

export interface Stats {
  totalPosts: number;
  totalLikes: number;
  currentStreak: number;
  longestStreak: number;
}

export function calculateStats(posts: Post[]): Stats {
  const totalPosts = posts.length;
  const totalLikes = posts.filter(p => p.liked).length;

  // Calculate streak
  const { currentStreak, longestStreak } = calculateStreak(posts);

  return {
    totalPosts,
    totalLikes,
    currentStreak,
    longestStreak,
  };
}

function calculateStreak(posts: Post[]): { currentStreak: number; longestStreak: number } {
  if (posts.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Get unique days with posts (sorted DESC)
  const daysWithPosts = new Set<string>();
  posts.forEach(post => {
    const date = new Date(post.createdAt);
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    daysWithPosts.add(dayKey);
  });

  // Convert to sorted array of dates
  const sortedDays = Array.from(daysWithPosts)
    .map(key => {
      const [year, month, day] = key.split('-').map(Number);
      return new Date(year, month, day);
    })
    .sort((a, b) => b.getTime() - a.getTime());

  if (sortedDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Check if today or yesterday has a post
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const mostRecentPost = sortedDays[0];
  mostRecentPost.setHours(0, 0, 0, 0);

  // If most recent post is before yesterday, streak is 0
  if (mostRecentPost.getTime() < yesterday.getTime()) {
    return { currentStreak: 0, longestStreak: calculateLongestStreak(sortedDays) };
  }

  // Calculate current streak
  let currentStreak = 1;
  let checkDate = new Date(mostRecentPost);
  
  for (let i = 1; i < sortedDays.length; i++) {
    checkDate.setDate(checkDate.getDate() - 1);
    const nextDay = sortedDays[i];
    nextDay.setHours(0, 0, 0, 0);
    
    if (nextDay.getTime() === checkDate.getTime()) {
      currentStreak++;
    } else {
      break;
    }
  }

  const longestStreak = calculateLongestStreak(sortedDays);

  return { currentStreak, longestStreak: Math.max(currentStreak, longestStreak) };
}

function calculateLongestStreak(sortedDays: Date[]): number {
  if (sortedDays.length === 0) return 0;
  if (sortedDays.length === 1) return 1;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]);
    prev.setDate(prev.getDate() - 1);
    
    const curr = sortedDays[i];
    
    if (curr.getTime() === prev.getTime()) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}
