import { Brackets, EntityRepository, Repository } from "typeorm";
import Interview from "../model/Interview";
import Participant, { ParticipantRole } from "../model/Participant";

@EntityRepository(Participant)
export default class ParticipantRepo extends Repository<Participant> {
	getInterviwers(getInterviews: boolean = false): Promise<Participant[]> {
		if (getInterviews)
			return this.find({
				where: { role: ParticipantRole.INTERVIEWER },
				relations: ["interviews"]
			});
		return this.find({ where: { role: ParticipantRole.INTERVIEWER } });
	}

	getCandidates(getInterviews: boolean = false): Promise<Participant[]> {
		if (getInterviews)
			return this.find({
				where: { role: ParticipantRole.CANDIDATE },
				relations: ["interviews"]
			});
		return this.find({ where: { role: ParticipantRole.CANDIDATE } });
	}

	getParticipantByEmail(email: string): Promise<Participant | undefined> {
		return this.findOne({ where: { email }, relations: ["interviews"] });
	}

	getParticipantsByEmails(emails: string[]): Promise<Participant[]> {
		return this.createQueryBuilder("participants")
			.leftJoinAndSelect("participants.interviews", "interviews")
			.where("participants.email in (:...emails)", { emails })
			.getMany();
	}
}
