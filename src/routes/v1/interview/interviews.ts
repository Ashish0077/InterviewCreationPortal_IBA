import express from "express";
import {
	getAllInterviews,
	addInterview,
	getUpcomingInterviews,
	updateInterview,
	getInterview,
	deleteInterview,
	checkParticipantAccess
} from "../../../controllers/v1/interview/interviews";

const router = express.Router();

router.get("/", getAllInterviews);
// router.post("/", addInterviewSQLCheck);
router.post("/", addInterview);
router.get("/upcoming", getUpcomingInterviews);
router.get("/:uuid", getInterview);
router.put("/:uuid", updateInterview);
router.delete("/:uuid", deleteInterview);
router.get("/:uuid/check", checkParticipantAccess);

export default router;
