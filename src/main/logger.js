import { bot } from "./index.js";

export class Logger
{
	/** @type {{ level: string, message: string }[]} */ logs;

	constructor()
	{
		this.logs = [];
	}

	LogMessage(level, message)
	{
		this.logs.push({ level, message });
		bot.httpServer.SendData('log', { level, message });
	}

	/**
	 * @param {string} message
	 */
	trace(message)
	{
		this.LogMessage('trace', message);
		console.log(message);
	}

	/**
	 * @param {string} message
	 */
	info(message)
	{
		this.LogMessage('info', message);
		console.info(message);
	}

	/**
	 * @param {string} message
	 */
	warn(message)
	{
		this.LogMessage('warn', message);
		console.warn(message);
	}

	/**
	 * @param {string} message
	 */
	error(message)
	{
		this.LogMessage('error', message);
		console.error(message);
	}

	/**
	 * @param {string} message
	 */
	critical(message)
	{
		this.LogMessage('critical', message);
		console.error(message);
	}
}
