import CommandHandler from './commandhandler.js';

import cfg from './config.json' assert { type: 'json' };

import {} from 'dotenv/config';

export const songQueue = new Map();

import { Client, Intents } from 'discord.js';
export const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

function UpdateStatus()
{
	client.user.setActivity(`${cfg.prefix}help`, {
		type: 'LISTENING'
	});
}

client.on('ready', () =>
{
	console.log(`Logged in as ${client.user.tag}`);
	UpdateStatus();
	const interval = 3600 * 1000;
	setInterval(UpdateStatus, interval);
});

client.on('messageCreate', CommandHandler);

client.login(process.env.TOKEN);
