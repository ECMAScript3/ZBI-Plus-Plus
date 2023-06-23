export class Code {
	prog;
	body;
	constructor(prog, body) {
		this.prog = prog;
		this.body = body;
	}
	populateFuncs() {
		const signaturePattern = /^\s+(?:(?<ret>[\$#]?[\w\d]+)[ \t])?\^(?<name>[\w\d]+)\((?<args>[\s\S]*?)\)/gim;
		this.body = this.body.replace(signaturePattern, (...found) => {
			const groups = found[found.length - 1];
			const args = groups.args ? groups.args.split(/,\s*/gim) : [];
			return this.prog.funcs[groups.name.toLowerCase()].asGoSub(args, groups.ret);
		});
	}
	byteString() {
		this.body = this.body.replace(/<(?:[\da-f]{2}(\s+)?)+>/gi, (match) => {
			let strvar = `${this.prog.defStrArr}(${++this.prog.defStrIndex})`;
			let str = '';
			let i = 0;
			for (const a of match.match(/[\da-f]{2}/gi)) {
				if (i++ >= 7) {
					i = 0;
					str += `\r\nlet ${strvar} = ${strvar}`;
				}
				str += ` & CHR$(${parseInt(a, 16)})`
			}
			this.prog.byteStrDefs += `let ${strvar} = ${str.substring(3)}\r\n`;
			return strvar;
		})
	}
	get writable() {
		this.body = this.body.replaceAll(/\n+/gim, '\n');
		this.body = this.body.replaceAll(/[\t ]+/gim, ' ');
		this.body = this.body.replaceAll(/^\s+/gim, '');
		return this.body;
	}
}
