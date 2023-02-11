Запускаю уже готовый проект, который лежит на https://github.com

Клонируем c https://github.com/SochavaAG проект gulp-mockup:
Запускаю в корневой папке GULP-projects команду в тернинале:
git clone https://github.com/SochavaAG/gulp-mockup.git newproject
где newproject имя нового проекта


Перехожу в скачанную с github папку gulp-mockup:
cd gulp-mockup

Устанавливаю локально Gulp для проекта newproject и нужные пакеты (можно посмотреть в файле gulpfile.js):
npm i -D gulp browser-sync gulp-plumber gulp-sass sass gulp-csso gulp-file-include gulp-htmlmin gulp-uglify gulp-concat gulp-autoprefixer gulp-rimraf

npm i -D imagemin-jpeg-recompress imagemin-pngquant gulp-webp gulp-filesize gulp-imagemin@7.1.0 gulp-svg-sprite

npm i -D gulp-rename

npm i -D gulp-ttf2woff gulp-ttf2woff2

npm i -D gulp-svgmin gulp-cheerio gulp-replace

npm i -D gulp-favicons

npm i -D gulp-group-css-media-queries

npm i -D gulp-zip

npm i -D gulp-class-prefix

Запускаю проект newproject для простоянного слежения:
gulp serve

Если нужно остановить постоянное слеждение, то комбинация кнопок:
ctrl + C
