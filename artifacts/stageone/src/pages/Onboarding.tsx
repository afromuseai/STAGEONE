import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useArtist } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Sparkles, Fingerprint, Users, Palette, ChevronRight, Check } from "lucide-react";

const GENRE_OPTIONS = [
  "Hip-Hop", "Trap", "R&B / Soul", "Pop", "Afrobeats", "Amapiano",
  "Electronic", "House", "Alternative", "Indie", "Latin", "Gospel",
  "Jazz", "Rock", "Synthwave", "Neo-Soul",
];

const MOOD_OPTIONS = ["dark", "emotional", "energetic", "cinematic", "euphoric", "melancholic", "aggressive"];

const AESTHETIC_OPTIONS = ["minimal", "luxury", "street", "futuristic", "retro", "cinematic", "raw"];

const AUDIENCE_OPTIONS = [
  { id: "gen_z_tiktok", label: "Gen Z TikTok listeners", desc: "18–24, short-form content, trend-driven" },
  { id: "club_audience", label: "Club audience", desc: "Nightlife, bass-forward, high energy" },
  { id: "emotional_streaming", label: "Emotional streaming listeners", desc: "Late-night, saves-driven, deep connection" },
  { id: "viral_shortform", label: "Viral short-form audience", desc: "Platform-agnostic, content-hungry, sharers" },
];

