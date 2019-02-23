import defaultArguments from '../../src/tasks/task1';

describe('Default Arguments: Task 1', () => {
	it('Should create default adder -- arrow function', () => {
		const add = (a, b) => a + b;
		const add4 = defaultArguments(add, { b: 4 });

		const result1 = add4(1, 2);
		result1.should.equal(3);

		const result2 = add4(6);
		result2.should.equal(10);

		const result3 = add4();
		result3.should.be.NaN();
	});

	it('Should create default adder -- full function declaration', () => {
		function add(arg1, arg2) {
			return arg1 + arg2;
		}

		const add4 = defaultArguments(add, { arg2: 4 });

		const result1 = add4('Hello,', ' world');
		result1.should.equal('Hello, world');

		const result2 = add4(6);
		result2.should.equal(10);

		const result3 = add4();
		result3.should.be.NaN();
	});

	it('Should create default with several parameters', () => {
		const factory = (v, w, x, y, z) => {
			return Object.assign({}, v, w, x, y, z);
		}

		const defaultFactory = defaultArguments(factory, { z: { a: 1 }, y: { b: 2 } });

		const obj = defaultFactory({ m: 4 }, { n: 7 }, { l: 9 });
		obj.should.have.property('a').equal(1);
		obj.should.have.property('b').equal(2);
		obj.should.have.property('m').equal(4);
		obj.should.have.property('n').equal(7);
		obj.should.have.property('l').equal(9);
	});
});

