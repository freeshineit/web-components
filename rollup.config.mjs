import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import swc from '@rollup/plugin-swc'
import { babel } from '@rollup/plugin-babel'
import serve from 'rollup-plugin-serve'
import { dts } from 'rollup-plugin-dts'
import eslint from '@rollup/plugin-eslint'
import alias from '@rollup/plugin-alias'
import strip from '@rollup/plugin-strip'
import replace from '@rollup/plugin-replace'
import dayjs from 'dayjs'
import postcss from 'rollup-plugin-postcss'
import copy from 'rollup-plugin-copy'
import autoprefixer from 'autoprefixer'
import { resolve } from 'node:path'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
// import { injectCssRequire } from './plugins/injectCssRequire.mjs'

const isDev = process.env.NODE_ENV !== 'production'

/**
 * @description rollup config function
 * @param {object} pkg package.json
 * @param {string} pkg.name name
 * @param {string=} pkg.main main
 * @param {version=} pkg.version string
 * @param {string=} pkg.author author
 * @param {object=} pkg.dependencies dependencies
 * @param {("tsc" | "swc")=} pkg.compiler compiler
 * @param {port=} pkg.port port
 * @param {Array} configs config[]
 * @returns
 */
function generateConfig(pkg, configs) {
  // prettier-ignore
  const banner = `/**
 * ${pkg.description}
 * 
 * ${pkg.name} v${pkg.version}
 * Copyright (c) ${dayjs().format("YYYY-MM-DD")} ${pkg.author}
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */`;

  const input = 'src/index.ts'
  const cssInput = 'src/style/css.ts' // 这个路径是约定路径，请勿随意修改

  const externals = Object.keys(pkg?.dependencies || {})

  const hasUmd = fs.existsSync('src/main.ts') // 是否存在 UMD 入口文件
  const hasStyle = fs.existsSync(cssInput) // 是否存在样式入口文件

  const defaultConfigs = [
    hasUmd
      ? {
          input: 'src/main.ts',
          output: [
            {
              file: 'dist/index.umd.js',
              format: 'umd',
              name: 'Picker',
              sourcemap: isDev,
              banner,
            },
          ],
        }
      : null,
    {
      input,
      output: [
        {
          file: 'dist/index.js',
          format: 'cjs',
          // https://www.rollupjs.com/configuration-options/#output-exports
          // exports: 'named',
          sourcemap: isDev,
          banner,
        },
      ],
    },
    {
      input,
      output: [
        {
          exports: 'named',
          file: 'dist/index.mjs',
          format: 'esm',
          sourcemap: isDev,
          banner,
        },
      ],
    },
    hasStyle
      ? {
          input: 'src/style/css.ts',
          output: [
            {
              file: 'dist/style/css.js',
              format: 'cjs',
              // https://www.rollupjs.com/configuration-options/#output-exports
              // exports: 'named',
              sourcemap: isDev,
              banner,
            },
          ],
        }
      : null,
  ].filter(Boolean)

  return [
    ...defaultConfigs.map(entry => ({
      ...entry,
      external: entry.output[0].format === 'umd' ? [] : [...externals],
      plugins: [
        // eslint({
        //   throwOnError: true, // lint 结果有错误将会抛出异常
        //   // throwOnWarning: true,
        //   include: [
        //     'src/**/*.ts',
        //     'src/**/*.js',
        //     'src/**/*.mjs',
        //     'src/**/*.jsx',
        //     'src/**/*.tsx',
        //   ],
        //   exclude: ['node_modules/**', '**/__tests__/**'],
        // }),
        // 需要和 tsconfig.json 配置 paths 一致
        alias({
          entries: [
            {
              find: /^@\/(.*)/,
              replacement: resolve(process.cwd(), 'src/$1'),
            },
          ],
        }),
        swc({
          // https://swc.rs/docs/configuration/swcrc
          swc: {
            jsc: {
              target: 'es5',
            },
          },
          include: ['./src/**/*.{ts,js,mjs,tsx,jsx}'],
        }),
        nodeResolve({
          extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.json'],
        }),
        commonjs({
          extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.json'],
        }),
        babel({
          babelHelpers: 'bundled',
          // 如果只需要编译项目源码，使用 exclude 默认的 node_modules 排除：
          exclude: /node_modules/,
          extensions: ['.js', '.mjs', '.jsx', '.ts', '.tsx'],
          // 若需转译特定的 node_modules 包，改用 include 或用 exclude 的否定正则：
          // include: ['src/**', 'node_modules/some-esm-package/**'],
        }),
        replace({
          __VERSION__: `${pkg.version}`,
          preventAssignment: true,
        }),
        postcss({
          plugins: [autoprefixer()],
          sourceMap: isDev,
          extract: true,
          // minimize: !isDev,
          use: [
            [
              'sass',
              {
                silenceDeprecations: ['legacy-js-api'],
              },
            ],
          ],
          include: ['/**/*.scss', '/**/*.sass'],
          includePaths: ['style/', 'node_modules/'],
          // 处理从 node_modules 导入
          importer(path) {
            return { file: path[0] === '~' ? path.substr(1) : path }
          },
        }),
        entry.input === cssInput
          ? copy({
              copyOnce: true,
              targets: [
                { src: 'src/style/**/*.scss', dest: 'dist/style' },
                {
                  src: 'src/style/css.ts',
                  dest: 'dist/style',
                  rename: 'index.js',
                },
              ],
            })
          : null,
        // css.ts. => css.js 注入内容（require("./css.css");）
        // entry.input === cssInput ? injectCssRequire() : null,
        !isDev
          ? strip({
              include: '**/*.(mjs|js|ts|jsx|tsx)',
              debugger: true,
              functions: [
                'console.log',
                'console.time',
                'console.timeEnd',
                'console.dir',
                'console.info',
                'console.debug',
                'console.group',
                'console.profile',
                'console.trace',
                'assert.*',
              ],
            })
          : null,
        isDev && entry.output[0].format === 'umd'
          ? serve({
              port: pkg.port || 3000,
              contentBase: ['public', 'dist'],
              open: true,
            })
          : null,
        ...[entry.plugins || []],
      ].filter(Boolean),
    })),
    {
      input,
      output: [{ file: 'dist/types/index.d.ts', format: 'es' }],
      plugins: [
        alias({
          entries: [
            {
              find: /^@\/(.*)/,
              replacement: resolve(process.cwd(), 'src/$1'),
            },
          ],
        }),
        ,
        dts(),
      ],
      external: [/\.(css|less|scss|sass)$/],
    },
    ...(configs || []),
  ]
}

export default generateConfig({ ...pkg, port: 3001 })
