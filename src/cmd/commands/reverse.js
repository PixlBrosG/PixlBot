import { BaseCommand } from 'pixlbot/main/basecommand.js';

export class Command extends BaseCommand
{
	description = 'Reverse some message';
	usage = '<message>';

	OnMessage(_msg, args)
	{
		if (args.length === 0)
			return 'esrever ot agessem a yficeps esaelP';

		return args.join(' ').split('').reverse().join('');
	}
}
