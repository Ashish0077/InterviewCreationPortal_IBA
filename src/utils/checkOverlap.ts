import Interview from "../database/model/Interview";

const checkOverlap = (interview: Interview, startTime: Date, endTime: Date): boolean => {
	if (
		startTime <= interview.startTime &&
		endTime >= interview.startTime &&
		endTime <= interview.endTime
	)
		return true;
	if (
		startTime >= interview.startTime &&
		startTime <= interview.endTime &&
		endTime >= interview.endTime
	)
		return true;
	if (startTime >= interview.startTime && endTime <= interview.endTime) return true;
	if (startTime <= interview.startTime && endTime >= interview.endTime) return true;
	return false;
};

export default checkOverlap;
