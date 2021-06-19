import express from "express";
import { getAllInterviews }from "../../../controllers/v1/interview/interviews";

const router = express.Router();

router.get("/", getAllInterviews)

export default router;
