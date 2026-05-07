import { motion, AnimatePresence } from "framer-motion";
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
  Plus,
  Settings,
  Sparkles,
  TrendingUp,
  TrendingDown,
  User,
  Users,
  Video,
  Wand2,
  Zap,
  Brain,
  Fingerprint,
  Clock,
  ChevronUp,
  Target,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import { getProfile, getPersonalizationMessage, hasMemory } from "@/lib/artistProfile";
import { useAuth, useArtist } from "@/hooks/useAuth";
import { redirectToLogout } from "@/lib/auth-utils";

const streamData = [
  { day: "Oct 1", streams: 18400 }, { day: "Oct 5", streams: 22100 },
  { day: "Oct 9", streams: 19800 }, { day: "Oct 13", streams: 28600 },
  { day: "Oct 17", streams: 31200 }, { day: "Oct 21", streams: 35800 },
  { day: "Oct 25", streams: 41000 }, { day: "Oct 29", streams: 38400 },
  { day: "Nov 2", streams: 48200 }, { day: "Nov 6", streams: 52100 },
];

const sparkData = {
  streams: [18, 22, 20, 28, 31, 36, 41, 38, 48, 52],
  reach: [40, 42, 45, 48, 52, 49, 55, 58, 62, 68],
  engagement: [12, 13, 12, 14, 15, 14, 16, 15, 17, 18],
};

