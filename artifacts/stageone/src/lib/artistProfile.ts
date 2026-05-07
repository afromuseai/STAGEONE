export interface ArtistProfile {
  artistName: string;
  primaryGenre: string;
  secondaryGenre: string;
  moodPreferences: string[];
  visualAesthetic: string[];
  targetAudience: string;
  preferredHookStyle: string;
  rolloutHistory: RolloutRecord[];
  creativeIdentitySummary: string;
  updatedAt: number;
}

export interface RolloutRecord {
  id: string;
  songTitle: string;
  artistName: string;
  genre: string;
  goal: string;
  mood: string;
  targetAudience: string;
  platforms: string[];
  timestamp: number;
}

const STORAGE_KEY = "stageone_artist_profile";

const DEFAULT_PROFILE: ArtistProfile = {
  artistName: "",
  primaryGenre: "",
  secondaryGenre: "",
  moodPreferences: [],
  visualAesthetic: [],
  targetAudience: "",
  preferredHookStyle: "",
  rolloutHistory: [],
  creativeIdentitySummary: "",
  updatedAt: 0,
};

export function getProfile(): ArtistProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: ArtistProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...profile, updatedAt: Date.now() }));
  } catch {}
}

export function learnFromRollout(
  profile: ArtistProfile,
  record: Omit<RolloutRecord, "id" | "timestamp">
): ArtistProfile {
  const next = { ...profile };

  if (record.artistName) next.artistName = record.artistName;
  if (record.genre) {
    if (!next.primaryGenre) {
      next.primaryGenre = record.genre;
    } else if (next.primaryGenre !== record.genre && !next.secondaryGenre) {
      next.secondaryGenre = record.genre;
    }
  }
  if (record.mood) {
    const moods = record.mood.toLowerCase().split(/[,\s]+/).filter(Boolean);
    const existing = new Set(next.moodPreferences.map(m => m.toLowerCase()));
    moods.forEach(m => { if (!existing.has(m)) next.moodPreferences = [...next.moodPreferences.slice(-4), m]; });
  }
  if (record.targetAudience) next.targetAudience = record.targetAudience;

  const newRecord: RolloutRecord = {
    ...record,
    id: Math.random().toString(36).slice(2),
    timestamp: Date.now(),
  };
  next.rolloutHistory = [newRecord, ...next.rolloutHistory].slice(0, 20);
  next.creativeIdentitySummary = buildIdentitySummary(next);

  return next;
}

function buildIdentitySummary(profile: ArtistProfile): string {
  const parts: string[] = [];
  if (profile.primaryGenre) parts.push(profile.primaryGenre);
  if (profile.secondaryGenre) parts.push(profile.secondaryGenre);
  if (profile.moodPreferences.length) parts.push(profile.moodPreferences.slice(-2).join(" / "));
  if (!parts.length) return "";
  return parts.join(" · ");
}

export function getPersonalizationMessage(profile: ArtistProfile): string {
  const count = profile.rolloutHistory.length;
  if (count === 0) return "Building your creative identity from this rollout…";
  if (count === 1) return `Refining your rollout style based on ${profile.primaryGenre || "your"} identity…`;
  if (profile.primaryGenre && profile.moodPreferences.length > 0) {
    return `Building consistency with your established ${profile.moodPreferences[profile.moodPreferences.length - 1]} ${profile.primaryGenre} identity…`;
  }
  return `Adapting strategy from ${count} previous campaign${count > 1 ? "s" : ""}…`;
}

export function hasMemory(profile: ArtistProfile): boolean {
  return profile.rolloutHistory.length > 0;
}
