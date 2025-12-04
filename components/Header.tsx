import React from 'react';
import { Newspaper, Crown, User, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isPremium: boolean;
  onUpgrade: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isPremium, onUpgrade, isDarkMode, toggleTheme }) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 p-2 rounded-lg text-white shadow-sm">
            <Newspaper size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">DRM News</h1>
            <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold uppercase tracking-wider">Summary</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isDarkMode ? "Modo Claro" : "Modo Escuro"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!isPremium ? (
            <button 
              onClick={onUpgrade}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium transition shadow-sm"
            >
              <Crown size={16} />
              Assinar Premium
            </button>
          ) : (
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800/50">
              <Crown size={12} className="fill-current" />
              Membro PRO
            </span>
          )}
          
          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};