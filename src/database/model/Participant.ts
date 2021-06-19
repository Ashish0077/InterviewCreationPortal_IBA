import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import BaseModel from "./BaseModel";
import Interview from "./Interview";

export enum ParticipantRole {
	CANDIDATE = "candidate",
	INTERVIEWER = "interviewer"
}

export interface IParticipant {
	name: string;
	email: string;
	role: ParticipantRole;
}

@Entity("participants")
class Participant extends BaseModel {
	@Column()
	name: string;

	@Column({ unique: true })
	email: string;

	@Column({
		type: "enum",
		enum: ParticipantRole,
		default: ParticipantRole.CANDIDATE
	})
	role: ParticipantRole;

	@ManyToMany((type) => Interview, (interview) => interview.participants)
	@JoinTable({ name: "participants_interviews" })
	interviews: Interview[];
}

export default Participant;
