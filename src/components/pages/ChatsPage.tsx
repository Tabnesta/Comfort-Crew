import { motion } from 'framer-motion';
import { MessageCircle, Users, Clock, ChevronRight } from 'lucide-react';
import { friends } from '../../data/friends';
import { useStore } from '../../store/useStore';
import type { FriendId } from '../../types';

interface ChatsPageProps {
  onOpenChat: (friendId: FriendId) => void;
  onOpenGroupChat: (friendIds: FriendId[]) => void;
}

export function ChatsPage({ onOpenChat, onOpenGroupChat }: ChatsPageProps) {
  const { conversations } = useStore();

  // Get all conversations sorted by last active
  const sortedConversations = Object.values(conversations)
    .filter(c => c.messages.length > 0)
    .sort((a, b) => b.lastActive - a.lastActive);

  const individualChats = sortedConversations.filter(c => !c.isGroupChat);
  const groupChats = sortedConversations.filter(c => c.isGroupChat);

  return (
    <div className="pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Conversations</h1>
        <p className="text-white/60">Your recent chats with friends</p>
      </motion.div>

      {sortedConversations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <MessageCircle size={64} className="text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No conversations yet</h3>
          <p className="text-white/60 mb-6">
            Start chatting with a friend to see your conversations here
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {(['sunny', 'max', 'river'] as FriendId[]).map(friendId => (
              <button
                key={friendId}
                onClick={() => onOpenChat(friendId)}
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${friends[friendId].gradient} text-white font-medium`}
              >
                Chat with {friends[friendId].name}
              </button>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Group Chats */}
          {groupChats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Group Chats</h2>
              </div>

              <div className="space-y-3">
                {groupChats.map((convo, index) => {
                  const participants = convo.participants || [convo.friendId];
                  const lastMessage = convo.messages[convo.messages.length - 1];

                  return (
                    <motion.button
                      key={convo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onOpenGroupChat(participants)}
                      className="w-full glass-panel p-4 flex items-center gap-4 hover:bg-white/20 transition-colors text-left"
                    >
                      {/* Stacked avatars */}
                      <div className="flex items-center -space-x-2">
                        {participants.slice(0, 3).map((friendId, i) => (
                          <div
                            key={friendId}
                            className={`w-10 h-10 rounded-full bg-gradient-to-r ${friends[friendId].gradient} flex items-center justify-center border-2 border-slate-900`}
                            style={{ zIndex: 3 - i }}
                          >
                            {friends[friendId].avatar}
                          </div>
                        ))}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">
                          {participants.map(id => friends[id].name).join(', ')}
                        </div>
                        {lastMessage && (
                          <div className="text-sm text-white/60 truncate">
                            {lastMessage.friendId !== 'user' && lastMessage.friendId !== 'system'
                              ? `${friends[lastMessage.friendId as FriendId].name}: `
                              : 'You: '}
                            {lastMessage.content}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-white/40">
                          {formatTimeAgo(convo.lastActive)}
                        </span>
                        <ChevronRight size={16} className="text-white/40" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Individual Chats */}
          {individualChats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle size={18} className="text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Direct Messages</h2>
              </div>

              <div className="space-y-3">
                {individualChats.map((convo, index) => {
                  const friend = friends[convo.friendId];
                  const lastMessage = convo.messages[convo.messages.length - 1];

                  return (
                    <motion.button
                      key={convo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => onOpenChat(convo.friendId)}
                      className="w-full glass-panel p-4 flex items-center gap-4 hover:bg-white/20 transition-colors text-left"
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${friend.gradient} flex items-center justify-center`}>
                        {friend.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{friend.name}</span>
                          <span className="text-xs text-white/40">{friend.tagline}</span>
                        </div>
                        {lastMessage && (
                          <div className="text-sm text-white/60 truncate">
                            {lastMessage.friendId === 'user' ? 'You: ' : ''}
                            {lastMessage.content}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-white/40">
                          {formatTimeAgo(convo.lastActive)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-white/30" />
                          <span className="text-xs text-white/30">
                            {convo.totalMessages} msgs
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