function MiniSparkline({ data, color = "#C8A96B" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64, h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const { user } = useAuth();
  const { artist } = useArtist();
  const profile = getProfile();
  const personalizationMsg = getPersonalizationMessage(profile);
  const hasProfileMemory = hasMemory(profile);

  const displayName = artist?.artistName || profile.artistName || user?.firstName || "Artist";
  const displayGenre = artist?.genre || profile.primaryGenre || "Independent";

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">

      {/* ── SIDEBAR ── */}
      <aside className="w-60 border-r border-border/60 bg-card/30 flex flex-col hidden md:flex shrink-0">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-border/40">
          <Link href="/" className="cursor-pointer">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="STAGEONE" className="h-5 w-auto" />
          </Link>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          <div className="space-y-0.5">
            <p className="px-2.5 text-[9px] font-bold text-muted-foreground/50 mb-2 uppercase tracking-[0.15em]">Main</p>
            {[
              { icon: <LayoutDashboard size={15} />, label: "Dashboard" },
              { icon: <Flame size={15} />, label: "Campaigns" },
              { icon: <Wand2 size={15} />, label: "AI Studio", badge: "PRO", href: "/studio" },
              { icon: <BarChart3 size={15} />, label: "Analytics" },
            ].map(item => <SidebarItem key={item.label} {...item} active={activeNav === item.label} onClick={() => setActiveNav(item.label)} />)}
          </div>

          <div className="space-y-0.5">
            <p className="px-2.5 text-[9px] font-bold text-muted-foreground/50 mb-2 uppercase tracking-[0.15em]">Brand</p>
            {[
              { icon: <Fingerprint size={15} />, label: "DNA Profile" },
              { icon: <ImageIcon size={15} />, label: "Assets" },
              { icon: <Globe size={15} />, label: "Distribution" },
            ].map(item => <SidebarItem key={item.label} {...item} active={activeNav === item.label} onClick={() => setActiveNav(item.label)} />)}
          </div>

          <div className="space-y-0.5">
            <p className="px-2.5 text-[9px] font-bold text-muted-foreground/50 mb-2 uppercase tracking-[0.15em]">System</p>
            {[
              { icon: <Settings size={15} />, label: "Settings" },
            ].map(item => <SidebarItem key={item.label} {...item} active={activeNav === item.label} onClick={() => setActiveNav(item.label)} />)}
          </div>
        </div>

        {/* Artist Memory Panel */}
        {hasProfileMemory && (
          <div className="mx-3 mb-3 p-3.5 rounded-xl border border-primary/20 bg-primary/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="flex items-center gap-2 mb-2">
              <Brain size={12} className="text-primary" />
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider">AI Memory</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-snug italic">
              "{personalizationMsg}"
            </p>
            {profile.primaryGenre && (
              <div className="mt-2 text-[9px] text-primary/60 font-mono">
                {profile.creativeIdentitySummary || profile.primaryGenre}
              </div>
            )}
          </div>
        )}

        {/* Profile */}
        <div className="p-3 border-t border-border/40">
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/40 cursor-pointer transition-colors group">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold truncate">{displayName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{displayGenre}</p>
            </div>
            <button onClick={redirectToLogout}>
              <LogOut size={13} className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Header */}
        <header className="h-14 border-b border-border/40 bg-background/60 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Home</span>
              <ChevronRight size={12} />
              <span className="text-foreground font-semibold">Overview</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Button variant="outline" size="sm" className="h-8 text-xs border-border/60 text-muted-foreground hover:text-foreground gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Last 30 Days
            </Button>
            <Link href="/studio">
              <Button size="sm" className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-[0_0_20px_-6px_hsl(38,46%,60%)]">
                <Sparkles className="h-3.5 w-3.5" />
                New Rollout
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 space-y-7 max-w-[1400px]">

            {/* AI Personalization Banner */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/20 bg-primary/5 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 relative z-10">
                <Brain size={14} className="text-primary" />
              </div>
              <p className="text-sm text-muted-foreground relative z-10 italic">
                {hasProfileMemory
                  ? `"${personalizationMsg}"`
                  : "Your AI creative director is ready. Generate your first rollout in AI Studio to activate memory."}
              </p>
              {hasProfileMemory && (
                <div className="ml-auto flex items-center gap-1.5 shrink-0 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Active</span>
                </div>
              )}
            </motion.div>

            {/* Welcome */}
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Welcome back. Your momentum is building.
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">Here's everything happening across your releases.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Total Streams",
                  value: "2.4M",
                  trend: "+12.5%",
                  up: true,
                  sub: "vs. last period",
                  icon: <Play size={14} className="text-primary" />,
                  spark: sparkData.streams,
                },
                {
                  title: "Audience Reach",
                  value: "845K",
                  trend: "+8.2%",
                  up: true,
                  sub: "unique listeners",
                  icon: <Users size={14} className="text-primary" />,
                  spark: sparkData.reach,
                },
                {
                  title: "Engagement Rate",
                  value: "14.2%",
                  trend: "+2.1%",
                  up: true,
                  sub: "saves + shares",
                  icon: <Activity size={14} className="text-primary" />,
                  spark: sparkData.engagement,
                },
                {
                  title: "Next Release",
                  value: "14 Days",
                  trend: null,
                  up: true,
                  sub: "Midnight Echoes",
                  icon: <Calendar size={14} className="text-primary" />,
                  spark: null,
                },
              ].map((s) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card border border-border/60 rounded-2xl p-5 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-muted-foreground">{s.title}</p>
                    <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center">
                      {s.icon}
                    </div>
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <div className="text-2xl font-bold tracking-tight">{s.value}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {s.trend && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${s.up ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                            {s.up ? <ChevronUp size={9} /> : <TrendingDown size={9} />}
                            {s.trend}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground">{s.sub}</span>
                      </div>
                    </div>
                    {s.spark && (
                      <div className="opacity-50 group-hover:opacity-80 transition-opacity">
                        <MiniSparkline data={s.spark} />
                      </div>
                    )}
                    {!s.spark && (
                      <div className="w-10 h-10 rounded-xl border border-primary/20 bg-primary/10 flex items-center justify-center">
                        <Zap size={16} className="text-primary" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Analytics Chart + Quick Stats */}
            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              {/* Area Chart */}
              <div className="bg-card border border-border/60 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-semibold">Stream Growth</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Daily streams across all platforms</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">52.1K</span>
                    <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <ChevronUp size={10} /> 12.5%
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={streamData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C8A96B" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#C8A96B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="streams"
                      stroke="#C8A96B"
                      strokeWidth={2}
                      fill="url(#streamGrad)"
                      dot={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(240 5% 11%)",
                        border: "1px solid hsl(240 4% 18%)",
                        borderRadius: "8px",
                        fontSize: "11px",
                        color: "hsl(0 0% 96%)",
                      }}
                      formatter={(v: number) => [v.toLocaleString(), "Streams"]}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Stats Panel */}
              <div className="bg-card border border-border/60 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold">Platform Breakdown</h3>
                {[
                  { platform: "Spotify", value: "1.2M", pct: 52, color: "#1DB954" },
                  { platform: "Apple Music", value: "680K", pct: 29, color: "#FC3C44" },
                  { platform: "TikTok", value: "320K", pct: 14, color: "#69C9D0" },
                  { platform: "YouTube", value: "120K", pct: 5, color: "#FF0000" },
                ].map(({ platform, value, pct, color }) => (
                  <div key={platform}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">{platform}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-border/40">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Save Rate</span>
                    <span className="text-green-400 font-semibold">28.4% · Excellent</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Skip Rate</span>
                    <span className="text-foreground font-semibold">11.2% · Low</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Campaigns */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold">Active Campaigns</h3>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-transparent h-7 text-xs gap-1">
                  View All <ChevronRight size={13} />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <CampaignCard
                  title="Midnight Echoes EP"
                  phase="Phase 2: Tease"
                  phaseActive
                  dates="Oct 12 – Nov 05"
                  progress={45}
                  icon={<Disc3 size={16} />}
                  generated={12}
                  scheduled={8}
                  platforms={["TK", "IG"]}
                  score={88}
                />
                <CampaignCard
                  title="Neon Nights Single"
                  phase="Phase 4: Sustain"
                  phaseActive={false}
                  dates="Sep 01 – Oct 30"
                  progress={85}
                  icon={<Music size={16} />}
                  generated={24}
                  scheduled={18}
                  platforms={["YT", "TW"]}
                  score={74}
                />
              </div>
            </div>

            {/* Bottom Row: DNA + Activity */}
            <div className="grid lg:grid-cols-[300px_1fr] gap-6">

              {/* Artist DNA */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Artist DNA</h3>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-muted-foreground hover:text-primary gap-1 px-2">
                    Refine
                  </Button>
                </div>
                <div className="bg-card border border-border/60 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, rgba(200,169,107,0.08) 0%, transparent 70%)", transform: "translate(40%, -40%)" }} />

                  <div className="space-y-5 relative z-10">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-2.5 font-bold">Sonic Identity</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(profile.primaryGenre
                          ? [profile.primaryGenre, ...(profile.secondaryGenre ? [profile.secondaryGenre] : []), "Cinematic"]
                          : ["Dark Synthpop", "Cinematic", "Nocturnal"]
                        ).map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-2.5 font-bold">Visual Aesthetic</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(profile.visualAesthetic.length
                          ? profile.visualAesthetic
                          : ["Neon Noir", "Brutalism", "High Contrast"]
                        ).map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-transparent text-muted-foreground border border-border hover:text-foreground hover:border-primary/30 transition-colors">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-2 font-bold">Audience Persona</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {profile.targetAudience || "Night owls, design-conscious, tech-adjacent creatives who prefer curated experiences."}
                      </p>
                    </div>

                    {hasProfileMemory && (
                      <div className="pt-3 border-t border-border/40">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Brain size={10} className="text-primary" />
                          <p className="text-[9px] text-primary uppercase tracking-widest font-bold">Memory: {profile.rolloutHistory.length} Campaign{profile.rolloutHistory.length > 1 ? "s" : ""}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground">AI is refining strategy from your rollout history.</p>
                      </div>
                    )}

                    <Link href="/studio">
                      <Button variant="outline" size="sm" className="w-full border-border/50 bg-background/30 hover:bg-background text-xs h-8 gap-2">
                        <Wand2 size={12} />
                        Open AI Studio
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Next Release Countdown */}
                <div className="bg-card border border-border/60 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                      <Clock size={12} className="text-primary" />
                    </div>
                    <span className="text-xs font-semibold">Next Release</span>
                  </div>
                  <div className="text-xl font-bold mb-1">14 Days</div>
                  <div className="text-xs text-muted-foreground mb-4">Midnight Echoes · Oct 12</div>
                  <div className="grid grid-cols-4 gap-1">
                    {[["14", "Days"], ["06", "Hours"], ["22", "Mins"], ["11", "Secs"]].map(([val, unit]) => (
                      <div key={unit} className="bg-secondary rounded-lg p-2 text-center">
                        <div className="text-sm font-bold">{val}</div>
                        <div className="text-[8px] text-muted-foreground uppercase">{unit}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">AI Activity Feed</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Live</span>
                  </div>
                </div>

                <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
                  <div className="divide-y divide-border/30">
                    {[
                      {
                        icon: <Wand2 size={14} className="text-primary" />,
                        bg: "bg-primary/10",
                        title: "Generated 5 TikTok hooks for 'Midnight Echoes'",
                        sub: "Context-aware hooks calibrated to Alt-R&B dark tone",
                        time: "2 hours ago",
                        action: "Review",
                        actionColor: "text-primary",
                        tag: "Generated",
                        tagColor: "bg-primary/10 text-primary border-primary/20",
                      },
                      {
                        icon: <ImageIcon size={14} className="text-blue-400" />,
                        bg: "bg-blue-500/10",
                        title: "Created moodboard for phase 3 rollout",
                        sub: "6 visual directions with cinematography notes",
                        time: "5 hours ago",
                        action: "View",
                        actionColor: "text-blue-400",
                        tag: "Visual",
                        tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                      },
                      {
                        icon: <PieChart size={14} className="text-green-400" />,
                        bg: "bg-green-500/10",
                        title: "Analyzed audience response to Teaser #1",
                        sub: "28.4% save rate · 3.2x playlist adds vs. baseline",
                        time: "Yesterday",
                        action: "Insights",
                        actionColor: "text-green-400",
                        tag: "Analytics",
                        tagColor: "bg-green-500/10 text-green-400 border-green-500/20",
                      },
                      {
                        icon: <Globe size={14} className="text-purple-400" />,
                        bg: "bg-purple-500/10",
                        title: "Optimized bio copy across all social platforms",
                        sub: "Tone consistency score improved from 72 → 91",
                        time: "2 days ago",
                        action: "Apply",
                        actionColor: "text-purple-400",
                        tag: "Copy",
                        tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                      },
                      {
                        icon: <Target size={14} className="text-amber-400" />,
                        bg: "bg-amber-500/10",
                        title: "Identified 3 new audience clusters for expansion",
                        sub: "Late-night Introspectors · Urban Tastemakers · Gym Streamers",
                        time: "3 days ago",
                        action: "Explore",
                        actionColor: "text-amber-400",
                        tag: "Strategy",
                        tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                      },
                      {
                        icon: <Radio size={14} className="text-rose-400" />,
                        bg: "bg-rose-500/10",
                        title: "Submitted 'Midnight Echoes' to 14 editorial playlists",
                        sub: "Spotify · Apple Music · Tidal — packages sent",
                        time: "4 days ago",
                        action: "Track",
                        actionColor: "text-rose-400",
                        tag: "Distribution",
                        tagColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                      },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.06 * i }}
                        className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors group"
                      >
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-xs font-semibold text-foreground/90 truncate">{item.title}</p>
                              <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${item.tagColor} hidden sm:inline-flex`}>{item.tag}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-snug">{item.sub}</p>
                            <p className="text-[10px] text-muted-foreground/50 mt-1">{item.time}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`opacity-0 group-hover:opacity-100 transition-opacity h-7 text-[10px] border border-border/50 shrink-0 ${item.actionColor}`}
                        >
                          {item.action}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SidebarItem({ icon, label, active, badge, href, onClick }: {
  icon: React.ReactNode; label: string; active?: boolean; badge?: string; href?: string; onClick?: () => void;
}) {
  const inner = (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
        active
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      {badge && (
        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/20 uppercase tracking-wider">
          {badge}
        </span>
      )}
    </div>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}

function CampaignCard({ title, phase, phaseActive, dates, progress, icon, generated, scheduled, platforms, score }: {
  title: string; phase: string; phaseActive: boolean; dates: string; progress: number;
  icon: React.ReactNode; generated: number; scheduled: number; platforms: string[]; score: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border/60 rounded-2xl p-5 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${phaseActive ? "bg-primary/15 text-primary border-primary/25" : "bg-secondary text-muted-foreground border-border"}`}>
              {phase}
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Calendar size={9} /> {dates}
            </span>
          </div>
          <h4 className="text-sm font-bold group-hover:text-primary transition-colors duration-300">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-lg bg-secondary border border-border/60 text-xs font-bold text-muted-foreground">
            {score}
          </div>
          <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center border border-border/60 text-muted-foreground">
            {icon}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Rollout Progress</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full relative"
              style={{ background: phaseActive ? "linear-gradient(90deg, hsl(38,46%,50%), hsl(38,46%,65%))" : "hsl(240 4% 46%)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              {phaseActive && <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/20 blur-[2px]" />}
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/30">
          <div>
            <div className="text-xs font-bold">{generated}</div>
            <div className="text-[9px] text-muted-foreground">Assets</div>
          </div>
          <div>
            <div className="text-xs font-bold">{scheduled}</div>
            <div className="text-[9px] text-muted-foreground">Scheduled</div>
          </div>
          <div>
            <div className="flex gap-1 mt-0.5">
              {platforms.map(p => (
                <div key={p} className="w-5 h-5 rounded-md bg-background border border-border flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                  {p}
                </div>
              ))}
            </div>
            <div className="text-[9px] text-muted-foreground mt-0.5">Platforms</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
