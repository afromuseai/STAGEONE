import { motion, useScroll, useTransform } from "framer-motion";
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
  ChevronRight,
  Disc3,
  Play,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      
      {/* Ambient Background Noise */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 border-b border-border/40 bg-background/60 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="STAGEONE Logo" className="w-40 md:w-52 h-auto" />
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors" data-testid="link-features">Features</a>
          <a href="#workflow" className="hover:text-foreground transition-colors" data-testid="link-workflow">Workflow</a>
          <Link href="/showcase" className="hover:text-foreground transition-colors" data-testid="link-showcase">Showcase</Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors" data-testid="link-pricing">Pricing</Link>
        </div>

        <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300" data-testid="button-join-waitlist-nav">
          Join Waitlist
        </Button>
      </motion.nav>

      {/* HERO */}
      <section className="relative min-h-[100dvh] flex items-center pt-20 pb-10 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container px-6 md:px-10 mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-border text-xs font-medium text-muted-foreground mb-6">
              <Sparkles size={14} className="text-primary" />
              <span>Introducing The OS For Independent Artists</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Launch Music <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#E8D19F] to-primary">Like a Major Label.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl">
              AI-powered rollout campaigns, visual direction, content strategy, and artist growth tools for modern independent artists.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/studio">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base shadow-[0_0_40px_-10px_hsl(var(--primary))]" data-testid="button-start-rollout">
                  Start Your Rollout <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base border-border bg-background/50 backdrop-blur hover:bg-secondary" data-testid="button-view-demo">
                View Demo
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: "1000px" }}
            className="relative lg:ml-auto w-full max-w-[600px]"
          >
            {/* Floating Mockup UI */}
            <div className="relative rounded-xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
              <div className="h-10 border-b border-border/40 flex items-center px-4 gap-2 bg-background/50">
                <div className="w-3 h-3 rounded-full bg-border"></div>
                <div className="w-3 h-3 rounded-full bg-border"></div>
                <div className="w-3 h-3 rounded-full bg-border"></div>
                <div className="ml-4 h-4 w-32 bg-secondary rounded-sm"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="h-3 w-24 bg-primary/20 rounded mb-2"></div>
                    <div className="h-6 w-48 bg-foreground/90 rounded"></div>
                  </div>
                  <div className="h-10 w-10 rounded-full border border-border bg-secondary flex items-center justify-center">
                    <Disc3 size={20} className="text-muted-foreground" />
                  </div>
                </div>
                
                {/* Waveform mock */}
                <div className="flex items-center gap-1 h-12 w-full mt-4">
                  {[...Array(40)].map((_, i) => (
                    <div key={i} className="flex-1 bg-primary/40 rounded-full" style={{ height: `${Math.random() * 100}%` }}></div>
                  ))}
                </div>

                {/* Timeline mock */}
                <div className="mt-auto space-y-3">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Rollout Timeline</span>
                    <span>Oct 24 - Nov 12</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-secondary">
                    <div className="w-1/4 bg-border"></div>
                    <div className="w-1/2 bg-primary relative">
                      <div className="absolute top-0 right-0 w-2 h-full bg-white/50 shadow-[0_0_10px_white]"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    <span>Tease</span>
                    <span className="text-primary">Announce</span>
                    <span>Release</span>
                    <span>Sustain</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating element 1 */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -right-8 -top-8 p-4 rounded-xl border border-border bg-card/90 backdrop-blur-md shadow-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Engagement</p>
                <p className="font-bold">+342%</p>
              </div>
            </motion.div>

            {/* Floating element 2 */}
            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
              className="absolute -left-10 bottom-10 p-4 rounded-xl border border-border bg-card/90 backdrop-blur-md shadow-xl flex flex-col gap-2 w-48"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium">TikTok Hook</p>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <p className="text-[10px] text-muted-foreground line-clamp-2">"Wait for the drop... when you realize you've been listening to the same loop for 3 hours."</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 md:py-32 relative bg-secondary/20 border-y border-border/30">
        <div className="container px-6 md:px-10 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Most Artists Don't Fail Because of Talent.</h2>
            <p className="text-lg text-muted-foreground">They fail because they drop great music into a void with no strategy, inconsistent branding, and weak promotion.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProblemCard title="Inconsistent Promotion" desc="Posting randomly without a cohesive narrative or timeline." />
            <ProblemCard title="Weak Branding" desc="No clear visual identity connecting the music to the artist." />
            <ProblemCard title="No Rollout Strategy" desc="Treating release day as the finish line instead of the starting line." />
            <ProblemCard title="Content Burnout" desc="Spending more time figuring out what to post than making music." />
          </div>
        </div>
      </section>

      {/* AI ROLLOUT ENGINE */}
      <section id="features" className="py-24 md:py-32">
        <div className="container px-6 md:px-10 mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center">Your AI Rollout Studio</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">Everything a major label marketing team provides, codified into an intelligent system.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Wand2 className="text-primary" />}
              title="Campaign Generator"
              desc="Upload a track and instantly generate a 4-phase rollout campaign mapped to your exact release date."
            />
            <FeatureCard 
              icon={<Video className="text-primary" />}
              title="TikTok Hook Generator"
              desc="AI analyzes your song's sonic profile to generate high-retention video concepts and text hooks."
            />
            <FeatureCard 
              icon={<Layers className="text-primary" />}
              title="Visual Direction Engine"
              desc="Create cohesive moodboards, color palettes, and visual treatments that match your audio."
            />
            <FeatureCard 
              icon={<PenTool className="text-primary" />}
              title="Caption Writer"
              desc="Platform-specific copywriting trained on your unique tone of voice and artist persona."
            />
            <FeatureCard 
              icon={<CalendarDays className="text-primary" />}
              title="Release Timeline Builder"
              desc="A smart calendar that schedules the perfect mix of teasers, announcements, and sustain content."
            />
            <FeatureCard 
              icon={<Fingerprint className="text-primary" />}
              title="Artist Brand Identity"
              desc="Systematize your aesthetic, themes, and narrative pillars so every release feels distinctly YOU."
            />
          </div>
        </div>
      </section>

      {/* ARTIST DNA */}
      <section className="py-24 md:py-32 bg-secondary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container px-6 md:px-10 mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Your Creative Identity,<br/> Systemized.</h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              STAGEONE doesn't give you generic advice. It builds a persistent <strong>Artist DNA Profile</strong> based on your influences, aesthetic, and audience. Every campaign generated is tailor-made for your specific brand.
            </p>
            <ul className="space-y-4">
              {[
                "Persistent memory of your visual style",
                "Tone of voice matching your personality",
                "Algorithmic understanding of your genre space"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-foreground/90 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Futuristic DNA Panel */}
          <div className="relative border border-border/80 bg-card rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            
            <div className="space-y-8">
              <div className="flex justify-between items-center pb-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Fingerprint className="text-primary" size={24} />
                  <span className="font-mono text-sm tracking-widest text-muted-foreground uppercase">DNA_PROFILE_V2</span>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">SYNCED</span>
              </div>
              
              <DnaRow label="GENRE PROFILE" value="Alt-R&B / Dark Synth" progress={85} />
              <DnaRow label="VISUAL AESTHETIC" value="Cinematic, High-Contrast, Brutalist" progress={92} />
              <DnaRow label="AUDIENCE SEGMENT" value="Nocturnal Creatives, 18-35" progress={78} />
              <DnaRow label="CONTENT TONE" value="Mysterious, Direct, Unpolished" progress={88} />
              
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section id="workflow" className="py-24 md:py-32">
        <div className="container px-6 md:px-10 mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">From Song to Full Campaign in Minutes.</h2>
            <p className="text-muted-foreground">The workflow designed to keep you in a flow state.</p>
          </div>
          
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-4 max-w-5xl mx-auto">
            {/* Connecting Line */}
            <div className="absolute top-12 md:top-1/2 left-[10%] right-[10%] h-full md:h-0.5 w-0.5 md:w-auto bg-border -z-10 -translate-y-1/2 hidden md:block">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>
            
            <WorkflowStep step={1} icon={<Upload />} label="Upload Song" />
            <WorkflowStep step={2} icon={<Cpu />} label="AI Analysis" />
            <WorkflowStep step={3} icon={<Wand2 />} label="Generate Campaign" />
            <WorkflowStep step={4} icon={<Video />} label="Social Assets" />
            <WorkflowStep step={5} icon={<BarChart />} label="Launch Dashboard" />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 relative overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-primary/20 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="container relative z-10 px-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 max-w-3xl mx-auto leading-tight">
            Your Next Release Deserves More Than Random Posting.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-lg shadow-[0_0_50px_-10px_hsl(var(--primary))]" data-testid="button-launch-stageone">
                Launch With STAGEONE
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container px-6 md:px-10 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="STAGEONE" className="h-5 w-auto opacity-70 grayscale" />
            <span className="font-bold tracking-widest text-xs text-muted-foreground">STAGEONE</span>
          </div>
          
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors" data-testid="link-footer-contact">Contact</a>
          </div>
          
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} STAGEONE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Subcomponents

function ProblemCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors duration-300 group">
      <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-background border border-border rounded-xl p-8 hover-elevate transition-all duration-300 group">
      <div className="h-12 w-12 rounded-lg bg-secondary border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function DnaRow({ label, value, progress }: { label: string, value: string, progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground font-mono tracking-wider">{label}</span>
        <span className="text-primary font-mono">{progress}% MATCH</span>
      </div>
      <div className="text-lg font-medium">{value}</div>
      <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function WorkflowStep({ step, icon, label }: { step: number, icon: React.ReactNode, label: string }) {
  return (
    <div className="relative flex flex-col items-center gap-4 z-10">
      <div className="w-16 h-16 rounded-full bg-card border-2 border-border flex items-center justify-center shadow-lg relative group hover:border-primary transition-colors duration-300">
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
          {step}
        </div>
        <div className="text-muted-foreground group-hover:text-primary transition-colors duration-300">
          {icon}
        </div>
      </div>
      <span className="text-sm font-medium text-center max-w-[120px]">{label}</span>
    </div>
  );
}
