// Copyright (C) 2019 developer-hole
//
// This file is part of Tesseract.
//
// Tesseract is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Tesseract is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Tesseract.  If not, see <http://www.gnu.org/licenses/>.

const Discord = require('discord.js');
const { extname, join, relative, sep } = require('path');
const { isClass } = require('../../utils');
const fs = require('fs-nextra');

class TesseractClient extends Discord.Client {
	/**
	 * @typedef DatabaseOptions
	 * @property {string} [uri="mongodb://localhost:27017/"] MongoDB URI.
	 * @property {string} [name="setup_bot"] Name of the database.
	 */

	/**
	 * @typedef ClientOptions
	 * @property {DatabaseOptions} database Options for database.
	 * @property {string} commandsDir The directory of commands.
	 * @property {string} eventsDir The directory of events.
	 * @property {string} prefix The prefix of the bot.
	 * @property {string[]} owners The owners of the bot.
	 */

	/**
	 * Initialize the Client.
	 * @param  {ClientOptions} [options={}] - The options for new client.
	 */

	constructor(options = {}) {
		if (options.constructor !== Object) {
			throw new TypeError('The Clientoptions must be an Object.');
		}

		super(options);

		// Directory Stuff
		this.commandsDir = options.commandsDir || './commands';
		this.eventsDir = options.eventsDir || './events';

		// Command Stuff
		this.commands = new Discord.Collection();
		this.aliases = new Discord.Collection();

		// Events
		this.events = new Discord.Collection();

		// Database huh.
		this.database = {
			name:
				options.database && options.database.name
					? options.database.name
					: 'setup_bot',
			uri:
				options.database && options.database.uri
					? options.database.uri
					: 'mongodb://localhost:27017/'
		};

		// stuff
		this.prefix = options.prefix;
		this.owners = options.owners;

		// OP
		this.init();
	}

	async loadEvent(directory, file) {
		const loc = join(directory, ...file);
		try {
			const e = require(loc);
			if (!isClass(e)) {
				throw new TypeError(
					`[Event Load Error] At ${loc} - Exported file is not a class.`
				);
			}
			const event = new e(this, file);
			console.log(event.name);
			this.events.set(event.name, event);
			event.once
				? super.once(event.name, (...args) => event.run(...args))
				: super.on(event.name, (...args) => event.run(...args));
		} catch (error) {
			console.error(error);
		}
	}

	async loadCommand(directory, file) {
		const loc = join(directory, ...file);
		try {
			const c = require(loc);
			if (!isClass(c)) {
				throw new TypeError(
					`[Command Load Error] At ${loc} - Exported file is not a class.`
				);
			}
			const command = new c(this, file);
			this.commands.set(c.split('.')[0], command);
			command.aliases.forEach(a => this.aliases.set(a, command));
		} catch (error) {
			console.error(error);
		}
	}

	init() {
		this.loadCommands();
		this.loadEvents();
	}

	async loadCommands() {
		const files = await fs
			.scan(this.commandsDir, {
				filter: (stats, path) => stats.isFile() && extname(path) === '.js'
			})
			.catch(() => fs.ensureDir(this.commandsDir))
			.catch(e => console.error(e));
		if (!files) return true;

		return Promise.all(
			[...files.keys()].map(file =>
				this.loadCommand(__dirname, relative(__dirname, file).split(sep)))
		);
	}

	async loadEvents() {
		const files = await fs
			.scan(this.eventsDir, {
				filter: (stats, path) => stats.isFile() && extname(path) === '.js'
			})
			.catch(() => fs.ensureDir(this.eventsDir))
			.catch(e => console.error(e));
		if (!files) return true;

		return Promise.all(
			[...files.keys()].map(file =>
				this.loadEvent(__dirname, relative(__dirname, file).split(sep)))
		);
	}

	login(token) {
		return super.login(token);
	}
}

module.exports = TesseractClient;
