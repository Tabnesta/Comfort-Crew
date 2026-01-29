import { motion } from 'framer-motion';
import { Home, Users, MessageSquare, Settings, Bell, Sparkles } from 'lucide-react';
import { useStore, useUnreadCheckIns } from '../store/useStore';

type ViewType = 'home' | 'chat' | 'friends' | 'settings';

interface NavigationProps {
  onOpenNotifications: () => void;
}

export function Navigation({ onOpenNotifications }: NavigationProps) {
  const { currentView, setCurrentView } = useStore();
  const unreadCheckIns = useUnreadCheckIns();

  const navItems: { id: ViewType; icon: React.ReactNode; label: string }[] = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'friends', icon: <Users size={24} />, label: 'Friends' },
    { id: 'chat', icon: <MessageSquare size={24} />, label: 'Chats' },
    { id: 'settings', icon: <Settings size={24} />, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-white/10 px-4 py-2 z-30">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            isActive={currentView === item.id}
            onClick={() => setCurrentView(item.id)}
            icon={item.icon}
            label={item.label}
          />
        ))}

        {/* Notification button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-3 rounded-xl transition-colors text-white/60 hover:text-white hover:bg-white/10"
        >
          <Bell size={24} />
          {unreadCheckIns.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold"
            >
              {unreadCheckIns.length}
            </motion.span>
          )}
        </button>
      </div>
    </nav>
  );
}

function NavButton({
  isActive,
  onClick,
  icon,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative p-3 rounded-xl transition-colors ${
        isActive
          ? 'text-white bg-white/10'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
        />
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}

// Header component
export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-lg border-b border-white/10 px-4 py-4"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ComfortCrew</h1>
            <p className="text-xs text-white/60">Your AI friends</p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

// Welcome screen for new users
export function WelcomeScreen({ onComplete }: { onComplete: (name: string) => void }) {
  const [name, setName] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-8"
        >
          <Sparkles size={48} className="text-white" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white mb-4"
        >
          Welcome to ComfortCrew
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/60 mb-8"
        >
          A collection of AI friends ready to support you through any mood.
          They're here to listen, encourage, and be there for you.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What should we call you?"
            className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />

          <button
            onClick={() => name.trim() && onComplete(name.trim())}
            disabled={!name.trim()}
            className={`w-full py-4 rounded-full font-semibold transition-all ${
              name.trim()
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90'
                : 'bg-white/10 text-white/30'
            }`}
          >
            Meet Your Crew
          </button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-4 gap-4"
        >
          {['☀️', '🔥', '🌊', '💗'].map((emoji, index) => (
            <motion.div
              key={emoji}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, delay: index * 0.2, repeat: Infinity }}
              className="text-4xl"
            >
              {emoji}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
