import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Moon,
  Trash2,
  Download,
  Heart,
  Info,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export function SettingsPage() {
  const { user, setUser } = useStore();
  const [notifications, setNotifications] = useState(true);
  const [voiceMessages, setVoiceMessages] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');

  const handleSaveName = () => {
    if (user && newName.trim()) {
      setUser({ ...user, name: newName.trim() });
    }
    setEditingName(false);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('comfort-crew-storage');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = localStorage.getItem('comfort-crew-storage');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'comfortcrew-backup.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/60">Customize your ComfortCrew experience</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Profile</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Display Name</div>
              <div className="text-sm text-white/60">How friends will address you</div>
            </div>

            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="flex items-center gap-2 text-white/60 hover:text-white"
              >
                <span>{user?.name || 'Not set'}</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Member Since</div>
              <div className="text-sm text-white/60">When you joined ComfortCrew</div>
            </div>
            <span className="text-white/60">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'Today'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell size={20} className="text-yellow-400" />
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
        </div>

        <div className="space-y-4">
          <ToggleSetting
            label="Daily Check-ins"
            description="Get daily messages from your friends"
            enabled={notifications}
            onToggle={() => setNotifications(!notifications)}
          />

          <ToggleSetting
            label="Voice Messages"
            description="Allow friends to send voice messages"
            enabled={voiceMessages}
            onToggle={() => setVoiceMessages(!voiceMessages)}
          />
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Moon size={20} className="text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Appearance</h2>
        </div>

        <ToggleSetting
          label="Dark Mode"
          description="Use dark theme (recommended)"
          enabled={darkMode}
          onToggle={() => setDarkMode(!darkMode)}
        />
      </motion.div>

      {/* Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Download size={20} className="text-green-400" />
          <h2 className="text-lg font-semibold text-white">Your Data</h2>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download size={20} className="text-white/60" />
              <div className="text-left">
                <div className="text-white font-medium">Export Data</div>
                <div className="text-sm text-white/60">Download your conversations</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-white/40" />
          </button>

          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-between p-4 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-red-400" />
              <div className="text-left">
                <div className="text-red-400 font-medium">Clear All Data</div>
                <div className="text-sm text-red-400/60">Delete everything and start fresh</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-red-400/40" />
          </button>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-panel p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Info size={20} className="text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">About</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/60">Version</span>
            <span className="text-white">1.0.0</span>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/60 mb-2">
              <Heart size={16} className="text-pink-400" />
              <span>Made with care for your wellbeing</span>
            </div>
            <p className="text-sm text-white/40">
              ComfortCrew provides AI companions for emotional support.
              These are not replacements for professional mental health services.
              If you're in crisis, please reach out to a mental health professional.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-white font-medium">{label}</div>
        <div className="text-sm text-white/60">{description}</div>
      </div>

      <button
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          enabled ? 'bg-green-500' : 'bg-white/20'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
        />
      </button>
    </div>
  );
}
