import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Activity,
  BarChart3,
  Calendar,
  ChevronRight,
  Disc3,
  Flame,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Music,
  PieChart,
  Play,
  Settings,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Video,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="STAGEONE" className="h-6 w-auto" />
            <span className="font-bold tracking-widest text-sm mt-0.5">STAGEONE</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div className="space-y-1">
            <p className="px-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Main</p>
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
            <NavItem icon={<Flame size={18} />} label="Campaigns" />
            <NavItem icon={<Wand2 size={18} />} label="AI Studio" badge="PRO" href="/studio" />
            <NavItem icon={<BarChart3 size={18} />} label="Analytics" />
          </div>
          
          <div className="space-y-1">
            <p className="px-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Brand</p>
            <NavItem icon={<User size={18} />} label="DNA Profile" />
            <NavItem icon={<ImageIcon size={18} />} label="Assets" />
          </div>
          
          <div className="space-y-1">
            <p className="px-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">System</p>
            <NavItem icon={<Settings size={18} />} label="Settings" />
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors">
            <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
              OA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Outsider Art</p>
              <p className="text-xs text-muted-foreground truncate">Independent</p>
            </div>
            <LogOut size={16} className="text-muted-foreground" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Topnav */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-medium">Overview</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground" data-testid="button-date-filter">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-new-rollout">
              <Sparkles className="mr-2 h-4 w-4" />
              New Rollout
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 space-y-8">
          
          {/* Welcome & Stats */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Welcome back. Your momentum is building.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Streams" value="2.4M" trend="+12.5%" icon={<Play className="text-primary h-5 w-5" />} />
              <StatCard title="Audience Reach" value="845K" trend="+8.2%" icon={<Users className="text-primary h-5 w-5" />} />
              <StatCard title="Engagement Rate" value="14.2%" trend="+2.1%" icon={<Activity className="text-primary h-5 w-5" />} />
              <StatCard title="Next Release" value="14 Days" subtext="Midnight Echoes" icon={<Calendar className="text-primary h-5 w-5" />} />
            </div>
          </section>

          {/* Active Campaigns */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium">Active Campaigns</h3>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-transparent" data-testid="button-view-all-campaigns">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Campaign Card 1 */}
              <div className="bg-card border border-card-border rounded-xl p-6 hover-elevate transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium border border-primary/20">Phase 2: Tease</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={12}/> Oct 12 - Nov 05</span>
                    </div>
                    <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">Midnight Echoes EP</h4>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center border border-border">
                    <Disc3 className="text-muted-foreground h-5 w-5" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Rollout Progress</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">Generated</span>
                      <span className="text-sm font-medium">12 Assets</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">Scheduled</span>
                      <span className="text-sm font-medium">8 Posts</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">Platform</span>
                      <div className="flex gap-1">
                        <div className="w-5 h-5 rounded bg-background border border-border flex items-center justify-center"><Video size={10} /></div>
                        <div className="w-5 h-5 rounded bg-background border border-border flex items-center justify-center"><ImageIcon size={10} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Card 2 */}
              <div className="bg-card border border-card-border rounded-xl p-6 hover-elevate transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs font-medium border border-border">Phase 4: Sustain</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={12}/> Sep 01 - Oct 30</span>
                    </div>
                    <h4 className="text-lg font-semibold group-hover:text-primary transition-colors">Neon Nights Single</h4>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center border border-border">
                    <Music className="text-muted-foreground h-5 w-5" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Rollout Progress</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-muted-foreground rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">Generated</span>
                      <span className="text-sm font-medium">24 Assets</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">Posted</span>
                      <span className="text-sm font-medium">18 Posts</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">Platform</span>
                      <div className="flex gap-1">
                        <div className="w-5 h-5 rounded bg-background border border-border flex items-center justify-center"><Video size={10} /></div>
                        <div className="w-5 h-5 rounded bg-background border border-border flex items-center justify-center"><MessageSquare size={10} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* DNA Profile Compact */}
            <section className="lg:col-span-1 space-y-6">
              <h3 className="text-xl font-medium">Artist DNA</h3>
              <div className="bg-card border border-card-border rounded-xl p-6 relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="space-y-6 relative z-10">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Sonic Identity</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Dark Synthpop</Badge>
                      <Badge>Cinematic</Badge>
                      <Badge>Nocturnal</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Visual Aesthetic</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Neon Noir</Badge>
                      <Badge variant="outline">Brutalism</Badge>
                      <Badge variant="outline">High Contrast</Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Audience Persona</p>
                    <p className="text-sm">Night owls, design-conscious, tech-adjacent creatives who prefer curated experiences.</p>
                  </div>
                  
                  <Button variant="outline" className="w-full border-border/50 bg-background/50 hover:bg-background" data-testid="button-refine-dna">
                    Refine DNA
                  </Button>
                </div>
              </div>
            </section>

            {/* Activity Feed */}
            <section className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-medium">Recent AI Activity</h3>
              <div className="bg-card border border-card-border rounded-xl p-1 overflow-hidden">
                <div className="space-y-1">
                  <ActivityItem 
                    icon={<Wand2 className="text-primary" size={16} />}
                    title="Generated 5 TikTok hooks for 'Midnight Echoes'"
                    time="2 hours ago"
                    action="Review"
                  />
                  <ActivityItem 
                    icon={<ImageIcon className="text-muted-foreground" size={16} />}
                    title="Created moodboard for phase 3 rollout"
                    time="5 hours ago"
                    action="View"
                  />
                  <ActivityItem 
                    icon={<PieChart className="text-muted-foreground" size={16} />}
                    title="Analyzed audience response to Teaser #1"
                    time="Yesterday"
                    action="Insights"
                  />
                  <ActivityItem 
                    icon={<Globe className="text-muted-foreground" size={16} />}
                    title="Optimized bio copy across all social platforms"
                    time="2 days ago"
                    action="Apply"
                  />
                </div>
              </div>
            </section>
          </div>
          
        </div>
      </main>
    </div>
  );
}

// Subcomponents

function NavItem({ icon, label, active, badge, href }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string, href?: string }) {
  const inner = (
    <div className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`} data-testid={`nav-item-${label.toLowerCase()}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      {badge && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">
          {badge}
        </span>
      )}
    </div>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}

function StatCard({ title, value, trend, subtext, icon }: { title: string, value: string, trend?: string, subtext?: string, icon: React.ReactNode }) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-5 hover-elevate transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
        {trend && <span className="text-xs font-medium text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">{trend}</span>}
      </div>
      {subtext && <p className="text-xs text-muted-foreground mt-2">{subtext}</p>}
    </div>
  );
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'outline' }) {
  const baseClass = "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors";
  const variants = {
    default: "bg-secondary text-secondary-foreground border border-transparent",
    outline: "bg-transparent text-muted-foreground border border-border hover:text-foreground hover:border-muted-foreground"
  };
  
  return (
    <span className={`${baseClass} ${variants[variant]}`}>
      {children}
    </span>
  );
}

function ActivityItem({ icon, title, time, action }: { icon: React.ReactNode, title: string, time: string, action: string }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-secondary/30 rounded-lg transition-colors group">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">{title}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 border border-border/50 text-xs" data-testid={`button-activity-action-${title.replace(/\s+/g, '-').toLowerCase()}`}>
        {action}
      </Button>
    </div>
  );
}
