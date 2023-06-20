export class Program {

	constructor() {

	}

	#scopedStrIndex = 0;
	#scopedNumIndex = 0;
	#defStrIndex = 0;
	#defNumIndex = 0;
	scopedStrArr = 'scoped_str$';
	scopedNumArr = 'scoped_num';
	#defStrArr = 'def_str$';
	#defNumArr = 'def_num';
	#defs = {};
	statics = {
		defs: [],
		hoisted: []
	}
	funcs = {};


	registerDef(defName) {
		if (this.#defs[defName]) return this.#defs[defName];
		let def;
		if (defName.charAt(0) == '@') {
			def = `${this.#defStrArr}(${++this.#defStrIndex})`
		} else if (defName.charAt(0) == '%') {
			def = `${this.#defNumArr}(${++this.#defNumIndex})`
		}
		this.#defs[defName] = def;
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
AUTONUM
DECLARE STRING ${this.scopedStrArr}(${this.#scopedStrIndex})
DECLARE NUMERIC ${this.scopedNumArr}(${this.#scopedNumIndex})
DECLARE STRING ${this.#defStrArr}(${this.#defStrIndex})
DECLARE NUMERIC ${this.#defNumArr}(${this.#defNumIndex})
`
	}
	transpile() {
		for (const stat of [...this.statics.defs, ...this.statics.hoisted]) {
			stat.populateDefs();
			stat.populateFuncs();
			stat.byteString();
		}
		for (const func in this.funcs) {
			this.funcs[func].populateDefs();
			this.funcs[func].populateFuncs();
			this.funcs[func].populateVars();
			this.funcs[func].byteString();
		}
	}

	async write(wStream) {
		const wr = streamWriter(wStream);
		await wr(this.header);
		for (const stat of [...this.statics.defs, ...this.statics.hoisted]) {
			await wr(stat.writable)
		}
		await wr('GOTO MAIN\n');
		for (const func in this.funcs) {
			await wr(this.funcs[func].writable);
		}
	}
}

function streamWriter(wStream) {
	return function wr(data) {
		return new Promise((resolve) => {
			if (!wStream.write(data)) {
				wStream.once('drain', resolve);
			} else resolve()
		})
	}
}
