import { NextFunction, Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import ParticipantRepo from "../../../database/repository/ParticipantRepo";
import asyncHandler from "../../../utils/asyncHandler";

export const getCandidates = asyncHandler(async (req: Request, res: Response) => {
    const pRepo = getCustomRepository(ParticipantRepo);
    const candidates = await pRepo.getCandidates();
    res.json({
        success: true,
        data: candidates
    });
});

export const getInterviewers = asyncHandler(async (req: Request, res: Response) => {
    const pRepo = getCustomRepository(ParticipantRepo);
    const interviewers = await pRepo.getInterviwers();
    res.json({
        success: true,
        data: interviewers
    });
});