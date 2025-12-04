import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HistorySidebar } from './components/HistorySidebar';
import { ResultDisplay } from './components/ResultDisplay';
import { UpgradeModal } from './components/UpgradeModal';
import { SummaryType, SummaryResult, HistoryItem } from './types';
import { generateNewsSummary } from './services/geminiService';
import { Layout, Menu, Wand2, Lock, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Mock initial history
const MOCK_HISTORY: HistoryItem[] = [];

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summaryType, setSummaryType] = useState<SummaryType>(SummaryType.SHORT);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(MOCK_HISTORY);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Free/Paid State (Mocked)
  const [isPremium, setIsPremium] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Apply Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Toggle Sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    // Plan Restriction Check
    if (!isPremium && summaryType !== SummaryType.SHORT) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const generated = await generateNewsSummary(inputText, summaryType);
      
      const newResult: SummaryResult = {
        ...generated,
        timestamp: Date.now(),
        type: summaryType,
        originalTextLength: inputText.length
      };

      setResult(newResult);

      const newHistoryItem: HistoryItem = {
        ...newResult,
        id: crypto.randomUUID()
      };

      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (error) {
      console.error("Failed to generate", error);
      alert("Ocorreu um erro ao gerar o resumo. Verifique sua chave de API ou tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setResult(item);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleClearHistory = () => {
    if (confirm("Tem certeza que deseja limpar todo o histórico?")) {
      setHistory([]);
      setResult(null);
    }
  };

  const handleUpgrade = () => {
    setIsPremium(true);
    setIsUpgradeModalOpen(false);
    alert("Parabéns! Você agora é um membro DRM News PRO.");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col font-sans transition-colors duration-200">
      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={handleUpgrade}
      />

      <Header 
        isPremium={isPremium} 
        onUpgrade={() => setIsUpgradeModalOpen(true)} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`transform transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full'
          } flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-hidden relative`}
        >
          <div className="w-80 h-full">
             <HistorySidebar 
               history={history}
               onSelect={handleSelectHistory}
               onClear={handleClearHistory}
               isOpen={true} // Controlled by parent container width
               isPremium={isPremium}
               onUpgrade={() => setIsUpgradeModalOpen(true)}
             />
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden relative">
          
          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 dark:text-gray-200 p-2 rounded-lg shadow-md text-gray-600"
          >
            {isSidebarOpen ? <Layout size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              
              {/* Left Column: Input */}
              <div className="flex flex-col gap-4 h-full">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col flex-1 min-h-[500px] transition-colors">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-t-xl flex justify-between items-center transition-colors">
                    <h2 className="font-semibold text-gray-700 dark:text-gray-200">Texto Original</h2>
                    <span className="text-xs text-gray-400">{inputText.length} caracteres</span>
                  </div>
                  <textarea
                    className="flex-1 w-full p-4 resize-none focus:outline-none focus:ring-0 text-gray-700 dark:text-gray-200 bg-transparent leading-relaxed custom-scrollbar placeholder-gray-400 dark:placeholder-gray-600"
                    placeholder="Cole seu texto longo aqui (artigos, relatórios, notícias)..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  
                  {/* Controls Toolbar */}
                  <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl space-y-4 transition-colors">
                    <div className="grid grid-cols-3 gap-2">
                       {/* Short */}
                       <button
                         onClick={() => setSummaryType(SummaryType.SHORT)}
                         className={`flex flex-col items-center justify-center p-3 rounded-lg border transition ${
                           summaryType === SummaryType.SHORT 
                             ? 'bg-white dark:bg-gray-800 border-brand-500 dark:border-brand-500 shadow-sm ring-1 ring-brand-500' 
                             : 'bg-transparent border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                         }`}
                       >
                         <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Curto</span>
                         <span className="text-[10px] text-gray-500 dark:text-gray-400">Lead básico</span>
                       </button>

                       {/* Medium */}
                       <button
                         onClick={() => setSummaryType(SummaryType.MEDIUM)}
                         className={`relative flex flex-col items-center justify-center p-3 rounded-lg border transition ${
                           summaryType === SummaryType.MEDIUM
                             ? 'bg-white dark:bg-gray-800 border-brand-500 dark:border-brand-500 shadow-sm ring-1 ring-brand-500' 
                             : 'bg-transparent border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                         }`}
                       >
                         {!isPremium && <Lock size={12} className="absolute top-2 right-2 text-amber-500" />}
                         <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Médio</span>
                         <span className="text-[10px] text-gray-500 dark:text-gray-400">Com contexto</span>
                       </button>

                       {/* Analytical */}
                       <button
                         onClick={() => setSummaryType(SummaryType.ANALYTICAL)}
                         className={`relative flex flex-col items-center justify-center p-3 rounded-lg border transition ${
                           summaryType === SummaryType.ANALYTICAL
                             ? 'bg-white dark:bg-gray-800 border-brand-500 dark:border-brand-500 shadow-sm ring-1 ring-brand-500' 
                             : 'bg-transparent border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                         }`}
                       >
                         {!isPremium && <Lock size={12} className="absolute top-2 right-2 text-amber-500" />}
                         <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Analítico</span>
                         <span className="text-[10px] text-gray-500 dark:text-gray-400">Profundo</span>
                       </button>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={!inputText || isLoading}
                      className="w-full bg-brand-600 hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <span className="animate-pulse">Processando...</span>
                      ) : (
                        <>
                          <Wand2 size={18} />
                          Gerar Resumo
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Result */}
              <div className="h-full">
                 <ResultDisplay 
                   result={result} 
                   isLoading={isLoading} 
                   isPremium={isPremium}
                   onUpgradeRequest={() => setIsUpgradeModalOpen(true)}
                 />
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;