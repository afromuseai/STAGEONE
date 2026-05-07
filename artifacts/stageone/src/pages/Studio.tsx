import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "wouter";
import ShareModal from "@/components/ShareModal";
import { getProfile, saveProfile, learnFromRollout, getPersonalizationMessage, hasMemory } from "@/lib/artistProfile";
import {
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Music,
  Users,
  Target,
  Zap,
  Clock,
  TrendingUp,
  Eye,
  Palette,
  Mic2,
  Radio,
  BarChart3,
  Fingerprint,
  Play,
  Wand2,
  Flame,
  Star,
  Globe,
  Brain,
  Repeat2,
  Heart,
  Share2,
  Wifi,
  Crown,
  X,
  ArrowRight,
} from "lucide-react";

// ─── INTELLIGENCE ENGINE ─────────────────────────────────────────────────────

const GENRE_CATEGORIES: Record<string, string[]> = {
  "Urban": ["Hip-Hop", "Trap", "Drill", "R&B / Soul", "Neo-Soul"],
  "Pop & Alternative": ["Pop", "Hyperpop", "Alternative", "Indie", "Bedroom Pop", "Lo-Fi"],
  "Electronic": ["Electronic", "House", "Techno", "Synthwave", "Drum & Bass", "Ambient"],
  "Global": ["Afrobeats", "Amapiano", "Afro-Pop", "Latin", "Reggaeton", "Soca", "Dancehall", "Reggae", "K-Pop", "Bossa Nova"],
  "Roots": ["Gospel", "Jazz", "Blues", "Funk", "Soul", "Country", "Folk"],
  "Rock & Alt": ["Rock", "Indie Rock", "Punk", "Emo", "Metal", "Grunge"],
};

const GENRES = Object.values(GENRE_CATEGORIES).flat();
const GOALS = ["First 100K Streams", "Viral TikTok Moment", "Playlist Placement", "Build Fanbase", "Label Attention", "Brand Deals"];
const PLATFORMS = ["TikTok", "Instagram", "YouTube", "Spotify", "Apple Music", "Twitter/X", "SoundCloud"];

// Deterministic shuffle seeded by a string
function pick<T>(arr: T[], seed: string, offset = 0): T {
  let hash = offset * 31;
  for (let i = 0; i < seed.length; i++) hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  return arr[Math.abs(hash) % arr.length];
}
function pickN<T>(arr: T[], n: number, seed: string): T[] {
  const result: T[] = [];
  const used = new Set<number>();
  for (let i = 0; i < n && result.length < arr.length; i++) {
    let hash = i * 73;
    for (let j = 0; j < seed.length; j++) hash = ((hash << 5) - hash + seed.charCodeAt(j)) | 0;
    const idx = Math.abs(hash) % arr.length;
    if (!used.has(idx)) { used.add(idx); result.push(arr[idx]); }
    else { for (let k = 0; k < arr.length; k++) { if (!used.has(k)) { used.add(k); result.push(arr[k]); break; } } }
  }
  return result;
}

// ── Hooks per genre — embedded type for contrast-aware mood selection ──
const HOOKS_BY_GENRE: Record<string, Array<{ text: string; type: string }>> = {
  "Hip-Hop": [
    { text: "POV: the city finally recognizes what you knew first", type: "POV" },
    { text: "They said this sound wasn't ready. The algorithm disagreed.", type: "Curiosity Gap" },
    { text: "This record doesn't ask for your attention — it takes it.", type: "Identity" },
    { text: "When the first verse hits and you realize this rapper has been living exactly your life", type: "Emotional" },
    { text: "Stop. Replay that bar. I'll wait.", type: "Pattern Interrupt" },
  ],
  "R&B / Soul": [
    { text: "POV: it's 2AM, you're not okay, and this song already knew that", type: "POV" },
    { text: "The note she holds at 1:47 just diagnosed something I didn't know was wrong with me", type: "Emotional" },
    { text: "I need you to tell me what song this is. Right now. I'm serious.", type: "Curiosity Gap" },
    { text: "Songs this emotionally precise shouldn't be allowed to exist in the same timeline as me.", type: "Pattern Interrupt" },
    { text: "For everyone who's ever sent a song instead of saying the thing they couldn't say", type: "Identity" },
  ],
  "Pop": [
    { text: "This is the song that soundtracks the summer you'll never forget — and it just dropped", type: "Curiosity Gap" },
    { text: "POV: the chorus just made you feel every version of yourself at once", type: "POV" },
    { text: "Tell me you've felt this exact feeling without telling me", type: "Identity" },
    { text: "The bridge alone makes this the best track of the quarter. That's not an opinion.", type: "Pattern Interrupt" },
    { text: "Six hours of repeat listens and the hook is still pulling harder than the first time", type: "Emotional" },
  ],
  "Afrobeats": [
    { text: "Your body is going to do something involuntary in the first 10 seconds. Consider yourself warned.", type: "Pattern Interrupt" },
    { text: "This rhythm was engineered to make you forget you have problems for exactly 3 minutes and 42 seconds", type: "Emotional" },
    { text: "POV: you walked into the party and this was playing and the entire night rewrote itself", type: "POV" },
    { text: "The cultural range on this record is something the algorithm isn't ready for yet", type: "Curiosity Gap" },
    { text: "This is what it sounds like when African rhythm and global production stop compromising and just win", type: "Identity" },
  ],
  "Electronic": [
    { text: "This track isn't background music. It's an instruction set for the next four minutes of your nervous system.", type: "Pattern Interrupt" },
    { text: "I've been searching for this exact sound for three years. Someone finally built it.", type: "Curiosity Gap" },
    { text: "POV: deep work playlist, 2AM, you found the zone, and this track is the reason you stay in it", type: "POV" },
    { text: "For the people who feel sound in their chest cavity before their brain processes it", type: "Identity" },
    { text: "The tension in this build is clinical. When the release hits, you'll understand what I mean.", type: "Emotional" },
  ],
  "Alternative": [
    { text: "This is what it sounds like when someone makes art instead of content and refuses to apologize for it", type: "Identity" },
    { text: "I cannot explain what this song does to me and that is precisely why it's working", type: "Emotional" },
    { text: "POV: you find the song that sounds like it was built specifically for the version of you nobody else has met", type: "POV" },
    { text: "Three people are going to send you this today. You're welcome a day early.", type: "Curiosity Gap" },
    { text: "Alternative used to mean difficult. This record redefines it as just honest.", type: "Pattern Interrupt" },
  ],
  "Latin": [
    { text: "This rhythm is going to be in 40 pieces of content by Sunday. First-mover advantage starts right now.", type: "Curiosity Gap" },
    { text: "POV: somewhere warm, night just started, this song decides what the rest of it looks like", type: "POV" },
    { text: "Latin music didn't need a crossover moment. It already crossed over. This is the confirmation.", type: "Identity" },
    { text: "The way this production layers tradition over modernity should be taught at Berklee.", type: "Pattern Interrupt" },
    { text: "This is the song that makes you want to call the person you haven't spoken to in six months", type: "Emotional" },
  ],
  "Indie": [
    { text: "Not everything great goes viral first. Some things just slowly become essential. This is starting now.", type: "Curiosity Gap" },
    { text: "This song found me at the exact moment I needed it. Still don't know how that works.", type: "Emotional" },
    { text: "POV: you're the person who plays this for everyone and watches their face change", type: "POV" },
    { text: "For everyone who is exhausted by music that sounds like it was designed by a committee of algorithms", type: "Identity" },
    { text: "Give this three full minutes before you form an opinion. It earns the patience.", type: "Pattern Interrupt" },
  ],
  "Gospel": [
    { text: "This isn't inspirational content. This is what it sounds like to actually believe something with your whole body.", type: "Identity" },
    { text: "I wasn't prepared for this to hit the way it did. I should have known better.", type: "Emotional" },
    { text: "POV: the moment during worship when the room stops performing and starts actually meaning it", type: "POV" },
    { text: "Gospel has been emotionally ahead of every other genre for a hundred years. This record explains why.", type: "Curiosity Gap" },
    { text: "There is a specific moment in this record that will stop you completely. I won't tell you when.", type: "Pattern Interrupt" },
  ],
  "Jazz": [
    { text: "Improvisation this precise is never an accident. Someone made a hundred invisible decisions so you could feel this.", type: "Curiosity Gap" },
    { text: "POV: the exact moment you understood that jazz isn't complicated — it's patient, and you weren't", type: "POV" },
    { text: "This arrangement did something to the room. The room still hasn't fully recovered.", type: "Emotional" },
    { text: "For everyone who was told jazz is for another generation: this record is your introduction and your correction.", type: "Identity" },
    { text: "Jazz doesn't repeat itself. Neither does this track. Pay full attention the first time.", type: "Pattern Interrupt" },
  ],
};

