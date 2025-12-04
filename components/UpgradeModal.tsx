import React from 'react';
import { X, Check, Crown } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative border border-gray-200 dark:border-gray-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          <X size={24} />
        </button>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center text-white">
          <div className="mx-auto bg-amber-400 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30">
            <Crown size={32} className="text-gray-900" />
          </div>
          <h2 className="text-2xl font-bold font-serif mb-2">Seja Premium</h2>
          <p className="text-gray-300 text-sm">Desbloqueie todo o poder do jornalismo sintético.</p>
        </div>

        <div className="p-8">
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3 text-sm">
              <Check className="text-green-500 flex-shrink-0" size={18} />
              <span className="text-gray-700 dark:text-gray-300">Resumos <strong>Médios e Analíticos</strong> profundos</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Check className="text-green-500 flex-shrink-0" size={18} />
              <span className="text-gray-700 dark:text-gray-300">Exportação profissional em <strong>PDF</strong></span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Check className="text-green-500 flex-shrink-0" size={18} />
              <span className="text-gray-700 dark:text-gray-300">Histórico <strong>Ilimitado</strong> na nuvem</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <Check className="text-green-500 flex-shrink-0" size={18} />
              <span className="text-gray-700 dark:text-gray-300">Sem anúncios ou interrupções</span>
            </li>
          </ul>

          <button 
            onClick={onUpgrade}
            className="w-full bg-brand-600 hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition transform active:scale-95"
          >
            Assinar Agora - R$ 19,90/mês
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            Cancele a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
};