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

const TOTITLECASE = /[A-Za-zÀ-ÖØ-öø-ÿ]\S*/g;

class Util {
	static isClass(input) {
		return (
			typeof input === 'function' &&
			typeof input.prototype === 'object' &&
			input.toString().substring(0, 5) === 'class'
		);
	}

	static toTitleCase(str) {
		return str.replace(
			TOTITLECASE,
			txt =>
				Util.titleCaseVariants[txt] ||
				txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
		);
	}
}

Util.titleCaseVariants = {
	textchannel: 'TextChannel',
	voicechannel: 'VoiceChannel',
	categorychannel: 'CategoryChannel',
	guildmember: 'GuildMember'
};

module.exports = Util;
