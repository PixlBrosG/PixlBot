import { MessageHandler } from 'pixlbot/main/handlers/messagehandler.js'
import { InteractionHandler } from 'pixlbot/main/handlers/interactionhandler.js';

import { Loader } from 'pixlbot/main/loader.js';
import { Logger } from 'pixlbot/main/logger.js';
import { MusicPlayer } from 'pixlbot/main/music.js';
import { AI } from 'pixlbot/main/AI.js';

import { HTTPServer } from 'pixlbot/main/httpserver.js';

import cfg from 'pixlbot/config.json' assert { type: 'json' };

import { Client, GatewayIntentBits, ActivityType, Events } from 'discord.js';

import { performance } from 'perf_hooks';

import {} from 'dotenv/config';

class Bot
{
	/** @type {Client} */ client;
	/** @type {HTTPServer} */ httpServer;

	/** @type {MessageHandler} */ messageHandler;
	/** @type {InteractionHandler} */ interactionHandler;

	/** @type {Loader} */ loader;
	/** @type {Logger} */ logger;
	/** @type {MusicPlayer} */ musicPlayer;
	/** @type {AI} */ AI;

	constructor()
	{
		/** @type {number} */
		this.startTime = performance.now();

		const intents = [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.MessageContent
		];

		this.client = new Client({ intents });
		this.httpServer = new HTTPServer();

		this.messageHandler = new MessageHandler();
		this.interactionHandler = new InteractionHandler();

		this.loader = new Loader();
		this.logger = new Logger();
		this.musicPlayer = new MusicPlayer();
		this.AI = new AI();
	}

	RegisterEvents()
	{
		this.client.on(Events.MessageCreate, this.messageHandler.OnMessage);
		this.client.on(Events.InteractionCreate, this.interactionHandler.OnInteract);

		this.client.on(Events.ClientReady, () =>
		{
			this.client.user.setActivity(`${cfg.prefix}help`, { type: ActivityType.Listening });

			this.logger.info(`Logged in as ${this.client.user.tag}`);
			this.logger.info(`Setup took ${performance.now() - this.startTime} ms`);
			this.startTime = null;
		});
	}

	Setup()
	{
		this.RegisterEvents();
		this.httpServer.Setup();
		this.loader.LoadAll();
	}

	/**
	 * @param {string} key
	 */
	Login(key)
	{
		this.client.login(key);
	}
}

export const bot = new Bot();

bot.Setup()
bot.Login(process.env.TOKEN);
