import { Router } from "express";
import { isAuthenticated } from "../auth";
import { authStorage } from "../auth/storage";

const router = Router();

router.get("/auth/user", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub as string;
    const user = await authStorage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
});

export default router;
