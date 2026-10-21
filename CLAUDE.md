# Polish Reader PWA

Копія English Reader PWA (`/Users/szubar/Projects/ACTIVE/English_Reader_Books_PWA`) для читання польських книжок з українським перекладом і польським озвученням.

## Документи (читати на початку кожної сесії)

1. `specs/002-polish/idea.md` — що відрізняється від English Reader, ідеї для вивчення польської (на погодження), ризики.
2. `specs/002-polish/tasks.md` — завдання й стан цієї копії.
3. `.specify/memory/constitution.md` і `specs/001-pwa-copy/*` — базова конституція й специфікація, успадковані від English Reader; діють, якщо `002-polish` не каже інакше.

## Правила

- Усі мовні відмінності — лише в `src/core/language.ts`; решта коду має лишатися однаковою з English Reader, щоб виправлення переносилися між проєктами.
- English Reader PWA, English_Reader_Books і English_Reader_2026 — лише читання.
- Демо-книжка — «Latarnik» Генрика Сенкевича (суспільне надбання, текст Wolne Lektury); інші книжки й матеріали під ліцензіями не комітити.
- Ключ OpenAI — лише в застосунку або в змінній середовища для живих тестів; ніколи в коді, комітах, журналах.
- Платні живі тести, створення репозиторію, push, розгортання — лише з окремим дозволом.
- Спілкування українською, стисло, без емодзі.

## Команди

- `npm run dev` (порт 5174) — розробка з тестовим режимом (`?reset`, `?testTranslation`, `?testSpeech`, `?testWordCard`, `?testSavedWords`, `?testRecording`, `?voice=system|openAI`, `?gallery`).
- `npm test` — модульні тести; `npm run test:e2e` — WebKit iPad (порт 4176) + офлайн у Chromium; `npm run check` — production-збірка, секрети, CSP, розмір.
- `npm run test:live` — платні живі тести OpenAI польською, лише з дозволом.
