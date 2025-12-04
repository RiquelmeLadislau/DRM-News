export enum SummaryType {
  SHORT = 'short',
  MEDIUM = 'medium',
  ANALYTICAL = 'analytical'
}

export interface SummaryResult {
  title: string;
  summary: string;
  bulletPoints: string[];
  timestamp: number;
  type: SummaryType;
  originalTextLength: number;
}

export interface HistoryItem extends SummaryResult {
  id: string;
}

export type ExportFormat = 'pdf' | 'markdown';
