export interface Profile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Shayari {
  id: string
  user_id: string
  content: string
  mood: string
  language: string
  is_pinned: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
  likes_count?: number
  comments_count?: number
  is_liked?: boolean
  is_saved?: boolean
}

export interface Like {
  id: string
  user_id: string
  shayari_id: string
  created_at: string
}

export interface Save {
  id: string
  user_id: string
  shayari_id: string
  created_at: string
}

export interface Comment {
  id: string
  user_id: string
  shayari_id: string
  content: string
  created_at: string
  profiles?: Profile
}

export interface Follower {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  actor_id: string | null
  type: 'like' | 'comment' | 'follow'
  shayari_id: string | null
  is_read: boolean
  created_at: string
  actor?: Profile
  shayari?: Shayari
}

export const MOODS = [
  { value: 'romantic', label: 'Romantic', emoji: 'heart' },
  { value: 'sad', label: 'Sad', emoji: 'tear' },
  { value: 'inspirational', label: 'Inspirational', emoji: 'star' },
  { value: 'philosophical', label: 'Philosophical', emoji: 'thought' },
  { value: 'funny', label: 'Funny', emoji: 'smile' },
  { value: 'patriotic', label: 'Patriotic', emoji: 'flag' },
  { value: 'spiritual', label: 'Spiritual', emoji: 'peace' },
  { value: 'nature', label: 'Nature', emoji: 'leaf' },
] as const

export const LANGUAGES = [
  { value: 'hindi', label: 'Hindi' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'english', label: 'English' },
  { value: 'punjabi', label: 'Punjabi' },
] as const

export type Mood = typeof MOODS[number]['value']
export type Language = typeof LANGUAGES[number]['value']