// ── Timeline templates per release goal — phase-psychology driven ──
const TIMELINE_BY_GOAL: Record<string, Array<{ day: string; action: string; phase: string }>> = {
  "Viral TikTok Moment": [
    { day: "Day 1–2", action: "Open with the hook — 8 seconds, no context, no caption explanation. Curiosity is the engine. The moment you explain it, it dies. Post twice.", phase: "TEASE" },
    { day: "Day 3", action: "Post a version engineered for stitch bait — leave a deliberate gap that demands a creator response. Silence in the clip is not dead air; it's invitation.", phase: "BUILD" },
    { day: "Day 4", action: "Behind-the-scenes of the exact moment the hook was written. Authenticity in production is the second-strongest driver of creator adoption after the sound itself.", phase: "BUILD" },
    { day: "Day 6", action: "Full release. TikTok audio live. All DSPs simultaneously at 12PM EST — coordinated velocity is what the algorithm reads as demand, not scattered uploads.", phase: "LAUNCH" },
    { day: "Day 7–8", action: "Find every creator who used your sound and amplify them immediately — comment, stitch, reshare. The creator ecosystem is the distribution system. Build it actively.", phase: "SUSTAIN" },
    { day: "Day 13", action: "Drop a challenge format or instructional version. The viral window doesn't close on its own — you extend it with a new entry point. This is that entry point.", phase: "SUSTAIN" },
  ],
  "First 100K Streams": [
    { day: "Day 1", action: "Atmospheric teaser — 15 seconds, cinematic, zero context, no lyrics visible. Give them a feeling before you give them a song. Anticipation multiplies release-day velocity.", phase: "TEASE" },
    { day: "Day 3", action: "Studio reel with pre-save link in bio. Pre-saves are the clearest demand signal you can send to Spotify's algorithm before release. Every pre-save is leverage.", phase: "BUILD" },
    { day: "Day 5", action: "Platform-native cuts: YouTube Short, Spotify Clip, Instagram Reel — each edited differently for the platform's native behavior. Cross-platform presence signals momentum.", phase: "BUILD" },
    { day: "Day 7", action: "Official release. Playlist curator pitches went out 48 hours ago. Day-one stream velocity is the single most important 24-hour window this song will ever have.", phase: "LAUNCH" },
    { day: "Day 9–10", action: "Fan reaction content, hosted listening session, stream-together on socials. The algorithm doesn't differentiate between new and returning listeners — keep the stream count moving.", phase: "SUSTAIN" },
    { day: "Day 15", action: "Stripped or acoustic version release. This is not a throwaway — it resets the discovery cycle, generates a second editorial pitch window, and reactivates the original audience.", phase: "SUSTAIN" },
  ],
  "Playlist Placement": [
    { day: "Day 1", action: "Soft launch — no hard promotional push. Let the metadata accuracy and early save-rate velocity send the right signal to Spotify's algorithm before human curators ever see it.", phase: "TEASE" },
    { day: "Day 3", action: "Editorial pitch package complete: press photo, official lyric video, one-paragraph artist story. Curators judge the package before they judge the song — this is the audition.", phase: "BUILD" },
    { day: "Day 5", action: "Publish the origin story of the song — why it exists, what emotional state it came from. Playlist curators write descriptions; give them content that writes itself.", phase: "BUILD" },
    { day: "Day 7", action: "Official release. Playlist consideration request submitted. The metric that matters more than any other right now is Save Rate — target 25% as the algorithmic trigger threshold.", phase: "LAUNCH" },
    { day: "Day 10–12", action: "Share every listener milestone as social proof — saves, streams, playlist adds. Each public signal increases the perceived momentum that pulls in the next curator.", phase: "SUSTAIN" },
    { day: "Day 18", action: "Remix with a featured artist or release an alternate version. New ISRC means a new playlist submission window and a fresh algorithmic test cohort.", phase: "SUSTAIN" },
  ],
  "Build Fanbase": [
    { day: "Day 1", action: "Introduce the story behind the song — not the song. Lead with the human context before you lead with the product. Connection precedes consumption every single time.", phase: "TEASE" },
    { day: "Day 3", action: "Q&A about the creative process — record it, post it, make it intimate. Fans who feel involved in the work become fans who defend it. That's the conversion you're building toward.", phase: "BUILD" },
    { day: "Day 5", action: "Lyric reveal — one verse, handwritten or typeset on screen. Let the words land independently before the track. Lyrics that circulate before release are earned pre-marketing.", phase: "BUILD" },
    { day: "Day 7", action: "Release day with a live listening session — Discord, Instagram Live, or an intimate venue stream. The experience of listening together is different from listening alone. Use that difference.", phase: "LAUNCH" },
    { day: "Day 10", action: "Feature a fan cover, reaction, or interpretation publicly. Community participation creates emotional ownership — fans who create around your music advocate for the artist, not just the song.", phase: "SUSTAIN" },
    { day: "Day 20", action: "Share transparent metrics: streams, saves, what worked, what didn't. Audiences who understand your trajectory become collaborators in it. Transparency is the strongest long-term retention tool you have.", phase: "SUSTAIN" },
  ],
  "Label Attention": [
    { day: "Day 1", action: "Professional-grade visual teaser, press kit finalized, artist website updated with current discography and bio. Labels do background research before they reach out — make the due diligence effortless.", phase: "TEASE" },
    { day: "Day 3", action: "Industry seeding: tastemaker blogs, playlist curators, music journalists — reach before the wide release. The goal is a visible paper trail of third-party validation before the song even has streams.", phase: "BUILD" },
    { day: "Day 5", action: "Live performance clip or recorded session video. Labels sign artists who can perform the catalog, not just produce it — make that capability visible before you need it to matter.", phase: "BUILD" },
    { day: "Day 7", action: "Full press release to DSP editorial teams and targeted music media simultaneously. The strongest signal you can send a label is coordinated, professional execution at every touchpoint.", phase: "LAUNCH" },
    { day: "Day 10", action: "Sync licensing submission to music libraries and supervisor networks. Labels notice artists with catalog that generates revenue independently — it proves the music has commercial utility.", phase: "SUSTAIN" },
    { day: "Day 21", action: "Month-end metrics summary — clean data, clear narrative, presented as a one-page overview. Make it easy for someone inside a label to forward it upward on your behalf.", phase: "SUSTAIN" },
  ],
  "Brand Deals": [
    { day: "Day 1", action: "Launch with a fully articulated visual brand identity — consistent color palette, recurring motifs, aesthetic language that exists independently of the music. Brands buy the aesthetic before they license the song.", phase: "TEASE" },
    { day: "Day 3", action: "Lifestyle integration content: show the song existing in real-world contexts — gym, morning routine, night drive, working session. Brands invest in artists whose music fits naturally, not transactionally.", phase: "BUILD" },
    { day: "Day 5", action: "Soft brand collaboration post — tag a brand you genuinely use and explain the connection. Organic brand affinity is the proof of concept that a paid partnership deck requires.", phase: "BUILD" },
    { day: "Day 7", action: "Official release with simultaneous sync pitch to music supervisors. Music libraries pay; brands pay significantly more. Both pipelines activated from the same release event is standard label practice.", phase: "LAUNCH" },
    { day: "Day 12", action: "Audience demographic content — surface who's listening, how, and where. Brands purchase access to specific audiences. Make the audience visible and the pitch writes itself.", phase: "SUSTAIN" },
    { day: "Day 25", action: "Partnership announcement if secured, or case study content if not. Document what the campaign achieved and present it publicly — every future brand sees it as evidence of investment worthiness.", phase: "SUSTAIN" },
  ],
};

