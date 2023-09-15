import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { bot } from 'pixlbot/main/index.js';

import { DefaultEmbed } from 'pixlbot/utils/utils.js';

import { writeFileSync } from 'fs';

import { createCanvas, Image } from 'canvas';

import axios from 'axios';

/**
 * @typedef {import('discord.js').Message} Message
 */

/** @type {import('axios').AxiosRequestConfig} */
const config = {
	headers: {
		'Authorization': `Bearer ${process.env.HUGGINGFACEAPIKEY}`,
		'Content-Type': 'application/json'
	},
	responseType: 'arraybuffer'
};

/** @type {string} URL */
const apiUrl = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1';

/**
 * @param {string} path
 * @param {ArrayBuffer} arraybuffer
 */
function GenerateImage(path, arraybuffer)
{
	const canvas = createCanvas(800, 600);
	const context = canvas.getContext('2d');

	const image = new Image();
	image.onload = () => {
		context.drawImage(image, 0, 0, canvas.width, canvas.height);
		const buffer = canvas.toBuffer('image/png');
		writeFileSync(path, buffer);
	};

	const imageBuffer = Buffer.from(arraybuffer, 'binary');
	image.src = `data:image/png;base64,${imageBuffer.toString('base64')}`;
}

export class Command extends BaseCommand
{
	description = 'Generate an image using AI';
	usage = '<img>';

	/**
	 * @param {Message} msg
	 * @param {string[]} args
	 */
	async OnMessage(msg, args)
	{
		const prompt = args.join(' ');

		let embed = DefaultEmbed(msg.author)
			.setAuthor({ name: prompt })
			.setTitle('Generating image...')
			.setDescription('Please be patient');

		const message = await msg.channel.send({ embeds: [embed] });

		const seed = Math.floor(Math.random() * 1000000);

		const requestBody = {
			inputs: `${prompt} [seed=${seed}]`,
			options: {
				diffusion_prompt: `${prompt} [seed=${seed}]`,
				wait_for_model: true
			}
		};

		bot.logger.trace(`Generating image with prompt '${prompt}' and seed '${seed}'`)

		let response;

		try
		{
			response = await axios.post(apiUrl, requestBody, config);
		}
		catch (error)
		{
			embed = DefaultEmbed(msg.author)
				.setTitle('Failed to generate image')
				.setDescription('Error has been automatically reported');
			message.edit({ embeds: [embed] });

			bot.logger.error(`Error generating image: ${error}`);
			return;
		}

		if (response.status === 200)
		{
			// Image generation successful
			const imagePath = `images/${prompt}+${Date.now()}.png`;
			GenerateImage(imagePath, response.data);

			embed = DefaultEmbed(msg.author)
				.setTitle(prompt)
				.setImage(`attachment://image.png`);

			message.edit({ embeds: [embed], files: [{ attachment: imagePath, name: 'image.png' }] });

			bot.logger.trace(`Image generated to '${imagePath}'`);
		}
		else
		{
			embed = DefaultEmbed(msg.author)
				.setTitle('Failed to generate image')
				.setDescription('Error has been automatically reported');
			message.edit({ embeds: [embed] });

			bot.logger.error(`Error generating image: ${response.data}`);
		}
	}
}
