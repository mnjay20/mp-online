import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  MapPin,
  Building2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { jobsApi, applicationsApi } from '@/api/client';
import { formatCurrency } from '@/lib/utils';

export const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [isApplying, setIsApplying] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobs() {
      const data = await jobsApi.getAll();
      setJobs(data);
    }
    loadJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    setIsApplying(jobId);
    try {
      await applicationsApi.apply(jobId, 'Applied via Pathfinder Portal');
      setAppliedJobIds(new Set([...appliedJobIds, jobId]));
    } finally {
      setIsApplying(null);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Placement & Job Opportunities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Verified engineering roles with transparent skill weights and automated candidate compatibility scoring.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by role, company, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const hasApplied = appliedJobIds.has(job.id);
          return (
            <Card key={job.id} className="border-border hover:border-primary/50 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl font-bold text-foreground">{job.title}</h2>
                      <Badge variant="cyan" className="font-mono text-xs">{job.work_mode}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <Building2 className="size-3.5 text-muted-foreground" />
                        {job.company?.name || 'Top Tech Firm'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        {job.location}
                      </span>
                      <span>
                        Salary: <strong className="text-emerald-400 font-mono">{formatCurrency(job.salary_min)} - {formatCurrency(job.salary_max)}</strong>
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground pt-1 leading-relaxed">{job.description}</p>

                    {/* Skill tags with weights */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {job.job_skills?.map((js: any, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs gap-1 py-1">
                          <span>{js.skill?.name}</span>
                          <span className="text-primary font-mono font-bold text-[10px]">w:{js.weight || 1.0}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <Button
                      onClick={() => handleApply(job.id)}
                      disabled={hasApplied || isApplying === job.id}
                      variant={hasApplied ? 'success' : 'default'}
                      className="gap-2 w-full sm:w-auto"
                    >
                      {hasApplied ? (
                        <>
                          <CheckCircle2 className="size-4" />
                          <span>Applied Successfully</span>
                        </>
                      ) : isApplying === job.id ? (
                        <span>Computing Match...</span>
                      ) : (
                        <>
                          <span>Apply with Profile</span>
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>

                    <p className="text-[11px] text-muted-foreground">
                      Instant ATS score calculated on submission
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
