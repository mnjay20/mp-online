import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Award,
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useInterviewStore } from '@/store/interviewStore';
import { interviewApi } from '@/api/client';

export const InterviewStudioPage: React.FC = () => {
  const {
    targetRole,
    interviewType,
    turnNumber,
    totalTurns,
    currentQuestion,
    studentAnswer,
    isRecording,
    isSpeechEnabled,
    isEvaluating,
    isSessionActive,
    isCompleted,
    evaluations,
    finalReport,
    startSession,
    setStudentAnswer,
    setIsRecording,
    toggleSpeech,
    addEvaluation,
    setFinalReport,
    resetSession,
  } = useInterviewStore();

  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Timer logic for session
  useEffect(() => {
    let interval: any = null;
    if (isSessionActive && !isCompleted) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, isCompleted]);

  // Web Speech Synthesis (Text-to-Speech) for question playback
  const speakQuestion = (text: string) => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Speak initial question on load if session active
  useEffect(() => {
    if (isSessionActive && currentQuestion) {
      speakQuestion(currentQuestion);
    }
  }, [currentQuestion, isSessionActive]);

  // Speech Recognition (STT) setup
  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Please use text input mode.');
      setInputMode('text');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setStudentAnswer(studentAnswer + ' ' + currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    }
  };

  // Submit Answer for AI Turn Scoring
  const handleSubmitTurn = async () => {
    if (!studentAnswer.trim()) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    useInterviewStore.setState({ isEvaluating: true });

    try {
      const turnResult = await interviewApi.processTurn({
        turn_number: turnNumber,
        total_turns: totalTurns,
        target_role: targetRole,
        interview_type: interviewType,
        current_question: currentQuestion,
        student_answer: studentAnswer,
      });

      const evalData = {
        turn_number: turnNumber,
        question: currentQuestion,
        answer: studentAnswer,
        score: turnResult.evaluation.turn_score,
        clarity_score: turnResult.evaluation.clarity_score,
        depth_score: turnResult.evaluation.depth_score,
        feedback: turnResult.evaluation.feedback,
      };

      const isFinished = turnNumber >= totalTurns || turnResult.is_completed;
      addEvaluation(evalData, turnResult.next_question, isFinished);

      if (isFinished) {
        const report = await interviewApi.generateReport(targetRole);
        setFinalReport(report as any);
        setShowReportDialog(true);
      }
    } finally {
      useInterviewStore.setState({ isEvaluating: false });
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 max-w-6xl mx-auto">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight">AI Mock Interview Studio</h1>
            <Badge variant="cyan" className="ml-2 font-mono text-xs">{interviewType}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Simulating live technical screening for <span className="font-semibold text-foreground">{targetRole}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-mono font-medium">
            <Clock className="size-3.5 text-muted-foreground" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleSpeech}
            className="gap-1.5 text-xs"
            title={isSpeechEnabled ? 'Mute Interviewer Voice' : 'Unmute Interviewer Voice'}
          >
            {isSpeechEnabled ? <Volume2 className="size-3.5 text-emerald-400" /> : <VolumeX className="size-3.5 text-muted-foreground" />}
            <span>{isSpeechEnabled ? 'Voice On' : 'Voice Muted'}</span>
          </Button>

          {!isSessionActive ? (
            <Button
              onClick={() => startSession(targetRole, interviewType)}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Mic className="size-4" />
              <span>Begin Session</span>
            </Button>
          ) : (
            <Button variant="destructive" size="sm" onClick={resetSession} className="gap-1.5 text-xs">
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {!isSessionActive && !isCompleted ? (
        /* Empty State / Session Setup Hero */
        <Card className="border-dashed border-2 border-border/80 bg-card/40 p-12 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <BrainCircuit className="size-8" />
          </div>
          <h2 className="text-2xl font-bold">Start Your Adaptive Mock Interview</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
            Practice real technical questions with live speech-to-text input, adaptive follow-ups, and instant turn-by-turn rubrics.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button
              size="lg"
              onClick={() => startSession('Backend Engineer', 'TECHNICAL')}
              className="gap-2"
            >
              <Mic className="size-4" />
              <span>Start Backend Engineer Drill (5 Turns)</span>
            </Button>
          </div>
        </Card>
      ) : (
        /* Active Interview Dual Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stage: Question & Answer Console (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interviewer Question Box */}
            <Card className="border-l-4 border-l-primary bg-card/90 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                      Q{turnNumber}
                    </span>
                    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Interviewer Prompt
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    Turn {turnNumber} of {totalTurns}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-medium leading-relaxed text-foreground">
                  "{currentQuestion}"
                </p>

                {/* Subtle speaking pulse animation */}
                {isSpeechEnabled && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-primary animate-ping" />
                    <span>Interviewer audio synthesis active</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Candidate Response Workspace */}
            <Card className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Your Response</CardTitle>
                  <div className="flex items-center rounded-lg border border-border p-1 bg-muted/40 text-xs">
                    <button
                      type="button"
                      onClick={() => setInputMode('voice')}
                      className={`px-3 py-1 rounded-md font-medium transition-all ${
                        inputMode === 'voice'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Microphone (STT)
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('text')}
                      className={`px-3 py-1 rounded-md font-medium transition-all ${
                        inputMode === 'text'
                          ? 'bg-background text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Text Editor
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {inputMode === 'voice' && (
                  <div className="flex flex-col items-center justify-center p-6 border border-dashed border-border rounded-lg bg-muted/20">
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`size-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        isRecording
                          ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-500/20'
                          : 'bg-primary text-primary-foreground hover:scale-105'
                      }`}
                    >
                      {isRecording ? <MicOff className="size-8" /> : <Mic className="size-8" />}
                    </button>
                    <p className="text-sm font-medium mt-4">
                      {isRecording ? 'Listening... Speak your answer now' : 'Click to start recording your answer'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Audio is transcribed in real-time using high-precision speech-to-text
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Candidate Transcript / Notes:</span>
                    <span>{studentAnswer.split(' ').filter(Boolean).length} words</span>
                  </div>
                  <Textarea
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    placeholder="Your transcribed or typed answer will appear here. Explain your thought process, architectural choices, and edge cases clearly..."
                    rows={5}
                    className="font-sans text-sm leading-relaxed"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-border pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStudentAnswer('')}
                  disabled={!studentAnswer || isEvaluating}
                >
                  Clear Transcript
                </Button>

                <Button
                  onClick={handleSubmitTurn}
                  disabled={!studentAnswer.trim() || isEvaluating}
                  className="gap-2 font-medium"
                >
                  {isEvaluating ? (
                    <>
                      <span className="size-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                      <span>Evaluating Turn...</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      <span>Submit Answer & Continue</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column: Live Turn Feedback & Coaching Feed (1 Col) */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Live Turn Scorecard</span>
                  <Award className="size-4 text-primary" />
                </CardTitle>
                <CardDescription>Instant coaching evaluations for each answer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[580px] overflow-y-auto">
                {evaluations.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-xs">
                    Your real-time scoring and coaching tips will appear here after you submit your first turn.
                  </div>
                ) : (
                  evaluations.map((ev, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-border bg-card/60 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Turn {ev.turn_number} Score</span>
                        <Badge
                          variant={ev.score >= 85 ? 'success' : ev.score >= 70 ? 'warning' : 'destructive'}
                          className="font-mono text-[10px]"
                        >
                          {ev.score} / 100
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                        <div>Clarity: <span className="font-mono font-medium text-foreground">{ev.clarity_score}%</span></div>
                        <div>Technical Depth: <span className="font-mono font-medium text-foreground">{ev.depth_score}%</span></div>
                      </div>

                      <p className="text-muted-foreground border-t border-border/50 pt-2 leading-relaxed">
                        <span className="font-semibold text-foreground">Coach Note:</span> {ev.feedback}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Comprehensive Final Scorecard Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
              <CheckCircle2 className="size-4" />
              <span>Session Concluded</span>
            </div>
            <DialogTitle className="text-2xl font-bold mt-1">
              Interview Evaluation: {targetRole}
            </DialogTitle>
            <DialogDescription>
              Comprehensive performance report generated by the AI evaluation engine.
            </DialogDescription>
          </DialogHeader>

          {finalReport && (
            <div className="space-y-5 my-2">
              {/* Verdict KPI Banner */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">Hiring Recommendation</p>
                  <p className="text-2xl font-black text-emerald-400 mt-0.5">
                    {finalReport.verdict.replace('_', ' ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase font-medium">Overall Score</p>
                  <p className="text-3xl font-black font-mono">{finalReport.overall_score}%</p>
                </div>
              </div>

              {/* Sub-Metric Bars */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Technical Depth</span>
                    <span className="font-mono">{finalReport.metrics.technical_depth}%</span>
                  </div>
                  <Progress value={finalReport.metrics.technical_depth} className="h-1.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Communication Clarity</span>
                    <span className="font-mono">{finalReport.metrics.communication_clarity}%</span>
                  </div>
                  <Progress value={finalReport.metrics.communication_clarity} className="h-1.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Problem Solving Structure</span>
                    <span className="font-mono">{finalReport.metrics.problem_solving}%</span>
                  </div>
                  <Progress value={finalReport.metrics.problem_solving} className="h-1.5" />
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                  <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5" />
                    <span>Demonstrated Strengths</span>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    {finalReport.key_strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 space-y-2">
                  <p className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="size-3.5" />
                    <span>Areas to Polish</span>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                    {finalReport.key_areas_for_growth.map((grow, i) => (
                      <li key={i}>{grow}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setShowReportDialog(false);
                resetSession();
              }}
              className="w-full sm:w-auto"
            >
              Finish & Return to Studio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
