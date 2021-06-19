import { EntityRepository, Repository } from "typeorm";
import Participant, { ParticipantRole } from "../model/Participant";

@EntityRepository(Participant)
export default class ParticipantRepo extends Repository<Participant> {
    getInterviwers(): Promise<Participant[]> {
        return this.find({role: ParticipantRole.INTERVIEWER});
    }

    getCandidates(): Promise<Participant[]> {
        return this.find({role: ParticipantRole.CANDIDATE});
    }
}