// ── Visual direction per mood — lighting, environment, color psychology specific ──
const VISUALS_BY_MOOD: Record<string, Array<{ title: string; desc: string; iconKey: string }>> = {
  dark: [
    { title: "Lighting Direction", desc: "Single practical source — one lamp, one window, one streetlight. Deep shadow is the primary visual element, not the background. What you refuse to show is doing more work than what you reveal.", iconKey: "eye" },
    { title: "Color Psychology", desc: "Midnight charcoal, bruised indigo, cold steel gray. Pure black reads as digital — use #1a1a2e and deep navy for the shadow range. The contrast between darkness and the single light source IS the visual tension.", iconKey: "palette" },
    { title: "Wardrobe & Character", desc: "Monochromatic. Structured silhouettes. Zero logos, zero prints. Darkness worn with intention reads as controlled power — the opposite of despair. The restraint is the statement.", iconKey: "star" },
    { title: "Environment & Scene", desc: "Late-night empty streets. Multilevel parking structures. Lit from below only. Industrial hallways at 3AM. The environment must feel like isolation chosen by the subject, not imposed on them.", iconKey: "flame" },
  ],
  euphoric: [
    { title: "Lighting Direction", desc: "Golden hour backlight — sun behind the subject, lens flare intentional. Motion blur on all movement. Frame every shot like the half-second before something unforgettable begins. High exposure, held shadow detail.", iconKey: "eye" },
    { title: "Color Psychology", desc: "Warm amber, electric gold, overexposed ivory. The palette should feel like sensory overload held just at the edge of beautiful. Avoid pure white — it reads clinical. Use #FFD700 and warm cream as your light range.", iconKey: "palette" },
    { title: "Wardrobe & Character", desc: "Bold color, one statement piece per look, movement-forward silhouettes. Every outfit needs to work in motion — if it reads flat when still and electric when moving, it's the right choice.", iconKey: "star" },
    { title: "Environment & Scene", desc: "Rooftops at hour before sunset. Crowd energy as visual texture. Open sky as the ceiling. The world looks like it's celebrating because the visual direction requires it to. No interior shots.", iconKey: "flame" },
  ],
  melancholic: [
    { title: "Lighting Direction", desc: "Overcast diffused natural light — no harsh shadows, no directional drama. Handheld camera movement. Imperfection is the technique, not the failure. The slight shake in the frame communicates what dialogue can't.", iconKey: "eye" },
    { title: "Color Psychology", desc: "Desaturated blue-green, faded teal, soft grain overlay. Pull the saturation down 30% in post and it will read as emotional distance. Rain-on-glass and condensation as texture elements wherever possible.", iconKey: "palette" },
    { title: "Wardrobe & Character", desc: "Worn-in clothing — soft layers, fabric that has a history. Nothing looks new. Authenticity over aesthetics here. Comfort reads as vulnerability when the camera is patient enough to let it show.", iconKey: "star" },
    { title: "Environment & Scene", desc: "Windows looking outward. Waiting rooms. The space between things — stairwells, hallways, empty cafes at closing. The viewer should feel like they've arrived slightly after something important just ended.", iconKey: "flame" },
  ],
  cinematic: [
    { title: "Lighting Direction", desc: "Anamorphic lens or anamorphic emulation. Slow push-ins with motivated camera movement. Score your shot list like a film trailer — every cut is a story beat, every angle has intentional meaning behind it.", iconKey: "eye" },
    { title: "Color Psychology", desc: "Teal-and-orange split grade — this is the cinematic standard because it works with all skin tones and creates immediate depth perception. Go deep in the shadow range and pull warmth from the highlights only.", iconKey: "palette" },
    { title: "Wardrobe & Character", desc: "Costume over outfit. Every clothing choice communicates character. Think about who this person is, not what looks good. The wardrobe should make the viewer feel they've walked into an established story.", iconKey: "star" },
    { title: "Environment & Scene", desc: "Architecturally controlled environments. Perfect symmetry or deliberate asymmetry — nothing in between. Grand scale or extreme intimacy. There is no middle ground in cinematic direction.", iconKey: "flame" },
  ],
  aggressive: [
    { title: "Lighting Direction", desc: "Harsh overhead practical sources — no softboxes, no diffusion. High contrast with intentional edge flare. Fast cuts synchronized to the hardest beats. Every frame should feel like it has a cost attached to it.", iconKey: "eye" },
    { title: "Color Psychology", desc: "Red on black, harsh tungsten white, industrial orange. Zero soft tones — softness breaks the tension this sound is building. The palette should feel like it was chosen by someone who doesn't need your approval.", iconKey: "palette" },
    { title: "Wardrobe & Character", desc: "Streetwear with structural intention. Oversized cuts worn with precise styling. The look should communicate one thing: this person occupies space on their own terms and has never needed permission.", iconKey: "star" },
    { title: "Environment & Scene", desc: "Warehouses. Freight yards. Empty arena floors before the audience arrives. Spaces that have been reclaimed and redefined. Power reads loudest in environments that weren't built to contain it.", iconKey: "flame" },
  ],
  default: [
    { title: "Lighting Direction", desc: "Natural light as the consistent anchor. One dominant visual motif per shoot — repeat it until it becomes signature. Visual consistency across content builds brand recognition faster than any single striking image.", iconKey: "eye" },
    { title: "Color Psychology", desc: "Let the emotional temperature of the song dictate the palette. Warm music → amber and earth tones. Cold music → teal and steel. High-energy → high contrast. Low-tempo → low saturation. The music is the creative brief.", iconKey: "palette" },
    { title: "Wardrobe & Character", desc: "Understated luxury. No logos, no prints. Monochromatic base with one considered statement piece. Timeless over trendy — in 18 months, trend-chasing visuals age the catalog. Timeless visuals compound.", iconKey: "star" },
    { title: "Environment & Scene", desc: "One evocative location per shoot, used completely. Depth of field that separates subject from environment. The frame carries the visual story; the artist carries the emotional one. They shouldn't compete.", iconKey: "flame" },
  ],
};

// ── Audience clusters per genre — behavioral archetypes, platform behavior, listening psychology ──
const AUDIENCES_BY_GENRE: Record<string, Array<{ name: string; size: string; desc: string; color: string; borderColor: string }>> = {
  "Hip-Hop": [
    { name: "Culture-First Listeners", size: "3.2M", desc: "18–28, streaming between 6PM–midnight. They add songs to playlists as cultural statements before they're mainstream — catch them here and the wave carries you. Save rate is 34% above genre average.", color: "from-orange-900/40 to-red-900/30", borderColor: "border-orange-700/30" },
    { name: "Gym & Grind Streamers", size: "1.8M", desc: "Need music that calibrates the energy they're building toward. Replay rate is 2.8x the platform average — they don't skip, they repeat. Early morning and late evening peaks. High add-to-playlist rate.", color: "from-slate-900/60 to-zinc-900/40", borderColor: "border-slate-700/30" },
    { name: "Late-Night Introspectors", size: "920K", desc: "Streaming 10PM–2AM. Share songs when they connect deeply, not when they're popular. They carry underground artists into mainstream conversations. Their share is a co-sign, not casual forwarding.", color: "from-indigo-900/40 to-blue-900/30", borderColor: "border-indigo-700/30" },
  ],
  "R&B / Soul": [
    { name: "Late-Night Emotional Listeners", size: "2.4M", desc: "18–26, streaming 11PM–3AM exclusively. Save rate is the highest of any R&B sub-segment — when this song hits, they play it 40 times in a week. They find you through mood-matched playlists, not discovery feeds.", color: "from-purple-900/40 to-blue-900/40", borderColor: "border-purple-700/30" },
    { name: "Proxy Communicators", size: "1.6M", desc: "They send songs to people they can't text directly. Your music becomes their language for feelings they can't say out loud. The share behavior is intimate — one-to-one, not broadcast. Deeply high retention rate.", color: "from-rose-900/30 to-pink-900/30", borderColor: "border-rose-700/30" },
    { name: "Identity Tastemakers", size: "840K", desc: "Music is how they communicate who they are. Their playlist recommendations carry social weight in their peer groups — one add from a tastemaker can trigger 60–150 downstream saves from their network.", color: "from-amber-900/30 to-orange-900/30", borderColor: "border-amber-700/30" },
  ],
  "Afrobeats": [
    { name: "Global Diaspora Loyalists", size: "4.1M", desc: "Cross-continental listeners using music to maintain cultural identity. Streaming across 40+ countries with concentrated pockets in UK, US, Canada, Nigeria, Ghana. Loyalty is earned, not bought — once converted, they stay.", color: "from-green-900/40 to-emerald-900/30", borderColor: "border-green-700/30" },
    { name: "Event & Party Architects", size: "2.2M", desc: "DJs, promoters, venue hosts, event curators. Getting on their radar means live placement — the highest-converting exposure in any genre. They make song decisions 2–3 weeks before events. Pitch this segment early.", color: "from-yellow-900/30 to-amber-900/30", borderColor: "border-yellow-700/30" },
    { name: "Movement-First TikTok Users", size: "1.5M", desc: "Discover through visual rhythm before audio. Dance challenge potential is the primary conversion mechanism — if the body moves naturally to this, they adopt it. Physical rhythm in the production must be undeniable.", color: "from-orange-900/30 to-red-900/30", borderColor: "border-orange-700/30" },
  ],
  "Pop": [
    { name: "Algorithm-Native Discoverers", size: "5.8M", desc: "Spotify's Release Radar and Discover Weekly are their primary music sources. They never actively search — they wait to be found. Save rate above 22% in the first 48 hours triggers algorithmic playlist expansion to this segment.", color: "from-sky-900/40 to-blue-900/30", borderColor: "border-sky-700/30" },
    { name: "Visual Aesthetic Adopters", size: "2.3M", desc: "TikTok-native. They choose songs based on how they'll look in a video — the visual use case is evaluated before the audio hook. A song that scores high aesthetically gets used; usage creates streams.", color: "from-violet-900/30 to-purple-900/30", borderColor: "border-violet-700/30" },
    { name: "Social Playlist Curators", size: "1.1M", desc: "They gatekeep for friend groups of 15–200 people. A single add to their playlist triggers 50–200 saves from their network. They're the connective tissue between discovery and mainstream. Reach them through featured playlist placement.", color: "from-teal-900/30 to-cyan-900/30", borderColor: "border-teal-700/30" },
  ],
  "Electronic": [
    { name: "Scene Credibility Insiders", size: "1.2M", desc: "Early adopters who define what's credible before the algorithm surfaces it. They discover through Bandcamp, niche Soundcloud channels, and DJ set recordings. Winning this segment means the scene validates you before the mainstream does.", color: "from-cyan-900/40 to-blue-900/40", borderColor: "border-cyan-700/30" },
    { name: "Deep Work & Focus Streamers", size: "3.4M", desc: "Electronic is their concentration infrastructure — they build work playlists and keep songs in rotation for weeks. Average session time is 4.2 hours. High stream count from loyalty, not discovery. Reach through Spotify focus playlists.", color: "from-slate-900/60 to-zinc-900/40", borderColor: "border-slate-700/30" },
    { name: "Festival Ecosystem Followers", size: "880K", desc: "Track festival lineups and discover artists through recorded sets. Live performance credibility is the conversion signal — they verify on Spotify after hearing the set. The path: festival set → SoundCloud clip → DSP stream → loyal listener.", color: "from-purple-900/40 to-indigo-900/30", borderColor: "border-purple-700/30" },
  ],
  "default": [
    { name: "Algorithm-Led Discoverers", size: "2.1M", desc: "Their entire music diet is algorithmically curated. Save rate and skip rate in the first 30 seconds determine trajectory — they don't browse, they respond. The first 30 seconds is the only audition that matters for this segment.", color: "from-purple-900/40 to-blue-900/40", borderColor: "border-purple-700/30" },
    { name: "Community Advocates", size: "780K", desc: "They share music as cultural contribution — when they adopt an artist, they bring their entire social network. One advocate in this group can trigger 40–80 organic shares. They don't promote; they evangelize.", color: "from-amber-900/30 to-orange-900/30", borderColor: "border-amber-700/30" },
    { name: "Platform-Native Streamers", size: "1.4M", desc: "Strong platform loyalty — they stay within one ecosystem and build deep within it. The strongest path in is a single high-performing playlist placement on their preferred platform. Cross-platform dilution reduces this segment's impact.", color: "from-teal-900/30 to-cyan-900/30", borderColor: "border-teal-700/30" },
  ],
};

