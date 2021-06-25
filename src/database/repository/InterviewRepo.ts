import { EntityRepository, Repository } from "typeorm";
import { format } from "date-fns";
import Interview from "../model/Interview";

@EntityRepository(Interview)
export default class InterviewRepo extends Repository<Interview> {
	getInterviews(): Promise<Interview[]> {
		return this.createQueryBuilder("interviews")
			.leftJoinAndSelect("interviews.participants", "participants")
			.getMany();
	}

	getUpcomingInterviews(): Promise<Interview[]> {
		return this.createQueryBuilder("interviews")
			.leftJoinAndSelect("interviews.participants", "participants")
			.where("UNIX_TIMESTAMP(interviews.startTime)*1000 >= :currTime", {
				currTime: Date.now()
			})
			.getMany();
	}

	getInterviewByUuid(uuid: string): Promise<Interview | undefined> {
		return this.createQueryBuilder("interviews")
			.leftJoinAndSelect("interviews.participants", "participants")
			.where("interviews.uuid = :uuid", { uuid })
			.getOne();
	}

	getInterviewByUuidWithEmail(uuid: string, email: string): Promise<Interview | undefined> {
		return this.createQueryBuilder("interviews")
			.leftJoinAndSelect("interviews.participants", "participants")
			.where("interviews.uuid = :id", { id: uuid })
			.having("participants.email = :email", { email })
			.getOne();
	}
}
