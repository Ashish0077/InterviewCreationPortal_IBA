import e, { NextFunction, Request, response, Response } from "express";
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
	const emailParticipants = await pRepo.getParticipantsByEmails(participants);
	const checkEmails = {};
	for (const email of participants) {
		// @ts-ignore
		checkEmails[email] = false;
	}
	for (let participant of emailParticipants) {
		// @ts-expect-error
		checkEmails[participant.email] = true;
		if (!participant.interviews) continue;
		for (let interview of participant.interviews) {
			if (checkOverlap(interview, startTime, endTime))
				throw new BadRequestError(
					`${participant.email} is having another interview during this time slot. Please reschedule!`
				);
		}
	}

	for (const email in checkEmails) {
		// @ts-ignore
		if (checkEmails[email] == false) throw new NoDataError(`Participant ${email} does not exist`);
	}

	// add the interview
	const iRepo = getCustomRepository(InterviewRepo);
	const interview = await iRepo.create({
		startTime: startTime,
		endTime: endTime,
		participants: emailParticipants
	});

	await iRepo.save(interview);

	for (let p of emailParticipants) {
		console.log(`Sending mail to ${p.email}`);
		sendEmail({
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
	const emailParticipants = await pRepo.getParticipantsByEmails(participants);
	const checkEmails = {};
	for (const email of participants) {
		// @ts-ignore
		checkEmails[email] = false;
	}
	for (let participant of emailParticipants) {
		// @ts-expect-error
		checkEmails[participant.email] = true;
		if (!participant.interviews) continue;
		for (let interview of participant.interviews) {
			if (checkOverlap(interview, startTime, endTime))
				throw new BadRequestError(
					`${participant.email} is having another interview during this time slot. Please reschedule!`
				);
		}
	}

	for (const email in checkEmails) {
		// @ts-ignore
		if (checkEmails[email] == false) throw new NoDataError(`Participant ${email} does not exist`);
	}

	updateInterview.participants = emailParticipants;

	// update the interview
	await iRepo.save(updateInterview);

	for (let p of updateInterview.participants) {
		console.log(`Sending mail to ${p.email}`);
		sendEmail({
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

export const checkParticipantAccess = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const uuid = req.params.uuid;
		const email = req.query.email;
		if (!email) throw new BadRequestError("Please provide a email to check");
		const iRepo = getCustomRepository(InterviewRepo);
		const interview = await iRepo.getInterviewByUuidWithEmail(uuid, email as string);
		if (!interview) throw new BadRequestError("Access Denied!");
		new SuccessResponse("You are allowed", {}).send(res);
	}
);
