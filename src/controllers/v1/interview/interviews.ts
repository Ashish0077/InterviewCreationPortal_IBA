import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { BadRequestError, NoDataError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";
import Participant from "../../../database/model/Participant";
import InterviewRepo from "../../../database/repository/InterviewRepo";
import ParticipantRepo from "../../../database/repository/ParticipantRepo";
import asyncHandler from "../../../utils/asyncHandler";
import checkOverlap from "../../../utils/checkOverlap";
import sendEmail from "../../../utils/sendEmails";
import moment from "moment";

export const getAllInterviews = asyncHandler(async (req: Request, res: Response) => {
	const iRepo = getCustomRepository(InterviewRepo);
	const interviews = await iRepo.getInterviews();
	new SuccessResponse("success", interviews).send(res);
});

export const addInterview = asyncHandler(async (req: Request, res: Response) => {
	let { startTime, endTime, participants } = req.body;
	if (!startTime || !endTime || !participants)
		throw new BadRequestError(
			"Please enter startTime, endTime and participants email list properly."
		);

	startTime = new Date(startTime);
	endTime = new Date(endTime);

	if (startTime < Date.now())
		throw new BadRequestError(
			"Start time can not be before current Time. (Are you a time traveller?)"
		);
	if (endTime < startTime)
		throw new BadRequestError("Meeting duration can not be negative. endTime is before startTime.");

	if (participants.length < 2) throw new BadRequestError("Please provide atleast 2 participants");

	const pRepo = getCustomRepository(ParticipantRepo);
	const notClashingParticipants: Participant[] = [];
	for (let participantEmail of participants) {
		const participant = await pRepo.getParticipantByEmail(participantEmail);
		if (!participant) throw new NoDataError("Participant not found!");
		if (!participant.interviews) continue;
		for (let interview of participant.interviews) {
			if (checkOverlap(interview, startTime, endTime))
				throw new BadRequestError(
					`${participant.email} is having another interview during this time slot. Please reschedule!`
				);
		}
		notClashingParticipants.push(participant);
	}

	// add the interview
	const iRepo = getCustomRepository(InterviewRepo);
	const interview = await iRepo.create({
		startTime: startTime,
		endTime: endTime,
		participants: notClashingParticipants
	});

	await iRepo.save(interview);

	for (let p of notClashingParticipants) {
		console.log(`Sending mail to ${p.email}`);
		await sendEmail({
			email: p.email,
			subject: "Interviewbit Engineering Role Interview",
			message: `Timing: ${moment(startTime).format("hh:mm A")} - ${moment(endTime).format(
				"hh:mm A"
			)} on ${moment(startTime).format("DD-MM-YYYY")}`
		});
		console.log("mail sent!");
	}

	new SuccessResponse("success", interview).send(res);
});

export const getUpcomingInterviews = asyncHandler(async (req: Request, res: Response) => {
	const iRepo = getCustomRepository(InterviewRepo);
	const interviews = await iRepo.getUpcomingInterviews();
	new SuccessResponse("success", interviews).send(res);
});

export const updateInterview = asyncHandler(async (req: Request, res: Response) => {
	const uuid = req.params.uuid;
	const iRepo = getCustomRepository(InterviewRepo);
	let updateInterview = await iRepo.getInterviewByUuid(uuid);
	if (!updateInterview) {
		throw new NoDataError("invalid uuid, Interview does not exist");
	}

	let { startTime, endTime, participants } = req.body;
	if (!startTime || !endTime || !participants)
		throw new BadRequestError(
			"Please enter startTime, endTime and participants email list properly."
		);
	console.log(req.body);
	startTime = new Date(startTime);
	endTime = new Date(endTime);

	updateInterview.startTime = startTime;
	updateInterview.endTime = endTime;

	if (startTime < Date.now())
		throw new BadRequestError(
			"Start time can not be before current Time. (Are you a time traveller?)"
		);

	if (endTime < startTime)
		throw new BadRequestError("Meeting duration can not be negative. endTime is before startTime.");

	if (participants.length < 2) throw new BadRequestError("Please provide atleast 2 participants");

	const pRepo = getCustomRepository(ParticipantRepo);
	updateInterview.participants = [];
	for (let participantEmail of participants) {
		console.log(participantEmail);
		const participant = await pRepo.getParticipantByEmail(participantEmail);
		if (!participant) throw new NoDataError("Participant not found!");
		if (!participant.interviews) continue;
		for (let interview of participant.interviews)
			if (interview.uuid != uuid && checkOverlap(interview, startTime, endTime))
				throw new BadRequestError(
					`${participant.email} is having another interview during this time slot. Please reschedule!`
				);
		updateInterview.participants.push(participant);
	}

	// update the interview
	await iRepo.save(updateInterview);

	for (let p of updateInterview.participants) {
		console.log(`Sending mail to ${p.email}`);
		await sendEmail({
			email: p.email,
			subject: "[RESCHEDULED] Interviewbit Engineering Role Interview",
			message: `Timing: ${moment(startTime).format("hh:mm A")} - ${moment(endTime).format(
				"hh:mm A"
			)} on ${moment(startTime).format("DD-MM-YYYY")}`
		});
		console.log("mail sent!");
	}

	new SuccessResponse("success", updateInterview).send(res);
});

export const getInterview = asyncHandler(async (req: Request, res: Response) => {
	const uuid = req.params.uuid;
	const iRepo = getCustomRepository(InterviewRepo);
	let interview = await iRepo.getInterviewByUuid(uuid);
	if (!interview) {
		throw new NoDataError("invalid uuid, Interview does not exist");
	}

	new SuccessResponse("success", interview).send(res);
});

export const deleteInterview = asyncHandler(async (req: Request, res: Response) => {
	const uuid = req.params.uuid;
	const iRepo = getCustomRepository(InterviewRepo);
	let interview = await iRepo.getInterviewByUuid(uuid);
	if (!interview) {
		throw new NoDataError("invalid uuid, Interview does not exist");
	}
	await iRepo.remove(interview);
	new SuccessResponse("successfully deleted", interview).send(res);
});
