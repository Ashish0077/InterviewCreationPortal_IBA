import { NextFunction, Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import InterviewRepo from "../../../database/repository/InterviewRepo";
import asyncHandler from "../../../utils/asyncHandler";

export const getAllInterviews = asyncHandler(async (req: Request, res: Response) => {
    const iRepo = getCustomRepository(InterviewRepo);
    const interviews = await iRepo.getInterviews();
    res.json({
        success: true,
        data: interviews
    });
});