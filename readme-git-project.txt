Запускаю уже готовый проект, который лежит на https://github.com

Клонируем c https://github.com/SochavaAG проект jadwalin:
Запускаю в корневой папке GULP-projects команду в тернинале:
git clone https://github.com/SochavaAG/jadwalin.git

Перехожу в скачанную с github папку jadwalin:
cd jadwalin

Устанавливаю локально Gulp для проекта xxxbabes4u и нужные пакеты (можно посмотреть в файле gulpfile.js):
npm i -D gulp browser-sync gulp-plumber gulp-sass sass gulp-csso gulp-file-include gulp-htmlmin gulp-uglify gulp-concat gulp-autoprefixer gulp-rimraf

npm i -D gulp-cache imagemin-jpeg-recompress imagemin-pngquant gulp-webp gulp-filesize gulp-imagemin@7.1.0 gulp-svg-sprite

npm i -D gulp-rename

npm i -D gulp-ttf2woff gulp-ttf2woff2


Запускаю проект jadwalin для простоянного слежения:
gulp serve

Если нужно остановить постоянное слеждение, то комбинация кнопок:
ctrl + C
