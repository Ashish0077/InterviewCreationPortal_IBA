import express from "express";
import {
	getAllInterviews,
	addInterview,
	getUpcomingInterviews,
	updateInterview,
	getInterview,
	deleteInterview
} from "../../../controllers/v1/interview/interviews";

const router = express.Router();

router.get("/", getAllInterviews);
router.post("/", addInterview);
router.get("/upcoming", getUpcomingInterviews);
router.get("/:uuid", getInterview);
router.put("/:uuid", updateInterview);
router.delete("/:uuid", deleteInterview);

export default router;
