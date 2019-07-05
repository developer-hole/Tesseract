// Copyright (C) 2019 <upcoming_org>
//
// This file is part of Server Setup.
//
// Server Setup is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Server Setup is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Server Setup.  If not, see <http://www.gnu.org/licenses/>.

const Discord = require('discord.js');
const { extname, join, relative, sep } = require('path');
const { isClass } = require('../utils');
const fs = require('fs-nextra');

class SetupClient extends Discord.Client {
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

		this.init();
	}

	async load(directory, file) {
		const loc = join(directory, ...file);
		try {
			const c = require(loc);
			if (!isClass(c)) {
				throw new TypeError(
					`[Load Error] At ${loc} - Exported file is not a class.`
				);
			}
			const command = new c();
			this.commands.set(c.split('.')[0], command);
			command.aliases.foreach(a => this.aliases.set(a, command));
		} catch (error) {
			console.error(error);
		}
	}

	async init() {
		this.load_commands();
		this.load_events();
	}

	async load_commands() {
		const files = await fs
			.scan(this.commandsDir, {
				filter: (stats, path) => stats.isFile() && extname(path) === '.js'
			})
			.catch(() => fs.ensureDir(this.commandsDir))
			.catch(e => console.error(e));
		if (!files) return true;

		return Promise.all(
			[...files.keys()].map(file =>
				this.load(__dirname, relative(__dirname, file).split(sep)))
		);
	}

	async load_events() {
		const files = await fs
			.scan(this.eventsDir, {
				filter: (stats, path) => stats.isFile() && extname(path) === '.js'
			})
			.catch(() => fs.ensureDir(this.eventsDir))
			.catch(e => console.error(e));
		if (!files) return true;

		return Promise.all(
			[...files.keys()].map(file =>
				this.load(__dirname, relative(__dirname, file).split(sep)))
		);
	}
}

module.exports = SetupClient;
