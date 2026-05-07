import { forwardRef } from "react";

export interface CampaignCardData {
  songTitle: string;
  artistName: string;
  genre: string;
  hook: string;
  strategyInsight: string;
  phase: "TEASE" | "BUILD" | "LAUNCH" | "SUSTAIN";
  overallScore?: number;
  dnaTag?: string;
}

const PHASE_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  TEASE:   { bg: "rgba(251,191,36,0.10)",  text: "#FBBF24", border: "rgba(251,191,36,0.28)", label: "TEASE" },
  BUILD:   { bg: "rgba(96,165,250,0.10)",  text: "#60A5FA", border: "rgba(96,165,250,0.28)", label: "BUILD" },
  LAUNCH:  { bg: "rgba(200,169,107,0.12)", text: "#C8A96B", border: "rgba(200,169,107,0.38)", label: "LAUNCH" },
  SUSTAIN: { bg: "rgba(52,211,153,0.10)",  text: "#34D399", border: "rgba(52,211,153,0.28)", label: "SUSTAIN" },
};

interface CampaignCardProps {
  data: CampaignCardData;
  compact?: boolean;
}

const CampaignCard = forwardRef<HTMLDivElement, CampaignCardProps>(
  ({ data, compact = false }, ref) => {
    const phase = PHASE_STYLES[data.phase] ?? PHASE_STYLES.LAUNCH;
    const pad = compact ? 24 : 36;
    const titleSize = compact ? 22 : 30;
    const subSize = compact ? 12 : 14;
    const labelSize = compact ? 9 : 10;
    const bodySize = compact ? 12 : 13;
    const hookPad = compact ? "10px 14px" : "14px 18px";

    return (
      <div
        ref={ref}
        style={{
          background: "linear-gradient(145deg, #111114 0%, #0D0D0F 55%, #0A0A0C 100%)",
          border: "1px solid rgba(200,169,107,0.22)",
          borderRadius: compact ? 16 : 20,
          padding: pad,
          position: "relative",
          overflow: "hidden",
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "'Inter', -apple-system, sans-serif",
          boxShadow: "0 0 80px rgba(200,169,107,0.07), 0 24px 64px rgba(0,0,0,0.7)",
        }}
      >
        {/* Gold top border */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(to right, transparent, #C8A96B 40%, #C8A96B 60%, transparent)" }} />
        {/* Ambient glow top */}
        <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 260, height: 140, borderRadius: "50%", background: "rgba(200,169,107,0.05)", filter: "blur(50px)", pointerEvents: "none" }} />
        {/* Corner accent */}
        <div style={{ position: "absolute", bottom: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(200,169,107,0.03)", filter: "blur(40px)", pointerEvents: "none" }} />

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: compact ? 18 : 26 }}>
          <div style={{ fontSize: labelSize, fontWeight: 700, letterSpacing: "0.18em", color: "#C8A96B", textTransform: "uppercase" as const }}>
            STAGEONE
          </div>
          <div style={{
            fontSize: labelSize,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: phase.text,
            background: phase.bg,
            border: `1px solid ${phase.border}`,
            borderRadius: 6,
            padding: compact ? "3px 8px" : "4px 10px",
            textTransform: "uppercase" as const,
          }}>
            {phase.label}
          </div>
        </div>

        {/* Song title */}
        <div style={{ fontSize: titleSize, fontWeight: 800, color: "#FAFAFA", letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 6 }}>
          {data.songTitle || "Untitled"}
        </div>

        {/* Artist + genre */}
        <div style={{ fontSize: subSize, color: "rgba(250,250,250,0.45)", marginBottom: compact ? 18 : 24, letterSpacing: "0.01em" }}>
          {data.artistName}{data.genre ? ` · ${data.genre}` : ""}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: compact ? 16 : 22 }} />

        {/* Strategy Insight */}
        <div style={{ marginBottom: compact ? 14 : 18 }}>
          <div style={{ fontSize: labelSize, fontWeight: 700, letterSpacing: "0.13em", color: "rgba(200,169,107,0.65)", textTransform: "uppercase" as const, marginBottom: compact ? 6 : 8 }}>
            Strategy Insight
          </div>
          <div style={{ fontSize: bodySize + 1, color: "rgba(250,250,250,0.82)", lineHeight: 1.55, fontWeight: 500 }}>
            {data.strategyInsight}
          </div>
        </div>

        {/* TikTok Hook */}
        <div style={{
          background: "rgba(200,169,107,0.06)",
          border: "1px solid rgba(200,169,107,0.14)",
          borderRadius: 12,
          padding: hookPad,
          marginBottom: compact ? 14 : 20,
        }}>
          <div style={{ fontSize: labelSize, fontWeight: 700, letterSpacing: "0.13em", color: "rgba(200,169,107,0.65)", textTransform: "uppercase" as const, marginBottom: 6 }}>
            Hook
          </div>
          <div style={{ fontSize: bodySize, color: "rgba(250,250,250,0.78)", lineHeight: 1.55, fontStyle: "italic" as const }}>
            "{data.hook}"
          </div>
        </div>

        {/* DNA tag */}
        {data.dnaTag && (
          <div style={{ fontSize: labelSize, color: "rgba(250,250,250,0.28)", letterSpacing: "0.06em" }}>
            {data.dnaTag}
          </div>
        )}

        {/* Watermark */}
        <div style={{
          position: "absolute",
          bottom: compact ? 14 : 18,
          right: compact ? 18 : 24,
          fontSize: 8,
          fontWeight: 600,
          letterSpacing: "0.14em",
          color: "rgba(250,250,250,0.16)",
          textTransform: "uppercase" as const,
        }}>
          STAGEONE · AI Rollout System
        </div>
      </div>
    );
  }
);

CampaignCard.displayName = "CampaignCard";
export default CampaignCard;
