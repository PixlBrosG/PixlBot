export const name = 'reverse';
export const category = 'commands';
export const description = 'Reverse some message';
export const usage = '<message>';
export const aliases = [];
export const permissions = [];

export function execute(_, args)
{
	if (args.length == 0)
		return 'esrever ot agassem a yficeps esaelP';

	return args.reverse().join(' ');
}
