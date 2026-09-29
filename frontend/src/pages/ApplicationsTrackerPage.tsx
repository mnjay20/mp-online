import React, { useState, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
  Clock,
  Building2,
  ChevronRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { applicationsApi } from '@/api/client';

const ATS_STAGES = ['APPLIED', 'REVIEWING', 'INTERVIEW_SCHEDULED', 'OFFER', 'SELECTED'];

export const ApplicationsTrackerPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    async function loadApps() {
      const data = await applicationsApi.getMyApplications();
      setApplications(data);
    }
    loadApps();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-bold tracking-tight">Application Tracking System (ATS)</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor real-time recruiter stage transitions, computed match scores, and interview invites.
        </p>
      </div>

      <div className="space-y-6">
        {applications.map((app) => {
          const currentStageIndex = ATS_STAGES.indexOf(app.status);
          const isRejected = app.status === 'REJECTED';

          return (
            <Card key={app.id} className="border-border">
              <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-xl font-bold text-foreground">{app.job?.title}</h2>
                      <Badge
                        variant={
                          app.status === 'REVIEWING'
                            ? 'warning'
                            : app.status === 'INTERVIEW_SCHEDULED'
                            ? 'cyan'
                            : app.status === 'OFFER'
                            ? 'success'
                            : isRejected
                            ? 'destructive'
                            : 'outline'
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-muted-foreground" />
                      <span>{app.job?.company?.name || 'Company'}</span> • Applied on {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-muted/40 px-4 py-2 rounded-xl border border-border">
                    <div className="text-right">
                      <p className="text-xl font-black font-mono text-emerald-400">{app.match_score}%</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Profile Overlap</p>
                    </div>
                  </div>
                </div>

                {/* Sequential Stage Stepper Visualizer */}
                <div className="pt-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Stage Progression Pipeline
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {ATS_STAGES.map((st, idx) => {
                      const isPassed = !isRejected && currentStageIndex >= idx;
                      const isCurrent = !isRejected && currentStageIndex === idx;

                      return (
                        <div
                          key={st}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            isCurrent
                              ? 'border-primary bg-primary/10 shadow-xs'
                              : isPassed
                              ? 'border-emerald-500/30 bg-emerald-500/5'
                              : 'border-border bg-card/40 opacity-50'
                          }`}
                        >
                          <div className="flex justify-center mb-1">
                            {isPassed ? (
                              <CheckCircle2 className="size-4 text-emerald-400" />
                            ) : (
                              <div className="size-4 rounded-full border border-muted-foreground" />
                            )}
                          </div>
                          <p className="text-xs font-semibold">{st.replace('_', ' ')}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status History Audit Trail */}
                {app.status_history && app.status_history.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Stage Audit History
                    </p>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      {app.status_history.map((sh: any, i: number) => (
                        <div key={i} className="flex items-center gap-2">
                          <Clock className="size-3 text-muted-foreground" />
                          <span>
                            Transitioned to <strong className="text-foreground">{sh.to_status}</strong> by {sh.role} on{' '}
                            {new Date(sh.timestamp).toLocaleString()} {sh.notes && `("${sh.notes}")`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
