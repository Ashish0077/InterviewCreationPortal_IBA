import express from "express";
import participants from "./participant/participants";

const router = express.Router();

router.use("/participants", participants);

export default router;
