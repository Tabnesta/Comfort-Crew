import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Mic, MicOff, Volume2, Heart, MoreHorizontal } from 'lucide-react';
import type { FriendId, Message } from '../types';
import { friends, getRelationshipLevel } from '../data/friends';
import { useStore, useActiveConversation } from '../store/useStore';
import { generateFriendResponse, createMessage } from '../utils/ai';

interface ChatInterfaceProps {
  friendId: FriendId;
  onBack: () => void;
}

export function ChatInterface({ friendId, onBack }: ChatInterfaceProps) {
  const friend = friends[friendId];
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    getOrCreateConversation,
    setActiveConversation,
    addMessage,
    friendMentions,
  } = useStore();

  // Get or create conversation on mount
  useEffect(() => {
    const convoId = getOrCreateConversation(friendId);
    setActiveConversation(convoId);
  }, [friendId, getOrCreateConversation, setActiveConversation]);

  const conversation = useActiveConversation();
  const messages = conversation?.messages || [];
  const totalMessages = conversation?.totalMessages || 0;
  const relationshipInfo = getRelationshipLevel(totalMessages);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedResponse]);

  // Send initial greeting if no messages
  useEffect(() => {
    if (conversation && messages.length === 0) {
      const greeting = friend.greetings[Math.floor(Math.random() * friend.greetings.length)];
      const greetingMessage = createMessage(friendId, greeting);
      addMessage(conversation.id, greetingMessage);
    }
  }, [conversation?.id]);

  const handleSend = async () => {
    if (!input.trim() || !conversation) return;

    const userMessage = createMessage('user', input.trim());
    addMessage(conversation.id, userMessage);
    setInput('');
    setIsTyping(true);
    setStreamedResponse('');

    try {
      const response = await generateFriendResponse(
        friendId,
        input.trim(),
        conversation,
        friendMentions,
        (chunk) => setStreamedResponse(chunk)
      );

      setIsTyping(false);
      setStreamedResponse('');

      const friendMessage = createMessage(friendId, response);
      addMessage(conversation.id, friendMessage);
    } catch (error) {
      console.error('Error generating response:', error);
      setIsTyping(false);
      setStreamedResponse('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording would be implemented here
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`bg-gradient-to-r ${friend.gradient} p-4 flex items-center gap-4`}
      >
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>

        <div className="text-4xl">{friend.avatar}</div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{friend.name}</h2>
          <p className="text-white/80 text-sm">{friend.tagline}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="flex items-center gap-1 text-white/80">
              <Heart size={14} />
              <span className="text-xs">{relationshipInfo.name}</span>
            </div>
          </div>
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <MoreHorizontal size={20} className="text-white" />
          </button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        <AnimatePresence>
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              friend={friend}
              delay={index * 0.05}
            />
          ))}
        </AnimatePresence>

        {/* Typing indicator / Streamed response */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${friend.gradient} flex items-center justify-center`}>
              {friend.avatar}
            </div>
            <div className="message-bubble friend">
              {streamedResponse || (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-white/60 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-white/60 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
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
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-full transition-all ${
              isRecording
                ? 'bg-red-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
            }`}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${friend.name}...`}
            className="chat-input"
            disabled={isTyping}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`p-3 rounded-full transition-all ${
              input.trim() && !isTyping
                ? `bg-gradient-to-r ${friend.gradient} text-white`
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

// Message bubble component
function MessageBubble({
  message,
  friend,
  delay = 0,
}: {
  message: Message;
  friend: typeof friends[FriendId];
  delay?: number;
}) {
  const isUser = message.friendId === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${friend.gradient} flex items-center justify-center flex-shrink-0`}>
          {friend.avatar}
        </div>
      )}

      <div
        className={`message-bubble ${isUser ? 'user' : 'friend'}`}
      >
        {message.content}

        {message.isVoice && (
          <button className="mt-2 flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <Volume2 size={16} />
            <span>Play voice message</span>
          </button>
        )}
      </div>

      <span className="text-xs text-white/30 self-end">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </motion.div>
  );
}
