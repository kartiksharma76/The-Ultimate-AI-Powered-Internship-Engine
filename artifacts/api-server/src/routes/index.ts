import { Router, type IRouter } from "express";
import healthRouter from "./health";
import studentsRouter from "./students";
import internshipsRouter from "./internships";
import recommendationsRouter from "./recommendations";
import skillgapRouter from "./skillgap";
import analyticsRouter from "./analytics";
import authRouter from "./auth";
import applicationsRouter from "./applications";
import gamificationRouter from "./gamification";
import githubRouter from "./github";
import rankingRouter from "./ranking";
import assessmentRouter from "./assessment";
import interviewRouter from "./interview";

const router: IRouter = Router();

router.use(healthRouter);
router.use(studentsRouter);
router.use(internshipsRouter);
router.use(recommendationsRouter);
router.use(skillgapRouter);
router.use(analyticsRouter);
router.use("/auth", authRouter);
router.use("/applications", applicationsRouter);
router.use(gamificationRouter);
router.use(githubRouter);
router.use(rankingRouter);
router.use(assessmentRouter);
router.use(interviewRouter);

export default router;
