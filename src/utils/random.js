export function RandInt(...args)
{
	let min = args[1] ? args[0] : 0;
	let max = args[1] ? args[1] : args[0];

	return Math.floor(Math.random() * (max - min)) + min;
}

export function Choice(list)
{
	return list[Math.floor(Math.random() * list.length)];
}