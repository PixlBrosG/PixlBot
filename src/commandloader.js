import { readdirSync } from 'fs';

import { performance } from 'perf_hooks';

import cfg from './config.json' assert { type: 'json' };

export const cmdInfo = { list: {}, data: {} };
export const cmdExe  = {};

async function loadCommand(folder, file)
{
	const startTime = performance.now();

	const cmd = await import(`pixlbot/src/cmd/${folder}/${file}`);
	const name = file.substring(0, file.length - 3);

	// For help.js

	if (folder != 'hidden')
	{
		if (cmdInfo.list[folder] !== '') cmdInfo.list[folder] += ', ';
		cmdInfo.list[folder] += `\`${name}\``;
	
		cmdInfo.data[folder][`${cfg.prefix}${name} ${cmd.usage}`] = cmd.description +
			(cmd.permissions.length > 0 ? `\nPermissions: \`${cmd.permissions.join(', ')}\`` : '') +
			(cmd.aliases.length > 0 ? `\nAliases: \`${cmd.aliases.join(', ')}\`` : '');
	}

	// For command handler

	cmdExe[name] = {
		cmd: cmd.execute,
		permissions: cmd.permissions,
		aliases: cmd.aliases
	};

	const time = performance.now() - startTime;
	console.info(`Loaded [${folder}] ${file} in ${time} ms`);
}

for (let folder of readdirSync('./src/cmd/'))
{
	if (folder !== 'hidden')
	{
		cmdInfo.data[folder] = {};
		cmdInfo.list[folder] = '';
	}

	for (let file of readdirSync(`./src/cmd/${folder}/`).filter(file => file.endsWith('.js')))
	{
		loadCommand(folder, file);
	}
}
