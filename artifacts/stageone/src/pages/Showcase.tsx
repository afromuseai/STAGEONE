import { motion } from "framer-motion";
import { Link, useSearch } from "wouter";
import { ArrowLeft, Flame, Star, TrendingUp, Users, Sparkles, ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import CampaignCard, { type CampaignCardData } from "@/components/CampaignCard";

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const FEATURED: CampaignCardData[] = [
  {
    songTitle: "Neon Dreams",
    artistName: "Marcus Cole",
    genre: "Hip-Hop",
    hook: "POV: the city finally recognizes what you knew first",
    strategyInsight: "High-velocity social discovery strategy targeting culture-first listeners through TikTok curiosity gap mechanics.",
    phase: "LAUNCH",
    overallScore: 91,
    dnaTag: "Hip-Hop · Cinematic energy · Viral-first strategy",
  },
  {
    songTitle: "Waterfall",
    artistName: "Zara Muse",
    genre: "R&B / Soul",
    hook: "They really put this exact feeling into a song and I can't recover",
    strategyInsight: "Late-night emotional resonance campaign built around listener vulnerability windows — 11PM to 3AM streaming peaks.",
    phase: "BUILD",
    overallScore: 88,
    dnaTag: "R&B / Soul · Melancholic energy · Algorithmic focus",
  },
  {
    songTitle: "Frequencies",
    artistName: "VOID",
    genre: "Electronic",
    hook: "This is not background music. This is what focus sounds like.",
    strategyInsight: "Scene-insider credibility play targeting early adopters and focus-state listeners across Spotify and YouTube.",
    phase: "TEASE",
    overallScore: 85,
    dnaTag: "Electronic · Dark energy · Playlist-first",
  },
];

const TRENDING: CampaignCardData[] = [
  {
    songTitle: "Mango Season",
    artistName: "Ayomide",
    genre: "Afrobeats",
    hook: "This is what it sounds like when summer remembers itself",
    strategyInsight: "Diaspora community activation through party tastemakers and TikTok dance adoption pathway.",
    phase: "LAUNCH",
    overallScore: 93,
    dnaTag: "Afrobeats · Euphoric energy · Viral-first strategy",
  },
  {
    songTitle: "In Between",
    artistName: "Elara",
    genre: "Pop",
    hook: "The chorus hits and suddenly you remember every version of yourself",
    strategyInsight: "Mainstream discovery campaign with playlist curator seeding strategy — first 100K streams goal.",
    phase: "SUSTAIN",
    overallScore: 87,
    dnaTag: "Pop · Cinematic energy · Algorithmic focus",
  },
  {
    songTitle: "Concrete Jungle",
    artistName: "Dre Nova",
    genre: "Hip-Hop",
    hook: "Not background music. This is the main character's entrance.",
    strategyInsight: "Gym & grind demographic activation with high-repeat-listen content placed inside established playlist ecosystems.",
    phase: "BUILD",
    overallScore: 84,
    dnaTag: "Hip-Hop · Aggressive energy · Label Attention",
  },
  {
    songTitle: "Crystalline",
    artistName: "Sunday Morning",
    genre: "Alternative",
    hook: "Wait for the bridge — I dare you not to feel everything at once",
    strategyInsight: "Intimate fanbase compounding strategy — community transparency content converting listeners into stakeholders.",
    phase: "TEASE",
    overallScore: 82,
    dnaTag: "Alternative · Melancholic energy · Build Fanbase",
  },
  {
    songTitle: "La Llama",
    artistName: "Cristal Rey",
    genre: "Latin",
    hook: "POV: someone wrote this song specifically for the feeling you can't describe",
    strategyInsight: "Cross-cultural rollout anchored in TikTok sound placement and influencer usage rights seeding.",
    phase: "LAUNCH",
    overallScore: 90,
    dnaTag: "Latin · Euphoric energy · Viral-first strategy",
  },
  {
    songTitle: "Midnight Run",
    artistName: "The Echo",
    genre: "Indie",
    hook: "The kind of song that makes driving at 2AM feel like a film scene",
    strategyInsight: "Late-night streaming behavior strategy — discovery windows targeting repeat listen and save rate optimization.",
    phase: "SUSTAIN",
    overallScore: 80,
    dnaTag: "Indie · Cinematic energy · Playlist Placement",
  },
  {
    songTitle: "Static",
    artistName: "KROME",
    genre: "Electronic",
    hook: "Your productivity playlist just got a new anchor track",
    strategyInsight: "Focus state and deep work audience activation — YouTube long session and Spotify playlist embed strategy.",
    phase: "BUILD",
    overallScore: 86,
    dnaTag: "Electronic · Cinematic energy · Algorithmic focus",
  },
  {
    songTitle: "Soulfire",
    artistName: "Naomi Reign",
    genre: "Gospel",
    hook: "Songs this honest shouldn't be allowed to exist",
    strategyInsight: "Community-first rollout with faith ecosystem playlist seeding and event placement through church media networks.",
    phase: "LAUNCH",
    overallScore: 89,
    dnaTag: "Gospel · Uplifting energy · Build Fanbase",
  },
  {
    songTitle: "Overgrown",
    artistName: "James Hale",
    genre: "Alternative",
    hook: "This is the song for people who grew up too fast and haven't processed it yet",
    strategyInsight: "Emotional identity positioning — targeting listeners who use music as communication for feelings they can't articulate.",
    phase: "TEASE",
    overallScore: 83,
    dnaTag: "Alternative · Melancholic energy · Build Fanbase",
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? "#34D399" : score >= 85 ? "#C8A96B" : "#60A5FA";
  return (
    <span style={{ color, fontSize: 11, fontWeight: 700 }}>
      {score}
    </span>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function Showcase() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const refParam = params.get("ref");
  const [refBanner, setRefBanner] = useState(!!refParam);

  useEffect(() => {
    if (refParam) {
      localStorage.setItem("stageone_ref", refParam);
    }
  }, [refParam]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/4 blur-[130px]" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/3 blur-[100px]" />
      </div>

      {/* Referral banner */}
      {refBanner && (
        <motion.div
          initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-50 bg-primary/10 border-b border-primary/20 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={14} className="text-primary shrink-0" />
            <p className="text-sm text-foreground/90">
              <span className="font-semibold text-primary">@{refParam}</span> invited you to STAGEONE — get 30 days of Pro Artist free when you sign up.
            </p>
          </div>
          <button onClick={() => setRefBanner(false)} className="text-muted-foreground hover:text-foreground ml-4 shrink-0">
            <X size={14} />
          </button>
        </motion.div>
      )}

      {/* NAV */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 md:px-10 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <Link href="/">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={15} /> Back
            </button>
          </Link>
          <div className="w-px h-4 bg-border/60" />
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="STAGEONE" className="h-6 w-auto" />
        </div>
        <div className="flex items-center gap-2">
          <Link href="/showcase" className="hidden sm:block text-xs text-muted-foreground/70 hover:text-foreground transition-colors px-3 py-1.5">
            Trending
          </Link>
          <Link href="/studio">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-background font-semibold text-sm hover:bg-primary/90 transition-colors">
              <Sparkles size={13} /> Generate Rollout
            </button>
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <FadeIn className="text-center py-16 md:py-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-primary/8 text-primary text-xs font-bold uppercase tracking-widest mb-8">
            <TrendingUp size={11} /> AI-Generated Rollouts
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
            The STAGEONE<br />
            <span className="text-primary">Showcase</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Real campaigns generated by real artists. Every card below was built by STAGEONE's creative intelligence system.
          </p>
        </FadeIn>

        {/* Stats strip */}
        <FadeIn delay={0.1} className="mb-16">
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
            {[
              { icon: <Users size={14} />, value: "4,200+", label: "Artists" },
              { icon: <Flame size={14} />, value: "18,400+", label: "Campaigns" },
              { icon: <Star size={14} />, value: "94%", label: "Share Rate" },
            ].map((stat, i) => (
              <div key={i} className="text-center border border-border/40 rounded-2xl py-4 px-3 bg-card/30">
                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">{stat.icon}</div>
                <div className="text-xl font-black text-foreground">{stat.value}</div>
                <div className="text-[11px] text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Featured */}
        <FadeIn delay={0.12} className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center">
              <Star size={12} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Featured Campaigns</h2>
            <div className="flex-1 h-px bg-border/40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED.map((card, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.55, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="cursor-default group">
                <div className="relative">
                  {card.overallScore && (
                    <div className="absolute -top-2 -right-2 z-10 w-9 h-9 rounded-full bg-card border border-border/60 flex items-center justify-center shadow-lg">
                      <ScoreBadge score={card.overallScore} />
                    </div>
                  )}
                  <CampaignCard data={card} compact />
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* Trending */}
        <FadeIn delay={0.15} className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center">
              <Flame size={12} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Trending Campaigns</h2>
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-xs text-muted-foreground font-medium">{TRENDING.length} campaigns</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TRENDING.map((card, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.5, delay: 0.04 * (i % 3), ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                className="cursor-default group">
                <div className="relative">
                  {card.overallScore && (
                    <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-card border border-border/60 shadow-md">
                      <TrendingUp size={9} className="text-primary/70" />
                      <ScoreBadge score={card.overallScore} />
                    </div>
                  )}
                  <CampaignCard data={card} compact />
                </div>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* CTA section */}
        <FadeIn delay={0.1} className="mb-24">
          <div className="relative rounded-3xl border border-primary/20 bg-card/40 p-10 md:p-14 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/8 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-5">
                <Sparkles size={20} className="text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                Generate your campaign.<br />
                <span className="text-primary">Make it shareable.</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                Every rollout you build becomes a campaign card you can export and post. Let STAGEONE's branding work for you.
              </p>
              <Link href="/studio">
                <button className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/20">
                  Build Your Rollout <ArrowRight size={15} />
                </button>
              </Link>
            </div>
          </div>
        </FadeIn>

      </div>

      {/* Footer */}
      <div className="border-t border-border/30 py-6 px-6 md:px-10 flex items-center justify-between">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="STAGEONE" className="h-5 w-auto opacity-60" />
        <p className="text-xs text-muted-foreground/50">AI Rollout System · Every campaign generated by artists, for artists.</p>
      </div>
    </div>
  );
}