// ── Platform-specific insights — decisive, behavior-specific, no hedging ──
const PLATFORM_INSIGHTS: Record<string, string> = {
  TikTok: "The decision window is 1.4 seconds. Lead with the hook — not the intro, not the context, not the explanation. The curiosity gap format (withhold, then reveal) drives the save behavior that signals the algorithm to expand distribution. Every piece of content must work without sound first, then earn the audio.",
  Instagram: "Reels are the primary distribution vehicle; static posts are credibility anchors. Caption character count above 150 with a deliberate soft CTA measurably increases saves and shares. Stories are for intimacy and real-time updates; Feed is for permanence and brand identity. These are not interchangeable — use them for their specific psychological function.",
  YouTube: "The first 8 seconds determine watch time; watch time determines algorithmic distribution. Open with the emotional payoff, not the setup. Resolve the narrative arc before the outro. End with a specific, value-forward reason to subscribe — not 'subscribe for more content.' YouTube's algorithm rewards session duration: make them watch the next video.",
  Spotify: "Save rate is the primary algorithmic signal, not stream count. Target 25% save rate in the first 48 hours — this is the threshold for editorial playlist consideration. Pitch to editorial 7 days before release. Add to your own artist playlist on day one. Canvas visuals increase save rate by 12–18% — deploy them at launch, not after.",
  "Apple Music": "Spatial Audio and lossless quality are production differentiators — market them explicitly in every release announcement. Apple's algorithmic curation favors complete listens over partial plays — the song must earn the full runtime. Library adds are the equivalent of Spotify saves. Priority: get them to add, not just stream.",
  "Twitter/X": "Twitter is where the music industry finds new artists — labels, publishers, supervisors, and journalists all use it as a discovery filter. Frame every release announcement as a cultural moment, not a product launch. Build the conversation around the song before it exists. Text-first, then asset. Industry reach is the primary strategic value of this platform.",
  SoundCloud: "SoundCloud's audience is the pro-listening community — producers, DJs, A&Rs, and dedicated listeners who treat streams as serious evaluations. Detailed descriptions, accurate genre tagging, and repost partnerships with established accounts drive organic discovery. A repost from a SoundCloud account with 50K followers converts better than an ad to 500K.",
};

// ── Strategic insights — confident, specific, decisive. No hedging. ──
const WHY_INSIGHTS_BY_GOAL: Record<string, string[]> = {
  "Viral TikTok Moment": [
    "The curiosity gap is the primary psychological mechanism this strategy exploits. Withholding context activates a neurological need for closure — viewers watch to the end specifically to resolve it. The hook-first format is not a stylistic choice; it's the execution of a documented attention capture pattern.",
    "The stagger between teaser and full release creates compression — social proof accumulates in a shorter window, which reads to the algorithm as demand velocity rather than slow organic growth. Concentrated engagement always outperforms diffuse engagement.",
    "Encouraging creator duets converts your song from content into infrastructure. The algorithm rewards songs that generate secondary content because secondary content creates additional distribution events. Each creator who uses your audio is running an unpaid marketing campaign on your behalf.",
  ],
  "First 100K Streams": [
    "Pre-save campaigns generate a day-one demand signal that Spotify's algorithm cannot ignore — pre-saves translate directly to immediate streams on release day, which creates the velocity spike that triggers discovery playlist consideration within the first 48 hours.",
    "Simultaneous multi-platform launch prevents stream dilution and ensures each platform's algorithm reads a genuine velocity signal independently. Staggered platform releases split the demand window — each algorithm sees weaker numbers and responds accordingly.",
    "The stripped version at Day 15 is not a bonus release — it is a deliberate catalog activation strategy. It resets the discovery cycle, creates a new editorial pitch window, reactivates the original audience's share behavior, and generates a secondary stream wave without requiring a new song.",
  ],
  "Playlist Placement": [
    "Save rate above 25% in the first 48 hours is Spotify's documented threshold for triggering algorithmic playlist consideration. Stream count is a vanity metric at this stage — save rate is the actual signal curators and the algorithm both evaluate. Every campaign decision should optimize for saves, not plays.",
    "A quiet early release is deliberate, not timid. It allows Spotify's algorithm to test the song with a small cohort of high-intent listeners. High engagement from that cohort triggers a wider distribution wave. A hard promotional push at launch before the algorithm has established a baseline often produces short spikes and long silence.",
    "A lyric video and professional press photo are not aesthetic luxuries — they are the professional credibility signals curators use to evaluate artist seriousness before the song's merits become relevant. The package judgment happens before the listen. Build the package first.",
  ],
  "Build Fanbase": [
    "Transparency in creative process performs a specific conversion: passive listeners become invested community members when they feel involved in the work's creation. Invested community members become advocates — they promote without being asked because they feel a stake in the outcome. This is the most durable audience a music career can build.",
    "Fan participation content — covers, reactions, interpretations — creates a specific form of emotional ownership that pure consumption cannot. Fans who create around your music stay because they're attached to the artist, not just the song. When the song ages, they follow you forward instead of moving on.",
    "Monthly metric transparency is not vulnerability — it's a retention mechanism. Audiences who understand your growth trajectory feel like collaborators in it. They promote, stream, and share because they experience your success as partially theirs. Opacity breeds passive consumption; transparency builds active advocacy.",
  ],
  "Label Attention": [
    "Labels evaluate four dimensions before offering anything: music quality, visual identity, audience engagement, and evidence of business acumen. This rollout is designed to generate visible signals in all four simultaneously — the goal is not just a good song, it's an undeniable package.",
    "A visible paper trail of third-party validation — blog features, curator placements, industry co-signs — creates the appearance of momentum, which accelerates actual momentum. Labels do not invest in undiscovered artists; they invest in artists who already have discoverable proof of demand. Build the trail before the meeting.",
    "Month-end metric summaries presented as clean one-page overviews are not vanity — they are internal sales tools. When a label employee becomes an advocate for you internally, they need material they can forward upward. Remove every friction point from that pitch. Make it easy to champion you.",
  ],
  "Brand Deals": [
    "Brands are not buying your music. They are buying access to a specific, engaged audience. Every campaign decision needs to function as audience evidence — make the demographic, the engagement rate, and the listening context visible in everything you publish. The song is the proof of concept; the audience is the product.",
    "Lifestyle integration content is the proof-of-fit brands require before investing. They fund artists whose music exists naturally in the contexts their products target — not artists who look like they could fit with enough campaign spend. Organic fit is the pitch; manufactured fit is expensive and unconvincing.",
    "Sync placement history — even library placements, student films, and small commercial uses — is a credibility multiplier for brand conversations. It demonstrates commercial utility: the music works in context beyond the artist's own promotional ecosystem. Brands require this evidence before they write the first check.",
  ],
};

