import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'
import { Workspace } from './Workspace.mjs';

export const argv = yargs(hideBin(process.argv))
	.scriptName('ZBI++ Transpiler')
	.usage('$0 [args]')
	.option('out', {
		alias: 'o',
		string: true,
		normalize: true,
		default: 'out.zbi',
		normalize: true,
		desc: 'Output file path.'
	})
	.option('in', {
		alias: 'i',
		string: true,
		default: './',
		normalize: true,
		desc: 'Folder containing files to be processed.'
	})
	.option('index', {
		alias: ['main', 'm'],
		string: true,
		normalize: true,
		desc: 'File to be run at program start.'
	})
	.option('def', {
		alias: 'd',
		array: true,
		normalize: true,
		desc: 'File to setup global constant definitions at initialization.'
	})
	.option('w', {
		alias: 'watch',
		boolean: true,
		default: false,
		desc: 'Whether file updates should automatically trigger another transpile.'
	})
	.argv;
await new Workspace(argv).run();
