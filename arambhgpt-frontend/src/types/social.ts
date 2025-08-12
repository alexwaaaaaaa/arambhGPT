export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  tags: string[];
  createdAt: string;
  moderators: string[];
}

export interface GroupMessage {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  content: string;
  isAnonymous: boolean;
  reactions: {
    emoji: string;
    count: number;
    userIds: string[];
  }[];
  createdAt: string;
}

export interface MoodShare {
  id: string;
  userId: string;
  userName: string;
  mood: number;
  message?: string;
  isAnonymous: boolean;
  supportCount: number;
  createdAt: string;
}

export interface TherapistProfile {
  id: string;
  name: string;
  specialization: string[];
  experience: number;
  rating: number;
  isAvailable: boolean;
  languages: string[];
  sessionPrice: number;
  bio: string;
  profileImage?: string;
}

export interface SupportConnection {
  id: string;
  userId: string;
  connectionId: string;
  connectionName: string;
  relationship: 'family' | 'friend' | 'therapist' | 'peer';
  permissions: {
    viewMoodTrends: boolean;
    receiveAlerts: boolean;
    viewProgress: boolean;
  };
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: string;
}