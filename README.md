# DB Simulator

Локальный симулятор интерфейса приложения для навигации: веб-версия/PWA, приложение для iPhone и приложение для Android. Все три версии находятся в основной ветке `master`; ветка `ios-local-app` также сохранена.

Фото и изображение QR выбираются с устройства. Данные профиля сохраняются в localStorage, изображения — в IndexedDB. Сервер и аккаунт не нужны. Для изменения профиля откройте **Edit Profile Demonstrational**. После удаления приложения или очистки его данных локальные данные могут быть потеряны.

## Структура проекта

```text
.github/workflows/build-apps.yml   сборки web, APK и IPA в GitHub Actions
src/pages/index.astro             основной интерфейс и локальное сохранение
src/components/                   формы, редактор профиля, экран билета
public/                           иконки, изображения, PWA manifest и service worker
android/                          нативный Android-проект Capacitor
  app/src/main/                   Android manifest, ресурсы и MainActivity
ios/App/                          нативный iOS-проект для Xcode
scripts/android-apk.mjs            запуск Gradle на Windows, macOS и Linux
scripts/ios-ipa.sh                 сборка неподписанного IPA на macOS
capacitor.config.json             общее имя приложения и настройки Capacitor
dist/                             готовая веб-сборка (генерируется)
artifacts/                        архивы для передачи (генерируются)
```

## Установка и команды

Нужны Node.js 22.12+ и pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
```

| Команда | Результат |
| --- | --- |
| `pnpm exec astro dev --background` | Запустить сервер разработки в фоне |
| `pnpm exec astro dev status` | Проверить состояние сервера |
| `pnpm exec astro dev logs` | Посмотреть логи сервера |
| `pnpm exec astro dev stop` | Остановить сервер |
| `pnpm run build` | Собрать веб-версию в `dist/` |
| `pnpm run preview` | Просмотреть готовую веб-сборку |
| `pnpm run android:sync` | Собрать веб-версию и скопировать её в Android |
| `pnpm run android:open` | Синхронизировать и открыть Android Studio |
| `pnpm run android:apk` | Собрать debug APK |
| `pnpm run ios:sync` | Собрать веб-версию и скопировать её в iOS |
| `pnpm run ios:open` | Синхронизировать и открыть Xcode на Mac |
| `pnpm run ios:ipa` | Собрать неподписанный IPA на Mac с Xcode |

## Веб-версия / PWA

После `pnpm run build` содержимое `dist/` можно разместить на статическом HTTPS-хостинге. Для локальной проверки используйте `pnpm run preview`. Для установки PWA и работы service worker нужен HTTPS либо localhost. Устанавливаемое имя — **DB Simulator**.

## Android / APK

Нужны JDK 21, Android SDK Platform 35 и Build Tools 35.0.0. Укажите SDK через `ANDROID_HOME` либо через `sdk.dir` в `android/local.properties`. Gradle скачивается автоматически через wrapper.

```sh
pnpm run android:apk
```

Результат: `android/app/build/outputs/apk/debug/app-debug.apk`. Это debug-сборка, подписанная отладочным ключом, для установки и проверки на устройстве. Сборка для Google Play потребует отдельной release-подписи.

После изменений интерфейса повторите сборку. Для запуска из Android Studio выполните `pnpm run android:open`, выберите телефон или эмулятор и нажмите Run.

## iPhone / IPA

Локальная сборка требует macOS с Xcode. Команда `pnpm run ios:ipa` создаёт `artifacts/DB-Simulator-unsigned.ipa` без подписи. Для установки на iPhone его нужно подписать сертификатом и подходящим provisioning profile.

Для установки напрямую с Mac:

1. Подключите iPhone и подтвердите доверие компьютеру.
2. Выполните `pnpm run ios:open`.
3. В Xcode выберите target **App** → **Signing & Capabilities** → свою Apple Developer Team.
4. При необходимости замените bundle identifier `de.local.dbnavigator.local` на уникальный, согласовав его с `capacitor.config.json`.
5. Выберите подключённый iPhone и нажмите Run. Включите Developer Mode, если устройство попросит.

## GitHub Actions

Workflow **Build apps** запускается после push в `master` или `ios-local-app` или вручную из Actions → Build apps → Run workflow. Сначала изменения с файлом workflow должны попасть на GitHub; для ручного запуска workflow также должен быть доступен в основной ветке репозитория.

Три задания сохраняют отдельные артефакты:

- `DB-Simulator-web` — содержимое `dist/` для статического хостинга.
- `DB-Simulator-Android-debug` — устанавливаемый debug APK.
- `DB-Simulator-iOS-unsigned` — неподписанный IPA, собранный на macOS.

Загрузите результаты из раздела Artifacts завершившегося запуска. Apple-сертификаты и секреты не требуются для неподписанного IPA. Такой IPA необходимо подписать перед установкой на iPhone.

## Проверка на устройстве

Выберите фото и QR с устройства, сохраните профиль и перезапустите приложение. Проверьте, что изображения сохранились. Затем отмените новый выбор фото и убедитесь, что прежнее изображение осталось.

## О проекте

DB Simulator — копия интерфейса приложения для навигации. Если вы искали пример такого интерфейса, этот проект можно использовать как основу. В целях симуляции реального приложения навигации можно создать любой демонстрационный профиль.
