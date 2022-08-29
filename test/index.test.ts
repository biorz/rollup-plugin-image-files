import RollupPluginsImages from '../src';
import { rollup } from 'rollup'

const build = async (inputOptions, outputOptions) => {
	const bundle = await rollup({
		input: inputOptions,
		plugins: [
			RollupPluginsImages()
		]
	})
	const generate = await bundle.generate({ dir: outputOptions })
	return generate
}

describe('image-plugin', () => {
  test('simple', async () => {
		expect(await build('test/index', 'test/output/simple')).toMatchSnapshot()
  })

	test('deep path', async () => {
		expect(await build('test/index', 'test/output/deep')).toMatchSnapshot()
  })

	test('named path', async () => {
		expect(await build({
			"named/path": 'test/index'
		}, 'test/output/named')).toMatchSnapshot()
  })

	test('multi input', async () => {
		expect(await build({
			"named/path": 'test/index',
			"named/path2": 'test/index2',
		}, 'test/output/multi')).toMatchSnapshot()
  })
})
