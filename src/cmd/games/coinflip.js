export const description = 'Flip a coin';
export const usage = '';
export const aliases = ['cf'];
export const permissions = [];

import { RandInt } from '../../API.js';

export function execute()
{
    return `:coin: **${RandInt(2) ? 'Heads' : 'Tails'}**`;
}