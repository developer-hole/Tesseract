const Event = require('../lib/structures/Event');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			name: 'message'
		});
	}

	run(msg) {
		if (!msg.content.startsWith(this.client.prefix) || msg.author.bot) return;

		const args = msg.content
			.slice(this.client.prefix.length)
			.trim()
			.split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command =
			this.client.commands.get(commandName) ||
			this.client.commands.find(
				cmd => cmd.aliases && cmd.aliases.includes(commandName)
			);
		if (!command) return;
		if (command.ownerOnly && !this.client.owners.includes(msg.author.id)) {
			return msg.channel.send('This Command is owner only.');
		}

		try {
			command.run(msg, args);
		} catch (error) {
			console.error(error);
			msg.reply('Something wrong happened.');
		}
	}
};
