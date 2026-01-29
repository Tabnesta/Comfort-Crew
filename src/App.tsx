import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Header,
  Navigation,
  WelcomeScreen,
  ChatInterface,
  GroupChat,
  CheckInNotifications,
  HomePage,
  FriendsPage,
  ChatsPage,
  SettingsPage,
  useGenerateDailyCheckIns,
} from './components';
import { useStore } from './store/useStore';
import type { FriendId, UserProfile } from './types';

function App() {
  const {
    user,
    setUser,
    currentView,
  } = useStore();

  const [activeChatFriend, setActiveChatFriend] = useState<FriendId | null>(null);
  const [groupChatParticipants, setGroupChatParticipants] = useState<FriendId[] | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const generateCheckIns = useGenerateDailyCheckIns();

  // Initialize user if not set
  const handleWelcomeComplete = (name: string) => {
    const newUser: UserProfile = {
      name,
      createdAt: Date.now(),
      lastCheckIn: Date.now(),
      currentMood: null,
      moodHistory: [],
      favoriteFrequency: {} as Record<FriendId, number>,
      ongoingSituations: [],
    };
    setUser(newUser);
  };

  // Generate daily check-ins periodically
  useEffect(() => {
    if (user) {
      // Generate check-ins on first load
      generateCheckIns();

      // And periodically (every 30 minutes for demo purposes)
      const interval = setInterval(generateCheckIns, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle opening chat with a friend
  const handleOpenChat = (friendId: FriendId) => {
    setActiveChatFriend(friendId);
    setGroupChatParticipants(null);
  };

  // Handle opening group chat
  const handleOpenGroupChat = (friendIds: FriendId[]) => {
    setGroupChatParticipants(friendIds);
    setActiveChatFriend(null);
  };

  // Handle going back from chat
  const handleBackFromChat = () => {
    setActiveChatFriend(null);
    setGroupChatParticipants(null);
  };

  // Show welcome screen if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      </div>
    );
  }

  // Show chat interface if a friend is selected
  if (activeChatFriend) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <ChatInterface friendId={activeChatFriend} onBack={handleBackFromChat} />
      </div>
    );
  }

  // Show group chat if participants are selected
  if (groupChatParticipants && groupChatParticipants.length >= 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <GroupChat
          participantIds={groupChatParticipants}
          onBack={handleBackFromChat}
        />
      </div>
    );
  }

  // Main app view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <HomePage
                onOpenChat={handleOpenChat}
                onOpenGroupChat={handleOpenGroupChat}
              />
            </motion.div>
          )}

          {currentView === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <FriendsPage onOpenChat={handleOpenChat} />
            </motion.div>
          )}

          {currentView === 'chat' && (
            <motion.div
              key="chats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ChatsPage
                onOpenChat={handleOpenChat}
                onOpenGroupChat={handleOpenGroupChat}
              />
            </motion.div>
          )}

          {currentView === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <SettingsPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Navigation onOpenNotifications={() => setShowNotifications(true)} />

      <CheckInNotifications
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onOpenChat={(friendId) => {
          setShowNotifications(false);
          handleOpenChat(friendId);
        }}
      />
    </div>
  );
}

export default App;
