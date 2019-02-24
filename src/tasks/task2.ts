import { addMinutes, isBefore } from '../lib/string.patch';

// CONSTANTS
const START_TIME = '09:00';
const END_TIME = '19:00';

export default class Scheduler {

	private schedules: TStaffSchedule;
	private meetingLength: number;
	private _potentialStartTime: string;
	private potentialMeetingEnd: string;
	private personPointers: TSchedulePointers;
	private slotHasMoved: boolean = false;

	constructor(schedules: TStaffSchedule, meetingLength: number) {
		Object.assign(this, { schedules, meetingLength });
		this.potentialStartTime = START_TIME;
		this.personPointers = Array(schedules.length).fill(0);
	}

	set potentialStartTime(newValue: string) {
		if (this._potentialStartTime && !this._potentialStartTime[isBefore](newValue)) {
			return;
		}

		this.potentialMeetingEnd = newValue[addMinutes](this.meetingLength);
		const fitsIntoWorkingDay = this.potentialMeetingEnd[isBefore](END_TIME);
		if (!fitsIntoWorkingDay) {
			throw new Error('No time left in day for meeting');
		}
		this._potentialStartTime = newValue;
		this.slotHasMoved = true;
	}

	get potentialStartTime(): string {
		return this._potentialStartTime;
	}

	public exec(): TMeeting {
		try {
			let canMakeItTracker = 0;
			let currentPersonIndex = 0;

			// until all have been checked against current time
			while (canMakeItTracker < this.schedules.length) {
				this.findIndividualsNextFreeSlot(currentPersonIndex);
				if (this.slotHasMoved) {
					this.slotHasMoved = false;
					// reset
					canMakeItTracker = 1;
				} else {
					canMakeItTracker++;
				}
				// wrap around
				currentPersonIndex = (currentPersonIndex + 1) % this.schedules.length;
			}

			return [this.potentialStartTime, this.potentialMeetingEnd];
		} catch (error) {
			if (error.message === 'No time left in day for meeting') {
				return null;
			}

			throw error;
		}
	}

	private findIndividualsNextFreeSlot(personIndex: number): void {
		const pointer = this.personPointers[personIndex];

		const nextAvailableTime = (pointer > 0) ?
			this.schedules[personIndex][pointer - 1][1] : START_TIME;

		const mustStartLater = this.potentialStartTime[isBefore](nextAvailableTime);
		if (mustStartLater) {
			return this.slideStartForward(personIndex, nextAvailableTime);
		}

		const [nextMeetingStart, nextMeetingEnd] = this.schedules[personIndex][pointer];

		const endsTooLate = nextMeetingStart[isBefore](this.potentialMeetingEnd);
		if (endsTooLate) {
			return this.slideStartForward(personIndex, nextMeetingEnd);
		}
	}

	private slideStartForward(personIndex: number, newStartTime: string): void {
		this.potentialStartTime = newStartTime;
		this.personPointers[personIndex]++;
		return this.findIndividualsNextFreeSlot(personIndex);
	}
}
