import { EntityRepository, Repository } from "typeorm";
import Interview from "../model/Interview";
import Participant, { ParticipantRole } from "../model/Participant";

@EntityRepository(Interview)
export default class InterviewRepo extends Repository<Interview> {
    getInterviews(): Promise<Interview[]> {
        return this.createQueryBuilder("interviews")
                .leftJoinAndSelect("interviews.participants", "participants")
                .getMany();
    }
}
