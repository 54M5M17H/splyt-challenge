import { addMinutes, isHowManyMinsBehind } from '../lib/string.patch';

// CONSTANTS
const START_TIME = '09:00';
const END_TIME = '19:00';

export default class Scheduler {

	private schedules: TStaffSchedule;
	private meetingLength: number;
	private _potentialStartTime: string;
	private potentialMeetingEnd: string;
	private personPointers: TSchedulePointers;

	constructor(schedules: TStaffSchedule, meetingLength: number) {
		Object.assign(this, { schedules, meetingLength });
		this.potentialStartTime = START_TIME;
		this.personPointers = Array(schedules.length).fill(0);
	}

	set potentialStartTime(newValue: string) {
		this.potentialMeetingEnd = newValue[addMinutes](this.meetingLength);
		const exceedsWorkingDay = this.potentialMeetingEnd[isHowManyMinsBehind](END_TIME) <= 0;
		if (exceedsWorkingDay) {
			throw new Error('No time left in day for meeting');
		}
		this._potentialStartTime = newValue;
	}

	get potentialStartTime(): string {
		return this._potentialStartTime;
	}

	public exec(): TMeeting {
		try {
			// find first person's next free slot
			this.findIndividualsNextFreeSlot(0);

			// check whether others can make it
			const allCanMake = this.personPointers.slice(1).every((_, index) => this.findIndividualsNextFreeSlot(index + 1));
			if (!allCanMake) {
				return this.exec();
			}
			return [this.potentialStartTime, this.potentialMeetingEnd];
		} catch (error) {
			if (error.message === 'No time left in day for meeting') {
				return null;
			}

			throw error;
		}
	}

	private findIndividualsNextFreeSlot(personIndex: number): boolean {
		const pointer = this.personPointers[personIndex];
		const nextMeeting = this.schedules[personIndex][pointer];
		const overlap = nextMeeting[0][isHowManyMinsBehind](this.potentialMeetingEnd);
		if (overlap > 0) {
			this.potentialStartTime = nextMeeting[1];
			this.personPointers[personIndex]++;
			if (personIndex === 0) {
				return this.findIndividualsNextFreeSlot(personIndex);
			}
			return false;
		}
		return true;
	}
}
