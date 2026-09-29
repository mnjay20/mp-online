import { create } from 'zustand';

export interface TurnEvaluation {
  turn_number: number;
  question: string;
  answer: string;
  score: number;
  clarity_score: number;
  depth_score: number;
  feedback: string;
}

export interface FinalReport {
  overall_score: number;
  verdict: 'STRONG_HIRE' | 'HIRE' | 'NEEDS_WORK' | 'NOT_READY';
  metrics: {
    technical_depth: number;
    communication_clarity: number;
    problem_solving: number;
  };
  key_strengths: string[];
  key_areas_for_growth: string[];
}

interface InterviewState {
  sessionId: string | null;
  targetRole: string;
  interviewType: string;
  turnNumber: number;
  totalTurns: number;
  currentQuestion: string;
  studentAnswer: string;
  isRecording: boolean;
  isSpeechEnabled: boolean;
  isEvaluating: boolean;
  isSessionActive: boolean;
  isCompleted: boolean;
  evaluations: TurnEvaluation[];
  finalReport: FinalReport | null;

  startSession: (role: string, type: string, totalTurns?: number) => void;
  setQuestion: (question: string) => void;
  setStudentAnswer: (answer: string) => void;
  setIsRecording: (recording: boolean) => void;
  toggleSpeech: () => void;
  addEvaluation: (evalItem: TurnEvaluation, nextQuestion?: string, isFinished?: boolean) => void;
  setFinalReport: (report: FinalReport) => void;
  resetSession: () => void;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  sessionId: null,
  targetRole: 'Backend Engineer',
  interviewType: 'TECHNICAL',
  turnNumber: 1,
  totalTurns: 5,
  currentQuestion:
    'Can you explain how database transactions ensure consistency, and what trade-offs arise when using optimistic versus pessimistic concurrency control?',
  studentAnswer: '',
  isRecording: false,
  isSpeechEnabled: true,
  isEvaluating: false,
  isSessionActive: false,
  isCompleted: false,
  evaluations: [],
  finalReport: null,

  startSession: (role, type, totalTurns = 5) =>
    set({
      sessionId: `session-${Date.now()}`,
      targetRole: role,
      interviewType: type,
      turnNumber: 1,
      totalTurns,
      currentQuestion:
        role === 'Backend Engineer'
          ? 'How do you design a high-throughput REST or gRPC service to handle distributed lock contention during payment processing?'
          : `Walk me through your experience building production applications for ${role}.`,
      studentAnswer: '',
      isRecording: false,
      isEvaluating: false,
      isSessionActive: true,
      isCompleted: false,
      evaluations: [],
      finalReport: null,
    }),

  setQuestion: (question) => set({ currentQuestion: question }),
  setStudentAnswer: (answer) => set({ studentAnswer: answer }),
  setIsRecording: (recording) => set({ isRecording: recording }),
  toggleSpeech: () => set((state) => ({ isSpeechEnabled: !state.isSpeechEnabled })),

  addEvaluation: (evalItem, nextQuestion, isFinished = false) => {
    const nextTurn = get().turnNumber + 1;
    set((state) => ({
      evaluations: [...state.evaluations, evalItem],
      studentAnswer: '',
      turnNumber: isFinished ? state.turnNumber : nextTurn,
      currentQuestion: nextQuestion || state.currentQuestion,
      isCompleted: isFinished || nextTurn > state.totalTurns,
    }));
  },

  setFinalReport: (report) =>
    set({
      finalReport: report,
      isCompleted: true,
      isSessionActive: false,
    }),

  resetSession: () =>
    set({
      sessionId: null,
      turnNumber: 1,
      currentQuestion: '',
      studentAnswer: '',
      isRecording: false,
      isEvaluating: false,
      isSessionActive: false,
      isCompleted: false,
      evaluations: [],
      finalReport: null,
    }),
}));
