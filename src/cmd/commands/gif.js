export const description = 'Send a GIF!';
export const usage = '[<query>]';
export const aliases = [];
export const permissions = [];

import {} from 'dotenv/config';
import fetch from 'node-fetch';

import { RandInt } from '../../API.js';

export async function execute(msg, args)
{
	let url = `https://g.tenor.com/v1/search?q=${args.join('%20')}&key=${process.env.TENORAPIKEY}`;
	let result = (await (await fetch(url)).json()).results;
	result = result[RandInt(result.length)].url;

	msg.channel.send({ content: result });
}