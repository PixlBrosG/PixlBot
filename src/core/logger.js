import { bot } from 'pixlbot/core/index.js';

class LogEntry
{
	/** @type {string} */ level;
	/** @type {string} */ tag;
	/** @type {string} */ message;
	/** @type {number} */ timestamp;

	/**
	 * @param {string} level
	 * @param {string} tag
	 * @param {string} message
	 */
	constructor(level, tag, message)
	{
		this.level = level;
		this.tag = tag;
		this.message = message;
		this.timestamp = Date.now();
	}
}

export class Logger
{
	/** @type {LogEntry[]} */ logs;

	constructor()
	{
		this.logs = [];
	}

	/**
	 * @param {string} level
	 * @param {string} tag
	 * @param {string} message
	 */
	logMessage(level, tag, message)
	{
		this.logs.push(new LogEntry(level, tag, message));
		bot.webServer.sendData('log', this.logs.lastItem)
	}

	/**
	 * @param {string} tag
	 * @param {string} message
	 */
	trace(tag, message)
	{
		this.logMessage('trace', tag, message);
		console.log(message);
	}

	/**
	* @param {string} tag
	* @param {string} message
	*/
	info(tag, message)
	{
		this.logMessage('info', tag, message);
		console.info(message);
	}

	/**
	* @param {string} tag
	* @param {string} message
	*/
	warn(tag, message)
	{
		this.logMessage('warn', tag, message);
		console.warn(message);
	}

	/**
	* @param {string} tag
	* @param {string} message
	*/
	error(tag, message)
	{
		this.logMessage('error', tag, message);
		console.error(message);
	}

	/**
	* @param {string} tag
	* @param {string} message
	*/
	critical(tag, message)
	{
		this.logMessage('critical', tag, message);
		console.critical(message);
	}
}
