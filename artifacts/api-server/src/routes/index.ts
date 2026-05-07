import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import artistsRouter from "./artists";
import rolloutsRouter from "./rollouts";
import sharesRouter from "./shares";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(artistsRouter);
router.use(rolloutsRouter);
router.use(sharesRouter);

export default router;
