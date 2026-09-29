import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { jobsApi, applicationsApi, skillsApi } from '@/api/client';
import { useAuthStore } from '@/store/authStore';

export const RecruiterPortalPage: React.FC = () => {
  const { role, switchRole } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Job creation modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('Bengaluru, India');
  const [newSkills, setNewSkills] = useState<{ name: string; weight: number; proficiency: string }[]>([
    { name: 'Python', weight: 3.0, proficiency: 'ADVANCED' },
    { name: 'PostgreSQL', weight: 2.0, proficiency: 'INTERMEDIATE' },
    { name: 'Docker', weight: 1.5, proficiency: 'BEGINNER' },
  ]);

  // Load jobs and initial candidates
  useEffect(() => {
    async function loadData() {
      try {
        const jobsList = await jobsApi.getAll();
        setJobs(jobsList);
        if (jobsList.length > 0) {
          setSelectedJob(jobsList[0]);
          const candList = await jobsApi.getCandidates(jobsList[0].id);
          setCandidates(candList);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectJob = async (job: any) => {
    setSelectedJob(job);
    setLoading(true);
    try {
      const candList = await jobsApi.getCandidates(job.id);
      setCandidates(candList);
    } finally {
      setLoading(false);
    }
  };

  // ATS State Transition: APPLIED -> REVIEWING -> INTERVIEW_SCHEDULED -> OFFER / REJECTED
  const handleTransition = async (applicationId: string, nextStatus: string) => {
    try {
      await applicationsApi.transitionStatus(applicationId, nextStatus, `Updated stage to ${nextStatus}`);
      // Optimistic update
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === applicationId
            ? {
                ...c,
                status: nextStatus,
                status_history: [
                  ...(c.status_history || []),
                  { from_status: c.status, to_status: nextStatus, role: 'RECRUITER', timestamp: new Date().toISOString() },
                ],
              }
            : c
        )
      );
    } catch (err: any) {
      alert(err.message || 'Status transition failed');
    }
  };

  const handleCreateJob = async () => {
    if (!newTitle.trim()) return;
    const created = {
      id: `job-${Date.now()}`,
      title: newTitle,
      description: newDescription || 'Fast-paced product engineering team.',
      location: newLocation,
      work_mode: 'HYBRID',
      salary_min: 1500000,
      salary_max: 2500000,
      company: { name: 'Razorpay' },
      job_skills: newSkills.map((s) => ({
        skill: { name: s.name },
        weight: s.weight,
        required_proficiency: s.proficiency,
      })),
      posted_at: new Date().toISOString(),
    };
    setJobs([created, ...jobs]);
    setSelectedJob(created);
    setCandidates([]);
    setIsCreateOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Role reminder banner if not currently viewing as RECRUITER */}
      {role !== 'RECRUITER' && (
        <div className="flex items-center justify-between p-3 rounded-lg border border-amber-500/20 bg-amber-500/10 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-medium">
            <Building2 className="size-4" />
            <span>Currently previewing the enterprise portal. Click to enable Recruiter Privileges.</span>
          </div>
          <Button size="sm" variant="warning" onClick={() => switchRole('RECRUITER')}>
            Switch to Recruiter Role
          </Button>
        </div>
      )}

      {/* Recruiter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recruiter ATS & Talent Match Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Post weighted skill requisitions, view candidates ranked by compatibility, and drive stage transitions.
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="size-4" />
          <span>Post Open Position</span>
        </Button>
      </div>

      {/* Two Column Layout: Requisitions on left, Candidates on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Requisitions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Active Job Requisitions ({jobs.length})
            </h2>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => handleSelectJob(job)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:border-border/80 hover:bg-card/70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-foreground leading-snug">{job.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                        <Building2 className="size-3" />
                        <span>{job.company?.name || 'Company'}</span> • <span>{job.location}</span>
                      </p>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {job.work_mode}
                    </Badge>
                  </div>

                  {/* Required skill badges with weights */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50">
                    {job.job_skills?.map((js: any, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-[11px] font-medium"
                      >
                        <span>{js.skill?.name || 'Skill'}</span>
                        <span className="font-mono text-[10px] text-primary">w:{js.weight || 1.0}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Candidate Ranking & ATS Pipeline (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Ranked Candidates for: <span className="text-foreground font-bold">{selectedJob?.title}</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Ranked by Weighted Match Formula</span>
            </div>
          </div>

          {candidates.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <p className="text-sm text-muted-foreground">No candidate applications submitted for this listing yet.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {candidates.map((cand) => (
                <Card key={cand.id} className="border-border hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Candidate info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-foreground">
                            {cand.student?.first_name} {cand.student?.last_name}
                          </h3>
                          <Badge
                            variant={
                              cand.status === 'REVIEWING'
                                ? 'warning'
                                : cand.status === 'INTERVIEW_SCHEDULED'
                                ? 'cyan'
                                : cand.status === 'OFFER'
                                ? 'success'
                                : 'outline'
                            }
                          >
                            {cand.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {cand.student?.student_education?.[0]?.degree || 'Computer Science'} • GPA:{' '}
                          {cand.student?.student_education?.[0]?.grade_point_avg || '8.5'}/10
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{cand.student?.bio}</p>
                      </div>

                      {/* Match Score Badge Indicator */}
                      <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-xl border border-border">
                        <div className="text-right">
                          <p className="text-2xl font-black font-mono text-emerald-400">
                            {cand.match_score}%
                          </p>
                          <p className="text-[10px] text-muted-foreground font-semibold uppercase">Overall Fit</p>
                        </div>
                      </div>
                    </div>

                    {/* Skill Breakdown Grid */}
                    <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-emerald-400 block mb-1.5">
                          ✓ Matched Skills ({cand.match_breakdown?.matched_skills?.length || 0}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cand.match_breakdown?.matched_skills?.map((ms: any, i: number) => (
                            <Badge key={i} variant="success" className="text-[10px]">
                              {ms.skill_name} ({ms.student_proficiency})
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold text-amber-400 block mb-1.5">
                          ⚠ Missing / Skill Gaps ({cand.match_breakdown?.missing_skills?.length || 0}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cand.match_breakdown?.missing_skills?.map((ms: any, i: number) => (
                            <Badge key={i} variant="outline" className="text-[10px] text-muted-foreground">
                              {ms.skill_name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stage Transition Control Bar */}
                    <div className="mt-5 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-muted-foreground">
                        Current Stage: <span className="font-semibold text-foreground">{cand.status}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Allowed State Actions */}
                        {cand.status === 'APPLIED' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleTransition(cand.id, 'REVIEWING')}
                            className="gap-1 text-xs"
                          >
                            <span>Move to Reviewing</span>
                            <ArrowRight className="size-3" />
                          </Button>
                        )}

                        {cand.status === 'REVIEWING' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleTransition(cand.id, 'INTERVIEW_SCHEDULED')}
                            className="gap-1 text-xs bg-cyan-600 hover:bg-cyan-700 text-white"
                          >
                            <span>Schedule Interview</span>
                            <ArrowRight className="size-3" />
                          </Button>
                        )}

                        {cand.status === 'INTERVIEW_SCHEDULED' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleTransition(cand.id, 'OFFER')}
                            className="gap-1 text-xs"
                          >
                            <span>Extend Offer</span>
                            <CheckCircle2 className="size-3" />
                          </Button>
                        )}

                        {cand.status === 'OFFER' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleTransition(cand.id, 'SELECTED')}
                            className="gap-1 text-xs"
                          >
                            <span>Confirm Hire</span>
                            <CheckCircle2 className="size-3" />
                          </Button>
                        )}

                        {/* Rejection option at any active stage */}
                        {!['REJECTED', 'SELECTED'].includes(cand.status) && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleTransition(cand.id, 'REJECTED')}
                            className="gap-1 text-xs"
                          >
                            <span>Reject</span>
                            <XCircle className="size-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Position Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Post Open Job Requisition</DialogTitle>
            <DialogDescription>
              Specify position details and weighted skill requirements for automated candidate ranking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Position Title</label>
              <Input
                placeholder="e.g. Senior Backend Engineer"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Location & Work Mode</label>
              <Input
                placeholder="e.g. Bengaluru, India (Hybrid)"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Description</label>
              <Textarea
                placeholder="Core responsibilities and tech stack overview..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold block">Required Skills with Match Weights</label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {newSkills.map((sk, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded border border-border bg-muted/20 text-xs">
                    <span className="font-semibold flex-1">{sk.name}</span>
                    <span className="text-muted-foreground">Proficiency: {sk.proficiency}</span>
                    <Badge variant="cyan" className="font-mono">Weight: {sk.weight}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateJob} disabled={!newTitle.trim()}>
              Publish Requisition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
