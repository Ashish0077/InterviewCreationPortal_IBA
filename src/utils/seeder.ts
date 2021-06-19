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
            name: "Abhishek Tiwari",
            role: ParticipantRole.INTERVIEWER,
            email: "abhishek@interviewbit.com"
        },
        {
            name: "Bhumika Arora",
            role: ParticipantRole.CANDIDATE,
            email: "bhumikaarora0077@gmail.com"
        },
        {
            name: "Mohak Kapoor",
            role: ParticipantRole.INTERVIEWER,
            email: "mohak@interviewbit.com"
        }
    ];
    await pRepo.query("delete from participants");
    await iRepo.query("delete from interviews");
    await pRepo.save(participants);
    const p = await pRepo.find();
    const interviews: IInterview[] = [
        {
            startTime: new Date("2021-07-01T11:30:00.000Z"),
            endTime: new Date("2021-07-01T12:30:00.000Z"),
            participants: [p[0], p[1]]
        },
        {
            startTime: new Date(2021, 6, 2, 17, 0),
            endTime: new Date(2021, 6, 1, 18, 0),
            participants: [p[2], p[3]]
        }, 
        {
            startTime: new Date(2020, 6, 2, 17, 0),
            endTime: new Date(2020, 6, 1, 18, 0),
            participants: [p[1], p[3]]
        }
    ];
    await iRepo.save(interviews);
}

export default seeder;