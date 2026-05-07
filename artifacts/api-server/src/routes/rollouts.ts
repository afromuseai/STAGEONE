import { Router } from "express";
import { db } from "@workspace/db";
import { artists, artistDna, rollouts } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { isAuthenticated } from "../auth";
import { generateRollout } from "../lib/ai/stageone-engine";

const router = Router();

function getUserId(req: any): string {
  return req.user.claims.sub as string;
}

async function getArtistForUser(userId: string) {
  const [artist] = await db
    .select()
    .from(artists)
    .where(eq(artists.userId, userId));
  return artist ?? null;
}

router.post("/generate-rollout", isAuthenticated, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    const { songTitle, genre, mood } = req.body;

    if (!songTitle) {
      return res.status(400).json({ message: "songTitle is required" });
    }

    const artist = await getArtistForUser(userId);
    let dna = null;

    if (artist) {
      const [dnaRow] = await db
        .select()
        .from(artistDna)
        .where(eq(artistDna.artistId, artist.id));
      dna = dnaRow ?? null;
    }

    const result = await generateRollout(
      { songTitle, genre, mood },
      artist,
      dna
    );

    if (!result) {
      return res.status(503).json({ message: "AI generation unavailable" });
    }

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "Generation failed" });
  }
});

router.post("/rollouts", isAuthenticated, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    const artist = await getArtistForUser(userId);

    if (!artist) {
      return res.status(404).json({ message: "Artist profile not found" });
    }

    const {
      songTitle,
      genre,
      mood,
      rolloutTimeline,
      hooks,
      visualDirection,
      audienceStrategy,
      launchScore,
      strategicInsight,
    } = req.body;

    const [rollout] = await db
      .insert(rollouts)
      .values({
        artistId: artist.id,
        songTitle,
        genre,
        mood,
        rolloutTimeline,
        hooks,
        visualDirection,
        audienceStrategy,
        launchScore,
        strategicInsight,
      })
      .returning();

    return res.json(rollout);
  } catch {
    return res.status(500).json({ message: "Failed to save rollout" });
  }
});

router.get("/rollouts", isAuthenticated, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    const artist = await getArtistForUser(userId);

    if (!artist) {
      return res.json([]);
    }

    const results = await db
      .select()
      .from(rollouts)
      .where(eq(rollouts.artistId, artist.id))
      .orderBy(desc(rollouts.createdAt));

    return res.json(results);
  } catch {
    return res.status(500).json({ message: "Failed to fetch rollouts" });
  }
});

export default router;
