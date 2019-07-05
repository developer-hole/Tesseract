class Command {
	constructor(args = {}) {
		this.name = args.name || '';
		this.usage = args.usage || '';
		this.description = args.info || '';
		this.extendedHelp = args.longinfo || '';
		this.aliases = args.aliases || [];
		this.enabled = args.disablity || true;
		this.category = args.category || 'general';
	}

	get isCmd() {
		return true;
	}

	get extendedHelp() {
		return this.extendedHelp;
	}

	// eslint-disable-next-line no-unused-vars
	run(client, message, args) {}
}

module.exports = Command;
