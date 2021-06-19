import { createConnection, getCustomRepository } from "typeorm";
import { ParticipantRole } from "./model/Participant";
import ParticipantRepo from "./repository/ParticipantRepo";

const insertDummyParticipants = async () => {
    const pRepo = getCustomRepository(ParticipantRepo);
    const participants = [
        {
            name: "Ashish Arora",
            role: ParticipantRole.CANDIDATE,
            email: "ashish007722@gmail.com"
        },
        {
            name: "Abhishek Tiwari",
            role: ParticipantRole.INTERVIEWER,
            email: "abhishek@interviewbit.com"
        }
    ];
    await pRepo.clear();
    await pRepo.insert(participants);
}

export default async function connectDB(): Promise<void> {
	try {
		await createConnection();
		console.log("DB CONNECTED!");
        await insertDummyParticipants();
	} catch (err) {
		console.log(err);
	}
}
