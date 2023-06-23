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
	.option('w', {
		alias: 'watch',
		boolean: true,
		default: false,
		desc: 'Whether file updates should automatically trigger another transpile.'
	})
	.argv;
if (argv.w) {
	await new Workspace(argv).watch();
} else {
	await new Workspace(argv).run();
}
