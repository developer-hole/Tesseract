const TesseractClient = require('./lib/structures/core/TesseractClient');

new TesseractClient({
	prefix: '-',
	eventsDir: './events',
	commandsDir: './commands',
	owners: []
}).login('TOKEN');
