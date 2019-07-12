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

class Command {
	constructor(client, file, options = {}) {
		this.name = options.name || file[-1].replace('.js', '');
		this.usage = options.usage || '';
		this.description = options.description || '';
		this.extendedHelp = options.extendedHelp || '';
		this.aliases = options.aliases || [];
		this.enabled = options.enabled || true;
		this.category = options.category || 'general';
		this.userPerms = options.userPerms || [];
		this.botPerms = ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY'];
		typeof options.botPerms == Array
			? options.botPerms.array.forEach(p => this.botPerms.push(p))
			: null;
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
