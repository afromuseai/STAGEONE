import { Router } from "express";
import { db } from "@workspace/db";
import { artists, artistDna } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "../auth";

const router = Router();

function getUserId(req: any): string {
  return req.user.claims.sub as string;
}

router.get("/artists/me", isAuthenticated, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    const [artist] = await db
      .select()
      .from(artists)
      .where(eq(artists.userId, userId));

    if (!artist) {
      return res.status(404).json({ message: "Artist profile not found" });
    }

    const [dna] = await db
      .select()
      .from(artistDna)
      .where(eq(artistDna.artistId, artist.id));

    return res.json({ ...artist, dna: dna ?? null });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch artist profile" });
  }
});

router.post("/artists", isAuthenticated, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    const {
      artistName,
      genre,
      secondaryGenre,
      audienceProfile,
      preferences,
      tone,
      visualStyle,
      hookStyle,
      audienceType,
      identitySummary,
    } = req.body;

    const existingArtist = await db
      .select()
      .from(artists)
      .where(eq(artists.userId, userId));

    if (existingArtist.length > 0) {
      return res.status(409).json({ message: "Artist profile already exists" });
    }

    const [artist] = await db
      .insert(artists)
      .values({
        userId,
        email: req.user.claims.email ?? null,
        artistName,
        genre,
        secondaryGenre: secondaryGenre ?? null,
        audienceProfile: audienceProfile ?? null,
        preferences: preferences ?? {},
        onboardingComplete: true,
      })
      .returning();

    const [dna] = await db
      .insert(artistDna)
      .values({
        artistId: artist.id,
        tone: tone ?? null,
        visualStyle: visualStyle ?? null,
        hookStyle: hookStyle ?? null,
        audienceType: audienceType ?? null,
        identitySummary: identitySummary ?? null,
      })
      .returning();

    return res.json({ ...artist, dna });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create artist profile" });
  }
});

router.put("/artists/me", isAuthenticated, async (req: any, res) => {
  try {
    const userId = getUserId(req);
    const [existing] = await db
      .select()
      .from(artists)
      .where(eq(artists.userId, userId));

    if (!existing) {
      return res.status(404).json({ message: "Artist profile not found" });
    }

    const { artistName, genre, secondaryGenre, audienceProfile, preferences } = req.body;

    const [updated] = await db
      .update(artists)
      .set({ artistName, genre, secondaryGenre, audienceProfile, preferences })
      .where(eq(artists.userId, userId))
      .returning();

    return res.json(updated);
  } catch {
    return res.status(500).json({ message: "Failed to update artist profile" });
  }
});

export default router;
