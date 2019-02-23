
import Scheduler from '../../src/tasks/task2';

describe('Scheduler: Task2', () => {
	it('Should return the timeframe 12:15 -> 13:15', () => {
		// @ts-ignore
		const schedules: TStaffSchedule = [
			[['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
			[['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
			[['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']],
		];

		const meetingLength = 60;

		const scheduler = new Scheduler(schedules, meetingLength);
		const meeting = scheduler.exec();

		meeting[0].should.equal('12:15');
		meeting[1].should.equal('13:15');
	});

	it('Should return the timeframe 16:30 -> 17:30', () => {
		// @ts-ignore
		const schedules: TStaffSchedule = [
			[['09:00', '11:30'], ['13:30', '16:00'], ['17:45', '19:00']],
			[['09:15', '12:00'], ['14:00', '16:30'], ['17:30', '17:30']],
			[['11:30', '13:15'], ['15:00', '16:30'], ['17:45', '19:00']],
		];

		const meetingLength = 60;

		const scheduler = new Scheduler(schedules, meetingLength);
		const meeting = scheduler.exec();

		meeting[0].should.equal('16:30');
		meeting[1].should.equal('17:30');
	});

	it('Should return no timeframe', () => {
		// @ts-ignore
		const schedules: TStaffSchedule = [
			[['09:00', '11:30'], ['13:30', '16:00'], ['17:45', '19:00']],
			[['09:15', '12:00'], ['14:00', '16:30'], ['17:30', '17:30']],
			[['11:30', '13:15'], ['15:00', '16:30'], ['17:45', '19:00']],
		];

		const meetingLength = 90;

		const scheduler = new Scheduler(schedules, meetingLength);
		const meeting = scheduler.exec();

		(meeting === null).should.equal(true);
	});
});




// const Scheduler = require('../../task2');



// const meetingLength = 60;

// const scheduler = new Scheduler(schedules, meetingLength);
// const startTime = scheduler.exec();
// if (startTime !== '12:15') {
// 	throw new Error(startTime + ' is wrong');
// }

// console.log(startTime + ' is correct');



// const schedules: TStaffSchedule = [
// 	[['09:00', '11:30'], ['13:30', '16:00'], ['17:45', '19:00']],
// 	[['09:15', '12:00'], ['14:00', '16:30'], ['17:30', '17:30']],
// 	[['11:30', '13:15'], ['15:00', '16:30'], ['17:45', '19:00']],
// ];

// const meetingLength = 60;

// const scheduler = new Scheduler(schedules, meetingLength);
// const startTime = scheduler.exec();
// if (startTime !== '12:15') {
// 	console.log(startTime + ' is wrong');
// } else {
// 	console.log(startTime + ' is correct');
// }

