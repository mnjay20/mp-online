import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const SkillGapRoadmapPage: React.FC = () => {
  const [selectedDuration, setSelectedDuration] = useState<'3' | '6'>('3');

  const gaps = [
    {
      skill: 'Docker & Containerization',
      importance: 'CRITICAL',
      weight: 3.0,
      currentProficiency: 'NONE',
      requiredProficiency: 'INTERMEDIATE',
      recommendedCourse: 'Mastering Docker & Container Orchestration',
    },
    {
      skill: 'Redis Caching & Pub/Sub',
      importance: 'IMPORTANT',
      weight: 2.0,
      currentProficiency: 'NONE',
      requiredProficiency: 'INTERMEDIATE',
      recommendedCourse: 'Redis Caching & Distributed Systems',
    },
    {
      skill: 'Apache Kafka Event Streaming',
      importance: 'NICE_TO_HAVE',
      weight: 1.0,
      currentProficiency: 'BEGINNER',
      requiredProficiency: 'BEGINNER',
      recommendedCourse: 'Learn Kafka Architecture & Event Streaming',
    },
  ];

  const milestones3M = [
    {
      month: 'Month 1',
      title: 'Containerization & Microservices Architecture',
      focus: 'Dockerfiles, multi-stage builds, container networking, and local compose orchestration.',
      deliverable: 'Containerize your Raft Key-Value Store project with healthchecks and volume persistence.',
      status: 'IN_PROGRESS',
    },
    {
      month: 'Month 2',
      title: 'Caching Strategies & In-Memory Data Stores',
      focus: 'Redis data structures, cache-aside pattern, distributed rate limiting, and session stores.',
      deliverable: 'Integrate Redis caching layer into backend service reducing p99 latency under 20ms.',
      status: 'UPCOMING',
    },
    {
      month: 'Month 3',
      title: 'System Design & High-Throughput Optimization',
      focus: 'Horizontal scaling, database connection pooling, read replicas, and distributed tracing.',
      deliverable: 'Conduct 5 AI Mock Technical Interviews and apply to Tier-1 backend listings.',
      status: 'UPCOMING',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Skill Gap & Personalized Roadmap</h1>
            <Badge variant="cyan" className="text-xs">Backend Engineer</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Dynamic LangGraph analysis compiled from your verified competencies against industry market demand.
          </p>
        </div>

        <Link to="/courses">
          <Button variant="outline" className="gap-2">
            <BookOpen className="size-4" />
            <span>Search Catalog & Web Courses</span>
          </Button>
        </Link>
      </div>

      {/* Identified Skill Deficits */}
      <div className="space-y-4">
        <h2 className="text-base font-bold flex items-center gap-2">
          <AlertTriangle className="size-4 text-amber-500" />
          <span>Top Identified Skill Gaps</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gaps.map((gap, i) => (
            <Card key={i} className="border-border bg-card/60">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant={gap.importance === 'CRITICAL' ? 'destructive' : gap.importance === 'IMPORTANT' ? 'warning' : 'outline'} className="text-[10px]">
                    {gap.importance}
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">Weight: {gap.weight}</span>
                </div>
                <CardTitle className="text-base font-bold mt-2">{gap.skill}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target Proficiency:</span>
                  <span className="font-semibold text-foreground">{gap.requiredProficiency}</span>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border border-border/50 text-xs">
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Recommended Module:</span>
                  <span className="font-medium text-foreground">{gap.recommendedCourse}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Month-by-Month Structured Roadmap */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Calendar className="size-4 text-primary" />
            <span>Curated Action Roadmap</span>
          </h2>

          <div className="flex items-center rounded-lg border border-border p-1 bg-muted/30 text-xs">
            <button
              onClick={() => setSelectedDuration('3')}
              className={`px-3 py-1 rounded font-medium ${selectedDuration === '3' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
            >
              3-Month Sprint
            </button>
            <button
              onClick={() => setSelectedDuration('6')}
              className={`px-3 py-1 rounded font-medium ${selectedDuration === '6' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
            >
              6-Month Master
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {milestones3M.map((milestone, idx) => (
            <Card key={idx} className="border-border hover:border-primary/50 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold font-mono text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-semibold uppercase text-primary tracking-wider">{milestone.month}</span>
                        <h3 className="text-lg font-bold text-foreground">{milestone.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{milestone.focus}</p>
                      <div className="mt-3 p-3 rounded-lg border border-border bg-muted/20 text-xs flex items-center gap-2">
                        <Award className="size-4 text-emerald-400 shrink-0" />
                        <span><strong className="text-foreground">Proof-of-Work Deliverable:</strong> {milestone.deliverable}</span>
                      </div>
                    </div>
                  </div>

                  <Badge variant={milestone.status === 'IN_PROGRESS' ? 'cyan' : 'outline'} className="self-start text-xs shrink-0">
                    {milestone.status === 'IN_PROGRESS' ? 'Current Focus' : 'Scheduled'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
