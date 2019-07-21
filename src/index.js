// Examples

// This is only for tests of the typings..

// Client file
const TesseractClient = require('./lib/structures/TesseractClient');

new TesseractClient({
	prefix: '',
	eventsDir: '',
	commandsDir: '',
	owners: [],
	database: { name: '', uri: '' }
}).login();

// Command File

const Command = require('./lib/structures/Command');

class command extends Command {
	constructor(...args) {
		super(...args, {
			name: ''

		});
	}
}

module.exports = command;

// Event file

const Event = require('./lib/structures/Event');

class event extends Event {
	constructor(...args) {
		super(...args, {
			enabled: true,
			once: false
		});
	}
}

module.export = event;
