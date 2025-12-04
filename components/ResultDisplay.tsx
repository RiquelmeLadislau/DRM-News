import React from 'react';
import { SummaryResult, ExportFormat } from '../types';
import { Download, Share2, FileText, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';

interface ResultDisplayProps {
  result: SummaryResult | null;
  isLoading: boolean;
  isPremium: boolean;
  onUpgradeRequest: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading, isPremium, onUpgradeRequest }) => {
  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px] text-gray-400 dark:text-gray-500 animate-pulse">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-brand-500 dark:border-t-brand-500 rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Analisando fatos e gerando resumo...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px] text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
        <FileText size={48} className="mb-4 opacity-50" />
        <p>Cole seu texto ao lado para gerar um resumo.</p>
      </div>
    );
  }

  const handleExport = (format: ExportFormat) => {
    if (format === 'pdf' && !isPremium) {
      onUpgradeRequest();
      return;
    }

    if (format === 'markdown') {
      const mdContent = `# ${result.title}\n\n## Resumo\n${result.summary}\n\n## Pontos Chave\n${result.bulletPoints.map(p => `- ${p}`).join('\n')}`;
      const blob = new Blob([mdContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.title.slice(0, 20).replace(/\s+/g, '_')}.md`;
      a.click();
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      
      // Title
      doc.setFont("times", "bold");
      doc.setFontSize(20);
      const splitTitle = doc.splitTextToSize(result.title, 180);
      doc.text(splitTitle, 15, 20);
      
      let yPos = 20 + (splitTitle.length * 10);
      
      // Metadata
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`DRM News Summary • ${new Date().toLocaleDateString()}`, 15, yPos);
      yPos += 15;

      // Summary Body
      doc.setFont("times", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0);
      const splitSummary = doc.splitTextToSize(result.summary, 180);
      doc.text(splitSummary, 15, yPos);
      
      yPos += (splitSummary.length * 7) + 10;

      // Bullets
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Pontos Principais:", 15, yPos);
      yPos += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      result.bulletPoints.forEach(point => {
         const splitPoint = doc.splitTextToSize(`• ${point}`, 175);
         doc.text(splitPoint, 15, yPos);
         yPos += (splitPoint.length * 6) + 2;
      });

      doc.save(`${result.title.slice(0, 20).replace(/\s+/g, '_')}.pdf`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
      {/* Result Header */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 p-4 flex flex-wrap justify-between items-center gap-4 transition-colors">
        <div className="flex items-center gap-2">
           <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border
             ${result.type === 'analytical' ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50' : 
               result.type === 'medium' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50' : 
               'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50'}`}>
             {result.type === 'analytical' ? 'Analítico' : result.type === 'medium' ? 'Médio' : 'Curto'}
           </span>
           <span className="text-xs text-gray-500 dark:text-gray-400">
             {result.originalTextLength} caracteres originais
           </span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => handleExport('markdown')}
            className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <FileDown size={14} />
            MD
          </button>
          
          <button 
            onClick={() => handleExport('pdf')}
            className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded transition
              ${!isPremium 
                ? 'text-gray-400 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-500 cursor-not-allowed bg-gray-50 dark:bg-gray-800' 
                : 'text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 bg-brand-50 dark:bg-brand-900/30 hover:bg-brand-100 dark:hover:bg-brand-900/50'}`}
          >
            { !isPremium && <span className="text-[10px] mr-1">PRO</span> }
            <Download size={14} />
            PDF
          </button>
        </div>
      </div>

      {/* Result Content */}
      <div className="p-8 font-serif">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {result.title}
        </h2>
        
        <div className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
           {result.summary.split('\n').map((para, idx) => (
             <p key={idx} className="mb-4">{para}</p>
           ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-lg border-l-4 border-brand-500 dark:border-brand-500">
          <h3 className="font-sans font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 uppercase text-sm tracking-wide">
            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
            Pontos Chave
          </h3>
          <ul className="space-y-3">
            {result.bulletPoints.map((point, idx) => (
              <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300 font-sans">
                <span className="text-brand-400 dark:text-brand-500 font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};