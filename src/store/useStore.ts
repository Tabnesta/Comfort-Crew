import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Message, Conversation, UserProfile, DailyCheckIn, FriendId, MoodType } from '../types';
import { friends } from '../data/friends';

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user: UserProfile) => set({ user }),
      updateMood: (mood: MoodType) => {
        const user = get().user;
        if (user) {
          set({
            user: {
              ...user,
              currentMood: mood,
              moodHistory: [
                { mood, timestamp: Date.now() },
                ...user.moodHistory.slice(0, 29), // Keep last 30 moods
              ],
            },
            selectedMood: mood,
          });
        }
      },

      // Conversations
      conversations: {},
      activeConversationId: null,
      setActiveConversation: (id: string | null) => set({ activeConversationId: id }),

      addMessage: (conversationId: string, message: Message) => {
        const conversations = get().conversations;
        const conversation = conversations[conversationId];
        if (conversation) {
          const updatedConversation = {
            ...conversation,
            messages: [...conversation.messages, message],
            lastActive: Date.now(),
            totalMessages: conversation.totalMessages + (message.friendId === 'user' ? 0 : 1),
          };
          set({
            conversations: {
              ...conversations,
              [conversationId]: updatedConversation,
            },
          });

          // Update relationship level
          if (message.friendId !== 'user' && message.friendId !== 'system') {
            get().incrementRelationship(message.friendId, 1);
          }
        }
      },

      getOrCreateConversation: (friendId: FriendId) => {
        const conversations = get().conversations;

        // Find existing conversation with this friend
        const existingConvo = Object.values(conversations).find(
          c => c.friendId === friendId && !c.isGroupChat
        );

        if (existingConvo) {
          return existingConvo.id;
        }

        // Create new conversation
        const id = generateId();
        const newConversation: Conversation = {
          id,
          friendId,
          messages: [],
          lastActive: Date.now(),
          relationshipLevel: 0,
          totalMessages: 0,
        };

        set({
          conversations: {
            ...conversations,
            [id]: newConversation,
          },
        });

        return id;
      },

      createGroupChat: (friendIds: FriendId[]) => {
        const conversations = get().conversations;
        const id = generateId();

        const newGroupChat: Conversation = {
          id,
          friendId: friendIds[0], // Primary friend
          messages: [],
          lastActive: Date.now(),
          relationshipLevel: 0,
          totalMessages: 0,
          isGroupChat: true,
          participants: friendIds,
        };

        set({
          conversations: {
            ...conversations,
            [id]: newGroupChat,
          },
          activeConversationId: id,
        });

        return id;
      },

      incrementRelationship: (friendId: FriendId, amount: number) => {
        const conversations = get().conversations;
        const convo = Object.values(conversations).find(c => c.friendId === friendId && !c.isGroupChat);

        if (convo) {
          const newLevel = Math.min(100, convo.relationshipLevel + amount);
          set({
            conversations: {
              ...conversations,
              [convo.id]: {
                ...convo,
                relationshipLevel: newLevel,
              },
            },
          });
        }

        // Update favorite frequency
        const user = get().user;
        if (user) {
          set({
            user: {
              ...user,
              favoriteFrequency: {
                ...user.favoriteFrequency,
                [friendId]: (user.favoriteFrequency[friendId] || 0) + 1,
              },
            },
          });
        }
      },

      // Check-ins
      dailyCheckIns: [],
      addCheckIn: (checkIn: DailyCheckIn) => {
        set({ dailyCheckIns: [checkIn, ...get().dailyCheckIns.slice(0, 9)] });
      },
      markCheckInRead: (id: string) => {
        set({
          dailyCheckIns: get().dailyCheckIns.map(c =>
            c.id === id ? { ...c, read: true } : c
          ),
        });
      },

      // UI State
      currentView: 'home',
      setCurrentView: (view) => set({ currentView: view }),
      selectedMood: null,
      setSelectedMood: (mood) => set({ selectedMood: mood }),

      // Friend references
      friendMentions: {} as Record<FriendId, string[]>,
      addFriendMention: (fromFriend: FriendId, toFriend: FriendId, context: string) => {
        const mentions = get().friendMentions;
        const existing = mentions[toFriend] || [];
        set({
          friendMentions: {
            ...mentions,
            [toFriend]: [...existing, `${friends[fromFriend].name} mentioned: ${context}`],
          },
        });
      },
    }),
    {
      name: 'comfort-crew-storage',
    }
  )
);

// Helper hooks
export const useConversation = (conversationId: string | null) => {
  return useStore(state =>
    conversationId ? state.conversations[conversationId] : null
  );
};

export const useActiveConversation = () => {
  const activeId = useStore(state => state.activeConversationId);
  const conversations = useStore(state => state.conversations);
  return activeId ? conversations[activeId] : null;
};

export const useFriendConversations = (friendId: FriendId) => {
  const conversations = useStore(state => state.conversations);
  return Object.values(conversations).filter(c => c.friendId === friendId);
};

export const useUnreadCheckIns = () => {
  return useStore(state => state.dailyCheckIns.filter(c => !c.read));
};
