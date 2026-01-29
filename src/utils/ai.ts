import type { FriendId, Message, Conversation } from '../types';
import { friends } from '../data/friends';

// This is a mock AI response generator for demo purposes
// In production, this would call your actual AI API (Claude, GPT, etc.)

const generateId = () => Math.random().toString(36).substring(2, 15);

// Get context from conversation history
const getConversationContext = (conversation: Conversation | null, maxMessages = 10) => {
  if (!conversation) return [];
  return conversation.messages.slice(-maxMessages);
};

// Build context about what other friends have mentioned
const getCrossFriendContext = (friendMentions: Record<FriendId, string[]>, friendId: FriendId) => {
  const mentions = friendMentions[friendId];
  if (!mentions || mentions.length === 0) return '';
  return `\n\nContext from other friends:\n${mentions.slice(-3).join('\n')}`;
};

// Simulated AI response based on friend personality
export const generateFriendResponse = async (
  friendId: FriendId,
  userMessage: string,
  conversation: Conversation | null,
  friendMentions: Record<FriendId, string[]>,
  onStreamChunk?: (chunk: string) => void
): Promise<string> => {
  const friend = friends[friendId];
  const context = getConversationContext(conversation);
  const crossContext = getCrossFriendContext(friendMentions, friendId);

  // For demo, we'll use pre-written responses based on keywords
  // In production, replace this with actual API call
  const response = await generateMockResponse(friend, userMessage, context, crossContext);

  // Simulate streaming
  if (onStreamChunk) {
    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
      onStreamChunk(words.slice(0, i + 1).join(' '));
    }
  }

  return response;
};

