import express from "express";
import { getCandidates, getInterviewers } from "../../../controllers/v1/participant/participants";

const router = express.Router();

router.get("/candidates", getCandidates);
router.get("/interviewers", getInterviewers);

export default router;
