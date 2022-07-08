export const name = 'clear';
export const category = 'utility';
export const description = 'Clear messages from the current channel';
export const usage = '<amount>';
export const aliases = [];
export const permissions = ['MANAGE_MESSAGES'];

export async function execute(msg, args)
{
	await msg.delete();

	let amount = parseInt(args[0]);
	if (amount > 100)
		amount = 100;

	if (isNaN(amount))
		return 'Amount should be an integer';
	if (amount < 0)
		return 'Amount should not be less than 0';

	msg.channel.bulkDelete(amount, true);
}