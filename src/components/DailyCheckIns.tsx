import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, MessageCircle, ChevronRight } from 'lucide-react';
import type { FriendId, DailyCheckIn } from '../types';
import { friends } from '../data/friends';
import { useStore, useUnreadCheckIns } from '../store/useStore';
import { generateDailyCheckIn } from '../utils/ai';

interface DailyCheckInsProps {
  onOpenChat: (friendId: FriendId) => void;
}

export function DailyCheckIns({ onOpenChat }: DailyCheckInsProps) {
  const unreadCheckIns = useUnreadCheckIns();
  const { markCheckInRead } = useStore();

  if (unreadCheckIns.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Bell size={18} className="text-white/60" />
        <h3 className="text-white/60 text-sm font-medium">New messages from friends</h3>
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {unreadCheckIns.length}
        </span>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {unreadCheckIns.map((checkIn, index) => (
            <CheckInCard
              key={checkIn.id}
              checkIn={checkIn}
              onOpen={() => {
                markCheckInRead(checkIn.id);
                onOpenChat(checkIn.friendId);
              }}
              onDismiss={() => markCheckInRead(checkIn.id)}
              delay={index * 0.1}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function CheckInCard({
  checkIn,
  onOpen,
  onDismiss,
  delay = 0,
}: {
  checkIn: DailyCheckIn;
  onOpen: () => void;
  onDismiss: () => void;
  delay?: number;
}) {
  const friend = friends[checkIn.friendId];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay }}
      className={`relative bg-gradient-to-r ${friend.gradient} rounded-xl overflow-hidden`}
    >
      <div className="p-4 flex items-start gap-3">
        <div className="text-3xl">{friend.avatar}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{friend.name}</span>
            <span className="text-white/60 text-xs">
              {formatTimeAgo(checkIn.timestamp)}
            </span>
          </div>
          <p className="text-white/90 text-sm line-clamp-2">{checkIn.message}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={14} className="text-white" />
          </button>
        </div>
      </div>

      <button
        onClick={onOpen}
        className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
      >
        <MessageCircle size={14} className="text-white" />
        <span className="text-white text-sm font-medium">Reply to {friend.name}</span>
        <ChevronRight size={14} className="text-white" />
      </button>
    </motion.div>
  );
}

// Check-in notifications panel
export function CheckInNotifications({
  isOpen,
  onClose,
  onOpenChat,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: (friendId: FriendId) => void;
}) {
  const { dailyCheckIns, markCheckInRead } = useStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900/95 backdrop-blur-lg border-l border-white/10 z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={20} className="text-white" />
                  <h2 className="text-lg font-semibold text-white">Notifications</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {dailyCheckIns.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell size={48} className="text-white/20 mx-auto mb-4" />
                    <p className="text-white/40">No notifications yet</p>
                    <p className="text-white/30 text-sm mt-1">
                      Your friends will check in on you daily
                    </p>
                  </div>
                ) : (
                  dailyCheckIns.map((checkIn) => (
                    <NotificationItem
                      key={checkIn.id}
                      checkIn={checkIn}
                      onOpen={() => {
                        markCheckInRead(checkIn.id);
                        onOpenChat(checkIn.friendId);
                        onClose();
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function NotificationItem({
  checkIn,
  onOpen,
}: {
  checkIn: DailyCheckIn;
  onOpen: () => void;
}) {
  const friend = friends[checkIn.friendId];

  return (
    <button
      onClick={onOpen}
      className={`w-full text-left p-4 rounded-xl transition-all ${
        checkIn.read
          ? 'bg-white/5 hover:bg-white/10'
          : `bg-gradient-to-r ${friend.gradient} bg-opacity-20`
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${friend.gradient} flex items-center justify-center`}>
          {friend.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-medium ${checkIn.read ? 'text-white/70' : 'text-white'}`}>
              {friend.name}
            </span>
            {!checkIn.read && (
              <span className="w-2 h-2 bg-blue-400 rounded-full" />
            )}
          </div>
          <p className={`text-sm line-clamp-2 ${checkIn.read ? 'text-white/50' : 'text-white/80'}`}>
            {checkIn.message}
          </p>
          <span className="text-xs text-white/40 mt-1 block">
            {formatTimeAgo(checkIn.timestamp)}
          </span>
        </div>
      </div>
    </button>
  );
}

// Generate check-ins for demo purposes
export function useGenerateDailyCheckIns() {
  const { addCheckIn, user, dailyCheckIns } = useStore();

  const generateCheckIns = () => {
    // Get most used friends
    const frequencyEntries = Object.entries(user?.favoriteFrequency || {});
    const topFriends = frequencyEntries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id as FriendId);

    // Add some variety
    const allFriends = Object.keys(friends) as FriendId[];
    const randomFriend = allFriends[Math.floor(Math.random() * allFriends.length)];

    const friendsToCheckIn = [...new Set([...topFriends, randomFriend])].slice(0, 2);

    friendsToCheckIn.forEach((friendId, index) => {
      // Check if we already have a recent check-in from this friend
      const recentCheckIn = dailyCheckIns.find(
        c => c.friendId === friendId &&
        Date.now() - c.timestamp < 8 * 60 * 60 * 1000 // 8 hours
      );

      if (!recentCheckIn) {
        setTimeout(() => {
          const message = generateDailyCheckIn(friendId);
          addCheckIn({
            id: `${friendId}-${Date.now()}`,
            friendId,
            message,
            timestamp: Date.now(),
            read: false,
          });
        }, index * 1000);
      }
    });
  };

  return generateCheckIns;
}

// Helper function
function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
