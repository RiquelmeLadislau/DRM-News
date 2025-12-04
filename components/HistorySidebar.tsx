import React from 'react';
import { HistoryItem } from '../types';
import { Clock, ChevronRight, Search, Trash2 } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  isOpen: boolean;
  isPremium: boolean;
  onUpgrade: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  history, 
  onSelect, 
  onClear,
  isOpen, 
  isPremium,
  onUpgrade
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-[calc(100vh-64px)] fixed md:sticky top-16 z-20 shadow-xl md:shadow-none transition-colors duration-200">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <Clock size={18} />
          Histórico
        </h2>
        {history.length > 0 && isPremium && (
          <button onClick={onClear} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition" title="Limpar histórico">
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {!isPremium && history.length > 3 && (
         <div className="bg-amber-50 dark:bg-amber-900/20 p-3 mx-4 mt-4 rounded-lg border border-amber-200 dark:border-amber-800/50 text-sm text-amber-800 dark:text-amber-400">
           <p className="mb-2">Histórico limitado no plano Grátis.</p>
           <button onClick={onUpgrade} className="text-amber-700 dark:text-amber-300 font-bold underline text-xs">Liberar histórico ilimitado</button>
         </div>
      )}

      <div className="overflow-y-auto flex-1 p-2 space-y-2">
        {history.length === 0 ? (
          <div className="text-center py-10 text-gray-400 dark:text-gray-600 text-sm">
            <Search className="mx-auto mb-2 opacity-50" size={32} />
            <p>Nenhum resumo ainda.</p>
          </div>
        ) : (
          history.slice(0, isPremium ? undefined : 3).map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition group"
            >
              <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm line-clamp-2 leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {item.title}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                  {item.type}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))
        )}
        
        {!isPremium && history.length > 3 && (
           <div className="text-center py-4 text-xs text-gray-400 dark:text-gray-600 italic">
             + {history.length - 3} itens antigos ocultos
           </div>
        )}
      </div>
    </div>
  );
};