:: Шаг 1. Сборка библиотеки
npm run lint build:lib
:: Шаг 2. Копирование дополнительных файлов. Тема для @angular/material
copyfiles projects/h21-be-ui-kit/src/css/*.scss dist/h21-be-ui-kit/css -f
