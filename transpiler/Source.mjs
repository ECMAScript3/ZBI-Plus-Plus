import { readFile } from 'node:fs/promises';
import { Func } from './Func.mjs';
import { Stat } from './Static.mjs';
export const kind = {
	init: Symbol('init'),
	loop: Symbol('loop'),
	recovery: Symbol('recovery'),
	func: Symbol('func')
}

export class Source {
	#path;
	#contents;
	#prog;
	#def;
	constructor(prog, path) {
		this.#prog = prog;
		this.#path = path;
		this.#def = true;
	}
	async load() {
		this.#contents = await readFile(this.#path, { encoding: 'utf8' });
		return;
	}
	extractFuncs() {
		const signaturePattern = /^(?:(?<ret>[\$~]?[\w\d]+)[ \t])?\^(?<name>[\w\d]+)\((?<args>[\s\S]*?)\)\s*{(?<body>[\s\S]*?)}/gim;
		const fnSigs = this.#contents.matchAll(signaturePattern);
		for (const fnSig of fnSigs) {
			const { groups: { ret, name, args, body } } = fnSig;
			this.#def = false;
			new Func(
				this.#prog,
				name.toLowerCase(),
				args ? args.split(/,\s*/gim) : [],
				ret,
				body
			);
		}
	}
	extractStatics() {
		const signaturePattern = /^(?:(?<ret>[\$~]?[\w\d]+)[ \t])?\^(?<name>[\w\d]+)\((?<args>[\s\S]*?)\)\s*{(?<body>[\s\S]*?)}/gim;
		new Stat(this.#prog, `${this.#contents.replace(signaturePattern, '')}\r\n`, this.#def);
	}
}

