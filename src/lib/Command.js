// Copyright (C) 2019 developer-hole
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

class Command {
	constructor(client, file, args = {}) {
		this.name = args.name || file[-1].replace('.js', '');
		this.usage = args.usage || '';
		this.description = args.info || '';
		this.extendedHelp = args.extendedHelp || '';
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

	run() {
		throw new Error('The command is missing a run function.');
	}
}

module.exports = Command;
