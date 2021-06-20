import { getCustomRepository } from "typeorm";
import { ParticipantRole, IParticipant } from "../database/model/Participant";
import { IInterview } from "../database/model/Interview";
import ParticipantRepo from "../database/repository/ParticipantRepo";
import InterviewRepo from "../database/repository/InterviewRepo";

const seeder = async () => {
	const pRepo = getCustomRepository(ParticipantRepo);
	const iRepo = getCustomRepository(InterviewRepo);
	const participants: IParticipant[] = [
		{
			name: "Ashish Arora",
			role: ParticipantRole.CANDIDATE,
			email: "ashish007722@gmail.com"
		},
		{
			name: "Kyle Simpson",
			role: ParticipantRole.CANDIDATE,
			email: "kyleSimpson@email.com"
		},
		{
			name: "Will Sentence",
			role: ParticipantRole.CANDIDATE,
			email: "willsentence@email.com"
		},
		{
			name: "Nancy Winters",
			role: ParticipantRole.CANDIDATE,
			email: "nancywinters@email.com"
		},
		{
			name: "Abhishek Tiwari",
			role: ParticipantRole.INTERVIEWER,
			email: "abhishek@interviewbit.com"
		},
		{
			name: "Mark Rober",
			role: ParticipantRole.INTERVIEWER,
			email: "markrober@email.com"
		},
		{
			name: "Mohak kapoor",
			role: ParticipantRole.INTERVIEWER,
			email: "mohakkapoor@email.com"
		},
		{
			name: "Neha Singh",
			role: ParticipantRole.INTERVIEWER,
			email: "nehasingh@email.com"
		},
		{
			name: "Bhumika Arora",
			role: ParticipantRole.INTERVIEWER,
			email: "bhumikaarora0077@gmail.com"
		}
	];
	await pRepo.query("delete from participants");
	await iRepo.query("delete from interviews");
	await pRepo.save(participants);
};

export default seeder;
