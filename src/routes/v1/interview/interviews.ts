import express from "express";
import { getAllInterviews, addInterview }from "../../../controllers/v1/interview/interviews";

const router = express.Router();

router.get("/", getAllInterviews)
router.post("/", addInterview);

export default router;
