import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft,
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  Building2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";

// ─── PLAN DATA ────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: null,
    priceLabel: "$0",
    period: "forever",
    tagline: "Start exploring the system.",
    description: "A preview of what STAGEONE can do. Enough to understand — not enough to operate.",
    icon: Zap,
    highlight: false,
    cta: "Start Free",
    ctaHref: "/studio",
    features: [
      { label: "1 rollout campaign per month", included: true },
      { label: "2 TikTok hook variations", included: true },
      { label: "Basic visual direction", included: true },
      { label: "STAGEONE watermark on output", included: false, note: "watermarked" },
      { label: "Full AI creative director", included: false },
      { label: "Audience intelligence clusters", included: false },
      { label: "Platform-specific optimization", included: false },
      { label: "Virality scoring system", included: false },
    ],
    color: "border-border",
    glowColor: "",
    badgeColor: "",
  },
  {
    id: "creator",
    name: "Creator",
    price: 19,
    priceLabel: "$19",
    period: "per month",
    tagline: "For artists ready to be consistent.",
    description: "Everything you need to run rollouts properly. No watermarks, no limits on the basics.",
    icon: Sparkles,
    highlight: false,
    cta: "Unlock Creator",
    ctaHref: "/studio",
    features: [
      { label: "Unlimited rollout campaigns", included: true },
      { label: "Full TikTok hook library", included: true },
      { label: "Visual direction engine", included: true },
      { label: "No watermarks", included: true },
      { label: "Platform strategy (3 platforms)", included: true },
      { label: "Full AI creative director", included: false },
      { label: "Audience intelligence clusters", included: false },
      { label: "Virality scoring system", included: false },
    ],
    color: "border-border",
    glowColor: "",
    badgeColor: "",
  },
  {
    id: "pro",
    name: "Pro Artist",
    price: 49,
    priceLabel: "$49",
    period: "per month",
    tagline: "Operate at label-level strategy.",
    description: "The full creative direction system. Every output at maximum intelligence depth.",
    icon: Crown,
    highlight: true,
    cta: "Unlock full creative direction system",
    ctaHref: "/studio",
    features: [
      { label: "Everything in Creator", included: true },
      { label: "Advanced AI creative director mode", included: true },
      { label: "Virality scoring + reasoning", included: true },
      { label: "Audience intelligence clusters", included: true },
      { label: "Platform-specific optimization (all)", included: true },
      { label: "Strategic Insight panel", included: true },
      { label: "Creative Direction Summary", included: true },
      { label: "Priority generation speed", included: true },
    ],
    color: "border-primary/60",
    glowColor: "shadow-[0_0_60px_-12px_rgba(200,169,107,0.4)]",
    badgeColor: "bg-primary text-background",
  },
  {
    id: "label",
    name: "Label",
    price: 199,
    priceLabel: "$199",
    period: "per month",
    tagline: "For those operating at scale.",
    description: "Multi-artist infrastructure. Built for management companies, labels, and agencies.",
    icon: Building2,
    highlight: false,
    cta: "Contact for Label Access",
    ctaHref: "/studio",
    features: [
      { label: "Everything in Pro Artist", included: true },
      { label: "Up to 20 artist profiles", included: true },
      { label: "Team collaboration workspace", included: true },
      { label: "Advanced analytics dashboard", included: true },
      { label: "White-label output export", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "Custom rollout templates", included: true },
      { label: "Unlimited usage, all features", included: true },
    ],
    color: "border-border",
    glowColor: "",
    badgeColor: "",
  },
];

// ─── COMPARISON TABLE ─────────────────────────────────────────────────────────

const COMPARISON_ROWS = [
  { cap: "Rollout campaigns", free: "1/month", creator: "Unlimited", pro: "Unlimited", labelPlan: "Unlimited" },
  { cap: "AI intelligence depth", free: "Surface", creator: "Standard", pro: "Director-level", labelPlan: "Director-level" },
  { cap: "Hook generation", free: "2 hooks", creator: "Full library", pro: "Full + typed", labelPlan: "Full + typed" },
  { cap: "Visual direction", free: "Basic", creator: "Full", pro: "Full + insight", labelPlan: "Full + insight" },
  { cap: "Audience clusters", free: "—", creator: "—", pro: "3 per campaign", labelPlan: "3 per campaign" },
  { cap: "Platform strategy", free: "—", creator: "3 platforms", pro: "All platforms", labelPlan: "All platforms" },
  { cap: "Virality scoring", free: "—", creator: "—", pro: "Full system", labelPlan: "Full system" },
  { cap: "Creative Direction Summary", free: "—", creator: "—", pro: "Included", labelPlan: "Included" },
  { cap: "Strategic Insight panel", free: "—", creator: "—", pro: "Always visible", labelPlan: "Always visible" },
  { cap: "Watermark", free: "Yes", creator: "None", pro: "None", labelPlan: "None" },
  { cap: "Artist profiles", free: "1", creator: "1", pro: "1", labelPlan: "Up to 20" },
  { cap: "Team collaboration", free: "—", creator: "—", pro: "—", labelPlan: "Full workspace" },
];

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────

