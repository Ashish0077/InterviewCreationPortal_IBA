import { Column, Entity, ManyToMany } from "typeorm";
import BaseModel from "./BaseModel";
import Participant from "./Participant";

export interface IInterview {
	startTime: Date;
	endTime: Date;
	participants: Participant[];
}

@Entity("interviews")
class Interview extends BaseModel {
	@Column("timestamp")
	startTime: Date;

	@Column("timestamp")
	endTime: Date;

	@ManyToMany((type) => Participant, (participant) => participant.interviews)
	participants: Participant[];
}

export default Interview;
