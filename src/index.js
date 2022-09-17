import CommandHandler from './commandhandler.js';

import cfg from './config.json' assert { type: 'json' };

import {} from 'dotenv/config';

import {} from './commandloader.js';

export const songQueue = new Map();

import { Client, GatewayIntentBits, ActivityType, Events } from 'discord.js';

const intents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.MessageContent
];

export const client = new Client({ intents });

client.on(Events.ClientReady, () =>
{
	console.info(`Logged in as ${client.user.tag}`);
	
	client.user.setActivity(`${cfg.prefix}help`, { type: ActivityType.Listening });
});

client.on(Events.MessageCreate, CommandHandler);

client.login(process.env.TOKEN);
