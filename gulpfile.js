const gulp = require('gulp')
const babel = require('gulp-babel')
const ts = require('gulp-typescript')
const del = require('del')
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const through = require('through2')
const vite = require('vite')
const rename = require('gulp-rename')
const header = require('gulp-header')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const tsconfig = require('./tsconfig.json')
const packageJson = require('./package.json')
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default

var banner = `/*
 * ${packageJson.name} ${packageJson.version}
 * ${packageJson.description}
 * ${packageJson.homepage}
 *
 * Copyright 2022, ${packageJson.author}
 * Released under the ${packageJson.license} license.
 */\n`

/** 清空lib下的文件 */
function clean() {
  return del('./lib/**')
}

function buildCJS() {
  return gulp
    .src(['lib/es/**/*.js'])
    .pipe(
      babel({
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      })
    )
    .pipe(gulp.dest('lib/cjs/'))
}

function buildES() {
  const tsProject = ts({
    ...tsconfig.compilerOptions,
    module: 'ES6',
  })
  return gulp
    .src(['src/**/*.{ts,tsx}'], {
      ignore: ['**/demos/**/*', '**/tests/**/*'],
    })
    .pipe(tsProject)
    .pipe(
      babel({
        plugins: [],
      })
    )
    .pipe(header(banner))
    .pipe(gulp.dest('lib/es/'))
}

function buildDeclaration() {
  const tsProject = ts({
    ...tsconfig.compilerOptions,
    module: 'ES6',
    declaration: true,
    emitDeclarationOnly: true,
  })
  return gulp
    .src(['src/**/*.{ts,tsx}'], {
      ignore: ['**/demos/**/*', '**/tests/**/*'],
    })
    .pipe(tsProject)
    .pipe(header(banner))
    .pipe(gulp.dest('lib/es/'))
    .pipe(gulp.dest('lib/cjs/'))
}

function getViteConfigForPackage({ env, formats, external }) {
  const name = packageJson.name
  const isProd = env === 'production'
  return {
    root: process.cwd(),
    mode: env,
    logLevel: 'silent',
    define: { 'process.env.NODE_ENV': `"${env}"` },
    build: {
      cssTarget: 'chrome61',
      lib: {
        name: 'webComponents',
        entry: './lib/es/index.js',
        formats,
        fileName: format => `${name}.${format}${isProd ? '' : `.${env}`}.js`,
      },
      rollupOptions: {
        // external,
        output: {
          dir: './lib/bundle',
        },
      },
      minify: isProd ? 'esbuild' : false,
    },
  }
}

async function buildBundles(cb) {
  const envs = ['development', 'production']
  const configs = envs.map(env =>
    getViteConfigForPackage({
      env,
      formats: ['es', 'cjs', 'umd'],
      //   external: ['react', 'react-dom'],
    })
  )

  await Promise.all(configs.map(config => vite.build(config)))
  cb && cb()
}

function umdWebpack() {
  return gulp
    .src('lib/es/index.js')
    .pipe(
      webpackStream(
        {
          output: {
            filename: 'web-components.js',
            library: {
              type: 'umd',
              name: 'webComponents',
            },
          },
          mode: 'production',
          optimization: {
            usedExports: true,
          },
          performance: {
            hints: false,
          },
          resolve: {
            extensions: ['.js', '.json'],
          },
          plugins: [
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              openAnalyzer: false,
              reportFilename: 'report/report.html',
            }),
            new StatoscopeWebpackPlugin({
              saveReportTo: 'report/statoscope/report.html',
              saveStatsTo: 'report/statoscope/stats.json',
              open: false,
            }),
            new webpack.BannerPlugin({ banner }),
          ],
          module: {
            rules: [
              {
                test: /\.m?js$/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    'presets': [
                      [
                        '@babel/preset-env',
                        {
                          'loose': true,
                          'modules': false,
                          'targets': {
                            'chrome': '49',
                            'ios': '9',
                          },
                        },
                      ],
                      '@babel/preset-typescript',
                    ],
                  },
                },
              },
            ],
          },
        },
        webpack
      )
    )
    .pipe(gulp.dest('lib/umd/'))
}

function copyUmd() {
  return gulp
    .src(['lib/umd/web-components.js'])
    .pipe(rename('web-components.compatible.umd.js'))
    .pipe(gulp.dest('lib/bundle/'))
}

function copyMetaFiles() {
  return gulp.src(['./README.md', './LICENSE']).pipe(gulp.dest('./lib/'))
}

function generatePackageJSON() {
  return gulp
    .src('./package.json')
    .pipe(
      through.obj((file, enc, cb) => {
        const rawJSON = file.contents.toString()
        const parsed = JSON.parse(rawJSON)
        delete parsed.scripts
        delete parsed.devDependencies
        delete parsed.publishConfig
        delete parsed.files
        delete parsed.resolutions
        delete parsed.packageManager
        const stringified = JSON.stringify(parsed, null, 2)
        file.contents = Buffer.from(stringified)
        cb(null, file)
      })
    )
    .pipe(gulp.dest('./lib/'))
}

exports.umdWebpack = umdWebpack
exports.buildBundles = buildBundles

exports.default = gulp.series(
  clean,
  buildES,
  buildCJS,
  gulp.parallel(buildDeclaration),
  copyMetaFiles,
  generatePackageJSON,
  buildBundles,
  umdWebpack,
  copyUmd
)
