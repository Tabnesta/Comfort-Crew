import { useState, useEffect, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
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

// Error Boundary Component to catch crashes
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">😅</div>
            <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
            <p className="text-white/60 mb-6">
              Don't worry, we can fix this by clearing the app data.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('comfort-crew-storage');
                window.location.reload();
              }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Reset App & Reload
            </button>
            <p className="text-white/40 text-sm mt-4">
              Error: {this.state.error?.message}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
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
      // Small delay to ensure state is ready
      const timeout = setTimeout(() => {
        try {
          generateCheckIns();
        } catch (e) {
          console.error('Error generating check-ins:', e);
        }
      }, 500);

      // And periodically (every 30 minutes for demo purposes)
      const interval = setInterval(() => {
        try {
          generateCheckIns();
        } catch (e) {
          console.error('Error generating check-ins:', e);
        }
      }, 30 * 60 * 1000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [user?.name]); // Only depend on user.name to avoid unnecessary reruns

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

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
