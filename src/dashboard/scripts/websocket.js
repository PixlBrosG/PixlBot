const socket = new WebSocket('ws://localhost:3000');

/**
 * @param {Event} event
 */
socket.onopen = event =>
{
	GenerateConsoleEntry({ level: 'info', message: 'WebSocket connection established.' });
};

/**
 * @param {MessageEvent} event
 */
socket.onmessage = event =>
{
	const message = JSON.parse(event.data);

	if (message.type === 'setup')
	{
		Setup(message.data);
		return;
	}

	if (message.type === 'log')
	{
		GenerateConsoleEntry(message.data);
		return;
	}

	GenerateConsoleEntry({ level: 'info', message: `Received data: ${event.data}` });
};

/**
 * @param {CloseEvent} event
 */
socket.onclose = event =>
{
	GenerateConsoleEntry({ level: 'info', message: 'WebSocket connection closed.' });
};

/**
 * @param {string} type
 * @param {Object} data
 */
function SendData(type, data)
{
	const stream = JSON.stringify({ type, data });
	socket.send(stream);
}

/**
 * @param {{ logs: { level: string, message: string }[], commands: { category: string, name: string }[] }} data
 */
function Setup(data)
{
	GenerateConsoleEntries(data.logs);
	GenerateCommandListEntries(data.commands);
}
