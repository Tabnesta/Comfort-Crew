import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles, TrendingUp } from 'lucide-react';
import { MoodSelector } from '../MoodSelector';
import { FriendCard } from '../FriendCard';
import { DailyCheckIns } from '../DailyCheckIns';
import { GroupChatCreator } from '../GroupChat';
import { friends, moods, getFriendsForMood } from '../../data/friends';
import { useStore } from '../../store/useStore';
import type { FriendId, MoodType } from '../../types';

interface HomePageProps {
  onOpenChat: (friendId: FriendId) => void;
  onOpenGroupChat: (friendIds: FriendId[]) => void;
}

export function HomePage({ onOpenChat, onOpenGroupChat }: HomePageProps) {
  const { user, selectedMood, setSelectedMood, conversations } = useStore();
  const [showGroupCreator, setShowGroupCreator] = useState(false);

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  const suggestedFriends = selectedMood
    ? getFriendsForMood(selectedMood)
    : [];

  // Get user's top friends based on interaction
  const topFriends = Object.values(conversations)
    .filter(c => !c.isGroupChat)
    .sort((a, b) => b.totalMessages - a.totalMessages)
    .slice(0, 3)
    .map(c => c.friendId);

  return (
    <div className="pb-24">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Hey{user?.name ? `, ${user.name}` : ''}! 👋
        </h1>
        <p className="text-white/60">How can your crew help you today?</p>
      </motion.div>

      {/* Daily Check-ins */}
      <DailyCheckIns onOpenChat={onOpenChat} />

      {/* Mood Selector */}
      <div className="mb-8">
        <MoodSelector onMoodSelect={handleMoodSelect} />
      </div>

      {/* Suggested Friends based on mood */}
      {selectedMood && suggestedFriends.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-purple-400" />
            <h2 className="text-lg font-semibold text-white">
              Recommended for {moods.find(m => m.id === selectedMood)?.label}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedFriends.map((friendId, index) => (
              <FriendCard
                key={friendId}
                friend={friends[friendId]}
                onClick={() => onOpenChat(friendId)}
                isRecommended={index === 0}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Top Friends */}
      {topFriends.length > 0 && !selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-green-400" />
            <h2 className="text-lg font-semibold text-white">Your Closest Friends</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topFriends.map((friendId, index) => (
              <FriendCard
                key={friendId}
                friend={friends[friendId]}
                onClick={() => onOpenChat(friendId)}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowGroupCreator(true)}
            className="glass-panel p-4 flex items-center gap-3 hover:bg-white/20 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Group Chat</div>
              <div className="text-xs text-white/60">Talk to multiple friends</div>
            </div>
          </button>

          <button
            onClick={() => onOpenChat('casey')}
            className="glass-panel p-4 flex items-center gap-3 hover:bg-white/20 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center">
              <span className="text-2xl">😄</span>
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Need a Laugh</div>
              <div className="text-xs text-white/60">Chat with Casey</div>
            </div>
          </button>

          <button
            onClick={() => onOpenChat('river')}
            className="glass-panel p-4 flex items-center gap-3 hover:bg-white/20 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <span className="text-2xl">🧘</span>
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Calm Down</div>
              <div className="text-xs text-white/60">Chat with River</div>
            </div>
          </button>

          <button
            onClick={() => onOpenChat('max')}
            className="glass-panel p-4 flex items-center gap-3 hover:bg-white/20 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center">
              <span className="text-2xl">🎉</span>
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Celebrate</div>
              <div className="text-xs text-white/60">Chat with Max</div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* All Friends Preview */}
      {!selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-white mb-4">Meet Your Crew</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(friends) as FriendId[]).map((friendId, index) => (
              <motion.button
                key={friendId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenChat(friendId)}
                className={`p-4 rounded-xl bg-gradient-to-br ${friends[friendId].gradient} text-center`}
              >
                <div className="text-4xl mb-2">{friends[friendId].avatar}</div>
                <div className="font-medium text-white">{friends[friendId].name}</div>
                <div className="text-xs text-white/70">{friends[friendId].tagline}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Group Chat Creator Modal */}
      {showGroupCreator && (
        <GroupChatCreator
          onCreateGroup={(friendIds) => {
            setShowGroupCreator(false);
            onOpenGroupChat(friendIds);
          }}
          onCancel={() => setShowGroupCreator(false)}
        />
      )}
    </div>
  );
}
