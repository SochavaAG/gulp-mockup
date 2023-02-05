Создаю проект с нуля:
Берем донора jadwalin и выполняем пункты:

Создаю папку temp в корневой папке GULP-projects:
mkdir temp

Перехожу в папку temp:
cd temp

Клонируем c https://github.com/SochavaAG проект jadwalin:
Запускаю в корневой папке GULP-projects команду в тернинале:
git clone https://github.com/SochavaAG/jadwalin.git

Затем удаляем все что связано с гитом:
.git
.gitignore

Переименовываем папку jadwalin в новое название проекта xxxbabes4u

И перемещаю папку xxxbabes4u в орневую папку GULP-projects:

Перехожу в скачанную с github папку xxxbabes4u и открываю терминад:

Устанавливаю локально Gulp для проекта xxxbabes4u и нужные пакеты (можно посмотреть в файле gulpfile.js):
npm i -D gulp browser-sync gulp-plumber gulp-sass sass gulp-csso gulp-file-include gulp-htmlmin gulp-uglify gulp-concat gulp-autoprefixer gulp-rimraf

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
