import { NextFunction, Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SuccessResponse } from "../../../core/ApiResponse";
import ParticipantRepo from "../../../database/repository/ParticipantRepo";
import asyncHandler from "../../../utils/asyncHandler";

export const getCandidates = asyncHandler(async (req: Request, res: Response) => {
	const getInterviews = req.query.interviews === "true" || false;
	const pRepo = getCustomRepository(ParticipantRepo);
	const candidates = await pRepo.getCandidates(getInterviews);
	new SuccessResponse("success", candidates).send(res);
});

export const getInterviewers = asyncHandler(async (req: Request, res: Response) => {
	const getInterviews = req.query.interviews == "true" || false;
	const pRepo = getCustomRepository(ParticipantRepo);
	const interviewers = await pRepo.getInterviwers(getInterviews);
	new SuccessResponse("success", interviewers).send(res);
});
