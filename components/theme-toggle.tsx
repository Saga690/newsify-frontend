'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(theme === 'dark');
  }, [theme]);

  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setIsDark(!isDark);
        setTimeout(() => setTheme(isDark ? 'light' : 'dark'), 300);
      }}
    >
      <Sun
        className={`h-5 w-5 transition-all duration-500 ease-in-out ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-500 ease-in-out ${isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
