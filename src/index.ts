import { readFileSync,  } from 'fs';
import { basename, extname } from 'path';
import { createFilter } from 'rollup-pluginutils';
import { Plugin } from 'rollup'

const defaultExtensions = [/\.jpg/, /\.jpeg/, /\.png/, /\.gif/, /\.svg/];

interface Options {
	extensions?: Array<string | RegExp>,
	include?: Array<string | RegExp> | string | RegExp | null,
	exclude?: Array<string | RegExp> | string | RegExp | null,
}

export default function image(options: Options = {}) : Plugin {
	const extensions = options.extensions || defaultExtensions;
	const filter = createFilter(options.include, options.exclude);

	return {
		name: 'image-file',
		load(id: string) {
			if ('string' !== typeof id || !filter(id)) {
				return null;
			}

			const ext = extname(id)
			if (!extensions.some(item => typeof item === 'string' ? (item === ext) : item.test(ext))) {
				return null
			}

			const referenceId = this.emitFile({
				type: 'asset',
				name: basename(id),
				source: readFileSync(id)
			});
			return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
		},
		resolveFileUrl ({ fileName, relativePath }) {
			if ('string' !== typeof fileName || !filter(fileName)) {
				return null;
			}

			return `require('${isRelativePath(relativePath) ? relativePath : `./${relativePath}`}')`
		},
	};
}

const matchRelativePath = /^\.\.?[/\\]/;

function isRelativePath(str: string) {
  return matchRelativePath.test(str);
}
