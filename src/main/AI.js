import { bot } from './index.js';

import { DefaultEmbed, LevenshteinDistance } from 'pixlbot/utils/utils.js';

import cfg from 'pixlbot/config.json' assert { type: 'json' };

import axios from 'axios';

/**
 * @typedef {import('discord.js').Message} Message
 */

export class AI
{
	/** @type {string} */ endpoint;
	/** @type {{ Authorization: string, Content-Type: string }} */ headers;

	/** @type {Map<string, Object>} */ data;
	/** @type {string[]} */ keywords;

	constructor()
	{
		this.endpoint = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';
//		this.endpoint = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';

		/** @type {import('axios').AxiosRequestHeaders} */
		this.headers = {
			'Authorization': `Bearer ${process.env.HUGGINGFACEAPIKEY}`,
			'Content-Type': 'application/json',
		};

		this.data = new Map();
		this.keywords = ['memget', 'stop'];
	}

	/**
	 * @param {Message} msg
	 */
	async OnMessage(msg)
	{
		const pingID = `<@${bot.client.user.id}>`;
		if (!msg.content.startsWith(pingID))
			return;

		const message = msg.content.substring(pingID.length).trim();
		if (message.length === 0)
			return;

		const tokens = message.split(' ');

		if (this.keywords.includes(tokens[0].toLowerCase()))
		{
			const embed = DefaultEmbed(msg.author);

			switch (tokens[0].toLowerCase())
			{
			case 'stop':
				this.data.delete(msg.author.id);
				embed.setDescription('Memory wiped...');
				break;
			case 'memget':
				if (this.data.has(msg.author.id))
					embed.setDescription(JSON.stringify(this.data.get(msg.author.id)));
				else
					embed.setDescription('No memory associated with you');
				break;
			}

			msg.reply({ embeds: [embed] });
			return;
		}

		let embed = DefaultEmbed(msg.author)
			.setAuthor({ name: message })
			.setTitle('Generating response...')
			.setDescription('Please be patient');
		const m = await msg.reply({ embeds: [embed] });
			
		const conversation = this.data.has(msg.author.id) ? this.data.get(msg.author.id) : {};

		try
		{
			var response = await this.RequestResponse(conversation, message);
		}
		catch (error)
		{
			bot.logger.error(`[AI] Error: ${error}`);
			embed = DefaultEmbed(msg.author).setTitle('An internal error occured')
				.setDescription(error.message);
			m.edit({ embeds: [embed] });
			return;
		}

		if (response.conversation.past_user_inputs.length > cfg.AI.messages_stored)
		{
			response.conversation.past_user_inputs.shift();
			response.conversation.generated_responses.shift();
		}

		this.data.set(msg.author.id, response.conversation);

		if (response.conversation.generated_responses.length > 1)
		{
			const previousMessage = response.conversation.generated_responses[response.conversation.generated_responses.length - 2];
			const levenshteinDistance = LevenshteinDistance(response.generated_text, previousMessage);
			const threshold = Math.max(response.generated_text.length, previousMessage.length) / 3;

			if (levenshteinDistance <= threshold)
			{
				var embed2 = DefaultEmbed(msg.author)
					.setTitle('Am i repeating myself?')
					.setDescription('My previous messages seem similar...\n' +
									'Just say `stop` (and remember to ping me!)\n' +
									'And i will clear my memory ;)');
			}
		}

		embed = DefaultEmbed(msg.author)
			.setDescription(response.generated_text);
		m.edit({ embeds: (embed2 ? [embed, embed2] : [embed]) });
	}

	/**
	 * @param {Object} conversation
	 * @param {string} message
	 * @returns {Object}
	 */
	async RequestResponse(conversation, message)
	{
		const seed = Math.floor(Math.random() * 1000000);

		const payload = {
			inputs: {
				past_user_inputs: conversation.past_user_inputs,
				generated_responses: conversation.generated_responses,
				text: `${message} [seed=${seed}]`
			},
			parameters: {
				temperature: cfg.AI.temperature,
				repetition_penalty: cfg.AI.repetition_penalty
			},
			options: {
				wait_for_model: true,
				use_cache: false
			}
		};

		const response = await axios.post(this.endpoint, payload, { headers: this.headers });
		const result = response.data;
		return result;
	}
}
