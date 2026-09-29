import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Briefcase,
  Target,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { careersApi } from '@/api/client';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export const CareersExplorerPage: React.FC = () => {
  const { student } = useAuthStore();
  const [careers, setCareers] = useState<any[]>([]);
  const [activeGoalId, setActiveGoalId] = useState<string>('c-1');

  useEffect(() => {
    async function loadCareers() {
      const data = await careersApi.getAll();
      setCareers(data);
    }
    loadCareers();
  }, []);

  const handleSetGoal = async (careerId: string) => {
    await careersApi.setGoal({ career_id: careerId, priority: 1 });
    setActiveGoalId(careerId);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl font-bold tracking-tight">Career Explorer & Role Benchmarks</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Explore industry technical tracks, skill requirements, compensation bands, and set active targets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {careers.map((career) => {
          const isCurrentGoal = activeGoalId === career.id;

          return (
            <Card
              key={career.id}
              className={`border transition-all flex flex-col justify-between ${
                isCurrentGoal ? 'border-primary shadow-sm bg-primary/5' : 'border-border'
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={career.demand_level.includes('High') ? 'success' : 'outline'} className="text-[10px]">
                    {career.demand_level} Demand
                  </Badge>
                  {isCurrentGoal && (
                    <Badge variant="cyan" className="text-[10px] gap-1">
                      <Target className="size-3" />
                      <span>Active Goal</span>
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-bold mt-2">{career.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">{career.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Compensation Range:</p>
                  <p className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                    {formatCurrency(career.average_salary_min)} - {formatCurrency(career.average_salary_max)}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Core Technical Benchmarks:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {career.career_skills?.map((cs: any, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {cs.skill?.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t border-border flex items-center justify-between">
                <Button
                  size="sm"
                  variant={isCurrentGoal ? 'outline' : 'default'}
                  onClick={() => handleSetGoal(career.id)}
                  className="w-full text-xs gap-1.5"
                >
                  {isCurrentGoal ? (
                    <>
                      <CheckCircle2 className="size-3.5 text-primary" />
                      <span>Targeting This Role</span>
                    </>
                  ) : (
                    <>
                      <span>Set as My Goal</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
