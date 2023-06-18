import { bot } from 'pixlbot/main/index.js';

import { readdirSync } from 'fs';

import { performance } from 'perf_hooks';

/**
 * @typedef {import('pixlbot/main/basecommand.js').BaseCommand} BaseCommand
 */

export class Command
{
	/** @type {string} */ category;
	/** @type {string} */ description;
	/** @type {string} */ usage;
	/** @type {string} */ aliases;
	/** @type {string} */ permissions;
	/** @type {string} */ OnMessage;
	/** @type {string} */ OnInteract;

	/**
	 * @param {string} category
	 * @param {BaseCommand} command
	 */
	constructor(category, command)
	{
		this.category = category,
		this.description = command.description,
		this.usage = command.usage,
		this.aliases = command.aliases,
		this.permissions = command.permissions,
		this.OnMessage = command.OnMessage,
		this.OnInteract = command.OnInteract
	}
}

export class Loader
{
	/** @type {Map<string, Command>} */ commands;
	/** @type {Map<string, Command>} */ commandAliases;

	constructor()
	{
		this.commands = new Map();
		this.commandAliases = new Map();
	}

	/**
	 * @param {string} folder
	 * @param {string} file
	 */
	async LoadCommand(folder, file)
	{
		const startTime = performance.now();

		/** @type {BaseCommand} */
		const command = new (await import(`pixlbot/cmd/${folder}/${file}?v=${Date.now()}`)).Command();

		const commandName = file.substring(0, file.length - 3).toLowerCase();

		this.commands.set(commandName, new Command(folder, command));

		for (let alias of command.aliases)
		{
			if (this.commandAliases[alias] || this.commands[alias])
				bot.logger.warn(`[Loader] Alias conflict at '${alias}' - Loading ${commandName}`);
			this.commandAliases.set(alias, this.commands.get(commandName));
		}

		const endTime = performance.now();
		bot.logger.trace(`[Loader] Loaded file ${folder}/${file} in ${endTime - startTime} ms`);
	}

	LoadAll()
	{
		for (let folder of readdirSync('./src/cmd/'))
		{
			for (let file of readdirSync(`./src/cmd/${folder}/`).filter(file => file.endsWith('.js')))
			{
				this.LoadCommand(folder, file);
			}
		}
	}

	ReloadAll()
	{
		this.commands = {};
		this.commandAliases = {};
		bot.logger.info(`Reloading all commands`);
		this.LoadAll();
	}

	/**
	 * @param {string} commandName command name (not alias)
	 */
	ReloadCommand(commandName)
	{
		const category = this.commands.get(commandName).category;

		for (let alias of this.commands.get(commandName).aliases)
			this.commandAliases.delete(alias);
		this.commands.delete(commandName);

		bot.logger.info(`Reloading ${category}/${commandName}`);
		this.LoadCommand(category, `${commandName}.js`);
	}

	/**
	 * @param {string | null} category
	 * @returns {Map<string, string>}
	 */
	GetInfo(category)
	{
		if (category)
		{
			let data = {};
			for (let [commandName, command] of this.commands.entries())
			{
				if (command.category !== category)
					continue;

				const key = `${commandName} ${command.usage}`;
				let value = command.description;

				if (command.permissions.length > 0)
					value += `\nPermissions: \`${command.permissions.join(', ')}\``;
				if (command.aliases.length > 0)
					value += `\nPermissions: \`${command.aliases.join(', ')}\``;

				data[key] = value;
			}

			return data;
		}

		let data = {};

		for (let commandName of this.commands.keys())
		{
			const category = this.commands.get(commandName).category;
			if (!data[category])
				data[category] = `\`${commandName}\``;
			else
				data[category] += `, \`${commandName}\``;
		}

		return data;
	}

	/**
	 * @param {string} commandName command name or alias
	 */
	GetCommand(commandName)
	{
		if (this.commands.has(commandName))
			return this.commands.get(commandName);
		if (this.commandAliases.has(commandName))
			return this.commandAliases.get(commandName);
		return null;
	}
}
