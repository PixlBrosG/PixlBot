import cfg from 'pixlbot/config.json' assert { type: 'json' };

import { EmbedBuilder } from 'discord.js';

/**
 * @typedef {import('discord.js').User} User
 */

/**
 * @param {User | { tag: string, iconURL: string }} user
 * @returns {EmbedBuilder}
 */
export function DefaultEmbed(user)
{
	let embed = new EmbedBuilder().setColor(cfg.embedColor);

	return embed.setFooter({
		text: `Requested by ${user.tag}`,
		iconURL: user.iconURL ? user.iconURL : user.displayAvatarURL()
	});
}

/**
 * @param {string} s
 * @param {string} t
 * @returns {number}
 */
export function LevenshteinDistance(s, t)
{
	let v0 = new Array(t.length + 1);
	let v1 = new Array(t.length + 1);

	for (let i = 0; i < v0.length; ++i)
		v0[i] = i;

	for (let i = 0; i < s.length; ++i)
	{
		v1[0] = i + 1;

		for (let j = 0; j < t.length; ++j)
		{
			const deletionCost = v0[j + 1] + 1;
			const insertionCost = v1[j] + 1;
			const substitutionCost = v0[j] + (s[i] !== t[j]);

			v1[j + 1] = Math.min(deletionCost, insertionCost, substitutionCost);
		}

		[v0, v1] = [v1, v0];
	}

	return v0[t.length];
}
