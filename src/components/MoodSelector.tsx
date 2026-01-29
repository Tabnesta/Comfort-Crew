import { motion } from 'framer-motion';
import { moods } from '../data/friends';
import type { MoodType } from '../types';
import { useStore } from '../store/useStore';

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodType) => void;
}

export function MoodSelector({ onMoodSelect }: MoodSelectorProps) {
  const selectedMood = useStore(state => state.selectedMood);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-2">How are you feeling?</h2>
        <p className="text-white/60">Select your mood and we'll match you with the right friend</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMoodSelect(mood.id)}
            className={`
              relative p-4 rounded-2xl border-2 transition-all duration-300
              ${selectedMood === mood.id
                ? 'border-white bg-white/20'
                : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30'
              }
            `}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">{mood.emoji}</span>
              <span className="font-medium text-white text-sm">{mood.label}</span>
            </div>

            {selectedMood === mood.id && (
              <motion.div
                layoutId="mood-selected"
                className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-20 -z-10"
                style={{
                  background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Compact mood selector for chat header
export function MoodSelectorCompact({ currentMood, onMoodChange }: {
  currentMood: MoodType | null;
  onMoodChange: (mood: MoodType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {moods.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onMoodChange(mood.id)}
          className={`
            px-3 py-1.5 rounded-full text-sm transition-all
            ${currentMood === mood.id
              ? 'bg-white/20 text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }
          `}
        >
          {mood.emoji} {mood.label}
        </button>
      ))}
    </div>
  );
}
