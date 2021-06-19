import express from "express";
import interviews from "./interview/interviews";
import participants from "./participant/participants";

const router = express.Router();

router.use("/participants", participants);
router.use("/interviews", interviews);

export default router;
