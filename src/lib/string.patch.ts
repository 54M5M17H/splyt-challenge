// methods for handling the provided time format
// Global prototype patched using symbols as `traits` to avoid monkey-patching

export const addMinutes = Symbol();
export const isHowManyMinsBehind = Symbol();

// NON-mutating
String.prototype[addMinutes] = function (additionalMinutes: number): string {
	const [currentHours, currentMinutes] = this.valueOf().split(':');
	const newMinuteTotal = Number(currentMinutes) + Number(additionalMinutes);
	const additionalHours = Math.floor(newMinuteTotal / 60);
	const newMinutes = String(newMinuteTotal % 60).padStart(2, '0');
	const newHours = String(Number(currentHours) + Number(additionalHours)).padStart(2, '0');
	return `${newHours}:${newMinutes}`;
};

// NON-mutating
String.prototype[isHowManyMinsBehind] = function (futureTime: string): number {
	const [currentHours, currentMinutes] = this.valueOf().split(':');
	const [futureHours, futureMinutes] = futureTime.split(':');
	return ((Number(futureHours)  * 60) + Number(futureMinutes)) -
		(Number(currentHours * 60) + Number(currentMinutes));
};