function FeatureRow({ label, included, note }: { label: string; included: boolean; note?: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${included ? "bg-primary/20" : "bg-secondary/50"}`}>
        {included
          ? <Check size={10} className="text-primary" />
          : <X size={10} className="text-muted-foreground/40" />
        }
      </div>
      <span className={`text-sm leading-snug ${included ? "text-foreground/90" : "text-muted-foreground/40"}`}>
        {label}
        {note && <span className="ml-1.5 text-[10px] font-bold text-amber-500/70 uppercase tracking-wider">[{note}]</span>}
      </span>
    </li>
  );
}

function ComparisonCell({ value, highlight }: { value: string; highlight?: boolean }) {
  const isDash = value === "—";
  return (
    <td className={`py-3.5 px-4 text-center text-sm ${highlight ? "bg-primary/5" : ""}`}>
      {isDash
        ? <span className="text-muted-foreground/25 font-mono">—</span>
        : <span className={`font-medium ${highlight ? "text-primary" : "text-foreground/80"}`}>{value}</span>
      }
    </td>
  );
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.65, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">

      {/* Ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/6 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <motion.nav initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Link href="/" data-testid="link-back-home">
            <motion.button whileHover={{ x: -2 }}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft size={16} /> Back
            </motion.button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="STAGEONE" className="w-28 md:w-36 h-auto" />
        </div>
        <Link href="/studio">
          <button className="flex items-center gap-2 text-sm font-medium text-primary border border-primary/40 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-all duration-200" data-testid="button-nav-try-studio">
            Try the Studio <ChevronRight size={14} />
          </button>
        </Link>
      </motion.nav>

      <div className="relative z-10 pt-28 pb-24 px-6 md:px-10">

        {/* Hero */}
        <FadeIn className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs font-medium text-muted-foreground mb-6">
            <Sparkles size={12} className="text-primary" />
            <span>Simple, transparent pricing</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
            Invest in your rollout.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#E8D19F] to-primary">
              Like a label would.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Every tier unlocks a deeper layer of creative intelligence. Start free. Scale when the strategy demands it.
          </p>
        </FadeIn>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 max-w-7xl mx-auto mb-24">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <FadeIn key={plan.id} delay={0.08 * i} className="relative">
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-background text-[11px] font-bold uppercase tracking-widest shadow-lg">
                      <Crown size={10} /> Most Popular
                    </span>
                  </div>
                )}
                <div className={`relative h-full flex flex-col rounded-2xl border p-7 transition-all duration-300
                  ${plan.highlight
                    ? `${plan.color} ${plan.glowColor} bg-primary/5 scale-[1.02]`
                    : `${plan.color} bg-card/40 hover:bg-card/70 hover:border-primary/20`
                  }`}>

                  {plan.highlight && (
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-t-2xl" />
                  )}

                  {/* Plan header */}
                  <div className="mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${plan.highlight ? "bg-primary/20 border border-primary/30" : "bg-secondary border border-border"}`}>
                      <Icon size={18} className={plan.highlight ? "text-primary" : "text-muted-foreground"} />
                    </div>
                    <h2 className={`text-xl font-bold mb-1 ${plan.highlight ? "text-primary" : "text-foreground"}`}>{plan.name}</h2>
                    <p className="text-xs text-muted-foreground leading-snug">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-border/50">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold tracking-tight ${plan.highlight ? "text-primary" : "text-foreground"}`}>
                        {plan.priceLabel}
                      </span>
                      {plan.price !== null && (
                        <span className="text-sm text-muted-foreground">/{plan.period}</span>
                      )}
                    </div>
                    {plan.price === null && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                    <p className="text-xs text-muted-foreground/70 mt-2 leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f, fi) => (
                      <FeatureRow key={fi} label={f.label} included={f.included} note={(f as { note?: string }).note} />
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href={plan.ctaHref}>
                    <button
                      data-testid={`button-plan-cta-${plan.id}`}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                        ${plan.highlight
                          ? "bg-primary text-background hover:bg-primary/90 shadow-lg shadow-primary/20"
                          : "border border-border bg-background/50 text-foreground hover:border-primary/40 hover:bg-card"
                        }`}>
                      {plan.cta}
                      {plan.highlight && <ArrowRight size={14} />}
                    </button>
                  </Link>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Comparison Table */}
        <FadeIn className="max-w-6xl mx-auto mb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">What changes at each tier</h2>
            <p className="text-muted-foreground">The difference is intelligence depth — not just feature count.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-muted-foreground w-1/3">Capability</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-muted-foreground">Free</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-muted-foreground">Creator</th>
                  <th className="py-4 px-4 text-center text-sm font-bold text-primary bg-primary/5">Pro Artist</th>
                  <th className="py-4 px-4 text-center text-sm font-semibold text-muted-foreground">Label</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={i} className={`border-b border-border/50 last:border-0 ${i % 2 === 0 ? "bg-card/20" : ""}`}>
                    <td className="py-3.5 px-4 text-sm text-foreground/80 font-medium">{row.cap}</td>
                    <ComparisonCell value={row.free} />
                    <ComparisonCell value={row.creator} />
                    <ComparisonCell value={row.pro} highlight />
                    <ComparisonCell value={row.labelPlan} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>

        {/* Tier Philosophy Section */}
        <FadeIn className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">What each tier actually means</h2>
            <p className="text-muted-foreground">This isn't a feature list. It's an operating level.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                tier: "Free",
                headline: "You're looking through the window.",
                desc: "You can see what STAGEONE does. You can't feel it working for you. Enough to understand the system — not enough to use it.",
                color: "border-border",
                textColor: "text-muted-foreground",
              },
              {
                tier: "Creator",
                headline: "You're in the room.",
                desc: "Unlimited access to the core rollout engine. Your campaigns are real and complete. This is where consistency becomes possible.",
                color: "border-border hover:border-primary/20",
                textColor: "text-foreground/80",
              },
              {
                tier: "Pro Artist",
                headline: "You're operating with a team.",
                desc: "The AI becomes a creative director, not just a generator. Every output is reasoned, positioned, and built for maximum impact. This is label-level strategy — solo.",
                color: "border-primary/40 bg-primary/5",
                textColor: "text-foreground",
                accent: true,
              },
              {
                tier: "Label",
                headline: "You're running an operation.",
                desc: "Multi-artist. Team-facing. Analytics-driven. Built for the people behind the artists — managers, labels, agencies that can't afford to guess.",
                color: "border-border hover:border-primary/20",
                textColor: "text-foreground/80",
              },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }} transition={{ delay: 0.07 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`p-7 rounded-2xl border transition-all duration-300 ${item.color}`}>
                {item.accent && (
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest mb-3 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    <Crown size={9} /> Recommended
                  </div>
                )}
                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{item.tier}</p>
                <h3 className={`text-lg font-bold mb-2 ${item.accent ? "text-foreground" : item.textColor}`}>{item.headline}</h3>
                <p className={`text-sm leading-relaxed ${item.textColor === "text-foreground" ? "text-muted-foreground" : "text-muted-foreground/70"}`}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* Final CTA */}
        <FadeIn className="text-center max-w-2xl mx-auto">
          <div className="relative rounded-3xl border border-primary/20 bg-primary/5 p-12 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute inset-0 bg-primary/3 rounded-3xl" />
            <div className="relative z-10">
              <Crown size={32} className="text-primary mx-auto mb-5" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Start free. Scale when<br />the strategy demands it.
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                No credit card required for the free tier. Upgrade the moment you need the full system working for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/studio">
                  <button data-testid="button-pricing-cta-primary"
                    className="flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20">
                    Start Free <ArrowRight size={16} />
                  </button>
                </Link>
                <Link href="/studio">
                  <button data-testid="button-pricing-cta-pro"
                    className="flex items-center gap-2 px-8 py-4 rounded-xl border border-primary/40 text-primary font-bold text-sm hover:bg-primary/10 transition-all duration-200">
                    Unlock full creative direction system
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </div>
  );
}
