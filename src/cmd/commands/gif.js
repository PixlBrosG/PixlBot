import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { Choice } from 'pixlbot/utils/random.js';

import axios from 'axios';

import {} from 'dotenv/config';

export class Command extends BaseCommand
{
	description = 'Send a GIF!';
	usage = '[<query>]';

	async OnMessage(msg, args)
	{
		const query = args.length === 0 ? '' : `q=${args.join('%20')}&`;
		const url = `https://g.tenor.com/v1/search?${query}key=${process.env.TENORAPIKEY}`;

		const results = (await axios.get(url)).data.results;

		if (results.length !== 0)
			msg.channel.send({ content: Choice(results).url });
		else
			return `${args.join(' ')} doesn't exist`;
	}
}
