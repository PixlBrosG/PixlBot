/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').Interaction} Interaction
 * @typedef {import('discord.js').PermissionsBitField} PermissionsBitField
 */

export class BaseCommand
{
	description = '';
	usage = '';
	/** @type {string[]} */
	aliases = [];
	/** @type {PermissionsBitField[]} */
	permissions = [];

	/**
	 * @param {Message} _msg
	 * @param {string[]} _args
	 * @returns {string | void | Promise<string | void>}
	 */
	OnMessage(_msg, _args) {}

	/**
	 * @param {Interaction} _interaction
	 * @returns {void | Promise<void>}
	 */
	OnInteract(_interaction) {}
}
