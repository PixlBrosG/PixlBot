import cfg from './config.json' assert { type: 'json' };

import { Embed, LevenshteinDistance } from './API.js';

import {} from 'dotenv/config';

const id = '<@744015666029396028>';
const keywords = ['stop'];

const data = new Map();

async function requestResponse(inputs)
{
	const options = {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.HUGGINGFACEAPIKEY}`
		},
		body: JSON.stringify({
			inputs,
			parameters: {
				temperature: cfg.AI.temperature,
				repetition_penalty: cfg.AI.repetition_penalty
			},
			options: {
				wait_for_model: true
			}
		})
	};

	const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-large", options);
	return await response.json()
}

export default async(msg) =>
{
	if (!msg.content.startsWith(id)) return;

	let tokens = msg.content.substring(id.length).trim();

	if (cfg.logMessages)
		console.info(`${msg.author.tag} > ${msg.content}`);

	if (keywords.includes(tokens))
	{
		const embed = Embed(msg.author);

		switch (tokens)
		{
		case 'stop':
			data.delete(msg.author.id);
			embed.setDescription('Memory wiped...');
		}

		msg.channel.send({ embeds: [embed] });
		return;
	}

	const embed = Embed(msg.author).setDescription('Generating response...\nPlease be patient');
	const m = await msg.channel.send({ embeds: [embed] });

	let inputs = data.has(msg.author.id) ? data.get(msg.author.id) : {};
	inputs.text = tokens;

	const response = await requestResponse(inputs);

	if (response.generated_text !== 'I\'m not sure what you mean.')
	{
		if (response.conversation.past_user_inputs.length > cfg.AI.messages_stored)
		{
			response.conversation.past_user_inputs.shift();
			response.conversation.generated_responses.shift();
		}

		data.set(msg.author.id, response.conversation);
	}

	const prevMessage = response.conversation.generated_responses[response.conversation.generated_responses.length - 2];

	if (prevMessage)
	{
		const levenshteinDistance = LevenshteinDistance(response.generated_text, prevMessage);
		const threshold =  Math.max(response.generated_text.length, prevMessage.length) / 3;

		if (levenshteinDistance <= threshold)
		{
			var embed2 = Embed(msg.author)
				.setTitle('Am i repeating myself?')
				.setDescription('My previous messages seem similar...\n' +
								'Just say `stop` (and remember to ping me!)\n' +
								'And i will clear my memory ;)');
		}
	}

	embed.setDescription(response.generated_text);
	m.edit({ embeds: (embed2 ? [embed, embed2] : [embed]) });
}
