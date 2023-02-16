const {src, dest, watch, series} = require('gulp'), // подключаем Gulp
  plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
  sourceMaps  = require('gulp-sourcemaps'), // модуль для указания в каком файле задано определенное правило или функция

  sass = require('gulp-sass')(require('sass')), // модуль для компиляции SASS (SCSS) в CSS
  csso = require('gulp-csso'), // модуль для минимизации CSS
  //classPrefix = require('gulp-class-prefix'), // модуль для добавление префиксов к классам CSS
  mediaGroup = require('gulp-group-css-media-queries'), // модуль для группировки медиа запросов
  autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов

  include = require('gulp-file-include'), // модуль для подключение компонентов
  //rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой (альтернатива модуля gulp-file-include)
  htmlmin = require('gulp-htmlmin'), // модуль для минимизации HTML

  uglify = require('gulp-uglify'), // модуль для минимизации JavaScript

  webp = require('gulp-webp'), // модуль для пережатие картинок в webp
  size = require('gulp-filesize'), // модуль выводит в консоль размер файлов до и после их сжатия, чем создаёт чувство глубокого морального удовлетворения, особенно при минификации картинок

  imagemin = require('gulp-imagemin'), // модуль для сжатия PNG, JPEG, GIF и SVG изображений
  jpegrecompress = require('imagemin-jpeg-recompress'), // модуль для сжатия jpeg
  pngquant = require('imagemin-pngquant'), // модуль для сжатия png

  svgSprite = require('gulp-svg-sprite'), // модуль для сборки SVG спарайта
  svgmin = require('gulp-svgmin'), // модуль для сжатия SVG
  cheerio = require('gulp-cheerio'), // модуль для удаление лишних атрибутов из SVG
  replace = require('gulp-replace'), // модуль для замены

  favicons = require('gulp-favicons'), // модуль для favicons

  ttf2woff = require('gulp-ttf2woff'), // модуль для конвертирования шрифта с формата *.ttf в *.woff
  ttf2woff2 = require('gulp-ttf2woff2'), // модуль для конвертирования шрифта с формата *.ttf в *.woff2

  concat = require('gulp-concat'), // модуль для конкатенация (объединение) файлов
  rimraf = require('gulp-rimraf'), // модуль для удаления файлов и каталогов
  rename = require('gulp-rename'), // модуль для переименования файла

  zipFiles = require('gulp-zip'), // модуль для архивации файлов для прода

  browserSync = require('browser-sync').create(); // сервер для работы и автоматического обновления страниц

//const config = require('../package.json');

/* пути к исходным файлам (app), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
const paths = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/images/',
    fonts: 'build/fonts/',
    zip: 'zip'
  },
  app: {
    root: 'app/',
    html: 'app/*.html',
    js: 'app/js/*.js',
    css: 'app/scss/*.scss',
    img: 'app/images/',
    fonts: 'app/fonts/'
  },
  watch: {
    html: 'app/**/*.html',
    js: 'app/js/**/*.js',
    css: 'app/**/*.scss',
    img: 'app/images/**/*.*',
    fonts: 'app/fonts/**/*.*'
  },
  root: './build'
};

// обработка шаблонов
function templates() {
  return src(paths.app.html)
    .pipe(plumber())
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest(paths.build.html));
}

// обработка стилей
function styles () {
  return src(paths.app.css)
    .pipe(sourceMaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(mediaGroup())
    //.pipe(classPrefix('ag-', { ignored: [/\.ag-/, /\.js-ag-/] }))
    .pipe(autoprefixer({
      //grid: true,
      overrideBrowserslist: ['last 8 versions'],
      browsers: [
        'Android >= 4',
        'Chrome >= 20',
        'Firefox >= 24',
        'Explorer >= 11',
        'iOS >= 6',
        'Opera >= 12',
        'Safari >= 6'
      ],
      //cascade: true
    }))
    .pipe(csso())
    .pipe(concat('style.min.css'))
    .pipe(sourceMaps.write())
    .pipe(dest(paths.build.css))
    .pipe(browserSync.stream());
}

// обработка JS
function scripts() {
  return src(paths.app.js)
    .pipe(plumber())
    .pipe(uglify({
      mangle: true,
      output: {
        beautify: false,
        comments: false
      }
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.build.js))
    .pipe(browserSync.stream());
}

// обработка картинок
function images() {
  return src(paths.app.img + '**/*.+(png|jpg|jpeg|gif|ico|svg)') // путь с исходниками картинок
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 80, progressive: true }), // перестал выдавать ошибку и с ним сжимает больше
        jpegrecompress({ progressive: true, max: 90, min: 80}),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({ plugins: [{ removeViewBox: false }] })
      ])
    )
    .pipe(dest(paths.build.img)) // path to pictures *.png|jpg|jpeg|gif|ico
    .pipe(browserSync.stream())
    .pipe(size());
}

