const getParameters = (func: Function): string[] => {
	return func
		.toString()
		.match(/\(([^)]*)\)/)[1]
		.split(',')
		.map(param => param.trim());
};

const validDefaults = (defaults: TDefaultArg) => {
	return typeof defaults === 'object' &&
	!Array.isArray(defaults);
};

export default (func: Function, defaults: TDefaultArg) => {
	if (!func) {
		throw new Error('Missing first argument: must be a function');
	}
	if (!validDefaults(defaults)) {
		return func;
	}
	const paramNames = getParameters(func);
	return function (...args) {
		const injectionArgs = paramNames.map((defaultValue, i) => args[i] || defaults[defaultValue]);
		return func(...injectionArgs);
	};
};
