import { Router } from "express";
import { db } from "@workspace/db";
import { campaignShares } from "@workspace/db/schema";
import { isAuthenticated } from "../auth";

const router = Router();

router.post("/shares", isAuthenticated, async (req: any, res) => {
  try {
    const { rolloutId, platform } = req.body;

    if (!rolloutId || !platform) {
      return res.status(400).json({ message: "rolloutId and platform are required" });
    }

    const [share] = await db
      .insert(campaignShares)
      .values({ rolloutId, platform })
      .returning();

    return res.json({ success: true, share });
  } catch {
    return res.status(500).json({ message: "Failed to record share" });
  }
});

export default router;
