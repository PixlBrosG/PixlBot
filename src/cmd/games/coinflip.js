import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { RandInt } from 'pixlbot/utils/random.js';

export class Command extends BaseCommand
{
	description = 'Flip a coin';
	aliases = ['cf'];

	OnMessage(_msg, _args)
	{
		return `:coin: **${RandInt(2) ? 'Heads' : 'Tails'}**`;
	}
}