// Score calculation — context-aware with justification reasoning
function computeScores(form: FormState) {
  const base = 70;
  const hasTikTok = form.platforms.includes("TikTok");
  const hasSpotify = form.platforms.includes("Spotify");
  const moodLow = (form.mood ?? "").toLowerCase();
  const isSad = /sad|melanchol|vulnerab|soft|quiet|tender/.test(moodLow);
  const isEnergetic = /euphor|hype|energet|party|festival|aggressiv/.test(moodLow);

  const virality = base + (hasTikTok ? 12 : 0) + (form.mood ? 5 : 0) + (isEnergetic ? 6 : 0);
  const rollout = base + (form.goal ? 10 : 0) + (form.audience ? 5 : 0) + (form.notes.length > 30 ? 4 : 0);
  const alignment = base + (form.genre ? 8 : 0) + (form.audience ? 8 : 0) + (form.platforms.length > 2 ? 4 : 0);
  const consistency = base + (form.goal ? 7 : 0) + (form.genre ? 5 : 0) + (form.mood ? 6 : 0);
  const replay = base + (isSad ? 12 : 0) + (hasSpotify ? 6 : 0) + (form.genre ? 4 : 0);

  const cap = (v: number) => Math.min(98, Math.max(62, v));
  return [
    {
      label: "Hook Strength", value: cap(virality), icon: Zap,
      desc: hasTikTok ? "TikTok-optimized" : "Platform-adapted",
      reason: hasTikTok
        ? "TikTok selection increases hook pressure — 1.4 second decision windows demand front-loaded attention capture."
        : form.genre
        ? `${form.genre} hooks calibrated to audience attention patterns and genre scroll behavior.`
        : "Hook framework derived from platform behavior data and audience psychology.",
    },
    {
      label: "Emotional Resonance", value: cap(rollout - 5), icon: Heart,
      desc: form.mood ? `${form.mood.charAt(0).toUpperCase() + form.mood.slice(1)} energy` : "Mood-calibrated",
      reason: isSad
        ? "Emotional depth scores high — vulnerable moods generate save behavior 2.3x the platform average."
        : form.mood
        ? `The ${form.mood} emotional register aligns with the target listener's peak streaming window.`
        : "Emotional alignment derived from genre listener psychology and behavioral streaming data.",
    },
    {
      label: "Replay Potential", value: cap(replay + 3), icon: Repeat2,
      desc: "Retention signal",
      reason: isSad
        ? "Melancholic and introspective songs show the highest repeat listen rates — listeners return to process, not just enjoy."
        : hasSpotify
        ? "Spotify's algorithm rewards high replay-to-stream ratios — this campaign is structured to drive both."
        : "Rollout structure creates multiple re-entry moments that reset listener engagement across the campaign window.",
    },
    {
      label: "Trend Fit", value: cap(virality - 8 + (form.genre ? 6 : 0)), icon: TrendingUp,
      desc: form.genre ? `${form.genre} positioned` : "Genre-calibrated",
      reason: form.genre
        ? `${form.genre} is in an active cultural growth phase — this campaign deploys genre-specific entry tactics at the right moment.`
        : "Campaign structure targets current platform discovery patterns without over-relying on trend dependency.",
    },
    {
      label: "Shareability", value: cap(consistency), icon: Share2,
      desc: "Network spread",
      reason: form.goal?.includes("TikTok")
        ? "TikTok goal maximizes share mechanics — duet bait, challenge structure, and creator ecosystem strategy all amplify organic spread."
        : form.goal?.includes("Fanbase")
        ? "Fan participation framework creates the emotional investment that drives organic sharing — advocates share more than casual listeners."
        : "Campaign narrative creates natural share triggers at multiple points, compounding reach without paid distribution.",
    },
  ];
}

// ── Artist DNA tag generation ──
function buildDNATag(form: FormState): string {
  const parts: string[] = [];
  if (form.genre) parts.push(form.genre);
  if (form.mood) parts.push(`${form.mood.charAt(0).toUpperCase() + form.mood.slice(1)} energy`);
  if (form.audience) {
    const a = form.audience.toLowerCase();
    if (a.includes("late") || a.includes("night")) parts.push("Late-night audience");
    else if (a.includes("young") || a.includes("18") || a.includes("gen z")) parts.push("Gen-Z core");
    else parts.push("Niche tastemakers");
  }
  if (form.goal) {
    if (form.goal.includes("TikTok")) parts.push("Viral-first strategy");
    else if (form.goal.includes("Playlist")) parts.push("Algorithmic focus");
    else if (form.goal.includes("Brand")) parts.push("Commercial appeal");
  }
  return parts.length > 0 ? parts.join(" · ") : "Artist profile building...";
}

// ── Creative Direction Summary — specific, opinionated, decisive ──
function buildCreativeDirectionSummary(form: FormState): string[] {
  const lines: string[] = [];
  const moodKey = (form.mood ?? "").toLowerCase().split(/[\s,]+/).find(w => VISUALS_BY_MOOD[w]) ?? "default";
  const moodLow = (form.mood ?? "").toLowerCase();
  const isSad = /sad|melanchol|vulnerab|soft|quiet|tender/.test(moodLow);
  const isAggressive = /aggressiv|hard|intense|raw|angry/.test(moodLow);

  if (form.genre && form.mood) {
    const moodLabel = form.mood.charAt(0).toUpperCase() + form.mood.slice(1);
    lines.push(`${moodLabel} ${form.genre} campaign — mood drives every creative decision`);
  } else if (form.genre) {
    lines.push(`${form.genre} release with genre-native content strategy`);
  } else {
    lines.push("Platform-first release with cross-genre discovery architecture");
  }

  const aud = (form.audience ?? "").toLowerCase();
  if (aud.includes("late") || aud.includes("night")) {
    lines.push("Targeting late-night streaming windows: 10PM–2AM peak");
  } else if (form.goal?.includes("Playlist")) {
    lines.push("Save rate optimization above all — 25% threshold is the target");
  } else if (form.goal?.includes("Build")) {
    lines.push("Community compounding: listeners converted into advocates");
  } else if (form.goal?.includes("Label")) {
    lines.push("Full professional package — music, visual, metrics, press trail");
  } else {
    lines.push("Velocity-first discovery: compress social proof into a tight window");
  }

  if (form.platforms.includes("TikTok")) {
    lines.push(isSad ? "TikTok emotional scroll — POV framing, no hype" : "TikTok attention capture — hook first, zero context");
  } else if (form.platforms.includes("YouTube")) {
    lines.push("YouTube narrative architecture — emotional arc, held watch time");
  } else if (form.platforms.includes("Spotify")) {
    lines.push("Spotify save-rate strategy — editorial pitch 7 days pre-release");
  } else {
    lines.push("Platform-native rollout: content adapted per platform psychology");
  }

  if (isAggressive) {
    lines.push("High-contrast visual identity — raw tension, no softness");
  } else if (moodKey === "dark" || moodKey === "cinematic") {
    lines.push("Single-source cinematic lighting — shadow as primary visual element");
  } else if (moodKey === "euphoric") {
    lines.push("Golden-hour backlit visuals — motion blur, overexposed warmth");
  } else if (moodKey === "melancholic") {
    lines.push("Handheld diffused light — imperfection is intentional technique");
  } else {
    lines.push("Visual identity derived directly from sonic palette and mood register");
  }

  return lines;
}

// ── Section insight lines — specific, confident, decisive ──
function buildSectionInsights(form: FormState) {
  const moodKey = (form.mood ?? "").toLowerCase().split(/[\s,]+/).find(w => VISUALS_BY_MOOD[w]) ?? "default";
  const moodLow = (form.mood ?? "").toLowerCase();
  const isSad = /sad|melanchol|vulnerab|soft|quiet|tender/.test(moodLow);
  const isAggressive = /aggressiv|hard|intense|raw|angry/.test(moodLow);
  return {
    hooks: form.platforms.includes("TikTok")
      ? isSad
        ? "Emotional and POV hooks prioritized — vulnerable moods convert through intimacy, not hype. Curiosity Gap used sparingly."
        : isAggressive
        ? "Identity and Pattern Interrupt hooks lead — aggressive moods demand authority, not relatability. Every hook should own the room."
        : "Curiosity gap hooks calibrated for 1.4-second TikTok decision windows — withhold context, demand completion."
      : form.platforms.includes("Spotify")
      ? "Hooks designed to drive the save behavior that Spotify's algorithm reads as demand. Every hook is a save trigger, not just an ear-catch."
      : isSad
      ? "Emotional and POV hooks dominate — melancholic moods convert through recognition, not spectacle. Let the feeling land before anything else."
      : "Hooks selected for replay behavior — the psychological type paired to this genre and mood maximizes return listens, not just first clicks.",
    visuals: moodKey === "dark"
      ? "Single-source lighting against deep shadow — what you hide is working harder than what you show. Every frame is a controlled choice."
      : moodKey === "cinematic"
      ? "Anamorphic-grade visual consistency — every frame is a story beat. No shot exists without narrative function."
      : moodKey === "euphoric"
      ? "Golden-hour backlit motion — the visual energy must match the sonic energy without ever competing with it."
      : moodKey === "melancholic"
      ? "Handheld diffused light — imperfection is the technique. Authenticity in texture communicates what staging cannot."
      : isAggressive
      ? "High-contrast harsh lighting — no softness, no diffusion. Tension is the visual language and every frame must maintain it."
      : `Visual direction derived from the ${form.mood || "sonic"} palette — the visual and audio registers must be in the same emotional key.`,
    audience: form.genre
      ? `Behavioral archetypes mapped to documented ${form.genre} listener psychology — streaming windows, share triggers, and save patterns all calibrated.`
      : "Clustered by documented listening behavior and platform psychology — demographics are context, not strategy.",
  };
}

// ── Main generation ──
interface FormState { songTitle: string; genre: string; artistName: string; mood: string; audience: string; goal: string; platforms: string[]; notes: string; }
interface GeneratedOutput {
  timeline: Array<{ day: string; action: string; phase: string }>;
  hooks: Array<{ text: string; type: string }>;
  visuals: Array<{ title: string; desc: string; iconKey: string }>;
  audiences: Array<{ name: string; size: string; desc: string; color: string; borderColor: string }>;
  scores: Array<{ label: string; value: number; desc: string; reason: string; icon: React.ComponentType<{ size?: number; className?: string }> }>;
  platformInsights: string[];
  whyInsights: string[];
  dnaTag: string;
  creativeDirectionSummary: string[];
  sectionInsights: { hooks: string; visuals: string; audience: string };
}

