export class Program {

	constructor() {

	}

	#scopedStrIndex = 0;
	#scopedNumIndex = 0;
	defStrIndex = 0;
	#defNumIndex = 0;
	scopedStrArr = 'scoped_str$';
	scopedNumArr = 'scoped_num';
	defStrArr = 'def_str$';
	#defNumArr = 'def_num';
	#defs = {};
	i = 0;
	statics = {
		defs: [],
		hoisted: []
	}
	byteStrDefs = '';
	funcs = {};


	registerDef(defName) {
		if (this.#defs[defName]) return this.#defs[defName];
		let def;
		if (defName.charAt(0) == '%') {
			def = `${this.defStrArr}(${++this.defStrIndex})`
		} else if (defName.charAt(0) == '@') {
			def = `${this.#defNumArr}(${++this.#defNumIndex})`
		}
		this.#defs[defName] = def;
		return this.#defs[defName];
	}
	useDef(defName) {
		if (this.#defs[defName]) return this.#defs[defName];
		console.log(`Def ${defName} could not be found! Are you sure it exists?`);
		return 'UNRESOLVED_DEF';
	}
	registerScopedStr() {
		return ++this.#scopedStrIndex;
	}
	registerScopedNum() {
		return ++this.#scopedNumIndex;
	}
	registerFunction(func) {
		this.funcs[func.name] = func;
	}
	registerStatic(stat) {
		this.statics[stat.def ? 'defs' : 'hoisted'].push(stat);
	}
	get header() {
		return `
DECLARE STRING ${this.scopedStrArr}(${this.#scopedStrIndex})
DECLARE NUMERIC ${this.scopedNumArr}(${this.#scopedNumIndex})
DECLARE STRING ${this.defStrArr}(${this.defStrIndex})
DECLARE NUMERIC ${this.#defNumArr}(${this.#defNumIndex})
${this.byteStrDefs}
`.trimStart();
	}
	transpile() {
		for (const stat of [...this.statics.defs, ...this.statics.hoisted]) {
			stat.populateFuncs();
			stat.populateDefs();
			stat.byteString();
		}
		for (const func in this.funcs) {
			this.funcs[func].populateFuncs();
			this.funcs[func].populateDefs();
			this.funcs[func].populateVars();
			this.funcs[func].byteString();
		}
	}

	async write(wStream) {
		let out = this.header.replaceAll(/\r/g, '\n').replaceAll(/\n+/g, '\r\n');
		out = out.replace(/^(?=.+$)/gim, (defName) => {
			return `${++this.i * 10} `;
		});
		await wStream.write(out)
		for (const stat of [...this.statics.defs, ...this.statics.hoisted]) {
			out = stat.writable.replaceAll(/\r/g, '\n').replaceAll(/\n+/g, '\r\n');
			out = out.replace(/^(?=.+$)/gim, (defName) => {
				return `${++this.i * 10} `;
			});
			await wStream.write(out)
		}
		await wStream.write(`${++this.i} GOTO main\r\n`)
		for (const func in this.funcs) {
			out = this.funcs[func].writable.replaceAll(/\r/g, '\n').replaceAll(/\n+/g, '\r\n');
			out = out.replace(/^(?=.+$)/gim, (defName) => {
					return `${++this.i * 10} `;
			});
			await wStream.write(out)
		}
	}
}