interface FormData {
  artistName: string;
  genre: string;
  secondaryGenre: string;
  moods: string[];
  aesthetics: string[];
  audiences: string[];
}

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { artist, isLoading: artistLoading, hasOnboarded } = useArtist();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<FormData>({
    artistName: "",
    genre: "",
    secondaryGenre: "",
    moods: [],
    aesthetics: [],
    audiences: [],
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (!artistLoading && hasOnboarded) {
      navigate("/dashboard");
    }
  }, [artistLoading, hasOnboarded, navigate]);

  function toggle(field: "moods" | "aesthetics" | "audiences", value: string) {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  }

  async function handleSubmit() {
    if (!form.artistName || !form.genre) return;
    setSubmitting(true);
    try {
      const audienceProfile = form.audiences
        .map(id => AUDIENCE_OPTIONS.find(o => o.id === id)?.label ?? id)
        .join(", ");

      const identitySummary = [
        form.genre,
        form.moods.slice(0, 2).join(" / "),
        form.aesthetics.slice(0, 2).join(" / "),
      ].filter(Boolean).join(" · ");

      const res = await fetch("/api/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          artistName: form.artistName,
          genre: form.genre,
          secondaryGenre: form.secondaryGenre || null,
          audienceProfile,
          preferences: { moods: form.moods, aesthetics: form.aesthetics },
          tone: form.moods[0] ?? null,
          visualStyle: form.aesthetics[0] ?? null,
          hookStyle: null,
          audienceType: audienceProfile,
          identitySummary,
        }),
      });

      if (res.ok) {
        await queryClient.invalidateQueries({ queryKey: ["/api/artists/me"] });
        setDone(true);
        setTimeout(() => navigate("/dashboard"), 2800);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || artistLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-20 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center"
        >
          <Sparkles size={32} className="text-primary" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-3 max-w-md"
        >
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Identity Activated</p>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {form.artistName}.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Your {form.genre} identity is now active in STAGEONE. The AI creative director is calibrated to your sound.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-1.5"
        >
          {[0, 0.15, 0.3].map((d, i) => (
            <motion.div key={i} className="w-2 h-2 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1, delay: d }} />
          ))}
        </motion.div>
      </div>
    );
  }

  const steps = [
    { num: 1, label: "Identity", icon: <Fingerprint size={14} /> },
    { num: 2, label: "Creative Style", icon: <Palette size={14} /> },
    { num: 3, label: "Audience", icon: <Users size={14} /> },
  ];

  const canProceedStep1 = !!form.artistName && !!form.genre;
  const canProceedStep2 = form.moods.length > 0;
  const canSubmit = form.audiences.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-primary/4 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <div className="relative max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="STAGEONE" className="h-6 w-auto mx-auto mb-8" />
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Artist Onboarding</p>
          <h1 className="text-3xl font-bold tracking-tight">Build your creative identity</h1>
          <p className="text-muted-foreground mt-2 text-sm">This shapes every AI rollout STAGEONE generates for you.</p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                step === s.num
                  ? "bg-primary text-background"
                  : step > s.num
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-card border border-border text-muted-foreground"
              }`}>
                {step > s.num ? <Check size={12} /> : s.icon}
                {s.label}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-px transition-colors duration-300 ${step > s.num ? "bg-primary/40" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">

          {step === 1 && (
            <motion.div key="step1"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6">
              <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Artist Name</label>
                  <input
                    type="text"
                    value={form.artistName}
                    onChange={e => setForm(p => ({ ...p, artistName: e.target.value }))}
                    placeholder="Your artist name"
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary Genre</label>
                  <div className="flex flex-wrap gap-2">
                    {GENRE_OPTIONS.map(g => (
                      <button key={g}
                        onClick={() => setForm(p => ({ ...p, genre: p.genre === g ? "" : g }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                          form.genre === g
                            ? "bg-primary/20 border-primary/60 text-primary"
                            : "bg-card/40 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Secondary Genre <span className="text-muted-foreground/40 normal-case font-normal">(optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {GENRE_OPTIONS.filter(g => g !== form.genre).map(g => (
                      <button key={g}
                        onClick={() => setForm(p => ({ ...p, secondaryGenre: p.secondaryGenre === g ? "" : g }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                          form.secondaryGenre === g
                            ? "bg-primary/10 border-primary/40 text-primary"
                            : "bg-card/20 border-border/60 text-muted-foreground/70 hover:border-primary/20 hover:text-foreground"
                        }`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                  canProceedStep1
                    ? "bg-primary text-background hover:bg-primary/90 shadow-lg shadow-primary/20"
                    : "bg-card border border-border text-muted-foreground cursor-not-allowed"
                }`}>
                Continue <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6">
              <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mood Preference</label>
                  <div className="flex flex-wrap gap-2">
                    {MOOD_OPTIONS.map(m => (
                      <button key={m}
                        onClick={() => toggle("moods", m)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 capitalize ${
                          form.moods.includes(m)
                            ? "bg-primary/20 border-primary/60 text-primary"
                            : "bg-card/40 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Visual Aesthetic</label>
                  <div className="flex flex-wrap gap-2">
                    {AESTHETIC_OPTIONS.map(a => (
                      <button key={a}
                        onClick={() => toggle("aesthetics", a)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 capitalize ${
                          form.aesthetics.includes(a)
                            ? "bg-primary/20 border-primary/60 text-primary"
                            : "bg-card/40 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)}
                  className="flex-1 py-4 rounded-2xl font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                  Back
                </button>
                <button onClick={() => setStep(3)} disabled={!canProceedStep2}
                  className={`flex-[2] py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    canProceedStep2
                      ? "bg-primary text-background hover:bg-primary/90 shadow-lg shadow-primary/20"
                      : "bg-card border border-border text-muted-foreground cursor-not-allowed"
                  }`}>
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6">
              <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Who you make music for</label>
                <div className="space-y-2">
                  {AUDIENCE_OPTIONS.map(opt => (
                    <button key={opt.id}
                      onClick={() => toggle("audiences", opt.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-150 ${
                        form.audiences.includes(opt.id)
                          ? "bg-primary/10 border-primary/40"
                          : "bg-card/30 border-border hover:border-primary/20"
                      }`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className={`text-sm font-semibold ${form.audiences.includes(opt.id) ? "text-primary" : "text-foreground"}`}>
                            {opt.label}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          form.audiences.includes(opt.id) ? "border-primary bg-primary" : "border-border"
                        }`}>
                          {form.audiences.includes(opt.id) && <Check size={10} className="text-background" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)}
                  className="flex-1 py-4 rounded-2xl font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                  Back
                </button>
                <button onClick={handleSubmit} disabled={!canSubmit || submitting}
                  className={`flex-[2] py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    canSubmit && !submitting
                      ? "bg-primary text-background hover:bg-primary/90 shadow-lg shadow-primary/20"
                      : "bg-card border border-border text-muted-foreground cursor-not-allowed"
                  }`}>
                  {submitting ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Sparkles size={16} />
                    </motion.div> Activating...</>
                  ) : (
                    <><Sparkles size={16} /> Activate Identity</>
                  )}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
