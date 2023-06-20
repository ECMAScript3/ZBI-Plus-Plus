import { Code } from './Code.mjs';
export class Func extends Code {
	name;
	inVars = [];
	retVar;
	scope = {};
	constructor(prog, name, inVars, retVar, body) {
		super(prog, body);
		this.name = name;
		this.retVar = this.addVar(retVar);
		for (const v of inVars) {
			this.inVars.push(this.addVar(v));
		}
		this.prog.registerFunction(this);
		this.body = `${this.asSub}\n${this.body.trim()}\n`;
	}
	addVar(varName) {
		if (varName.charAt(0) == '#') {
			this.scope[varName] = `${this.prog.scopedNumArr}(${this.prog.registerScopedNum()})`
		} else if (varName.charAt(0) == '$') {
			this.scope[varName] = `${this.prog.scopedStrArr}(${this.prog.registerScopedStr()})`
		}
		return this.scope[varName];
	}
	useVar(varName) {
		if (this.scope[varName]) {
			return this.scope[varName];
		} else {
			return this.addVar(varName);
		}
	}
	populateVars() {
		this.body = this.body.replace(/[\$#]\w[\w\d]*/gi, (varName) => {
			return this.useVar(varName);
		});
	}
	asGoSub(args, ret) {
		let callStr = '';
		for (let i = 0; i < args.length; i++) {

			if (!this.inVars[i]) console.log(`Argument count mismatch!\t${ret ? ret : 'Void'} ${this.name}(${args.join(', ')}) does not match ${ret ? ret : 'Void'} ${this.name}(${this.inVars.join(', ')})`)

			callStr += `LET ${this.inVars[i]} = ${args[i]}\n`;
		}
		callStr += `GOSUB ${this.name}\n`
		if (ret) {
			callStr += `LET ${ret} = ${this.retVar}\n`
		}
		return callStr.trimEnd();
	}
	get asSub() {
		return `SUB ${this.name}`
	}
	populateDefs() {
		this.body = this.body.replace(/[@%][\w\d]+/gi, (defName) => {
			return this.prog.useDef(defName);
		});
	}

}
