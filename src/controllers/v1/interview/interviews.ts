import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import Participant from "../../../database/model/Participant";
import InterviewRepo from "../../../database/repository/InterviewRepo";
import ParticipantRepo from "../../../database/repository/ParticipantRepo";
import asyncHandler from "../../../utils/asyncHandler";
import checkOverlap from "../../../utils/checkOverlap";

export const getAllInterviews = asyncHandler(async (req: Request, res: Response) => {
	const iRepo = getCustomRepository(InterviewRepo);
	const interviews = await iRepo.getInterviews();
	res.json({
		success: true,
		data: interviews
	});
});

export const addInterview = asyncHandler(async (req: Request, res: Response) => {
	let { startTime, endTime, participants } = req.body;
	if (!startTime || !endTime || !participants) {
		return res.json({
			success: false,
			msg: "parameters missing"
		});
	}
	startTime = new Date(startTime);
	endTime = new Date(endTime);
	if (startTime < Date.now()) {
		return res.json({
			success: false,
			msg: "start time can not be in past"
		});
	}
	if (endTime < startTime) {
		return res.json({
			success: false,
			msg: "meeting duration can not be negavtive"
		});
	}
	if (participants.length < 2) {
		return res.json({
			success: false,
			msg: "there should be atleast two members"
		});
	}
	const pRepo = getCustomRepository(ParticipantRepo);
	const notClashingParticipants: Participant[] = [];
	for (let participantEmail of participants) {
		console.log(participantEmail);
		const participant = await pRepo.getParticipantByEmail(participantEmail);
		if (!participant)
			return res.json({
				success: false,
				msg: "invalid participant"
			});
		console.log(participant);
		if (!participant.interviews) continue;
		for (let interview of participant.interviews) {
			console.log(interview);
			console.log("checking overlap");
			if (checkOverlap(interview, startTime, endTime)) {
				return res.json({
					success: false,
					msg: "Time Clash"
				});
			}
			console.log("checked");
			notClashingParticipants.push(participant);
		}
	}

	// add the interview
	const iRepo = getCustomRepository(InterviewRepo);
	const interview = await iRepo.create({
		startTime: startTime,
		endTime: endTime,
		participants: notClashingParticipants
	});

	await iRepo.save(interview);
	return res.json({
		success: true,
		data: interview
	});
});

export const getUpcomingInterviews = asyncHandler(async (req: Request, res: Response) => {
	const iRepo = getCustomRepository(InterviewRepo);
	const interviews = await iRepo.getUpcomingInterviews();
	res.json({
		success: true,
		data: interviews
	});
});

export const updateInterview = asyncHandler(async (req: Request, res: Response) => {
	const uuid = req.params.uuid;
	const iRepo = getCustomRepository(InterviewRepo);
	const updateInterview = await iRepo.getInterviewByUuid(uuid);
	if (!updateInterview) {
		return res.json({
			success: false,
			msg: "this interview does not exist"
		});
	}
	let { startTime, endTime, participants } = req.body;
	if (!startTime || !endTime || !participants) {
		return res.json({
			success: false,
			msg: "parameters missing"
		});
	}
	startTime = new Date(startTime);
	endTime = new Date(endTime);
	if (startTime < Date.now()) {
		return res.json({
			success: false,
			msg: "start time can not be in past"
		});
	}
	if (endTime < startTime) {
		return res.json({
			success: false,
			msg: "meeting duration can not be negative"
		});
	}
	if (participants.length < 2) {
		return res.json({
			success: false,
			msg: "there should be atleast two members"
		});
	}
	const pRepo = getCustomRepository(ParticipantRepo);
	updateInterview.participants = [];
	for (let participantEmail of participants) {
		console.log(participantEmail);
		const participant = await pRepo.getParticipantByEmail(participantEmail);
		if (!participant)
			return res.json({
				success: false,
				msg: "invalid participant"
			});
		console.log(participant);
		if (!participant.interviews) continue;
		for (let interview of participant.interviews) {
			console.log(interview);
			console.log("checking overlap");
			if (interview.uuid != uuid && checkOverlap(interview, startTime, endTime)) {
				console.log(interview);
				return res.json({
					success: false,
					msg: "Time Clash"
				});
			}
			console.log("checked");
		}
		updateInterview.participants.push(participant);
	}

	// update the interview
	await iRepo.save(updateInterview);
	return res.json({
		success: true,
		data: updateInterview
	});
});
