import express from "express";
import { getAllInterviews, addInterview, getUpcomingInterviews, updateInterview }from "../../../controllers/v1/interview/interviews";

const router = express.Router();

router.get("/", getAllInterviews)
router.post("/", addInterview);
router.get("/upcoming", getUpcomingInterviews);
router.put("/:uuid", updateInterview);

export default router;
