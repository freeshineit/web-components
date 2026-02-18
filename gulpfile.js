const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const del = require('del');
const through = require('through2');
const header = require('gulp-header');
const tsconfig = require('./tsconfig.json');
const packageJson = require('./package.json');

const banner = `/*
 * ${packageJson.name} ${packageJson.version}
 * ${packageJson.description}
 * ${packageJson.homepage}
 *
 * Copyright 2022, ${packageJson.author}
 * Released under the ${packageJson.license} license.
 */\n`;

// name
const wcName = packageJson.name.split('/')[packageJson.name.split('/').length - 1];

/**
 * 下划线或横线转换驼峰
 *
 * @example
 * toHump('wc-ui'); // wcName
 * toHump('wc_ui'); // wcName
 * @param {string} name
 *
 * @return string
 */
function toHump(name) {
  return name.replace(/[\_,\-](\w)/g, (all, letter) => letter.toUpperCase());
}

/** 清空lib下的文件 */
function clean() {
  return del('./lib/**');
}

function buildCJS() {
  return gulp
    .src(['lib/es/**/*.js'])
    .pipe(
      babel({
        plugins: ['@babel/plugin-transform-modules-commonjs'],
      }),
    )
    .pipe(gulp.dest('lib/cjs/'));
}

function buildES() {
  const tsProject = ts({
    ...tsconfig.compilerOptions,
    module: 'ES6',
  });
  return gulp
    .src(['src/**/*.{ts,tsx}'], {
      ignore: ['**/demos/**/*', '**/tests/**/*', '**/*.spec.{ts,tsx}'],
    })
    .pipe(tsProject)
    .pipe(
      babel({
        plugins: [],
      }),
    )
    .pipe(header(banner))
    .pipe(gulp.dest('lib/es/'));
}

function buildDeclaration() {
  const tsProject = ts({
    ...tsconfig.compilerOptions,
    module: 'ES6',
    declaration: true,
    emitDeclarationOnly: true,
  });
  return gulp
    .src(['src/**/*.{ts,tsx}'], {
      ignore: ['**/demos/**/*', '**/tests/**/*', '**/*.spec.{ts,tsx}'],
    })
    .pipe(tsProject)
    .pipe(header(banner))
    .pipe(gulp.dest('lib/es/'))
    .pipe(gulp.dest('lib/cjs/'));
}

function copyMetaFiles() {
  return gulp.src(['./README.md', './LICENSE']).pipe(gulp.dest('./lib/'));
}

function generatePackageJSON() {
  return gulp
    .src('./package.json')
    .pipe(
      through.obj((file, enc, cb) => {
        const rawJSON = file.contents.toString();
        const parsed = JSON.parse(rawJSON);
        delete parsed.scripts;
        delete parsed.devDependencies;
        delete parsed.publishConfig;
        delete parsed.files;
        delete parsed.resolutions;
        delete parsed.packageManager;
        const stringified = JSON.stringify(parsed, null, 2);
        file.contents = Buffer.from(stringified);
        cb(null, file);
      }),
    )
    .pipe(gulp.dest('./lib/'));
}

exports.copyPublicToDocs = function copyPublicToDocs() {
  return gulp.src(['public/**/*', '!public/index.html']).pipe(gulp.dest('docs'));
};

exports.default = gulp.series(clean, buildES, buildCJS, gulp.parallel(buildDeclaration), copyMetaFiles, generatePackageJSON);
