import express from "express";
import { getAllInterviews, addInterview, getUpcomingInterviews }from "../../../controllers/v1/interview/interviews";

const router = express.Router();

router.get("/", getAllInterviews)
router.post("/", addInterview);
router.get("/upcoming", getUpcomingInterviews);

export default router;
