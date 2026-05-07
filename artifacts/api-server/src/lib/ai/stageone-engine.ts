export interface RolloutInput {
  songTitle: string;
  genre?: string;
  mood?: string;
}

export interface ArtistContext {
  artistName?: string | null;
  genre?: string | null;
  secondaryGenre?: string | null;
  audienceProfile?: string | null;
  preferences?: Record<string, unknown> | null;
}

export interface DnaContext {
  tone?: string | null;
  visualStyle?: string | null;
  hookStyle?: string | null;
  audienceType?: string | null;
  identitySummary?: string | null;
}

export interface NvidiaRolloutOutput {
  rolloutTimeline: Array<{ phase: string; strategy: string }>;
  hooks: Array<{ type: string; text: string }>;
  visualDirection: {
    lighting: string;
    aesthetic: string;
    scene: string;
    colorPalette: string;
  };
  audienceStrategy: Array<{ segment: string; behavior: string }>;
  launchScore: {
    hookVirality: number;
    emotionalDepth: number;
    replayValue: number;
    trendFit: number;
    audienceFit: number;
  };
  strategicInsight: string;
}

export async function generateRollout(
  input: RolloutInput,
  artist: ArtistContext | null,
  dna: DnaContext | null
): Promise<NvidiaRolloutOutput | null> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return null;
  }

  const prompt = `You are STAGEONE, a senior music marketing creative director. Build a rollout strategy. Be strategic, opinionated, culturally aware, genre-specific, and non-generic.

ARTIST: ${JSON.stringify(artist ?? {})}
DNA: ${JSON.stringify(dna ?? {})}
INPUT: ${JSON.stringify(input)}

Return ONLY valid JSON with this exact structure:
{
  "rolloutTimeline": [
    {"phase": "TEASE", "strategy": ""},
    {"phase": "BUILD", "strategy": ""},
    {"phase": "RELEASE", "strategy": ""},
    {"phase": "SUSTAIN", "strategy": ""}
  ],
  "hooks": [
    {"type": "curiosity", "text": ""},
    {"type": "emotional", "text": ""},
    {"type": "identity", "text": ""}
  ],
  "visualDirection": {
    "lighting": "",
    "aesthetic": "",
    "scene": "",
    "colorPalette": ""
  },
  "audienceStrategy": [
    {"segment": "", "behavior": ""}
  ],
  "launchScore": {
    "hookVirality": 0,
    "emotionalDepth": 0,
    "replayValue": 0,
    "trendFit": 0,
    "audienceFit": 0
  },
  "strategicInsight": ""
}`;

  try {
    const response = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.1-70b-instruct",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2000,
        }),
        signal: AbortSignal.timeout(20000),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    // Strip markdown code fences if present
    const cleaned = content.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    return JSON.parse(cleaned) as NvidiaRolloutOutput;
  } catch {
    return null;
  }
}