// Hook contrast rule: mood-aware preference ordering for hook types
function getMoodHookPreference(mood: string): string[] {
  const m = mood.toLowerCase();
  if (/sad|melanchol|vulnerab|soft|quiet|tender/.test(m)) return ["Emotional", "POV", "Identity", "Curiosity Gap", "Pattern Interrupt"];
  if (/aggressiv|hard|intense|raw|angry/.test(m)) return ["Identity", "Pattern Interrupt", "Curiosity Gap", "POV", "Emotional"];
  if (/euphor|hype|energet|party|festival/.test(m)) return ["Pattern Interrupt", "Identity", "POV", "Curiosity Gap", "Emotional"];
  return ["POV", "Curiosity Gap", "Identity", "Emotional", "Pattern Interrupt"];
}

function generateOutput(form: FormState, seed: string): GeneratedOutput {
  const genreHooks = HOOKS_BY_GENRE[form.genre] ?? HOOKS_BY_GENRE["Hip-Hop"];
  // Contrast-aware: sort by mood preference, then pick top 4
  const typePreference = getMoodHookPreference(form.mood ?? "");
  const sortedHooks = [...genreHooks].sort((a, b) => {
    const ai = typePreference.indexOf(a.type);
    const bi = typePreference.indexOf(b.type);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  // Seed-based shuffle within each preference tier so outputs vary
  const seedN = seed.charCodeAt(0) % 3;
  const hooks = [...sortedHooks.slice(0, 3), sortedHooks[3 + seedN] ?? sortedHooks[4] ?? sortedHooks[3]]
    .slice(0, 4)
    .map(h => ({ text: h.text, type: h.type }));

  const moodKey = (form.mood ?? "").toLowerCase().split(/[\s,]+/).find(w => VISUALS_BY_MOOD[w]) ?? "default";
  const visuals = VISUALS_BY_MOOD[moodKey] ?? VISUALS_BY_MOOD["default"];

  const goalKey = form.goal || "First 100K Streams";
  const timeline = TIMELINE_BY_GOAL[goalKey] ?? TIMELINE_BY_GOAL["First 100K Streams"];

  const genreAudience = AUDIENCES_BY_GENRE[form.genre] ?? AUDIENCES_BY_GENRE["default"];
  const audiences = genreAudience;

  const scores = computeScores(form);

  const platformInsights = form.platforms
    .filter(p => PLATFORM_INSIGHTS[p])
    .map(p => `**${p}**: ${PLATFORM_INSIGHTS[p]}`);

  const whyKey = form.goal || "First 100K Streams";
  const whyInsights = WHY_INSIGHTS_BY_GOAL[whyKey] ?? WHY_INSIGHTS_BY_GOAL["First 100K Streams"];

  const dnaTag = buildDNATag(form);
  const creativeDirectionSummary = buildCreativeDirectionSummary(form);
  const sectionInsights = buildSectionInsights(form);

  return { timeline, hooks, visuals, audiences, scores, platformInsights, whyInsights, dnaTag, creativeDirectionSummary, sectionInsights };
}

// ─── UPGRADE MODAL ───────────────────────────────────────────────────────────

const UPGRADE_TRIGGERS = [
  {
    id: "regenerate",
    headline: "Unlock unlimited rollout strategies",
    subhead: "with Pro Artist",
    body: "Free accounts generate one campaign per month. Pro Artist removes every limit and activates the full creative director system — audience intelligence, virality scoring, and platform-specific optimization at full depth.",
    perks: [
      "Unlimited campaign generation",
      "Full audience intelligence clusters",
      "Virality scoring + strategic reasoning",
      "Advanced AI creative director mode",
    ],
    cta: "Unlock full creative direction system",
    ctaSecondary: "See all plans",
  },
  {
    id: "launch",
    headline: "Operate at label-level strategy",
    subhead: "with Pro Artist",
    body: "Launching a campaign is only the beginning. Pro Artist gives you the analytics infrastructure, audience positioning maps, and platform intelligence to sustain momentum — not just start it.",
    perks: [
      "Strategic Insight panel (always visible)",
      "Audience Positioning Map (full depth)",
      "Platform-specific playbooks for all platforms",
      "Creative Direction Summary per campaign",
    ],
    cta: "Unlock full creative direction system",
    ctaSecondary: "See all plans",
  },
];

function UpgradeModal({ trigger, onClose }: {
  trigger: typeof UPGRADE_TRIGGERS[0];
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        onClick={onClose}>
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
          className="relative max-w-md w-full rounded-3xl border border-primary/30 bg-card shadow-2xl shadow-primary/10 overflow-hidden">

          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="p-7 relative">
            <button onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" data-testid="button-close-upgrade-modal">
              <X size={14} />
            </button>

            <div className="w-11 h-11 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-5">
              <Crown size={20} className="text-primary" />
            </div>

            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{trigger.subhead}</p>
            <h2 className="text-2xl font-bold tracking-tight mb-3">{trigger.headline}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{trigger.body}</p>

            <ul className="space-y-2.5 mb-7">
              {trigger.perks.map((perk, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm text-foreground/90">{perk}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2.5">
              <Link href="/pricing">
                <button data-testid="button-upgrade-cta"
                  className="w-full py-3.5 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                  {trigger.cta} <ArrowRight size={14} />
                </button>
              </Link>
              <Link href="/pricing">
                <button data-testid="button-upgrade-see-plans"
                  className="w-full py-3 rounded-xl border border-border text-muted-foreground text-sm hover:text-foreground hover:border-primary/30 transition-all duration-200">
                  {trigger.ctaSecondary}
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── COMPONENT UTILITIES ────────────────────────────────────────────────────

const phaseColors: Record<string, string> = {
  TEASE: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  BUILD: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  LAUNCH: "text-[#C8A96B] bg-[#C8A96B]/10 border-[#C8A96B]/40",
  SUSTAIN: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
};

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  eye: Eye, palette: Palette, star: Star, flame: Flame,
};

function RadialScore({ value, label, desc, reason, delay, icon: Icon }: {
  value: number; label: string; desc: string; reason: string; delay: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (value / 100) * circumference;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-start gap-0 p-4 rounded-2xl border border-border bg-card/40 hover:bg-card/70 hover:border-primary/30 transition-all duration-300 col-span-1"
    >
      <div className="flex items-center gap-3 w-full mb-3">
        <div className="relative w-14 h-14 shrink-0">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="32" fill="none" stroke="hsl(240 4% 18%)" strokeWidth="4.5" />
            <motion.circle
              cx="36" cy="36" r="32" fill="none" stroke="#C8A96B" strokeWidth="4.5"
              strokeLinecap="round" strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
              transition={{ delay: delay + 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span className="text-base font-bold text-foreground" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: delay + 0.5 }}>
              {value}
            </motion.span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <Icon size={11} className="text-primary shrink-0" />
            <p className="text-xs font-semibold text-foreground truncate">{label}</p>
          </div>
          <p className="text-[10px] text-primary/70 font-medium">{desc}</p>
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: delay + 0.7 }}
        className="text-[10px] text-muted-foreground leading-relaxed"
      >
        {reason}
      </motion.p>
    </motion.div>
  );
}

function GenerationPulse() {
  const messages = [
    "Analyzing genre behavior…",
    "Mapping audience psychology…",
    "Building rollout strategy…",
    "Designing attention hooks…",
    "Calibrating visual identity…",
    "Synthesizing creative direction…",
  ];
  const [msgIdx, setMsgIdx] = useState(0);
  useState(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % messages.length), 900);
    return () => clearInterval(t);
  });
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 py-24">
      <div className="relative w-28 h-28">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="absolute inset-0 rounded-full border border-primary/30"
            animate={{ scale: [1, 1.4 + i * 0.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.35, ease: "easeInOut" }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center"
            animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
            <Sparkles className="text-primary w-7 h-7" />
          </motion.div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <AnimatePresence mode="wait">
          <motion.p key={msgIdx} className="text-base font-semibold text-foreground"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}>
            {messages[msgIdx]}
          </motion.p>
        </AnimatePresence>
        <p className="text-sm text-muted-foreground">Building your personalized campaign</p>
      </div>
      <div className="flex gap-2">
        {[0, 0.2, 0.4].map((d, i) => (
          <motion.div key={i} className="w-2 h-2 rounded-full bg-primary"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1, delay: d }} />
        ))}
      </div>
    </div>
  );
}

function Section({ title, subtitle, insight, icon, children, delay }: { title: string; subtitle?: string; insight?: string; icon: React.ReactNode; children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: delay ?? 0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">{icon}</div>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          {subtitle && <span className="text-xs text-muted-foreground font-normal hidden sm:inline">— {subtitle}</span>}
        </div>
        {insight && <p className="text-xs text-muted-foreground/70 italic pl-9">{insight}</p>}
      </div>
      {children}
    </motion.section>
  );
}

