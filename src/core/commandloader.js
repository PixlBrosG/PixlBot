import { bot } from 'pixlbot/core/index.js';

import cfg from 'pixlbot/config.json' assert { type: 'json' };
import commands from 'pixlbot/commands.json' assert { type: 'json' };

export class CommandMeta
{
	/** @type {string} */ category;
	/** @type {string} */ description;
	/** @type {string} */ usage;
	/** @type {string[]} */ aliases;
	/** @type {string[]} */ permissions;
	/** @type {boolean} */ enabled;

	/**
	 * @param {string} category
	 * @param {string} name
	 * @param {{
	 *		description?: string,
	 *		usage?: string,
	 *		aliases?: string[],
	 *		permissions?: string[],
	 *		enabled?: boolean
	 * }} meta
	 */
	constructor(category, name, meta)
	{
		const defaultMeta = cfg.commandLoader.defaultCommandMeta;

		this.category = category;
		this.name = name;
		
		if (cfg.commandLoader.requireExplicitConfig && (
			!meta.description || !meta.usage ||
			!meta.aliases || !meta.permissions ||
			meta.enabled === undefined))
			throw `'${meta.category}/${meta.name}' does not have explicit configuration`;

		this.description = meta.description || defaultMeta.description;
		this.usage = meta.usage || defaultMeta.usage;
		this.aliases = meta.aliases || defaultMeta.aliases;
		this.permissions = meta.permissions || defaultMeta.permissions;
		this.enabled = meta.enabled || defaultMeta.enabled;
	}
}

export class Command
{
	/** @type {CommandMeta} */ meta;
	/** @type {method()} */ onMessage;
	/** @type {method} */ onInteract;

	/**
	 * @param {CommandMeta} meta
	 * @param {{ onMessage?: method, onInteract?: method }} handlers
	 */
	constructor(meta, handlers)
	{
		this.meta = meta;

		if (cfg.commandLoader.requireMessageHandler && !handlers.onMessage)
			throw `Message handler missing in '${meta.category}/${meta.name}'`;

		if (cfg.commandLoader.requireInteractionHandler && !handlers.onInteract)
			throw `Interaction handler missing in '${meta.category}/${meta.name}'`

		this.onMessage = handlers.onMessage || ((..._args) => {});
		this.onInteract = handlers.onInteract || ((...args) => {});
	}
}

export class CommandLoader
{
	/** @type {Map<string, Command>} */ commands;
	/** @type {Map<string, Command>} */ commandAliases;

	constructor()
	{
		this.commands = new Map();
		this.commandAliases = new Map();
	}

	/**
	 * @param {string} category
	 * @param {string} name
	 */
	async loadCommand(category, name)
	{
		const startTime = performance.now();

		const meta = new CommandMeta(category, name, commands[category][name]);
		const handlers = await import(`pixlbot/commands/${category}/${name}.js?v=${Date.now()}`);
		const command = new Command(meta, handlers);

		this.commands.set(name, command);

		for (let alias of command.meta.aliases)
		{
			if ((this.commandAliases[alias] || this.commands[alias]) && cfg.commandLoader.notifyConflicts)
				bot.logger.warn(bot.logger.tag.COMMAND_LOADER, `Alias conflict at '${alias}'`);
			this.commandAliases[alias] = this.commands.get(name);
		}

		const endTime = performance.now();
		bot.logger.trace(bot.logger.tag.COMMAND_LOADER, `Loaded '${category}/${name}' in ${endTime - startTime} ms`);
	}

	loadAll()
	{
		for (let [category, commandList] of Object.entries(commands))
		{
			for (let command of Object.keys(commandList))
			{
				this.loadCommand(category, command);
			}
		}
	}

	/** @param {string} name */
	async reloadCommand(name)
	{
		
	}
}