function webpImg() {
  return src(paths.app.img + '**/*.+(png|jpg|jpeg|webp)') // путь с исходниками картинок
    .pipe(plumber())
    .pipe(
      webp({
        quality: 75,
        method: 6
      })
    )
    .pipe(dest(paths.build.img + 'webp/')) // path to pictures *.webp
    .pipe(browserSync.stream())
    .pipe(size());
}

function spriteSVG(){
  return src(paths.app.img + 'svg/icons/**/*.svg')
    .pipe(plumber())
    // minify svg
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    // remove all fill and style declarations in out shapes
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: {xmlMode: true}
    }))
    // cheerio plugin create unnecessary string '&gt;', so replace it.
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../symbol/svg/sprite.svg',
          example: true, // создает файл sprite.symbol.html с примером svg
          svg: {
            xmlDeclaration: false,
            doctypeDeclaration: false
          },
          render: {
            scss: {
              dest:'svg/sprite-svg.scss',
              template: paths.app.root + 'scss/base/templates/_sprite-template-svg.scss'
            }
          }
        }
      }
    }))

    .pipe(dest(paths.build.img)); // path to pictures *.svg
}

function faviconsImg(){
  return src(paths.app.img + 'favicons/favicon-sm.png')
    .pipe(plumber())
    .pipe(favicons({
      html: 'favicons.html',
      pipeHTML: true,
      path: '/images/favicons',
      replace: true,
      icons: {
        appleIcon: false,
        favicons: true,
        online: false,
        appleStartup: false,
        android: false,
        firefox: false,
        yandex: false,
        windows: false,
        coast: false
      }
    }))
    .pipe(dest(paths.build.img + 'favicons'))
}

function faviconsImgBig(){
  return src(paths.app.img + 'favicons/favicon-lg.png')
    .pipe(plumber())
    .pipe(favicons({
      //appName: config.name,
      //appShortName: config.name,
      //appDescription: config.description,
      html: 'favicons-big.html',
      pipeHTML: true,
      url: 'http://localhost/',
      path: '/images/favicons',
      replace: true,
      version: 3,
      lang: 'ru-RU',
      icons: {
        appleIcon: true,
        favicons: false,
        online: false,
        appleStartup: false,
        android: true,
        firefox: true,
        yandex: true,
        windows: true,
        coast: true
      }
    }))
    .pipe(dest(paths.build.img + 'favicons'))
}

function fonts() {
  src(paths.app.fonts + '**/*.+(eot|svg|ttf|otf|woff2)')
    .pipe(plumber())
    .pipe(ttf2woff())
    .pipe(dest(paths.build.fonts));
  return src(paths.app.fonts + '**/*.+(eot|svg|ttf|otf|woff)')
    .pipe(ttf2woff2())
    .pipe(dest(paths.build.fonts))
    .pipe(browserSync.stream());
}

function zip() {
  const name = require('./package.json').name;

  const now = new Date(),
    year = now.getFullYear().toString().padStart(2, '0'),
    month = (now.getMonth() + 1).toString().padStart(2, '0'),
    day = now.getDate().toString().padStart(2, '0'),
    hours = now.getHours().toString().padStart(2, '0'),
    minutes = now.getMinutes().toString().padStart(2, '0');

  nameZip = year + '-' + month + '-' + day + '_' + hours + ':' + minutes + '_' + name + '.zip';

  return src([
    './**',
    '.gitignore',
    '*.js',
    '*.json',
    '*.md',
    '*.yml',
    '!package-lock.json',
    '!node_modules/**',
    '!zip/**'
  ])
    .pipe(plumber())
    .pipe(zipFiles(nameZip))
    .pipe(dest('zip'));
}

// удаление каталога build
function clear() {
  //return src(paths.root, {read: false})
  return src(paths.root, { allowEmpty: true })
    .pipe(rimraf());
}

function serve() {
  browserSync.init({
    server: paths.root
  });

  watch(paths.watch.html, series(templates));
  watch(paths.watch.css, series(styles));
  watch(paths.watch.js, series(scripts));
  watch(paths.watch.fonts, series(fonts));
  watch(paths.watch.img, series(images, webpImg)).on('change', browserSync.reload);
}


exports.clear = series(clear); // задача для удаления папки build // gulp clear
exports.zip = series(zip); // задача для архивации файлов для прода // gulp zip
exports.svg = series(clear, spriteSVG); // задача для генерации SVG sprite // gulp svg
exports.favicon = series(clear, series(faviconsImg, faviconsImgBig)); // задача для генерации favicon // gulp favicon
exports.build = series(clear, styles, templates, scripts, images, webpImg, fonts, faviconsImg, faviconsImgBig); // Задача для единоразовой сборки проекта // gulp build
exports.serve = series(clear, styles, templates, scripts, images, webpImg, fonts, faviconsImg, faviconsImgBig, serve); // Задача с постоянным слежением за изменениями в проекте // gulp serve
exports.fast = series(clear, styles, templates, scripts, serve); // Задача с постоянным слежением за изменениями в проекте без лишнего для скорости // gulp fast