# Візуальні й аудіоматеріали

## Документальні фотографії хронології

На чотирьох етапах використовуються різні зображення. Рік етапу — дата події, а не автоматична атрибуція дати фотографії; датування знімка, коли відоме, винесено в його підпис. Кожен знімок можна відкрити повністю.

- `public/images/chornovil-young-uinp.jpeg` — молоді роки. [Публікація УІНП](https://www.uinp.gov.ua/pres-centr/novyny/vichnyy-opozycioner-24-grudnya-narodyvsya-vyacheslav-chornovil), фотографія `A8k1577186753Xr0.jpeg`.
- `public/images/chornovil-case-uinp.jpeg` — фото з особової справи. Та сама публікація УІНП, фотографія `Scb15771868324J9.jpeg`.
- `public/images/chornovil-1970s-uinp.jpeg` — портрет початку 1970-х. [Біографія УІНП](https://uinp.gov.ua/istorychnyy-kalendar/gruden/24/1937-narodyvsya-vyacheslav-chornovil), фотографія `Q231549459936Mf0.jpeg`. УІНП посилається на «Історичну правду».
- `public/images/chornovil-rally-uinp.jpeg` — пізніший портрет із біографічної публікації УІНП, фотографія `xSIx41577187138ofNu6.jpeg`. Точну дату знімка в інтерфейсі не приписано.

## Хода першого екрана

Художня реконструкція, не історичний відеозапис. Вісім поз одного циклу; індекс кадру та горизонтальне просування залежать від прокручування. При зворотному скролі цикл перемотується назад. Режим зменшеного руху показує статичну композицію.

Створено вбудованим інструментом image_gen за навичкою imagegen; CLI не використовувався. Згенерований оригінал: `public/images/chornovil-walk-sheet-v1.png`. Оптимізований файл із прозорістю: `public/images/chornovil-walk-sheet-v1.webp` (1536 × 1024, вісім кадрів у сітці 4 × 2). Зображення обличчя й костюма ґрунтуються на референсах `chornovil-standing.png` та `chornovil-uinp.jpeg`.

Промпт генерації:

> Use case: historical-scene / identity-preserve. Asset type: transparent photographic sprite sheet for a scroll-controlled walking animation in a Ukrainian biographical website. Reference 1 is the existing full-body reconstruction: preserve this exact older man's identity, thin build, dark charcoal two-piece suit, white shirt, dark tie and black leather dress shoes. Reference 2 is a historical portrait of Viacheslav Chornovil for facial likeness (receding hairline, distinctive moustache). Generate ONE sheet arranged as a precise 4 COLUMN by 2 ROW uniform grid of EIGHT chronological full-body walk-cycle frames, reading left to right across row 1 then row 2. All eight figures are the SAME man walking calmly TOWARD THE RIGHT, viewed from a near side-profile with a small three-quarter turn so his face and moustache are visible. Each frame is a different phase of one seamless natural walking cycle: left contact, left down, left passing, left up, right contact, right down, right passing, right up. Realistic alternating leg movement and opposite arm swing, upright dignified gait. Photographic, neutral studio lighting, softly desaturated archival tones, crisp detail. Entire head to soles visible in EVERY cell, same camera, same scale, same baseline and hip position in all cells. Each frame centered precisely within its own equal size cell, generous transparent gap around each figure so no limbs cross a cell boundary. Render a wide 3:2 landscape canvas, ideally 3072 x 2048: each cell is 768 x 1024. Pure genuine transparent alpha background with no checkerboard baked in, no scenery, no floor, no shadows outside the figure, no panels, no frames, no numbers, no captions, no typography, no watermarks. Must show all 8 complete figures in 4x2, not one figure or a collage. This is a labelled artistic reconstruction, not a claim of historical footage.

## Українські аудіодоріжки

`public/audio/` містить готові MP3 для всіх розділів і трьох етапів блоку незалежності. Голос — `uk-UA-OstapNeural`, синтезований оповідач Microsoft; це не клон і не історичний запис голосу Чорновола. Тексти та перелік доріжок збережені в `public/audio/manifest.json`. Генерація виконана через edge-tts; залежність не потрібна відвідувачу й не входить у вебзастосунок.

## Логотип
- Оригінал користувача: logo_chornovil.jpg (копія: public/images/logo_chornovil.jpg).
- Похідний PNG з прозорим зовнішнім фоном: public/images/logo-chornovil-transparent.png. Створений інструментом imagegen на основі оригіналу; оригінал збережений.
- Підключений у шапці та favicon; темні розділи використовують CSS-інверсію для контрасту.

Нові блоки «Самвидав» та «Спротив цензурі» створені з HTML/CSS на основі наявних зображень. Папки, аркуші й обкладинки — інтерпретація, не оригінали справ або факсиміле. Наявну ілюстрацію друкарської машинки позначено як художню.

## Перший екран: чіткість і завершення
Восьмикадрова реконструкція стабілізується за положенням голови. Відображається одна чітка поза без змішування сусідніх силуетів. Переміщення згладжується пружиною; після припинення прокручування цикл доходить до цілісної пози.

Наприкінці постать залишається у повний зріст і переходить до фронтальної реконструкції public/images/chornovil-standing.png. Це стилізований поворот двох площин, не анатомічна 3D-анімація. Вісім початкових поз обмежують природність ходи; для справжнього плавного кроку потрібна узгоджена відеопослідовність або 3D-модель. Режим зменшеного руху показує статичну фронтальну постать.

Англійський портрет має CSS-підкладку лише всередині голови, щоб літери за портретом не просвічували крізь дефекти початкового альфа-каналу. Оригінальний файл збережено.

## Перший екран: редакційний масштаб і кадри повороту (22.10.2026)
- Збільшено основний заголовок, активний рік, текст події та навігацію роками окремо для мобільного і великого екрана.
- Постать проходить усю ширину доріжки до 84% прокручування. Після зупинки, з 86%, починається поворот; до 97% вона стоїть обличчям до глядача. Старе фронтальне фото не використовується в цьому екрані.
- Новий прозорий атлас: `public/images/chornovil-turn-sheet-v2.png`. Створений вбудованим imagegen за референсом `chornovil-walk-sheet-v1.png`, художня реконструкція. Чотири пози 2 × 2: зупинка, початок повороту, три чверті, фронтально. Єдиний костюм, освітлення й масштаб, вирівнювання голови та підошов у відображенні. Це кадрова реконструкція, не історичне відео та не 3D-модель.
- Промпт: Edit / identity-preserve. Create a transparent 2 × 2 stop-and-turn sprite atlas of the exact reconstructed Chornovil in the walking reference. Preserve face, age, moustache, hair, slim physique, charcoal two-button suit, white shirt, dark tie, shoes, lighting and photographic style. Four chronological poses from a stopped right-facing profile through two intermediate pivots to a fully frontal stance. Equal head-to-toe scale and baseline, genuine alpha, no background, text or labels.

### Синхронізація ходи
Переміщення і вибір пози тепер залежать від однієї пройденої відстані. Швидкість обмежена відносно розміру фігури; окремого відставання циклу кроків немає. Поворот починається лише після фактичного прибуття на правий край. Це виправляє синхронізацію, але не створює відсутніх проміжних анатомічних кадрів. Для реалістичної ходи потрібно замінити восьмипозовий атлас узгодженим відеокліпом або 3D-анімацією.

## Скорочена сцена та новий цикл ходи (22.10.2026)
Робочий атлас `public/images/chornovil-walk-sheet-v3.png`: 16 кадрів у сітці 4 × 4, 1086 × 1448, справжня прозорість. Створений вбудованим imagegen за референсом попереднього атласу. Проміжні фази включають перенесення ваги, проходження ноги та згинання коліна; положення голови вирівнюється при відображенні. Невдалий 24-кадровий варіант із повторними позами відхилено і до сайту не підключено. Це художня кадрова реконструкція, не відео чи motion capture; природність залишається обмеженою узгодженістю згенерованих поз.

Промпт вибраного набору: Animation character turnaround/locomotion sheet. Use attached man ONLY as identity, wardrobe and photographic style reference. Need a REAL WALK CYCLE, NOT repeated wide split-leg poses. EXACTLY 16 frames in FOUR columns and FOUR rows. Same man, full body, right-facing profile, fixed pelvis centered each cell. All heads/feet same baseline. Chronological row-major ordering. Animate a complete stride with knees bending and legs PASSING EACH OTHER, feet meeting underneath body in frames 3,4,11,12. Frame1 left foot far forward/right behind; frame2 left foot grounded right knee bends; frame3 right knee bent swings forward past planted left leg; frame4 right raised leg ahead; frames5–8 right foot extends, grounds, accepts weight; frames9–16 opposite-leg sequence returning to1. Restrained upright serious statesman, modest opposite arm swing, identical charcoal suit, head and lighting, genuine transparent background, no text, shadows, ghosts or blur. Prioritize varying leg biomechanics.

Тривалість сцени: 200svh на комп’ютері та 190svh на телефоні (раніше 320/280). Позиція напряму залежить від скролу без інерційного наздоганяння: хода до 68%, зупинка 68–72%, поворот 72–88%, фінальна поза 88–100%. При швидкому виході з першої сцени анімація одразу має завершений стан. Режим зменшеного руху лишається статичним.
