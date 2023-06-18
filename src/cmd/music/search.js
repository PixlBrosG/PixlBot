import { BaseCommand } from 'pixlbot/main/basecommand.js';

import { bot } from 'pixlbot/main/index.js';
import { Video } from 'pixlbot/main/music.js';

import { video_basic_info } from 'play-dl';

import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";

/**
 * @typedef {import('discord.js').Message} Message
 * @typedef {import('discord.js').Interaction} Interaction
 */

export class Command extends BaseCommand
{
	description = 'Search for music';
	usage = '<query>';

	/**
	 * @param {Message} msg
	 * @param {string[]} args
	 * @returns {Promise<string>}
	 */
	async OnMessage(msg, args)
	{
		let voiceChannel = msg.member.voice.channel;
	
		if (!voiceChannel)
			return 'You need to be in a voice channel to execute this command';
		if (!args[0])
			return 'Please specify a query';

		const query = args.join(' ');
		
		let videos = await bot.musicPlayer.Find(query, 10);

		if (videos.length === 0)
			return `No videos found using the query '${query}'`;

		let options = []
		for (let i = 0; i < videos.length; i++)
		{
			options.push({
				label: videos[i].title,
				description: videos[i].url,
				value: `${i}`
			});
		}
		options.push({
			label: 'Cancel',
			description: 'Cancel the request',
			value: 'cancel'
		});

		const menu = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('search')
					.setPlaceholder('Nothing Selected')
					.addOptions(options)
			);

		await msg.channel.send({ content: `Search results for \`${query}\` [${videos.length}]`, components: [menu] });
	}

	/**
	 * @param {Interaction} interaction
	 */
	async OnInteract(interaction)
	{
		let voiceChannel = interaction.member.voice.channel;
	
		if (!voiceChannel)
			return 'You need to be in a voice channel to play this video';

		if (interaction.values[0] !== 'cancel')
		{
			const selectedOption = interaction.message.components[0].components[0].options.find(
				(option) => option.value === interaction.values[0]
			);
	
			let info = await video_basic_info(selectedOption.description);
			let video = new Video(info.video_details, interaction.user);
	
			bot.musicPlayer.Add(interaction.guild, video, voiceChannel, interaction.channel)
		}

		interaction.message.delete();
	}
}