// Mock response generator - replace with real AI API
const generateMockResponse = async (
  friend: typeof friends[FriendId],
  userMessage: string,
  _context: Message[],
  _crossContext: string
): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

  const lowercaseMessage = userMessage.toLowerCase();

  // Response templates based on friend personality
  const responseTemplates: Record<FriendId, Record<string, string[]>> = {
    sunny: {
      greeting: [
        "Hey there, sunshine! I'm so happy you reached out. How's your day going?",
        "Hi friend! It's always lovely to hear from you. What's on your mind today?",
      ],
      sad: [
        "I hear you, and it's okay to feel this way. Sometimes the clouds come, but they always pass. What's weighing on you?",
        "That sounds really tough. I'm here with you. Would you like to talk about what's going on, or would you prefer some gentle encouragement?",
      ],
      happy: [
        "That's wonderful to hear! I love seeing you in good spirits. Tell me more about what's making you happy!",
        "Your joy is contagious! Moments like these are worth celebrating. What's lighting you up today?",
      ],
      default: [
        "I'm here for you. Every day is a new opportunity, and I believe in you. What would help you most right now?",
        "Thanks for sharing that with me. Remember, even small steps forward are still progress. How can I support you today?",
      ],
    },
    max: {
      greeting: [
        "YOOO! There's my favorite person! What's happening, superstar?!",
        "Hey hey HEY! So pumped you're here! What's good?!",
      ],
      sad: [
        "Okay wait - I hear you, and that's valid. But also? You're literally dealing with it right now and that takes STRENGTH. I'm proud of you.",
        "Real talk - it's okay to not be okay. But I need you to know that you're way more capable than you give yourself credit for.",
      ],
      happy: [
        "YESSSS! That's what I'm TALKING about! This is huge! I'm so hyped for you right now!!",
        "ARE YOU SERIOUS?! That's AMAZING! You absolutely crushed it! Tell me everything!",
      ],
      default: [
        "You know what? Whatever's going on, I believe in you. Like, genuinely. You've got this!",
        "I'm here to remind you that you're kind of amazing. Just wanted to put that out there.",
      ],
    },
    river: {
      greeting: [
        "Hello. Take a breath. I'm here, and there's no rush.",
        "Hi there. It's nice to be with you. How are you feeling in this moment?",
      ],
      sad: [
        "That sounds heavy. Let's just sit with that for a moment. You don't have to fix anything right now. Just breathe.",
        "I hear you. Sometimes sadness needs space to exist. Take a slow breath with me.",
      ],
      anxious: [
        "Let's slow down together. Feel your feet on the ground. You're safe right now, in this moment. What do you notice around you?",
        "Anxiety can feel so overwhelming. Let's anchor ourselves. Can you name three things you can see right now?",
      ],
      default: [
        "Let's take this one breath at a time. There's no need to rush. What feels most present for you right now?",
        "I'm here with you, steady and calm. Whatever's happening, we can sit with it together.",
      ],
    },
    alex: {
      greeting: [
        "Hey. What's going on? Give it to me straight.",
        "Alright, I'm here. What do we need to figure out?",
      ],
      confused: [
        "Let's break this down. What's the actual decision you need to make? Forget the noise for a second.",
        "Okay, here's what I'm hearing. Correct me if I'm wrong, but it sounds like the real question is...",
      ],
      decision: [
        "What are you actually afraid of here? Because that's usually where the answer is hiding.",
        "Let me be real - what's the worst case scenario if you just... did it?",
      ],
      default: [
        "Alright, let's cut through this. What matters most to you in this situation?",
        "Here's my honest take. But ultimately, you know your situation better than I do. What's your gut telling you?",
      ],
    },
    sam: {
      greeting: [
        "Oh honey, I'm so glad you're here. How are you really doing?",
        "Hey sweetheart. Come in, tell me what's going on. I'm all ears.",
      ],
      sad: [
        "Oh love, that sounds so hard. I'm right here with you. You don't have to carry this alone.",
        "I'm so sorry you're going through this. Come here. It's okay to feel all of this.",
      ],
      lonely: [
        "I'm here with you, and you matter so much. Being lonely is one of the hardest feelings. But you reached out, and I'm proud of you.",
        "You're not alone right now. I'm right here. Tell me what's on your heart.",
      ],
      default: [
        "Whatever you're feeling is valid. I'm here to listen without judgment. What do you need right now?",
        "I care about you, you know that? Take your time. I'm not going anywhere.",
      ],
    },
    jordan: {
      greeting: [
        "Yo! Ready for some adventure? Or at least some interesting conversation?",
        "Hey there! I've got ideas. So many ideas. What kind of energy are we working with today?",
      ],
      bored: [
        "Bored? Oh, we can fix that. When's the last time you did something that surprised even yourself?",
        "Perfect! A blank canvas! What's something you've always wanted to try but haven't yet?",
      ],
      stuck: [
        "Stuck in a rut? Let's shake things up! Even tiny changes can shift your whole perspective.",
        "Here's a wild thought - what if the solution is doing the opposite of what you normally would?",
      ],
      default: [
        "Life's an adventure, even the mundane parts. What would make today more interesting?",
        "What's something exciting on your radar? Or should we brainstorm some possibilities?",
      ],
    },
    morgan: {
      greeting: [
        "Hello, fellow traveler. What's on your mind today?",
        "Hey. I was just contemplating the nature of human connection. Perfect timing.",
      ],
      existential: [
        "That's such a profound question. I don't think there's one answer, but maybe exploring it together is the point?",
        "Existential thoughts can feel heavy, but they also mean you're engaging deeply with life. What's sparked this for you?",
      ],
      meaning: [
        "Meaning is such a personal thing. Maybe it's not something we find, but something we create?",
        "I've been thinking about this too. What if meaning isn't in the big moments, but in how we show up for the small ones?",
      ],
      default: [
        "That's interesting. Tell me more about what you're sitting with. I'd love to explore this together.",
        "There's something deeper there. What do you think this says about what you value?",
      ],
    },
    casey: {
      greeting: [
        "Oh good, you're here! I have approximately 47 terrible jokes queued up. You've been warned.",
        "Hey hey! Ready for some chaotic good energy?",
      ],
      sad: [
        "Okay okay, things are rough, I get it. But have you considered that life is just a series of increasingly bizarre plot twists? Also, I'm here if you want to laugh or vent or both.",
        "Sending you virtual comfort snacks and a reminder that even bad days have endings. Want to hear something ridiculous to take the edge off?",
      ],
      laugh: [
        "Perfect, you've come to the right place! Did you know that otters hold hands while they sleep so they don't drift apart? Anyway, that's my energy today.",
        "I've been saving my best material for you. Okay, not my BEST, but definitely my most enthusiastically mediocre.",
      ],
      default: [
        "So what's the vibe? Silly? Chaotic? Need-to-forget-reality-for-a-bit? I'm versatile like that.",
        "Plot twist: I'm actually here to brighten your day. It's my superpower. Well, that and terrible puns.",
      ],
    },
  };

  // Determine response category
  let category = 'default';
  if (lowercaseMessage.match(/\b(hi|hey|hello|sup)\b/)) category = 'greeting';
  else if (lowercaseMessage.match(/\b(sad|down|depressed|upset|crying|hurt)\b/)) category = 'sad';
  else if (lowercaseMessage.match(/\b(happy|great|good|amazing|wonderful|excited)\b/)) category = 'happy';
  else if (lowercaseMessage.match(/\b(anxious|anxiety|worried|panic|scared|nervous)\b/)) category = 'anxious';
  else if (lowercaseMessage.match(/\b(confused|don't know|unsure|help me decide)\b/)) category = 'confused';
  else if (lowercaseMessage.match(/\b(decide|decision|choose|should i)\b/)) category = 'decision';
  else if (lowercaseMessage.match(/\b(lonely|alone|isolated|no one)\b/)) category = 'lonely';
  else if (lowercaseMessage.match(/\b(bored|boring|nothing to do)\b/)) category = 'bored';
  else if (lowercaseMessage.match(/\b(stuck|rut|same thing|routine)\b/)) category = 'stuck';
  else if (lowercaseMessage.match(/\b(meaning|purpose|why|existence|point)\b/)) category = 'existential';
  else if (lowercaseMessage.match(/\b(funny|joke|laugh|humor|lol)\b/)) category = 'laugh';

  const templates = responseTemplates[friend.id];
  const categoryResponses = templates[category] || templates['default'];
  const response = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

  return response;
};

// Generate a daily check-in message from a friend
export const generateDailyCheckIn = (friendId: FriendId): string => {
  const checkInTemplates: Record<FriendId, string[]> = {
    sunny: [
      "Good morning! Just wanted to remind you that today is full of possibilities. How are you feeling?",
      "Hey there! The sun is shining somewhere, and I hope a little of that warmth reaches you today.",
    ],
    max: [
      "Yo! New day, new chances to be awesome! You've got this!!",
      "Morning superstar! Just dropping by to remind you that you're kind of amazing.",
    ],
    river: [
      "Hello. I hope you find moments of peace today. Take a breath when you need one.",
      "Good morning. Remember to be gentle with yourself today. I'm here if you need stillness.",
    ],
    alex: [
      "Hey. New day. What's one thing you want to accomplish? Let's make it happen.",
      "Morning. Check in with yourself - what do you need today?",
    ],
    sam: [
      "Good morning, sweetheart. I hope you slept okay. Remember, I'm always here if you need to talk.",
      "Hey love. Just checking in to say I care about you. How are you doing?",
    ],
    jordan: [
      "Morning! What adventure awaits today? Even small ones count!",
      "Hey! New day = new possibilities. What's one thing you could try today?",
    ],
    morgan: [
      "Good morning. What questions are you carrying today?",
      "Hey there. A new day of existence awaits. What's on your mind?",
    ],
    casey: [
      "Morning! Fun fact: a group of flamingos is called a flamboyance. Anyway, hope your day is flamboyant!",
      "Hey! Today's forecast: 100% chance of me sending you ridiculous messages. You're welcome.",
    ],
  };

  const templates = checkInTemplates[friendId];
  return templates[Math.floor(Math.random() * templates.length)];
};

// Generate voice message placeholder (would integrate with TTS API)
export const generateVoiceMessage = async (
  friendId: FriendId,
  text: string
): Promise<string> => {
  // In production, this would call a TTS API
  // For now, return a placeholder that indicates voice capability
  console.log(`Voice message from ${friendId}: ${text}`);
  return `voice://${friendId}/${generateId()}`;
};

// Helper to create message object
export const createMessage = (
  friendId: FriendId | 'user' | 'system',
  content: string,
  isVoice = false
): Message => ({
  id: generateId(),
  friendId,
  content,
  timestamp: Date.now(),
  isVoice,
});
