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
      <div className="flex items-center bg-white/90 dark:bg-zinc-800/90 p-0.5 rounded-md border border-gray-200 dark:border-zinc-700 shadow-2xs w-20 h-7 animate-pulse" />
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
      className="inline-flex items-center bg-white/90 dark:bg-zinc-800/90 p-0.5 rounded-md border border-gray-200 dark:border-zinc-700 shadow-2xs"
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
            className={`flex items-center justify-center p-1 rounded text-xs transition ${
              isActive
                ? 'bg-rose-500 text-white shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-amber-400'
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
