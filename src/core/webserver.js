import { bot } from 'pixlbot/core/index.js';

import cfg from 'pixlbot/config.json' assert { type: 'json' };

import { fileURLToPath } from 'url';
import path from 'path';

import express from 'express';
import http from 'http';
import WebSocket from 'ws';

export class WebServer
{
	/** @type {express.Express} */ expressApp;
	/** @type {http.Server} */ httpServer;
	/** @type {WebSocket.Server} */ wsServer;

	constructor()
	{
		this.expressApp = express();
		this.httpServer = http.createServer(this.expressApp);
		this.wsServer = new WebSocket.Server({ server: this.httpServer });

		const moduleURL = import.meta.url;
		const modulePath = path.dirname(fileURLToPath(moduleURL));
		const httpServerPath = path.join(modulePath, '../dashboard');

		this.expressApp.use(express.static(httpServerPath));
	}

	async setup()
	{
		this.httpServer.listen(cfg.webServer.port, () =>
		{
			bot.logger.info(`HTTP server is running at 'http://localhost:${cfg.webServer.port}'`);
		});

		this.wsServer.on('connection', (ws, req) =>
		{
			const remote = `${req.socket.remoteAddress}:${req.socket.remotePort} (${req.socket.remoteFamily})`;
			console.info(`WebSocket client connected from ${remote}`);

			const commands = [];
			for (const command of bot.commandLoader.commands.values())
				commands.push(commands.meta);

			ws.send(`{"type":"setup","data:{"logs":${JSON.stringify(bot.logger.logs)},"commands":${JSON.stringify(commands)}}"}`);

			ws.on('message', this.webSocketHandler);

			ws.on('close', (code, reasonBuffer) =>
			{
				const reason = Buffer.from(reasonBuffer);
				console.info(`WebSocket client at ${remote} disconnected - ${code}: ${reason}`);
			});
		});
	}

	/**
	 * @param {WebSocket.WebSocket} webSocket
	 * @param {WebSocket.RawData} rawData
	 * @param {boolean} isBinary
	 */
	webSocketHandler(webSocket, rawData, isBinary)
	{
		/** @type {{ type: string, data: Object }} */
		const data = JSON.parse(rawData);

		if (data.type === 'commandLoader')
		{
			if (data.data.type === 'reload')
				bot.commandLoader.reloadCommand(data.data.command);
			else if (data.data.type === 'toggle')
				bot.commandLoader.toggleCommand(data.data.command);
		}
	}

	/**
	 * @param {string} type
	 * @param {*} data
	 */
	sendData(type, data)
	{
		this.wsServer.clients.forEach(client =>
		{
			client.send(`{"type":"${type}","data":${JSON.stringify(data)}}`);
		});
	}
}
