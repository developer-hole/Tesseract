const Event = require('../lib/structures/Event');
const {
	Permissions: { FLAGS }
} = require('discord.js');
const util = require('../lib/utils');
module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			name: 'message'
		});
		this.friendlyPerms = Object.keys(FLAGS).reduce((obj, key) => {
			obj[key] = util.toTitleCase(key.split('_').join(' '));
			return obj;
		}, {});
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

		if (
			!this.client.owners.includes(msg.author.id) &&
			command.userPerms.length
		) {
			const misssing = msg.channel
				.permissionsFor(msg.author)
				.missing(command.userPerms);
			if (misssing.length) {
				return msg.reply(
					`You are missing \`${misssing
						.map(p => this.friendlyPerms(p))
						.join(', ')}\` permissions.`
				);
			}
		}

		if (command.botPerms.length) {
			const misssing = msg.channel
				.permissionsFor(this.client.user)
				.missing(command.botPerms);
			if (misssing.length) {
				return msg.reply(
					`Bot is missing \`${misssing
						.map(p => this.friendlyPerms(p))
						.join(', ')}\` permissions.`
				);
			}
		}
		try {
			command.run(msg, args);
		} catch (error) {
			console.error(error);
			msg.reply('Something wrong happened.');
		}
	}
};
