import cfg from 'pixlbot/config.json' assert { type: 'json' };

import { EmbedBuilder } from 'discord.js';

/** @returns {EmbedBuilder} */
export function defaultEmbed()
{
    return new EmbedBuilder() .setColor(cfg.embedColor);
}

/**
 * @param {string} string1
 * @param {string} string2
 * @returns {number}
 */
export function levenshteinDistance(string1, string2)
{
	let v0 = new Array(string2.length + 1);
	let v1 = new Array(string2.length + 1);

	for (let i = 0; i < v0.length; ++i)
		v0[i] = 0;

	for (let i = 0; i < string1.length; ++i)
	{
		v1[0] = i + 1;

		for (let j = 0; j < string2.length; ++j)
		{
			const deletionCost = v0[j + 1] + 1;
			const insertionCost = v1[j] + 1;
			const substitutionCost = v0[j] + (string1[i] !== string2[j]);

			v1[j + 1] = Math.min(deletionCost, insertionCost, substitutionCost);
		}

		[v0, v1] = [v1, v0];
	}

	return v0[string2.length];
}

/**
 * @param {Command} command
 * @param {string[]} tokens
 * @returns {*[]}
 */
export function parseTokens(command, tokens)
{

}
