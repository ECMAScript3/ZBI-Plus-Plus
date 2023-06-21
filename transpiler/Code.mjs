export class Code {
	prog;
	body;
	constructor(prog, body) {
		this.prog = prog;
		this.body = body;
	}
	populateFuncs() {
		const signaturePattern = /^(?:(?<ret>[\$#]?[\w\d]+\$?)[ \t])?\^(?<name>[\w\d]+)\((?<args>.+)?\)/gim
		this.body = this.body.replace(signaturePattern, (...found) => {
			const groups = found[found.length - 1];
			const args = groups.args ? groups.args.split(/,\s*/gim) : [];
			return this.prog.funcs[groups.name.toLowerCase()].asGoSub(args, groups.ret);
		});
	}
	byteString() {
		this.body = this.body.replace(/<(?:[\da-f]{2}\s?)+>/gi, (match) => {
			const str = '';
			for (a of match.match(/[\da-f]{2}/gi)) {
				`CHR$(${parseInt(a, 16)}) & `
			}
			return str.substring(0, str.length - 3);
		})
	}
	get writable() {
		this.body = this.body.replaceAll(/\n+/gim, '\n');
		this.body = this.body.replaceAll(/[\t ]+/gim, ' ');
		this.body = this.body.replaceAll(/^\s+/gim, '');
		return this.body;
	}
}
