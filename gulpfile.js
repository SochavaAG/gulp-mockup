const {src, dest, watch, series} = require('gulp'), // подключаем Gulp
  plumber = require('gulp-plumber'), // модуль для отслеживания ошибок

  sass = require('gulp-sass')(require('sass')), // модуль для компиляции SASS (SCSS) в CSS
  csso = require('gulp-csso'), // плагин для минимизации CSS
  autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов

  include = require('gulp-file-include'), // модуль для подключение компонентов
  //rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой (альтернатива модуля gulp-file-include)
  htmlmin = require('gulp-htmlmin'), // модуль для минимизации HTML

  uglify = require('gulp-uglify'), // модуль для минимизации JavaScript

  cache = require('gulp-cache'), // модуль для кэширования

  webp = require('gulp-webp'), // модуль для пережатие картинок в webp
  size = require('gulp-filesize'), // модуль выводит в консоль размер файлов до и после их сжатия, чем создаёт чувство глубокого морального удовлетворения, особенно при минификации картинок

  imagemin = require('gulp-imagemin'), // модуль для сжатия PNG, JPEG, GIF и SVG изображений
  jpegrecompress = require('imagemin-jpeg-recompress'), // модуль для сжатия jpeg
  pngquant = require('imagemin-pngquant'), // модуль для сжатия png

  svgSprite = require('gulp-svg-sprite'), // модуль для сборки SVG спарайта
  svgmin = require('gulp-svgmin'), // модуль для сжатия SVG
  cheerio = require('gulp-cheerio'), // модуль для удаление лишних атрибутов из SVG
  replace = require('gulp-replace'), // модуль для замены


  ttf2woff = require('gulp-ttf2woff'), // модуль для конвертирования шрифта с формата *.ttf в *.woff
  ttf2woff2 = require('gulp-ttf2woff2'), // модуль для конвертирования шрифта с формата *.ttf в *.woff2

  concat = require('gulp-concat'), // модуль для конкатенация (объединение) файлов
  rimraf = require('gulp-rimraf'), // модуль для удаления файлов и каталогов
  rename = require('gulp-rename'), // модуль для переименования файла

  sync = require('browser-sync').create(); // сервер для работы и автоматического обновления страниц


/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
const paths = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/images/',
    fonts: 'build/fonts/'
  },
  src: {
    root: 'src/',
    html: 'src/**.html',
    js: 'src/js/**.js',
    css: 'src/scss/*.scss',
    img: 'src/images/',
    fonts: 'src/fonts/'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    css: 'src/scss/*.scss',
    img: 'src/images/**/*.*',
    fonts: 'srs/fonts/**/*.*'
  },
  root: './build'
};

// обработка шаблонов
function templates() {
  return src(paths.src.html)
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
  return src(paths.src.css)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 4 versions']
    }))
    .pipe(csso())
    .pipe(concat('style.min.css'))
    .pipe(dest(paths.build.css));
}

// обработка картинок JS
function scripts() {
  return src(paths.src.js)
    .pipe(plumber())
    .pipe(uglify({
      mangle: true,
      output: {
        beautify: false,
        comments: false
      }
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.build.js));
}

// обработка картинок
function images() {
  return src(paths.src.img + '**/*.+(png|jpg|jpeg|gif|ico)') // путь с исходниками картинок
    .pipe(plumber())
    .pipe(cache(imagemin([ // сжатие изображений
      imagemin.gifsicle({ interlaced: true }),
      jpegrecompress({
        progressive: true,
        max: 90,
        min: 80
      }),
      pngquant(),
      imagemin.svgo({ plugins: [{ removeViewBox: false }] })
    ])))

    /* второй вариант кода для сжатия
     .pipe(
     imagemin({
     progressive: true,
     svgoPlugins: [{ removeViewBox: false }],
     interlaced: true,
     optimizationLevel: 3
     })
     )
     */
    .pipe(dest(paths.build.img)) // path to pictures *.png|jpg|jpeg|gif|ico
    .pipe(size());
}

function webpImg() {
  return src(paths.src.img + '**/*.+(png|jpg|jpeg|webp)') // путь с исходниками картинок
    .pipe(plumber())
    .pipe(
      webp({
        quality: 75,
        method: 6
      })
    )
    .pipe(dest(paths.build.img + 'webp/')) // path to pictures *.webp
    .pipe(size());
}


function spriteSVG(){
  return src(paths.src.img + 'svg/icons/**/*.svg')
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
    // build SVG sprite
    /*
      .pipe(svgSprite({
        mode: {
          stack: {
            sprite: '../svg/sprite/sprite.svg',
            example: true
          }
        }
      }
    ))
    */

    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: '../svg/sprite/sprite.svg',
          example: true,
          svg: {
            xmlDeclaration: false,
            doctypeDeclaration: false
          },
          render: {
            scss: {
              dest:'scss/_sprite-svg.scss',
              template: paths.src.root + 'scss/templates/_sprite-template-svg.scss'
            }
          }
        }
      }
    }))

    .pipe(dest(paths.build.img)); // path to pictures *.svg
}


function fonts() {
  return src(paths.src.fonts + '**/*.+(eot|svg|ttf|otf|woff|woff2)')
    .pipe(plumber())
    .pipe(dest(paths.build.fonts));
}

function fontWoff() {
  return src(paths.src.fonts + '**/*.+(eot|svg|ttf|otf|woff|woff2)')
    .pipe(plumber())
    .pipe(ttf2woff())
    .pipe(dest(paths.build.fonts));
}

function fontWoff2() {
  return src(paths.src.fonts + '**/*.+(eot|svg|ttf|otf|woff|woff2)')
    .pipe(plumber())
    .pipe(ttf2woff2())
    .pipe(dest(paths.build.fonts));
}

// удаление каталога build
function clear() {
  //return src(paths.root, {read: false})
  return src(paths.root, { allowEmpty: true })
    .pipe(rimraf());
}

// очистка кэша
function cacheclear() {
 return cache.clearAll();
}

function serve() {
  sync.init({
    server: paths.root
  });

  watch(paths.watch.html, series(templates)).on('change', sync.reload);
  watch(paths.watch.css, series(styles)).on('change', sync.reload);
  watch(paths.watch.js, series(scripts)).on('change', sync.reload);
  watch(paths.watch.fonts, series(fontWoff, fontWoff2)).on('change', sync.reload);
  watch(paths.watch.img, series(images, webpImg, spriteSVG)).on('change', sync.reload);
}


exports.build = series(clear, cacheclear, styles, templates, scripts, images, webpImg, spriteSVG, fonts, fontWoff, fontWoff2);
exports.serve = series(clear, cacheclear, styles, templates, scripts, images, webpImg, spriteSVG, fonts, fontWoff, fontWoff2, serve);