import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Users, Plus, X } from 'lucide-react';
import type { FriendId, Message } from '../types';
import { friends } from '../data/friends';
import { useStore } from '../store/useStore';
import { generateFriendResponse, createMessage } from '../utils/ai';
import { FriendCardCompact } from './FriendCard';

interface GroupChatProps {
  participantIds: FriendId[];
  onBack: () => void;
  onAddFriend?: () => void;
}

export function GroupChat({ participantIds, onBack, onAddFriend }: GroupChatProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState<FriendId | null>(null);
  const [streamedResponse, setStreamedResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    createGroupChat,
    setActiveConversation,
    addMessage,
    conversations,
    activeConversationId,
    friendMentions,
    addFriendMention,
  } = useStore();

  // Get or create group conversation
  useEffect(() => {
    if (participantIds.length >= 2) {
      const existingGroup = Object.values(conversations).find(
        c => c.isGroupChat &&
        c.participants?.length === participantIds.length &&
        participantIds.every(id => c.participants?.includes(id))
      );

      if (existingGroup) {
        setActiveConversation(existingGroup.id);
      } else {
        const newId = createGroupChat(participantIds);
        setActiveConversation(newId);
      }
    }
  }, [participantIds.join(',')]);

  const conversation = activeConversationId ? conversations[activeConversationId] : null;
  const messages = conversation?.messages || [];

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedResponse]);

  // Send initial group greeting
  useEffect(() => {
    if (conversation && messages.length === 0 && participantIds.length >= 2) {
      const secondFriend = friends[participantIds[1]];

      const groupGreeting = createMessage(
        participantIds[0],
        `Hey! ${secondFriend.name} and I are both here. What's going on?`
      );
      addMessage(conversation.id, groupGreeting);

      setTimeout(() => {
        const secondGreeting = createMessage(
          participantIds[1],
          getGroupGreeting(participantIds[1], participantIds[0])
        );
        addMessage(conversation.id, secondGreeting);
      }, 1500);
    }
  }, [conversation?.id]);

  const handleSend = async () => {
    if (!input.trim() || !conversation) return;

    const userMessage = createMessage('user', input.trim());
    addMessage(conversation.id, userMessage);
    setInput('');

    // Each friend responds in turn
    for (const friendId of participantIds) {
      setIsTyping(friendId);
      setStreamedResponse('');

      // Random delay between friends
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      try {
        // Build context with other friends' messages
        const otherFriendMessages = messages
          .filter(m => m.friendId !== 'user' && m.friendId !== friendId)
          .slice(-3);

        // Add cross-references
        otherFriendMessages.forEach(m => {
          if (m.friendId !== 'user' && m.friendId !== 'system') {
            addFriendMention(m.friendId as FriendId, friendId, m.content.slice(0, 100));
          }
        });

        const response = await generateFriendResponse(
          friendId,
          input.trim(),
          conversation,
          friendMentions,
          (chunk) => setStreamedResponse(chunk)
        );

        setIsTyping(null);
        setStreamedResponse('');

        const friendMessage = createMessage(friendId, response);
        addMessage(conversation.id, friendMessage);

        // Random chance for a friend to not respond
        if (Math.random() > 0.7 && participantIds.indexOf(friendId) > 0) {
          break;
        }
      } catch (error) {
        console.error('Error generating response:', error);
        setIsTyping(null);
        setStreamedResponse('');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4"
      >
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-white" />
              <h2 className="text-xl font-bold text-white">Group Chat</h2>
            </div>
            <p className="text-white/80 text-sm">
              {participantIds.map(id => friends[id].name).join(', ')}
            </p>
          </div>

          {onAddFriend && (
            <button
              onClick={onAddFriend}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <Plus size={20} className="text-white" />
            </button>
          )}
        </div>

        {/* Participant avatars */}
        <div className="flex items-center gap-2">
          {participantIds.map((id, index) => (
            <motion.div
              key={id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`w-10 h-10 rounded-full bg-gradient-to-r ${friends[id].gradient} flex items-center justify-center border-2 border-white/30`}
              style={{ marginLeft: index > 0 ? '-8px' : 0 }}
            >
              {friends[id].avatar}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <AnimatePresence>
          {messages.map((message, index) => (
            <GroupMessageBubble
              key={message.id}
              message={message}
              delay={index * 0.05}
            />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${friends[isTyping].gradient} flex items-center justify-center`}>
              {friends[isTyping].avatar}
            </div>
            <div className="message-bubble friend">
              {streamedResponse || (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/60">{friends[isTyping].name} is typing</span>
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-white/60 rounded-full"
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 bg-white/5 backdrop-blur-lg border-t border-white/10"
      >
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message the group..."
            className="chat-input"
            disabled={!!isTyping}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || !!isTyping}
            className={`p-3 rounded-full transition-all ${
              input.trim() && !isTyping
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white/10 text-white/30'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Group message bubble
function GroupMessageBubble({
  message,
  delay = 0,
}: {
  message: Message;
  delay?: number;
}) {
  const isUser = message.friendId === 'user';
  const friend = !isUser && message.friendId !== 'system' ? friends[message.friendId as FriendId] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {friend && (
        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${friend.gradient} flex items-center justify-center flex-shrink-0`}>
          {friend.avatar}
        </div>
      )}

      <div className="flex flex-col gap-1">
        {friend && (
          <span className="text-xs text-white/50 ml-1">{friend.name}</span>
        )}
        <div className={`message-bubble ${isUser ? 'user' : 'friend'}`}>
          {message.content}
        </div>
      </div>

      <span className="text-xs text-white/30 self-end">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </motion.div>
  );
}

// Group greeting helpers
function getGroupGreeting(friendId: FriendId, otherFriendId: FriendId): string {
  const greetings: Record<FriendId, (other: string) => string> = {
    sunny: (other) => `Hi! ${other} and I make a great team. We're both here for you!`,
    max: (other) => `YESS! Double the support! ${other} and I got you!!`,
    river: (other) => `Hello. ${other} and I are here. Take your time.`,
    alex: (other) => `Hey. ${other}'s here too. Between us, we'll figure this out.`,
    sam: (other) => `Oh honey, ${other} told me you might need us. We're both here.`,
    jordan: (other) => `This is gonna be fun! ${other} and I have so many ideas!`,
    morgan: (other) => `Interesting. ${other} and I bring different perspectives. Let's explore together.`,
    casey: (other) => `Oh nice, a party! ${other} is great but I'm funnier. Just saying.`,
  };

  return greetings[friendId](friends[otherFriendId].name);
}

// Group chat creator component
export function GroupChatCreator({
  onCreateGroup,
  onCancel,
}: {
  onCreateGroup: (friendIds: FriendId[]) => void;
  onCancel: () => void;
}) {
  const [selectedFriends, setSelectedFriends] = useState<FriendId[]>([]);

  const toggleFriend = (friendId: FriendId) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(prev => prev.filter(id => id !== friendId));
    } else if (selectedFriends.length < 4) {
      setSelectedFriends(prev => [...prev, friendId]);
    }
  };

  const allFriendIds = Object.keys(friends) as FriendId[];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Create Group Chat</h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        <p className="text-white/60 text-sm mb-4">
          Select 2-4 friends to chat with together
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {allFriendIds.map(friendId => (
            <FriendCardCompact
              key={friendId}
              friend={friends[friendId]}
              isSelected={selectedFriends.includes(friendId)}
              onClick={() => toggleFriend(friendId)}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onCreateGroup(selectedFriends)}
            disabled={selectedFriends.length < 2}
            className={`flex-1 py-3 rounded-full font-medium transition-all ${
              selectedFriends.length >= 2
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                : 'bg-white/10 text-white/30'
            }`}
          >
            Create Group ({selectedFriends.length}/4)
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
