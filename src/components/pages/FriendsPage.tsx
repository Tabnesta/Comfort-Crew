import { motion } from 'framer-motion';
import { Heart, MessageCircle, Star, TrendingUp } from 'lucide-react';
import { FriendCard } from '../FriendCard';
import { friends, getRelationshipLevel, friendRelationshipLevels } from '../../data/friends';
import { useStore } from '../../store/useStore';
import type { FriendId } from '../../types';

interface FriendsPageProps {
  onOpenChat: (friendId: FriendId) => void;
}

export function FriendsPage({ onOpenChat }: FriendsPageProps) {
  const { conversations } = useStore();

  // Calculate stats for each friend
  const friendStats = (Object.keys(friends) as FriendId[]).map(friendId => {
    const convo = Object.values(conversations).find(
      c => c.friendId === friendId && !c.isGroupChat
    );
    return {
      friendId,
      totalMessages: convo?.totalMessages || 0,
      relationshipLevel: convo?.relationshipLevel || 0,
      lastActive: convo?.lastActive || 0,
    };
  });

  // Sort by interaction
  const sortedFriends = [...friendStats].sort((a, b) => b.totalMessages - a.totalMessages);

  return (
    <div className="pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Your Crew</h1>
        <p className="text-white/60">Your AI friends are always here for you</p>
      </motion.div>

      {/* Relationship Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Heart size={20} className="text-pink-400" />
          <h2 className="text-lg font-semibold text-white">Friendship Progress</h2>
        </div>

        <div className="space-y-4">
          {sortedFriends.map((stat, index) => {
            const friend = friends[stat.friendId];
            const level = getRelationshipLevel(stat.totalMessages);

            return (
              <motion.div
                key={stat.friendId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${friend.gradient} flex items-center justify-center flex-shrink-0`}>
                  {friend.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white">{friend.name}</span>
                    <span className="text-xs text-white/60">{level.name}</span>
                  </div>

                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.relationshipLevel}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className={`h-full bg-gradient-to-r ${friend.gradient}`}
                    />
                  </div>

                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-white/40">
                      <MessageCircle size={10} className="inline mr-1" />
                      {stat.totalMessages} messages
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Relationship Level Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 mb-8"
      >
        <div className="flex items-center gap-2 mb-4">
          <Star size={20} className="text-yellow-400" />
          <h2 className="text-lg font-semibold text-white">Relationship Levels</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {friendRelationshipLevels.map((level) => (
            <div
              key={level.level}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                {level.level}
              </div>
              <div>
                <div className="font-medium text-white text-sm">{level.name}</div>
                <div className="text-xs text-white/50">{level.description}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* All Friends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-green-400" />
          <h2 className="text-lg font-semibold text-white">Meet Everyone</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(friends) as FriendId[]).map((friendId, index) => (
            <FriendCard
              key={friendId}
              friend={friends[friendId]}
              onClick={() => onOpenChat(friendId)}
              delay={index * 0.05}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
