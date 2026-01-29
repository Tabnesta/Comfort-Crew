import { motion } from 'framer-motion';
import { MessageCircle, Heart, Sparkles } from 'lucide-react';
import type { Friend, FriendId } from '../types';
import { friends, getRelationshipLevel } from '../data/friends';
import { useStore } from '../store/useStore';

interface FriendCardProps {
  friend: Friend;
  onClick: () => void;
  isRecommended?: boolean;
  delay?: number;
}

export function FriendCard({ friend, onClick, isRecommended, delay = 0 }: FriendCardProps) {
  const conversations = useStore(state => state.conversations);
  const conversation = Object.values(conversations).find(
    c => c.friendId === friend.id && !c.isGroupChat
  );

  const totalMessages = conversation?.totalMessages || 0;
  const relationshipInfo = getRelationshipLevel(totalMessages);
  const relationshipPercent = conversation?.relationshipLevel || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative cursor-pointer"
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${friend.gradient} opacity-20 blur-xl`}
      />

      {/* Card content */}
      <div className={`relative bg-gradient-to-br ${friend.gradient} rounded-2xl p-6 overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute -right-8 -top-8 text-8xl opacity-20">
          {friend.avatar}
        </div>

        {/* Recommended badge */}
        {isRecommended && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1"
          >
            <Sparkles size={12} className="text-white" />
            <span className="text-xs text-white font-medium">Recommended</span>
          </motion.div>
        )}

        {/* Avatar and info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-5xl">{friend.avatar}</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{friend.name}</h3>
            <p className="text-white/80 text-sm">{friend.tagline}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {friend.description}
        </p>

        {/* Best for tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {friend.bestFor.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/20 rounded-full text-xs text-white"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Relationship indicator */}
        {totalMessages > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Heart size={14} className="text-white/70" />
                <span className="text-xs text-white/70">{relationshipInfo.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={14} className="text-white/70" />
                <span className="text-xs text-white/70">{totalMessages} messages</span>
              </div>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${relationshipPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-white/60 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Chat prompt */}
        <motion.div
          whileHover={{ x: 5 }}
          className="flex items-center gap-2 text-white mt-4"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-medium">Start chatting</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Compact card for group chat selection
export function FriendCardCompact({ friend, isSelected, onClick }: {
  friend: Friend;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        p-3 rounded-xl transition-all
        ${isSelected
          ? `bg-gradient-to-r ${friend.gradient}`
          : 'bg-white/5 hover:bg-white/10'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{friend.avatar}</span>
        <div className="text-left">
          <div className="font-medium text-white text-sm">{friend.name}</div>
          <div className="text-xs text-white/60">{friend.tagline}</div>
        </div>
      </div>
    </motion.button>
  );
}

// Avatar only for chat bubbles
export function FriendAvatar({ friendId, size = 'md' }: { friendId: FriendId; size?: 'sm' | 'md' | 'lg' }) {
  const friend = friends[friendId];

  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-10 h-10 text-xl',
    lg: 'w-14 h-14 text-3xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${friend.gradient} flex items-center justify-center`}
    >
      {friend.avatar}
    </div>
  );
}
