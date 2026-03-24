
export enum TransformationPhase {
  SURGERY = 'Surgery',
  RESUSCITATION = 'Resuscitation',
  THERAPY = 'Therapy'
}

export enum UserRole {
  LEADER = 'Leader',
  STAFF = 'Staff'
}

export enum ReportMode {
  SECULAR = 'Secular',
  FAITH = 'Faith'
}

export interface Question {
  id: string;
  phase: TransformationPhase;
  text: string;
  options: string[]; // 3 options
  recommendedOptionIndex: number; // Index of the best answer (0-2)
  feedback: string; // Educational content/rationale
}

export interface Answer {
  questionId: string;
  selectedOptionIndex: number;
}

export interface Submission {
  id: string;
  role: UserRole;
  answers: Answer[];
  timestamp: number;
}

export interface ReportData {
  gapScore: number; // 0-100
  // Structural breakdown to ensure no phase is skipped
  executiveSummary: string;
  surgeryAnalysis: string;
  resuscitationAnalysis: string;
  therapyAnalysis: string;
  conclusion: string;
  
  prayerTitle?: string;
  prayerContent?: string; // ~750 words (Mandatory even in secular, acts as reflection)
  scriptureReferences?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
