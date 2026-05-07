import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  Sparkles,
  Wand2,
  Video,
  PenTool,
  CalendarDays,
  Fingerprint,
  BarChart,
  Upload,
  Cpu,
  Layers,
  Disc3,
  Play,
  TrendingUp,
  CheckCircle2,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const [scrolled, setScrolled] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    const handler = () => {
      const cy = window.scrollY;
      setScrolled(cy > 20);
      setNavVisible(cy < lastY || cy < 60);
      setLastY(cy);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [lastY]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">

      {/* Grain texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* NAVBAR */}
      <AnimatePresence>
        {navVisible && (
          <motion.nav
            key="nav"
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 transition-all duration-300 ${
              scrolled
                ? "py-2.5 border-b border-border/50 bg-background/90 backdrop-blur-2xl shadow-[0_1px_0_rgba(255,255,255,0.04)]"
                : "py-3.5 border-b border-transparent bg-background/0"
            }`}
          >
            <div className="flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="STAGEONE" className="w-28 md:w-36 h-auto" />
            </div>

            <div className="hidden md:flex items-center gap-7 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors duration-200">Features</a>
              <a href="#workflow" className="hover:text-foreground transition-colors duration-200">How It Works</a>
              <Link href="/showcase" className="hover:text-foreground transition-colors duration-200">Showcase</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors duration-200">Pricing</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/studio">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hidden md:inline-flex">
                  Try Studio
                </Button>
              </Link>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-4 text-sm">
                Join Waitlist
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative min-h-[100dvh] flex items-center pt-16 pb-10 overflow-hidden">
        {/* Multi-layer glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[900px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(200,169,107,0.08) 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(200,169,107,0.04) 0%, transparent 70%)" }} />

        <div className="container px-6 md:px-10 mx-auto grid lg:grid-cols-[1fr_1fr] gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-xs font-semibold text-primary mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AI Artist Operating System — Beta Now Open
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-7">
              Launch Music<br />
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#E8C97A] to-primary/70">
                  Like a Major.
                </span>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
              AI-powered rollout campaigns, visual direction, and content strategy for independent artists who refuse to release into a void.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/studio">
                <Button size="lg" className="h-12 px-7 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_32px_-8px_hsl(38,46%,60%)] group">
                  Start Your Rollout
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="h-12 px-7 text-sm font-semibold border-border/60 bg-background/40 backdrop-blur hover:bg-secondary/80">
                  <Play className="mr-2 h-3.5 w-3.5" />
                  View Demo
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 mt-10">
              <div className="flex -space-x-2">
                {["JK", "AM", "RL", "TW", "SM"].map((init, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[9px] font-bold text-muted-foreground">{init}</div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">2,400+</span> artists in beta
              </div>
              <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 fill-primary" viewBox="0 0 12 12"><path d="M6 0l1.5 4h4.5l-3.5 2.5 1.3 4.5L6 8.5 2.2 11 3.5 6.5 0 4h4.5z"/></svg>
                ))}
                <span className="ml-1">4.9 rating</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:ml-auto w-full max-w-[580px]"
          >
            {/* Main mockup card */}
            <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="h-9 border-b border-border/40 flex items-center px-4 gap-2 bg-background/40">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <div className="ml-3 h-4 w-36 bg-secondary/80 rounded-sm text-[9px] font-mono text-muted-foreground/60 flex items-center px-2">stageone.ai/studio</div>
              </div>
              <div className="p-5 space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5 font-semibold">Active Campaign</div>
                    <div className="text-lg font-bold">Midnight Echoes EP</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Alt-R&B · Phase 2: Tease</div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <Disc3 size={16} className="text-primary" />
                  </div>
                </div>

                {/* Waveform */}
                <div className="flex items-center gap-[2px] h-10">
                  {[...Array(56)].map((_, i) => {
                    const heights = [30, 65, 45, 80, 55, 90, 40, 70, 35, 85, 60, 95, 50, 75, 45, 88, 62, 78, 42, 92];
                    const h = heights[i % heights.length];
                    return (
                      <div key={i} className="flex-1 rounded-full transition-all duration-300"
                        style={{ height: `${h}%`, background: i < 30 ? 'hsl(38,46%,60%)' : 'hsl(240,4%,18%)' }} />
                    );
                  })}
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Rollout Progress</span>
                    <span className="font-semibold text-primary">45%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-secondary">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary relative" style={{ width: '45%' }}>
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 blur-[2px]" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[9px] uppercase font-bold text-muted-foreground tracking-wider">
                    <span>Tease</span>
                    <span className="text-primary">Announce</span>
                    <span>Release</span>
                    <span>Sustain</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/40">
                  {[["12 Assets", "Generated"], ["8 Posts", "Scheduled"], ["TikTok / IG", "Platforms"]].map(([val, label]) => (
                    <div key={label}>
                      <div className="text-sm font-semibold">{val}</div>
                      <div className="text-[10px] text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Float card 1 */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -right-10 -top-6 p-3.5 rounded-xl border border-border/80 bg-card/95 backdrop-blur-md shadow-xl flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center">
                <TrendingUp size={16} className="text-green-400" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Engagement</p>
                <p className="text-sm font-bold text-green-400">+342%</p>
              </div>
            </motion.div>

            {/* Float card 2 */}
            <motion.div
              animate={{ y: [8, -8, 8] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.8 }}
              className="absolute -left-10 bottom-16 p-3.5 rounded-xl border border-border/80 bg-card/95 backdrop-blur-md shadow-xl w-52"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold">AI Generated Hook</p>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-muted-foreground leading-snug">"Wait for the drop… when you realize you've been listening to the same loop for 3 hours."</p>
            </motion.div>

            {/* Float card 3 */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1.5 }}
              className="absolute right-4 -bottom-4 p-3 rounded-xl border border-border/80 bg-card/95 backdrop-blur-md shadow-xl flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <Sparkles size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Launch Score</p>
                <p className="text-sm font-bold">94 / 100</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-y border-border/30 bg-card/20 py-8">
        <div className="container px-6 md:px-10 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-border/30">
            {[
              { value: "2,400+", label: "Artists in Beta" },
              { value: "18K+", label: "Campaigns Generated" },
              { value: "94%", label: "Avg. Launch Score" },
              { value: "4.9★", label: "Artist Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center md:px-8">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 md:py-32 relative">
        <div className="container px-6 md:px-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center mb-16"
          >
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4">The Problem</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">Most Artists Don't Fail Because of Talent.</h2>
            <p className="text-lg text-muted-foreground">They fail because they drop great music into a void with no strategy, inconsistent branding, and zero promotional infrastructure.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Inconsistent Promotion", desc: "Posting randomly without a cohesive narrative or timeline that builds real momentum." },
              { title: "Weak Brand Identity", desc: "No clear visual language connecting the music to the artist across every touchpoint." },
              { title: "No Rollout Strategy", desc: "Treating release day as the finish line instead of the starting gun." },
              { title: "Content Burnout", desc: "Spending more time figuring out what to post than actually making music." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-card/50 border border-border rounded-2xl p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-4">
                  <div className="w-2 h-2 rounded-full bg-destructive/60" />
                </div>
                <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
        <div className="container px-6 md:px-10 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 max-w-xl"
          >
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4">AI Rollout Studio</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything a Major Label Marketing Team Does.</h2>
            <p className="text-muted-foreground text-lg">Codified into an intelligent system that runs in seconds, not months.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Wand2 />, title: "Campaign Generator", desc: "Upload a track and instantly generate a 4-phase rollout campaign mapped to your exact release date and audience.", badge: "Core" },
              { icon: <Video />, title: "TikTok Hook Generator", desc: "AI analyzes your song's sonic profile to generate high-retention video concepts and text hooks with psychological precision.", badge: "Viral" },
              { icon: <Layers />, title: "Visual Direction Engine", desc: "Create cohesive moodboards, color palettes, and visual treatments that make your audio feel like a world.", badge: "Brand" },
              { icon: <PenTool />, title: "Caption Writer", desc: "Platform-specific copywriting trained on your unique tone of voice, genre, and artist persona.", badge: "Content" },
              { icon: <CalendarDays />, title: "Release Timeline Builder", desc: "A smart calendar that schedules the perfect mix of teasers, announcements, and sustain content.", badge: "Strategy" },
              { icon: <Fingerprint />, title: "Artist DNA Profile", desc: "Systematize your aesthetic, themes, and narrative pillars so every release feels distinctly, unmistakably you.", badge: "Identity" },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group relative bg-background border border-border rounded-2xl p-7 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="absolute top-5 right-5">
                  <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">{feat.badge}</span>
                </div>
                <div className="h-11 w-11 rounded-xl bg-secondary border border-border flex items-center justify-center mb-6 text-primary group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300">
                  {feat.icon}
                </div>
                <h3 className="text-base font-semibold mb-2.5">{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ARTIST DNA */}
      <section className="py-24 md:py-32 bg-secondary/10 border-y border-border/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(200,169,107,0.06) 0%, transparent 70%)" }} />

        <div className="container px-6 md:px-10 mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-5">Artist DNA</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Your Creative Identity, Systemized.</h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              STAGEONE builds a persistent <strong className="text-foreground">Artist DNA Profile</strong> from your inputs, influences, and aesthetic. Every campaign generated is tailor-made for your specific creative identity — not a template.
            </p>
            <ul className="space-y-4">
              {[
                { text: "Persistent memory of your visual style across all campaigns", icon: <CheckCircle2 size={16} className="text-primary" /> },
                { text: "Tone of voice that matches your personality and genre", icon: <CheckCircle2 size={16} className="text-primary" /> },
                { text: "AI that evolves with every release you run", icon: <CheckCircle2 size={16} className="text-primary" /> },
                { text: "No generic outputs — everything is personalized", icon: <CheckCircle2 size={16} className="text-primary" /> },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="flex items-center gap-3"
                >
                  {item.icon}
                  <span className="text-foreground/90 font-medium text-sm">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* DNA Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative border border-border/80 bg-card rounded-2xl p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-sm"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-primary/5 to-transparent rounded-t-2xl" />

            <div className="space-y-7 relative z-10">
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Fingerprint className="text-primary" size={16} />
                  </div>
                  <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">DNA_PROFILE_V2</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Live</span>
                </div>
              </div>

              {[
                { label: "Genre Profile", value: "Alt-R&B / Dark Synth", progress: 85 },
                { label: "Visual Aesthetic", value: "Cinematic, High-Contrast", progress: 92 },
                { label: "Audience Segment", value: "Nocturnal Creatives, 18–35", progress: 78 },
                { label: "Content Tone", value: "Mysterious, Direct", progress: 88 },
              ].map(({ label, value, progress }) => (
                <div key={label} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-mono tracking-wider uppercase">{label}</span>
                    <span className="text-primary font-mono font-semibold">{progress}%</span>
                  </div>
                  <div className="text-sm font-medium">{value}</div>
                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, hsl(38,46%,50%), hsl(38,46%,60%))" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="workflow" className="py-24 md:py-32">
        <div className="container px-6 md:px-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Workflow</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">From Song to Full Campaign in Minutes.</h2>
            <p className="text-muted-foreground text-lg">The workflow designed to keep you in a flow state.</p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting line */}
            <div className="absolute top-8 left-[10%] right-[10%] h-px bg-border hidden md:block">
              <motion.div
                className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"
                initial={{ scaleX: 0, transformOrigin: "left" }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>

            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-start gap-10 md:gap-4">
              {[
                { step: 1, icon: <Upload size={18} />, label: "Upload Song", desc: "Drop your track or describe it" },
                { step: 2, icon: <Cpu size={18} />, label: "AI Analysis", desc: "Genre, mood, and sonic profile" },
                { step: 3, icon: <Wand2 size={18} />, label: "Generate Campaign", desc: "Full rollout in seconds" },
                { step: 4, icon: <Video size={18} />, label: "Social Assets", desc: "Hooks, captions, visuals" },
                { step: 5, icon: <BarChart size={18} />, label: "Launch & Track", desc: "Monitor in your dashboard" },
              ].map(({ step, icon, label, desc }, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative flex flex-col items-center gap-3 z-10 flex-1"
                >
                  <div className="w-16 h-16 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-lg group hover:border-primary transition-all duration-300 relative">
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                      {step}
                    </div>
                    <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
                      {icon}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-16 border-y border-border/20 bg-card/10">
        <div className="container px-6 md:px-10 mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              { icon: <Shield size={16} className="text-primary" />, text: "No data sold. Ever." },
              { icon: <Zap size={16} className="text-primary" />, text: "Campaign in under 60 seconds" },
              { icon: <Globe size={16} className="text-primary" />, text: "Works for every genre" },
              { icon: <Sparkles size={16} className="text-primary" />, text: "AI trained on real artist data" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
                {icon}
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(200,169,107,0.12) 0%, transparent 70%)" }} />

        <div className="container relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-6">Your Next Release</div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
              Your Next Release Deserves More Than Random Posting.
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join 2,400+ independent artists who are launching with the same intelligence as major labels.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/studio">
                <Button size="lg" className="h-13 px-10 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_50px_-12px_hsl(38,46%,60%)]">
                  Launch With STAGEONE
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="h-13 px-8 text-base border-border/60 hover:bg-secondary/80">
                  See Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 bg-background py-12">
        <div className="container px-6 md:px-10 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="STAGEONE" className="h-5 w-auto opacity-60" />
          </div>

          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </div>

          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} STAGEONE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
