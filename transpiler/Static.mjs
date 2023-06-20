import { Code } from './Code.mjs';

export class Stat extends Code {
	def;
	constructor(prog, body, def) {
		super(prog, body);
		this.def = def;
		this.prog.registerStatic(this);
	}
	populateDefs() {
		this.body = this.body.replace(/[@%][\w\d]+/gi, (defName) => {
			return this.prog.registerDef(defName);
		});
	}
}
