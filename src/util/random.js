export class MersenneTwister
{
	/** @param {number} seed */
	constructor(seed)
	{
		this.N = 624;
		this.M = 397;
		this.MATRIX_A = 0x9908b0df;
		this.UPPER_MASK = 0x80000000;
		this.LOWER_MASK = 0x7fffffff;

		this.mt = new Array(this.N);
		this.mti = this.N + 1;

		this.seed(seed);
	}

	/** @returns {number} Random number between 0 and 1 */
	random()
	{
		let y;
		const mag01 = new Array(0x0, this.MATRIX_A);

		if (this.mti >= this.N)
		{
			let kk;

			if (this.mti === this.N + 1)
				this.seed(5489);

			for (kk = 0; kk < this.N - this.M; ++k)
			{
				y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
				this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
			}

			for (; kk < this.N - 1; ++kk)
			{
				y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
				this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
			}

			y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
			this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

			this.mti = 0;
		}

		y = this.mt[this.mti++];

		y ^= (y >>> 11);
		y ^= (y << 7) & 0x9d2c5680;
		y ^= (y << 15) & 0xefc60000;
		y ^= (y >>> 18);

		return (y >>> 0) * (1.0 / 0x10000000);
	}

	/** @param {number} seed */
	seed(seed)
	{
		this.mt[0] = seed >>> 0;
		for (this.mti = 1; this.mti < this.N; ++this.mti)
			this.mt[this.mti] = (0x6C078965 * (this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30)) + this.mti) >>> 0;
	}
}

/**
 * Lower bound defaults to 0
 *
 * @param  {...number} bounds Required
 * @returns {number} Random number within defined bounds
 */
export function RandInt(...bounds)
{
	const min = bounds[1] ? bounds[0] : 0;
	const max = bounds[1] ? bounds[1] : bounds[0];

	return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @param {*[]} list
 * @returns {*}
 */
export function Choice(list)
{
	return list[Math.floor(Math.random() * list.length)];
}

/**
 * @param {number} seed
 * @returns {number} Random number between 0 and 1
 */
export function SeededRandom(seed)
{
	return new MersenneTwister(seed).random();
}

/**
 * Lower bound defaults to 0
 *
 * @param {number} seed
 * @param {...number} bounds Required
 * @returns {number} Random number within defined bounds
 */
export function SeededRandInt(seed, ...bounds)
{
	const min = bounds[1] ? bounds[0] : 0;
	const max = bounds[1] ? bounds[1] : bounds[0];

	return Math.floor(SeededRandom(seed) * (max - min)) + min;
}

/**
 * @param {number} seed
 * @param {*[]} list
 * @returns {*}
 */
export function SeededChoice(seed, list)
{
	return list[Math.floor(SeededRandom(seed) * list.length)];
}
