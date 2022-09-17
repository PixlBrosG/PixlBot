export const description = 'Lecenshtein Distance!';
export const usage = '<word1> <word2>';
export const aliases = [];
export const permissions = [];

import { Embed, LevenshteinDistance } from '../../API.js';

export function execute(_, args)
{
	if (args.length !== 2)
		return 'Give me exactly 2 words!';

	return `Levenshtein Distance: ${LevenshteinDistance(args[0], args[1])}`;
}