function InputField({ label, icon, value, onChange, placeholder, testId }: {
  label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void; placeholder: string; testId: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        {icon} {label}
      </label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} data-testid={testId}
        className="w-full bg-card/60 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
      />
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function Studio() {
  const [form, setForm] = useState<FormState>({
    songTitle: "", genre: "", artistName: "", mood: "", audience: "", goal: "", platforms: [], notes: "",
  });
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [seed, setSeed] = useState("init");
  const [generateCount, setGenerateCount] = useState(0);
  const [upgradeModal, setUpgradeModal] = useState<typeof UPGRADE_TRIGGERS[0] | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [artistProfile, setArtistProfile] = useState(() => getProfile());

  const output = useMemo<GeneratedOutput | null>(() => {
    if (status !== "done") return null;
    return generateOutput(form, seed);
  }, [status, seed, form]);

  const dnaTag = useMemo(() => buildDNATag(form), [form]);

  function handleChange(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }
  function togglePlatform(p: string) {
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p) ? prev.platforms.filter(x => x !== p) : [...prev.platforms, p],
    }));
  }
  function handleGenerate() {
    if (!form.songTitle || !form.artistName) return;
    const newSeed = form.songTitle + form.artistName + Date.now();
    setSeed(newSeed);
    setStatus("generating");
    setGenerateCount(c => c + 1);
    // Persist to artist memory
    const profile = getProfile();
    const updated = learnFromRollout(profile, {
      songTitle: form.songTitle,
      artistName: form.artistName,
      genre: form.genre,
      goal: form.goal,
      mood: form.mood,
      platforms: form.platforms,
      targetAudience: form.audience,
    });
    saveProfile(updated);
    setArtistProfile(updated);
    setTimeout(() => setStatus("done"), 3200);
  }
  function handleRegenerate() {
    if (generateCount >= 2) {
      setUpgradeModal(UPGRADE_TRIGGERS[0]);
      return;
    }
    setSeed(form.songTitle + form.artistName + Date.now());
    setStatus("generating");
    setGenerateCount(c => c + 1);
    setTimeout(() => setStatus("done"), 2600);
  }
  function handleLaunchCampaign() {
    setUpgradeModal(UPGRADE_TRIGGERS[1]);
  }

  const canGenerate = !!form.songTitle && !!form.artistName;
  const overallScore = output ? Math.round(output.scores.reduce((a, s) => a + s.value, 0) / output.scores.length) : null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Upgrade Modal */}
      {upgradeModal && (
        <UpgradeModal trigger={upgradeModal} onClose={() => setUpgradeModal(null)} />
      )}

      {/* Share Modal */}
      {showShareModal && output && (
        <ShareModal
          data={{
            songTitle: form.songTitle,
            artistName: form.artistName,
            genre: form.genre,
            hook: output.hooks[0]?.text ?? "",
            strategyInsight: output.creativeDirectionSummary[0] ?? "",
            phase: (output.timeline[0]?.phase as "TEASE" | "BUILD" | "LAUNCH" | "SUSTAIN") ?? "LAUNCH",
            overallScore: overallScore ?? undefined,
            dnaTag: output.dnaTag,
          }}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/4 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-primary/3 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5 border-b border-border/40 bg-background/70 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-6">
          <Link href="/" data-testid="link-back-home">
            <motion.button whileHover={{ x: -2 }} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft size={16} /> Back
            </motion.button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="STAGEONE" className="w-28 md:w-36 h-auto" />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
            <Sparkles size={12} /> AI Studio
          </div>
          <Link href="/dashboard" data-testid="link-dashboard">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">Dashboard</button>
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">

        {/* ── LEFT PANEL ── */}
        <aside className="w-full lg:w-[420px] xl:w-[460px] border-r border-border/50 bg-card/20 flex flex-col shrink-0">
          <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-2xl font-bold tracking-tight">Rollout Generator</h1>
              <p className="text-sm text-muted-foreground mt-1">The AI adapts every output to your genre, mood, platforms, and release goal. No two campaigns are the same.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="space-y-5">
              <InputField label="Song Title" icon={<Music size={15} />} value={form.songTitle} onChange={v => handleChange("songTitle", v)} placeholder="e.g. Midnight Echoes" testId="input-song-title" />
              <InputField label="Artist Name" icon={<Mic2 size={15} />} value={form.artistName} onChange={v => handleChange("artistName", v)} placeholder="Your artist name" testId="input-artist-name" />

              {/* Genre — categorized toggle select */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Radio size={13} /> Genre</label>
                {Object.entries(GENRE_CATEGORIES).map(([category, genres]) => (
                  <div key={category}>
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.15em] mb-1.5">{category}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {genres.map(g => (
                        <button
                          key={g}
                          onClick={() => handleChange("genre", form.genre === g ? "" : g)}
                          data-testid={`btn-genre-${g}`}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all duration-150 ${
                            form.genre === g
                              ? "bg-primary/20 border-primary/60 text-primary shadow-[0_0_12px_-4px_hsl(38,46%,60%)]"
                              : "bg-card/40 border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-card/80"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <InputField label="Mood / Vibe" icon={<Flame size={15} />} value={form.mood} onChange={v => handleChange("mood", v)} placeholder="e.g. dark, cinematic, euphoric, melancholic, aggressive" testId="input-mood" />
              <InputField label="Target Audience" icon={<Users size={15} />} value={form.audience} onChange={v => handleChange("audience", v)} placeholder="e.g. 18–24 late-night R&B fans" testId="input-audience" />

              {/* Goal */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Target size={13} /> Release Goal</label>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map(g => (
                    <button key={g} onClick={() => handleChange("goal", g)} data-testid={`btn-goal-${g}`}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${form.goal === g ? "bg-primary/20 border-primary/60 text-primary" : "bg-card/50 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platforms */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Globe size={13} /> Platform Focus</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(p => (
                    <button key={p} onClick={() => togglePlatform(p)} data-testid={`btn-platform-${p}`}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${form.platforms.includes(p) ? "bg-primary/20 border-primary/60 text-primary" : "bg-card/50 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><Wand2 size={13} /> Additional Context</label>
                <textarea value={form.notes} onChange={e => handleChange("notes", e.target.value)}
                  placeholder="Collaborators, key influences, creative intentions, cultural context..."
                  data-testid="input-notes" rows={3}
                  className="w-full bg-card/60 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all duration-200 resize-none"
                />
              </div>
            </motion.div>

            {/* Generate Button */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="pb-2">
              <motion.button onClick={handleGenerate} disabled={!canGenerate || status === "generating"} data-testid="btn-generate-rollout"
                whileHover={{ scale: canGenerate ? 1.02 : 1 }} whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-3 transition-all duration-300 ${canGenerate && status !== "generating" ? "bg-primary text-background hover:bg-primary/90 shadow-lg shadow-primary/20 cursor-pointer" : "bg-card border border-border text-muted-foreground cursor-not-allowed"}`}>
                {status === "generating" ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Sparkles size={18} /></motion.div> Generating...</>
                ) : (
                  <><Sparkles size={18} /> Generate Rollout <ChevronRight size={16} /></>
                )}
              </motion.button>
              {!canGenerate && <p className="text-xs text-muted-foreground text-center mt-2">Enter a song title and artist name to begin</p>}
            </motion.div>
          </div>

          {/* Artist DNA Panel */}
          <div className="border-t border-border/50 p-6 bg-card/30">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Fingerprint size={16} className="text-primary" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Artist DNA</span>
              </div>
              {hasMemory(artistProfile) ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded">
                  {artistProfile.rolloutHistory.length} ROLLOUTS
                </motion.span>
              ) : status === "done" ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                  LEARNING
                </motion.span>
              ) : null}
            </div>

            {/* Identity summary from memory */}
            <AnimatePresence mode="wait">
              {hasMemory(artistProfile) && artistProfile.creativeIdentitySummary ? (
                <motion.div key="memory-summary" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="mb-3 px-3 py-2 rounded-lg bg-primary/8 border border-primary/15">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">Identity</p>
                  <p className="text-sm font-semibold text-primary leading-snug">{artistProfile.creativeIdentitySummary}</p>
                </motion.div>
              ) : (
                <motion.p key={dnaTag} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className={`text-sm font-medium mb-3 ${dnaTag.includes("building") ? "text-muted-foreground/50" : "text-primary"}`}>
                  {dnaTag}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="space-y-2.5">
              {[
                {
                  label: "Genre DNA",
                  value: form.genre || artistProfile.primaryGenre || "—",
                  sub: !form.genre && artistProfile.primaryGenre ? "(from memory)" : null,
                  active: !!(form.genre || artistProfile.primaryGenre),
                  influence: (form.genre || artistProfile.primaryGenre) ? "Shaping hook tone + audience clusters" : null,
                },
                {
                  label: "Mood Signature",
                  value: form.mood || (artistProfile.moodPreferences.length ? artistProfile.moodPreferences[artistProfile.moodPreferences.length - 1] : "—"),
                  sub: !form.mood && artistProfile.moodPreferences.length ? "(from memory)" : null,
                  active: !!(form.mood || artistProfile.moodPreferences.length),
                  influence: (form.mood || artistProfile.moodPreferences.length) ? "Driving visual identity + hook emotion" : null,
                },
                {
                  label: "Audience",
                  value: form.audience || artistProfile.targetAudience || "—",
                  sub: !form.audience && artistProfile.targetAudience ? "(from memory)" : null,
                  active: !!(form.audience || artistProfile.targetAudience),
                  influence: (form.audience || artistProfile.targetAudience) ? "Calibrating audience cluster strategy" : null,
                },
                {
                  label: "Platforms",
                  value: form.platforms.length ? form.platforms.slice(0, 2).join(", ") + (form.platforms.length > 2 ? ` +${form.platforms.length - 2}` : "") : "—",
                  sub: null,
                  active: form.platforms.length > 0,
                  influence: form.platforms.length > 0 ? "Calibrating platform-specific tactics" : null,
                },
              ].map(({ label, value, sub, active, influence }) => (
                <div key={label} className="space-y-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs text-muted-foreground shrink-0">{label}</span>
                    <div className="text-right">
                      <motion.span key={value} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={`text-xs font-medium ${active ? "text-foreground" : "text-muted-foreground/30"}`}>
                        {value}
                      </motion.span>
                      {sub && (
                        <p className="text-[10px] text-primary/50 mt-0.5">{sub}</p>
                      )}
                    </div>
                  </div>
                  {influence && status === "done" && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                      className="text-[10px] text-primary/60 italic">
                      {influence}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">

            {status === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-8 py-20 gap-6">
                <motion.div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
                  animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                  <Zap size={32} className="text-primary" />
                </motion.div>
                {hasMemory(artistProfile) ? (
                  <div className="space-y-2 max-w-md">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">Artist Memory Active</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      {artistProfile.artistName ? `Welcome back, ${artistProfile.artistName}` : "Your identity is being refined"}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {getPersonalizationMessage(artistProfile)} Your established {artistProfile.primaryGenre || "creative"} identity is loaded and shaping this output.
                    </p>
                    {artistProfile.creativeIdentitySummary && (
                      <p className="text-xs font-medium text-primary/80 mt-1">{artistProfile.creativeIdentitySummary}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 max-w-md">
                    <h2 className="text-2xl font-bold tracking-tight">Your Campaign Awaits</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">Every output adapts to your genre, mood, and goals. The more context you give, the sharper the strategy becomes.</p>
                  </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 w-full max-w-lg">
                  {["Context-Aware Hooks", "Genre-Matched Visuals", "Audience Clusters", "Platform Strategy", "Launch Score", "Strategic Insights"].map((item, i) => (
                    <motion.div key={item} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                      className="p-3 rounded-xl border border-border bg-card/30 text-xs text-muted-foreground text-center">
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {status === "generating" && (
              <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <GenerationPulse />
              </motion.div>
            )}

            {status === "done" && output && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-8 space-y-10">

                {/* Evolving Identity Message */}
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/20 bg-primary/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
                  <div className="relative flex items-center gap-2.5 flex-1 min-w-0">
                    <Brain size={14} className="text-primary shrink-0" />
                    <p className="text-sm text-primary/90 font-medium truncate">
                      {getPersonalizationMessage(artistProfile)}
                    </p>
                  </div>
                  {hasMemory(artistProfile) && artistProfile.rolloutHistory.length > 1 && (
                    <span className="relative text-[10px] font-bold text-primary/70 bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded shrink-0">
                      {artistProfile.rolloutHistory.length} rollouts
                    </span>
                  )}
                </motion.div>

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Campaign Generated</span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">{form.songTitle}</h2>
                    <p className="text-muted-foreground mt-1">{form.artistName} · {form.genre || "Genre"} · {form.goal || "Growth"}</p>
                  </div>
                  {overallScore && (
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/30 bg-primary/10">
                      <TrendingUp size={16} className="text-primary" />
                      <span className="text-sm font-semibold text-primary">Score: {overallScore}</span>
                    </div>
                  )}
                </motion.div>

                {/* Creative Direction Summary */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-primary/20 bg-primary/5 p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  <div className="flex items-center gap-2 mb-4">
                    <Brain size={15} className="text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Creative Direction</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {output.creativeDirectionSummary.map((line, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 + 0.06 * i, duration: 0.4 }}
                        className="flex items-center gap-2.5">
                        <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                        <span className="text-sm font-medium text-foreground/90">{line}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* 1. Timeline */}
                <Section title="Rollout Timeline" icon={<Clock size={16} className="text-primary" />} delay={0}>
                  <div className="relative pl-6 space-y-0">
                    <div className="absolute left-2 top-4 bottom-4 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />
                    {output.timeline.map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="relative flex items-start gap-4 py-4 group">
                        <div className="absolute -left-4 top-5 w-3 h-3 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors duration-200" />
                        <div className="flex-1 flex items-start gap-4 pl-2">
                          <div className="w-16 shrink-0"><span className="text-xs font-bold text-primary">{item.day}</span></div>
                          <div className="flex-1 flex items-start justify-between gap-3">
                            <p className="text-sm text-foreground/90 leading-relaxed">{item.action}</p>
                            <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${phaseColors[item.phase]}`}>{item.phase}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Section>

                {/* 2. Hooks */}
                <Section title="Attention Hooks" subtitle="Designed for Replay Behavior" insight={output.sectionInsights.hooks} icon={<Play size={16} className="text-primary" />} delay={0.05}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {output.hooks.map((hook, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.07 * i, duration: 0.5 }}
                        whileHover={{ y: -2, borderColor: "rgba(200,169,107,0.4)" }}
                        className="p-4 rounded-xl border border-border bg-card/40 cursor-pointer transition-all duration-200 group">
                        <p className="text-sm font-medium text-foreground leading-snug mb-3">"{hook.text}"</p>
                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{hook.type}</span>
                      </motion.div>
                    ))}
                  </div>
                </Section>

                {/* 3. Visual Direction */}
                <Section title="Cinematic Identity Blueprint" insight={output.sectionInsights.visuals} icon={<Eye size={16} className="text-primary" />} delay={0.1}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {output.visuals.map((item, i) => {
                      const IconComp = iconMap[item.iconKey] ?? Star;
                      return (
                        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.07 * i, duration: 0.5 }}
                          whileHover={{ y: -2 }}
                          className="p-4 rounded-xl border border-border bg-card/40 hover:border-primary/30 transition-all duration-200">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><IconComp size={15} className="text-primary" /></div>
                            <h4 className="text-sm font-semibold">{item.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                </Section>

                {/* 4. Audience Strategy */}
                <Section title="Audience Positioning Map" insight={output.sectionInsights.audience} icon={<Users size={16} className="text-primary" />} delay={0.15}>
                  <div className="space-y-3">
                    {output.audiences.map((aud, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 * i, duration: 0.5 }}
                        className={`p-4 rounded-xl border bg-gradient-to-r ${aud.color} ${aud.borderColor} transition-all duration-200 hover:scale-[1.01]`}>
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <h4 className="text-sm font-semibold text-foreground">{aud.name}</h4>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Users size={12} className="text-muted-foreground" />
                            <span className="text-sm font-bold text-foreground">{aud.size}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{aud.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </Section>

                {/* 5. Platform Strategy (if platforms selected) */}
                {output.platformInsights.length > 0 && (
                  <Section title="Platform Strategy" icon={<Wifi size={16} className="text-primary" />} delay={0.18}>
                    <div className="space-y-3">
                      {output.platformInsights.map((insight, i) => {
                        const [platformPart, ...rest] = insight.split(": ");
                        const platform = platformPart.replace(/\*\*/g, "");
                        return (
                          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.07 * i, duration: 0.5 }}
                            className="p-4 rounded-xl border border-border bg-card/40 hover:border-primary/20 transition-colors">
                            <p className="text-xs font-bold text-primary mb-1.5 uppercase tracking-wider">{platform}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">{rest.join(": ")}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </Section>
                )}

                {/* 6. Launch Score */}
                <Section title="Launch Intelligence" icon={<BarChart3 size={16} className="text-primary" />} delay={0.2}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {output.scores.map((score, i) => (
                      <RadialScore key={score.label} value={score.value} label={score.label} desc={score.desc} reason={score.reason} delay={0.08 * i} icon={score.icon} />
                    ))}
                  </div>
                </Section>

                {/* 7. Strategic Insight */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="rounded-2xl border border-border bg-card/30 overflow-hidden">
                  <div className="flex items-center gap-3 p-5 border-b border-border/50">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Brain size={15} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Strategic Insight</p>
                      <p className="text-xs text-muted-foreground">The specific mechanics that make this strategy work</p>
                    </div>
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    {output.whyInsights.map((insight, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + 0.06 * i }}
                        className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-3 pb-6">
                  <button data-testid="btn-launch-campaign" onClick={handleLaunchCampaign}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-background font-semibold text-sm hover:bg-primary/90 transition-colors">
                    <Zap size={16} /> Launch Campaign
                  </button>
                  <button data-testid="btn-share-campaign" onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-primary/30 bg-primary/8 text-primary text-sm font-semibold hover:bg-primary/14 hover:border-primary/50 transition-all duration-200">
                    <Share2 size={16} /> Share Campaign
                  </button>
                  <button data-testid="btn-regenerate" onClick={handleRegenerate}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200
                      ${generateCount >= 2
                        ? "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                        : "border-border bg-card/40 hover:border-primary/40 hover:bg-card/70"
                      }`}>
                    {generateCount >= 2 ? <Crown size={16} /> : <Sparkles size={16} />}
                    {generateCount >= 2 ? "Unlock unlimited regeneration" : "Regenerate"}
                  </button>
                  <Link href="/dashboard" data-testid="link-to-dashboard">
                    <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card/40 text-sm font-medium hover:border-primary/40 hover:bg-card/70 transition-all duration-200">
                      <BarChart3 size={16} /> View Dashboard
                    </button>
                  </Link>
                </motion.div>

              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
