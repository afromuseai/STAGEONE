import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Copy, Check, Instagram, Twitter, ExternalLink } from "lucide-react";
import { toPng } from "html-to-image";
import CampaignCard, { type CampaignCardData } from "./CampaignCard";

type ExportFormat = "square" | "twitter" | "story" | "tiktok";

interface FormatConfig {
  label: string;
  dims: string;
  w: number;
  h: number;
  icon: React.ReactNode;
  previewAspect: string;
}

const FORMATS: Record<ExportFormat, FormatConfig> = {
  square:  { label: "Square",          dims: "1080×1080", w: 1080, h: 1080, icon: <div className="w-4 h-4 border-2 border-current rounded-sm" />, previewAspect: "aspect-square" },
  twitter: { label: "Twitter / X",     dims: "1200×675",  w: 1200, h: 675,  icon: <Twitter size={14} />, previewAspect: "aspect-video" },
  story:   { label: "Instagram Story", dims: "1080×1920", w: 1080, h: 1920, icon: <Instagram size={14} />, previewAspect: "aspect-[9/16]" },
  tiktok:  { label: "TikTok Post",     dims: "1080×1920", w: 1080, h: 1920, icon: <ExternalLink size={14} />, previewAspect: "aspect-[9/16]" },
};

interface ShareModalProps {
  data: CampaignCardData;
  onClose: () => void;
}

export default function ShareModal({ data, onClose }: ShareModalProps) {
  const [format, setFormat] = useState<ExportFormat>("square");
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const fmt = FORMATS[format];

  async function handleExport() {
    if (!captureRef.current) return;
    setExporting(true);
    try {
      const pixelRatio = fmt.w / captureRef.current.offsetWidth;
      const dataUrl = await toPng(captureRef.current, {
        pixelRatio,
        cacheBust: true,
        style: { borderRadius: "0" },
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${data.songTitle.replace(/\s+/g, "-").toLowerCase()}-${format}-stageone.png`;
      a.click();
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setExporting(false);
    }
  }

  function handleCopyLink() {
    const mockUser = (data.artistName || "artist").toLowerCase().replace(/\s+/g, "");
    const url = `${window.location.origin}${import.meta.env.BASE_URL}?ref=${mockUser}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}>
        <div className="absolute inset-0 bg-background/85 backdrop-blur-md" />

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-card rounded-3xl border border-border/60 shadow-2xl shadow-black/60 overflow-hidden">

          {/* Gold top line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border/40">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-0.5">Export Campaign Card</p>
              <h2 className="text-lg font-bold tracking-tight">{data.songTitle}</h2>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-0 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border/40">

            {/* Left: Format selector + actions */}
            <div className="w-full sm:w-52 shrink-0 p-5 flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Format</p>
                <div className="flex flex-col gap-1.5">
                  {(Object.entries(FORMATS) as [ExportFormat, FormatConfig][]).map(([key, cfg]) => (
                    <button key={key} onClick={() => setFormat(key)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left
                        ${format === key
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                        }`}>
                      <span className="shrink-0">{cfg.icon}</span>
                      <div>
                        <div className="text-xs font-semibold leading-none mb-0.5">{cfg.label}</div>
                        <div className="text-[10px] opacity-60">{cfg.dims}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-2">
                <button onClick={handleExport} disabled={exporting}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-all duration-200 disabled:opacity-60 shadow-lg shadow-primary/20">
                  {exporting ? (
                    <motion.div className="w-4 h-4 border-2 border-background/40 border-t-background rounded-full"
                      animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
                  ) : <Download size={14} />}
                  {exporting ? "Exporting…" : "Export PNG"}
                </button>

                <button onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:border-primary/30 transition-all duration-200">
                  {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy Referral Link"}
                </button>

                <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed px-1">
                  Share your link and earn access to Pro features
                </p>
              </div>
            </div>

            {/* Right: Card preview */}
            <div className="flex-1 p-5 flex flex-col items-center justify-center bg-[#090909]">
              <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-4">Preview</p>

              <div className={`w-full max-w-[300px] ${fmt.previewAspect} relative`}>
                <div
                  ref={captureRef}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: format === "twitter"
                      ? "linear-gradient(135deg, #0C0C0E 0%, #0A0A0C 100%)"
                      : "linear-gradient(160deg, #0C0C0E 0%, #080809 60%, #0A0A0B 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: format === "twitter" ? "24px 28px" : format === "square" ? "28px" : "48px 28px",
                    boxSizing: "border-box" as const,
                  }}>
                  {/* Bg glow */}
                  <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "30%", borderRadius: "50%", background: "rgba(200,169,107,0.04)", filter: "blur(40px)", pointerEvents: "none" }} />
                  <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
                    <CampaignCard data={data} compact={format === "twitter"} />
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground/40 mt-4">{fmt.dims} · PNG export</p>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
