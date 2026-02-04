# Подключение к новому Git репозиторию

## 1. Удалить текущий remote:
git remote remove origin

## 2. Добавить новый репозиторий:
git remote add origin <URL_ВАШЕГО_НОВОГО_РЕПОЗИТОРИЯ>

# Примеры URL:
# HTTPS: https://github.com/username/repository.git
# SSH:   git@github.com:username/repository.git

## 3. Проверить подключение:
git remote -v

## 4. Сделать первый коммит (если ещё не делали):
git add .
git commit -m "Initial commit: FinSim Dashboard"

## 5. Отправить код в новый репозиторий:
git branch -M main
git push -u origin main

## Если нужно принудительно перезаписать удалённый репозиторий:
git push -u origin main --force
