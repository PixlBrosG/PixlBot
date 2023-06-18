import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { LevenshteinDistance } from 'pixlbot/utils/utils.js';

export class Command extends BaseCommand
{
	description = 'Levenshtein Distance!';
	usage = '<word1> <word2>';

	OnMessage(_msg, args)
	{
		if (args.length !== 2)
			return 'Give me exactly 2 words!';

		return `Levenshtein Distance: ${LevenshteinDistance(args[0], args[1])}`;
	}
}
