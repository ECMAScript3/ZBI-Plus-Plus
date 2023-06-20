import { readdir, watch, open } from 'node:fs/promises';
import { Program } from './Program.mjs';
import { Source } from './Source.mjs';
import path from 'node:path';
export class Workspace {
	#watch = false;
	#def = [];
	#sources = [];
	#prog;
	#outPath;
	#inPath;

	constructor(config) {
		this.#watch = config.w;
		this.#outPath = config.out;
		this.#inPath = config.in;
		this.#prog = new Program();
	}
	async run() {
		await this.findSources();
		await this.loadSources();
		for (const src of this.#sources) src.extractFuncs();
		for (const src of this.#sources) src.extractStatics();
		this.#prog.transpile();
		await this.write();
	}
	async findSources() {
		const files = await readdir(this.#inPath);
		for (const file of files) {
			if (/\.zbp$/gi.test(file)) {
				console.log(`Including ${file}`);
				this.#sources.push(new Source(this.#prog, path.join(this.#inPath, file)));
			} else {
				console.log(`Ignoring ${path.join(this.#inPath, file)}`);
			}
		}
	}
	async loadSources() {
		await Promise.all(this.#sources.map(src => src.load()));
	}
	async write() {
		let outFile;
		try {
			outFile = await open(this.#outPath, 'w');
			const wStream = outFile.createWriteStream();
			await this.#prog.write(wStream);
		} finally {
			await outFile.close();
		}
	}

}
