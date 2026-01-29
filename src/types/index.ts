export type MoodType =
  | 'down'
  | 'anxious'
  | 'sad'
  | 'bored'
  | 'confused'
  | 'celebrating'
  | 'existential'
  | 'need-laugh';

export type FriendId =
  | 'sunny'
  | 'max'
  | 'river'
  | 'alex'
  | 'sam'
  | 'jordan'
  | 'morgan'
  | 'casey';

export interface Friend {
  id: FriendId;
  name: string;
  tagline: string;
  description: string;
  personality: string;
  bestFor: string[];
  moods: MoodType[];
  color: string;
  gradient: string;
  avatar: string;
  systemPrompt: string;
  greetings: string[];
  catchphrases: string[];
}

export interface Message {
  id: string;
  friendId: FriendId | 'user' | 'system';
  content: string;
  timestamp: number;
  isVoice?: boolean;
  voiceUrl?: string;
}

export interface Conversation {
  id: string;
  friendId: FriendId;
  messages: Message[];
  lastActive: number;
  relationshipLevel: number; // 0-100
  totalMessages: number;
  isGroupChat?: boolean;
  participants?: FriendId[];
}

export interface UserProfile {
  name: string;
  createdAt: number;
  lastCheckIn: number;
  currentMood: MoodType | null;
  moodHistory: {
    mood: MoodType;
    timestamp: number;
  }[];
  favoriteFrequency: Record<FriendId, number>;
  ongoingSituations: string[];
}

export interface DailyCheckIn {
  id: string;
  friendId: FriendId;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateMood: (mood: MoodType) => void;

  // Conversations
  conversations: Record<string, Conversation>;
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: Message) => void;
  getOrCreateConversation: (friendId: FriendId) => string;
  createGroupChat: (friendIds: FriendId[]) => string;
  incrementRelationship: (friendId: FriendId, amount: number) => void;

  // Check-ins
  dailyCheckIns: DailyCheckIn[];
  addCheckIn: (checkIn: DailyCheckIn) => void;
  markCheckInRead: (id: string) => void;

  // UI State
  currentView: 'home' | 'chat' | 'friends' | 'settings';
  setCurrentView: (view: 'home' | 'chat' | 'friends' | 'settings') => void;
  selectedMood: MoodType | null;
  setSelectedMood: (mood: MoodType | null) => void;

  // Friend references
  friendMentions: Record<FriendId, string[]>; // Tracks what friends know about from other friends
  addFriendMention: (fromFriend: FriendId, toFriend: FriendId, context: string) => void;
}

export interface Mood {
  id: MoodType;
  label: string;
  emoji: string;
  description: string;
  color: string;
  suggestedFriends: FriendId[];
}
