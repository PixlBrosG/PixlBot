import { EventHandler } from 'pixlbot/core/eventhandler.js';
import { CommandLoader } from 'pixlbot/core/commandloader.js';
import { Logger } from 'pixlbot/core/logger.js';
import { PlaybackManager } from 'pixlbot/core/playbackmanager.js';
import { AIManager } from 'pixlbot/core/aimanager.js';
import { WebServer } from 'pixlbot/core/webserver.js';

import cfg from 'pixlbot/config.json' assert { type: 'json' };

import { Client, GatewayIntentBits, ActivityType, Events } from 'discord.js';

import {} from 'dotenv/config';

class Bot
{
	/** @type {Client} */ client;
	/** @type {WebServer} */ webServer;
	/** @type {EventHandler} */ eventHandler;
	/** @type {CommandLoader} */ commandLoader;
	/** @type {Logger} */ logger;
	/** @type {PlaybackManager} */ playbackManager;
	/** @type {AIManager} */ AIManager;

	constructor()
	{
		/** @type {number} */
		this.loadStartTime = performance.now();

		const intents = [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.MessageContent
		];

		this.client = new Client({ intents });
		this.webServer = new WebServer();
		this.eventHandler = new EventHandler();
		this.commandLoader = new CommandLoader();
		this.logger = new Logger();
		this.playbackManager = new PlaybackManager();
		this.AIManager = new AIManager();
	}

	registerEvents()
	{
		this.client.on(Events.MessageCreate, this.eventHandler.onMessage);
		this.client.on(Events.InteractionCreate, this.eventHandler.onInteract);

		this.client.on(Events.ClientReady, () =>
		{
			this.client.user.setActivity(`${cfg.prefix}help`, { type: ActivityType.Listening });

			this.logger.info(`Logged in as ${this.client.user.tag}`);
			this.logger.info(`Setup took ${performance.now() - this.loadStartTime} ms`);
			this.loadStartTime = null;
		});
	}

	setup()
	{
		this.registerEvents();
		this.webServer.setup();
		this.loader.loadAll();
	}

	/** @param {string} key */
	login(key)
	{
		this.client.login(key);
	}
}

export const bot = new Bot();

bot.setup()
bot.login(process.env.TOKEN);
