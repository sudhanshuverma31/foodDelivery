import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-slate-800 dark:bg-slate-800 light:bg-white/80 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 text-slate-400 dark:text-slate-400 light:text-gray-600 border border-slate-700 dark:border-slate-700 light:border-gray-200 transition-all cursor-pointer shadow-sm"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </button>
  );
};

export default ThemeToggle;
