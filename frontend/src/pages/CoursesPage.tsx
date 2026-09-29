import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Globe,
  Tag,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { coursesApi } from '@/api/client';
import { useAuthStore } from '@/store/authStore';

export const CoursesPage: React.FC = () => {
  const { role } = useAuthStore();
  const [courses, setCourses] = useState<any[]>([]);
  const [gapRecommendations, setGapRecommendations] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingGap, setIsSearchingGap] = useState(false);
  const [gapSkillInput, setGapSkillInput] = useState('Docker, Kubernetes, Redis');

  // Admin add course modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('Platform Academy');
  const [newUrl, setNewUrl] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('INTERMEDIATE');

  useEffect(() => {
    async function loadCatalog() {
      const data = await coursesApi.getAll();
      setCourses(data);
      // Run initial gap search
      const gapData = await coursesApi.recommendGapCourses(['Docker', 'Redis']);
      setGapRecommendations(gapData);
    }
    loadCatalog();
  }, []);

  const handleSearchGap = async () => {
    if (!gapSkillInput.trim()) return;
    setIsSearchingGap(true);
    try {
      const skills = gapSkillInput.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await coursesApi.recommendGapCourses(skills);
      setGapRecommendations(res);
    } finally {
      setIsSearchingGap(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const newCourse = {
      id: `crs-${Date.now()}`,
      title: newTitle,
      provider: newProvider,
      url: newUrl,
      difficulty: newDifficulty,
      is_free: true,
      price: 0,
      rating: 4.8,
      duration_hours: 15,
    };
    setCourses([newCourse, ...courses]);
    setIsAddOpen(false);
    setNewTitle('');
    setNewUrl('');
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm('Are you sure you want to remove this course from the platform catalog?')) {
      await coursesApi.delete(id);
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Curated Course Catalog & Web Search</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse internal courses or query Tavily for real-time live internet training modules (Free & Paid).
          </p>
        </div>

        {role === 'ADMIN' && (
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="size-4" />
            <span>Add Course (Admin)</span>
          </Button>
        )}
      </div>

      {/* AI & Tavily Live Gap Search Box */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="size-4" />
                <span>Tavily Live Internet Course Harvester</span>
              </span>
              <h2 className="text-lg font-bold">Search Best Courses for Specific Skill Gaps</h2>
              <p className="text-xs text-muted-foreground">
                App catalog courses are prioritized first, followed by live scraped paid and unpaid training.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Input
                value={gapSkillInput}
                onChange={(e) => setGapSkillInput(e.target.value)}
                placeholder="e.g. Docker, Redis, Kubernetes"
                className="w-full md:w-80 bg-background"
              />
              <Button onClick={handleSearchGap} disabled={isSearchingGap} className="gap-2 shrink-0">
                <Search className="size-4" />
                <span>{isSearchingGap ? 'Harvesting...' : 'Search'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Platform Catalog ({courses.length})</TabsTrigger>
          <TabsTrigger value="gap-unpaid">
            Free Web Courses ({gapRecommendations?.web_courses?.unpaid?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="gap-paid">
            Paid Certifications ({gapRecommendations?.web_courses?.paid?.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Platform Courses */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="border-border hover:shadow-md transition-all flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="cyan" className="text-[10px]">{course.difficulty}</Badge>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {course.is_free ? 'FREE' : `₹${course.price}`}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold mt-2 leading-snug">{course.title}</CardTitle>
                  <CardDescription className="text-xs mt-1">{course.provider}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pb-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <strong className="text-foreground">{course.rating || 4.8}</strong>
                    </span>
                    <span>• {course.duration_hours || 10} hours</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t border-border flex items-center justify-between">
                  <a href={course.url} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <span>View Course</span>
                      <ExternalLink className="size-3.5" />
                    </Button>
                  </a>

                  {role === 'ADMIN' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Free Web Courses */}
        <TabsContent value="gap-unpaid">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gapRecommendations?.web_courses?.unpaid?.map((wc: any, idx: number) => (
              <Card key={idx} className="border-border">
                <CardContent className="p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Badge variant="success" className="text-[10px]">Free Web Resource</Badge>
                    <h3 className="font-bold text-base text-foreground mt-1">{wc.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Globe className="size-3" />
                      <span>{wc.provider}</span>
                    </p>
                  </div>
                  <a href={wc.url} target="_blank" rel="noreferrer" className="shrink-0">
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      <span>Open</span>
                      <ExternalLink className="size-3" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Paid Web Courses */}
        <TabsContent value="gap-paid">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gapRecommendations?.web_courses?.paid?.map((pc: any, idx: number) => (
              <Card key={idx} className="border-border">
                <CardContent className="p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Badge variant="warning" className="text-[10px]">Paid Industry Training</Badge>
                    <h3 className="font-bold text-base text-foreground mt-1">{pc.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Globe className="size-3" />
                      <span>{pc.provider}</span> • <span className="font-semibold text-foreground">{pc.price}</span>
                    </p>
                  </div>
                  <a href={pc.url} target="_blank" rel="noreferrer" className="shrink-0">
                    <Button size="sm" variant="outline" className="gap-1 text-xs">
                      <span>Enroll</span>
                      <ExternalLink className="size-3" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Admin Add Course Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Course to Platform Catalog</DialogTitle>
            <DialogDescription>Admin privilege: Register new internal or external module.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold">Course Title</label>
              <Input
                placeholder="e.g. Distributed Consensus in Go"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Provider</label>
              <Input
                placeholder="e.g. Platform Academy"
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold">Course URL</label>
              <Input
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCourse} disabled={!newTitle.trim() || !newUrl.trim()}>
              Save Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
