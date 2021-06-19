import { Column, Entity } from "typeorm";
import BaseModel from "./BaseModel";

export enum ParticipantRole {
    CANDIDATE = "candidate",
    INTERVIEWER = "interviewer"
}

@Entity("participants")
class Participant extends BaseModel {
	@Column()
	name: string;

	@Column()
	email: string;

    @Column({
        type: "enum",
        enum: ParticipantRole,
        default: ParticipantRole.CANDIDATE
    })
    role: ParticipantRole
}

export default Participant;
