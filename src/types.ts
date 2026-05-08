export type Role = 'user' | 'ai' | 'system';
export type MessageType = 'debate' | 'judge' | 'system' | 'intro';

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  type: MessageType;
}

export type DebateStatus = 'SETUP' | 'INTRO' | 'DEBATING' | 'JUDGING' | 'FINISHED';

export interface DebateResult {
  userScore: number;
  aiScore: number;
  winner: 'Kamu' | 'AI';
  pros: string[];
  cons: string[];
  growthTips: string[];
}
