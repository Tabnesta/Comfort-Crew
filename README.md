# ComfortCrew - AI Friends For Different Moods

A collection of AI companion personalities optimized for different emotional needs - not romantic, just genuinely supportive friends.

## Features

### Mood-Based Matching
Open the app, select how you're feeling, and get matched with the right "friend" for that mood.

### 8 Unique AI Companions

- **Sunny** - The Optimist. Gentle encouragement, silver linings, hope. Best for: Feeling down, need positivity
- **Max** - The Hype Friend. Enthusiastic, validating, cheers you on. Best for: Need confidence, celebration
- **River** - The Calm Presence. Grounding, peaceful, mindful. Best for: Anxiety, overwhelm, can't sleep
- **Alex** - The Straight Talker. Honest, practical, no-nonsense. Best for: Need reality check, decisions
- **Sam** - The Nurturer. Warm, caring, comforting. Best for: Sad, lonely, need gentleness
- **Jordan** - The Adventurous One. Exciting, spontaneous, fun. Best for: Bored, stuck in rut, need energy
- **Morgan** - The Deep Thinker. Philosophical, meaningful conversations. Best for: Existential thoughts, big questions
- **Casey** - The Silly One. Humor, memes, lightness. Best for: Need distraction, laughter

### Unique Features

- **Mood-based matching** - Get matched with the right friend based on how you're feeling
- **Friend relationship levels** - Deeper conversations as you bond
- **Cross-friend references** - Friends reference each other ("Sam told me you were having a rough week")
- **Group chat** - Chat with multiple friends at once
- **Daily check-ins** - Get daily messages from your favorite friends
- **Conversation memory** - Friends remember your history and ongoing situations

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Framer Motion for animations
- Vite for build tooling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/comfort-crew.git
cd comfort-crew

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Usage

1. **Welcome Screen**: Enter your name to personalize your experience
2. **Home Screen**: See your mood selector, recommended friends, and quick actions
3. **Select Mood**: Choose how you're feeling from 8 mood options
4. **Chat**: Start chatting with your matched friend
5. **Group Chat**: Select multiple friends to chat with them together
6. **Friends**: View all friends and track your relationship progress
7. **Settings**: Customize your experience and manage your data

## Project Structure

```
src/
├── components/         # React components
│   ├── pages/         # Page components
│   ├── ChatInterface  # Individual chat
│   ├── GroupChat      # Group chat feature
│   ├── FriendCard     # Friend display card
│   └── ...
├── data/              # Static data
│   └── friends.ts     # Friend personalities and system prompts
├── store/             # Zustand store
│   └── useStore.ts    # App state management
├── types/             # TypeScript types
│   └── index.ts       # Type definitions
├── utils/             # Utility functions
│   └── ai.ts          # AI response generation
└── App.tsx            # Main app component
```

## Note

This is a demo application with mock AI responses. In production, you would integrate with an actual AI API (Claude, GPT, etc.) to generate personalized responses based on the friend's personality and conversation context.

## License

MIT
