import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Target,
  FileCheck2,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  BookOpen,
  Briefcase,
  Mic,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { studentApi, skillsApi, applicationsApi } from '@/api/client';
import { useAuthStore } from '@/store/authStore';

export const DashboardPage: React.FC = () => {
  const { student } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [mySkills, setMySkills] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [profData, skillsData, appsData] = await Promise.all([
          studentApi.getProfile(),
          skillsApi.getMySkills(),
          applicationsApi.getMyApplications(),
        ]);
        setProfile(profData);
        setMySkills(skillsData);
        setApplications(appsData);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const readinessScore = student?.readiness_score || 78;
  const completeness = student?.profile_completeness || 85;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Welcome Banner with Editorial Distinction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {student?.first_name || 'Alex'}
          </h1>
          <p className="text-muted-foreground mt-1 text-base">
            Targeting <span className="font-semibold text-foreground">{student?.target_career_title || 'Backend Engineer'}</span>. Your profile readiness is trending upward.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/copilot">
            <Button variant="outline" className="gap-2">
              <Sparkles className="size-4 text-primary" />
              <span>Ask Copilot</span>
            </Button>
          </Link>
          <Link to="/interview">
            <Button variant="default" className="gap-2">
              <Mic className="size-4" />
              <span>Launch Mock Interview</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-primary bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Readiness Index</span>
              <TrendingUp className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-black">{readinessScore}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={readinessScore} className="h-1.5 mt-1" />
            <p className="text-xs text-muted-foreground mt-2">
              +6% improvement following your last resume review
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Verified Skills</span>
              <ShieldCheck className="size-4 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-black">
              {mySkills.filter((s) => s.verified).length} / {mySkills.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge variant="success" className="text-[10px]">Verified via Assessment</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Docker & Redis remain top gap priorities
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Active ATS Applications</span>
              <Briefcase className="size-4 text-amber-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-black">{applications.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-emerald-400">1 in Reviewing</span>
              <span className="text-muted-foreground text-xs">• 1 Applied</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Avg match score across listings: 78.2%
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-cyan-500 bg-card/50">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>Profile Health</span>
              <FileCheck2 className="size-4 text-cyan-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-black">{completeness}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={completeness} indicatorClassName="bg-cyan-500" className="h-1.5 mt-1" />
            <p className="text-xs text-muted-foreground mt-2">
              Add 1 more project link to reach 100%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Skill Matrix & Roadmap Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Profile Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle>Skill Competency & Verification</CardTitle>
                <CardDescription>
                  Evaluated against requirements for Senior Backend Engineer roles
                </CardDescription>
              </div>
              <Link to="/skill-gap">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  <span>Detailed Gap Analysis</span>
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mySkills.map((sk) => (
                  <div key={sk.id} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-secondary text-foreground font-mono text-xs font-semibold">
                        {sk.skill?.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{sk.skill?.name}</p>
                          {sk.verified && (
                            <Badge variant="success" className="text-[10px] py-0 px-1">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{sk.skill?.category || 'Technical'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="font-mono text-xs">
                        {sk.proficiency}
                      </Badge>
                      <div className="w-24 hidden sm:block">
                        <Progress
                          value={
                            sk.proficiency === 'EXPERT'
                              ? 100
                              : sk.proficiency === 'ADVANCED'
                              ? 85
                              : sk.proficiency === 'INTERMEDIATE'
                              ? 65
                              : 40
                          }
                          className="h-1.5"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Job Applications Feed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle>Active Application Pipeline</CardTitle>
                <CardDescription>Real-time ATS status transitions and match scores</CardDescription>
              </div>
              <Link to="/applications">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  <span>Full ATS Tracker</span>
                  <ArrowUpRight className="size-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card/40 hover:bg-card/70 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base">{app.job?.title || 'Job Application'}</span>
                        <span className="text-xs text-muted-foreground">• {app.job?.company?.name || 'Company'}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Applied on {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-emerald-400 font-mono">
                          {app.match_score}% Match
                        </span>
                        <div className="text-[11px] text-muted-foreground">Weighted Overlap</div>
                      </div>
                      <Badge
                        variant={
                          app.status === 'REVIEWING'
                            ? 'warning'
                            : app.status === 'INTERVIEW_SCHEDULED'
                            ? 'cyan'
                            : app.status === 'OFFER'
                            ? 'success'
                            : 'outline'
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Action Items & Interview Recommendation */}
        <div className="space-y-6">
          {/* Quick AI Mock Interview Promo */}
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
                <Sparkles className="size-4" />
                <span>AI Simulation Studio</span>
              </div>
              <CardTitle className="text-xl mt-1">Ready for a 5-minute technical drill?</CardTitle>
              <CardDescription>
                Simulate a real-time voice interview for <span className="font-semibold text-foreground">Backend Engineer</span> with instant clarity and depth feedback.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-background/60 p-3 text-xs border border-border/60 text-muted-foreground">
                <span className="font-semibold text-foreground">Next Up:</span> Concurrency Control & Database Deadlock Prevention
              </div>
              <Link to="/interview" className="block">
                <Button className="w-full gap-2">
                  <Mic className="size-4" />
                  <span>Start Interview Now</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* High Priority Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recommended Next Actions</CardTitle>
              <CardDescription>Prioritized by impact on your career match rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                  <div className="size-2 rounded-full bg-emerald-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Close Docker Skill Gap</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Completing this module will raise your match rate to 91% for Razorpay and Postman.
                    </p>
                    <Link to="/courses" className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1 mt-1.5">
                      Explore course recommendations <ArrowUpRight className="size-3" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                  <div className="size-2 rounded-full bg-amber-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Re-scan Resume with ATS Engine</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your current ATS score is 87/100. Adding unit testing keywords can boost it to 94+.
                    </p>
                    <Link to="/resume" className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1 mt-1.5">
                      Upload latest PDF <ArrowUpRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
