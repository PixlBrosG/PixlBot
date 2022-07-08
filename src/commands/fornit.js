export const name = 'fortnit';
export const category = 'commands';
export const description = 'Fortnit';
export const usage = '<players>';
export const aliases = [];
export const permissions = [];

import { Embed, Choice } from '../API.js';

export function execute(msg, args)
{
	if (args.length == 0)
		return 'Must be at least 1 player';

	let rarities = ['Grå', 'Grønn', 'Blå', 'Epic', 'Legendary', 'idk'];

	let weapons = ['Sniper', 'AR', 'Pistol', 'Shotgun', 'SMG', 'idk']

	let locations = ['Logjam Lotus', 'Rave Cave', 'Reality Falls', 'Greasy Grove',
					 'Sleepy Sound', 'Shifty Shafts', 'Coney Crossroads', 'Tilted Towers',
					 'The Daily Bugle', 'Sanctuary', 'The Joneses', 'Rocky Reels',
					 'Synapse Station', 'Chonkers Speedway', 'Condo Canyon (Kaktus)']

	let embed = Embed(msg.author);

	let rarity =  [];
	let weapon =  [];
	let location = [];
	
	for (let _ in args)
	{
		rarity.push(Choice(rarities));
		weapon.push(Choice(weapons));
		location.push(Choice(locations));
	}

	embed.setTitle(Choice(locations));

	embed.addField('Players', args.join('\n'));
	embed.addField('Rarity', rarity.join('\n'), true);
	embed.addField('Weapon', weapon.join('\n'), true);
	embed.addField('Location', location.join('\n'), true);

	msg.channel.send({embeds: [embed]});
}