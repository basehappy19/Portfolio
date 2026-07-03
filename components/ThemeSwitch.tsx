'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md p-1 rounded-full border border-rose-200/60 dark:border-zinc-700 shadow-sm w-24 h-9 animate-pulse" />
    );
  }

  const modes = [
    { id: 'light', icon: Sun, label: 'Light' },
    { id: 'dark', icon: Moon, label: 'Dark' },
    { id: 'system', icon: Monitor, label: 'Auto' },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Theme mode switcher"
      className="inline-flex items-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-1 rounded-full border border-rose-200/80 dark:border-zinc-700 shadow-md hover:shadow-lg transition-all duration-300"
    >
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = theme === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => setTheme(mode.id)}
            aria-checked={isActive}
            role="radio"
            title={`Switch to ${mode.label} mode`}
            className={`flex items-center justify-center p-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm scale-105'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-amber-400 hover:bg-rose-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="sr-only">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
