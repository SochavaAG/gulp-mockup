Создаю проект с нуля:
Берем донора gulp-mockup и выполняем пункты:

Создаю папку temp в корневой папке GULP-projects:
mkdir temp

Перехожу в папку temp:
cd temp

Клонируем c https://github.com/SochavaAG проект gulp-mockup:
Запускаю в корневой папке GULP-projects команду в тернинале:
git clone https://github.com/SochavaAG/gulp-mockup.git

Затем удаляем все что связано с гитом:
.git
.gitignore

Переименовываем папку gulp-mockup в новое название проекта newproject

И перемещаю папку newproject в корневую папку GULP-projects:

Перехожу в скачанную с github папку newproject и открываю терминал:

Устанавливаю локально Gulp для проекта xxxbabes4u и нужные пакеты (можно посмотреть в файле gulpfile.js):
npm i -D gulp browser-sync gulp-plumber gulp-sass sass gulp-csso gulp-file-include gulp-htmlmin gulp-uglify gulp-concat gulp-autoprefixer gulp-rimraf

npm i -D gulp-cache imagemin-jpeg-recompress imagemin-pngquant gulp-webp gulp-filesize gulp-imagemin@7.1.0 gulp-svg-sprite

npm i -D gulp-rename

npm i -D gulp-ttf2woff gulp-ttf2woff2

Запускаю проект jadwalin для простоянного слежения:
gulp serve

Если нужно остановить постоянное слеждение, то комбинация кнопок:
ctrl + C

После запуска убеждаемся, что все работает

И начинаем удалять ненужные файлы и добавлять файлы с нового проекта









/*
Создаю новую папку xxxbabes4u:
mkdir xxxbabes4u

Перехожу в эту папку xxxbabes4u:
cd xxxbabes4u

Инициализирую package.json:
npm init -y

Устанавливаю локально Gulp для проекта xxxbabes4u и нужные пакеты (можно посмотреть в файле gulpfile.js):
npm i -D gulp browser-sync gulp-plumber gulp-sass sass gulp-csso gulp-file-include gulp-htmlmin gulp-uglify gulp-concat gulp-autoprefixer gulp-rimraf

Создаю файл gulpfile.js:
touch gulpfile.js

Создаю папку src:
mkdir src

Перехожу в папку src:
cd src

Перехожу в папку dist:
cd dist

Создаю папку fonts:
mkdir fonts

Создаю папку images:
mkdir images

Создаю папку js:
mkdir js

Создаю папку parts:
mkdir parts

Создаю папку scss:
mkdir scss
*/
