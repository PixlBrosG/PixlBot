import { fileURLToPath } from 'url';
import path from 'path';

import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { bot } from './index.js';

export class HTTPServer
{
	/** @type {express.Express} */ expressApp;
	/** @type {http.Server} */ httpServer;
	/** @type {WebSocket.Server} */ wsServer;

	/** @type {number} */ port;

	constructor()
	{
		this.port = 3000;

		this.expressApp = express();
		this.httpServer = http.createServer(this.expressApp);
		this.wsServer = new WebSocket.Server({ server: this.httpServer });

		const currentModuleUrl = import.meta.url;
		const currentModulePath = path.dirname(fileURLToPath(currentModuleUrl));
		const httpServerPath = path.join(currentModulePath, '../dashboard');

		this.expressApp.use(express.static(httpServerPath));
	}

	Setup()
	{
		this.httpServer.listen(this.port, () =>
		{
			bot.logger.info(`HTTP server is running at 'http://localhost:${this.port}'`);
		});

		this.wsServer.on('connection', ws =>
		{
			console.info('WebSocket client connected');

			const commands = [];
			for (const [name, command] of bot.loader.commands.entries())
			{
				commands.push({ name, category: command.category });
			}

			this.SendData('setup', { logs: bot.logger.logs, commands });

			ws.on('message', this.WebSocketHandler);
		
			ws.on('close', () =>
			{
				console.info('WebSocket client disconnected');
			});
		});
	}

	/**
	 * @param {WebSocket.WebSocket} webSocket
	 * @param {WebSocket.RawData} data
	 * @param {boolean} isBinary
	 */
	WebSocketHandler(stream)
	{
		const data = JSON.parse(stream);

		if (data.type === 'loader')
		{
			if (data.data.type === 'reload')
			{
				bot.loader.ReloadCommand(data.data.command);
			}
		}
	}

	/**
	 * @param {string} type
	 * @param {any} data
	 */
	SendData(type, data)
	{
		this.wsServer.clients.forEach(client =>
		{
			client.send(`{"type":"${type}","data":${JSON.stringify(data)}}`);
		});
	}
}
