// ─── Types ────────────────────────────────────────────────────────────────────

export type CaseItem = {
  id: string;
  title: string;
  creator: string;
  initials: string;
  avatarColor: string;
  spec: string;
  views: string;
  viewsNum: number;
  youtubeId: string;
  isPro: boolean;
  duration: string | null;
  task: string;
  result: string;
  city: string;
  rating: number;
  story: string;
  roles: string[];
  category: string;
  tags: string[];
  galleryIds: string[];
};

export type Section = {
  id: string;
  num: string;
  genre: string;
  layout: 'portrait' | 'landscape' | 'bento';
  dark?: boolean;
  cases: CaseItem[];
};

// ─── YouTube helpers ──────────────────────────────────────────────────────────

export const ytThumb = (id: string) =>
  `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

// Portrait (9:16) thumbnail — oardefault.jpg is YouTube's OAR thumbnail for Shorts
export const ytPortraitThumb = (id: string) =>
  `https://i.ytimg.com/vi/${id}/oardefault.jpg`;

export const ytMaxThumb = (id: string) =>
  `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

export const ytPreview = (id: string) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&disablekb=1`;

export const ytPlayer = (id: string) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

// ─── Data ─────────────────────────────────────────────────────────────────────

export const SECTIONS: Section[] = [
  {
    id: 'reels', num: '01', genre: 'Reels & Shorts', layout: 'portrait',
    // YouTube Shorts IDs — vertical 9:16 content. Replace with your own Shorts IDs.
    cases: [
      {
        id: 'r1', title: 'Fashion Reels для ModaUz',
        creator: 'Nilufar Rashidova', initials: 'NR', avatarColor: '#5C4A3A',
        spec: 'Мобилограф', views: '142K', viewsNum: 142,
        youtubeId: 'UV5cvvYmJJI', isPro: true, duration: '0:60',
        task: 'Вирусные Reels для кийим бренди', result: '+800 подписчиков за 2 дня',
        city: 'Самарканд', rating: 4.8,
        story: 'Снимала Fashion Reels для Moda.uz на iPhone 15 Pro. Акцент на динамике движения, текстурах ткани и естественном свете Самарканда. Контент вышел за рамки задачи — бренд получил +800 подписчиков за 2 дня без платного продвижения.',
        roles: ['Съёмка', 'Монтаж', 'Постобработка'],
        category: 'Fashion',
        tags: ['#reels', '#fashion', '#mobilecinema', '#самарканд'],
        galleryIds: ['97sq802BCBE', 'dDH0Ikt3imk', 'H-9qGWrW83M'],
      },
      {
        id: 'r2', title: 'Вирал Shorts +2K продаж',
        creator: 'Azizbek Karimov', initials: 'AK', avatarColor: '#3A4A5C',
        spec: 'Сценарист', views: '540K', viewsNum: 540,
        youtubeId: '97sq802BCBE', isPro: false, duration: '0:35',
        task: 'Вирал контент beauty бренда', result: '+2000 продаж в первую неделю',
        city: 'Ташкент', rating: 5.0,
        story: 'Написал вирусный сценарий для beauty-бренда по схеме «проблема → триггер → решение» в 30 секунд. Ролик разлетелся органически — 540K просмотров без рекламного бюджета и +2000 продаж за первую неделю.',
        roles: ['Сценарий', 'Раскадровка', 'Режиссура'],
        category: 'Beauty',
        tags: ['#shorts', '#beauty', '#viral', '#ташкент'],
        galleryIds: ['UV5cvvYmJJI', 'dDH0Ikt3imk', 'brcRoAIMXWE'],
      },
      {
        id: 'r3', title: 'Food Reels ресторан',
        creator: 'Feruza Nazarova', initials: 'FN', avatarColor: '#3A5C48',
        spec: 'Мобилограф', views: '230K', viewsNum: 230,
        youtubeId: 'dDH0Ikt3imk', isPro: true, duration: '0:22',
        task: 'Таом съёмкаси', result: '+1200 подписчиков',
        city: 'Ташкент', rating: 4.9,
        story: 'Снимала атмосферные food reels для ресторана в Ташкенте. Минимум реквизита, максимум текстуры — естественный свет у окна, медленные движения камеры. Контент набрал 230K без таргета.',
        roles: ['Съёмка', 'Монтаж', 'Стайлинг'],
        category: 'Food',
        tags: ['#food', '#reels', '#ресторан', '#ташкент'],
        galleryIds: ['UV5cvvYmJJI', '97sq802BCBE', 'H-9qGWrW83M'],
      },
      {
        id: 'r4', title: 'Beauty контент — серия',
        creator: 'Nilufar Rashidova', initials: 'NR', avatarColor: '#5C4A3A',
        spec: 'Мобилограф', views: '89K', viewsNum: 89,
        youtubeId: 'H-9qGWrW83M', isPro: true, duration: '0:31',
        task: '5 роликов beauty серии', result: '3 ролика попали в топ',
        city: 'Самарканд', rating: 4.8,
        story: 'Серия из 5 beauty-роликов для косметического бренда с единой визуальной концепцией: тёплая гамма, крупные планы текстур, ASMR-звук. 3 из 5 роликов попали в рекомендации органически.',
        roles: ['Съёмка', 'Монтаж', 'Цветокоррекция'],
        category: 'Beauty',
        tags: ['#beauty', '#reels', '#skincare', '#самарканд'],
        galleryIds: ['dDH0Ikt3imk', '97sq802BCBE', 'UV5cvvYmJJI'],
      },
      {
        id: 'r5', title: 'Кафе атмосфера — промо',
        creator: 'Feruza Nazarova', initials: 'FN', avatarColor: '#3A5C48',
        spec: 'Мобилограф', views: '88K', viewsNum: 88,
        youtubeId: 'brcRoAIMXWE', isPro: true, duration: '0:19',
        task: 'Кафе промо', result: '88K просмотров',
        city: 'Ташкент', rating: 4.9,
        story: '19 секунд — кофе, люди, свет. Атмосферное промо для нового кафе в Ташкенте, снятое в час пик для передачи живого настроения места. Без сценария, только наблюдение.',
        roles: ['Съёмка', 'Монтаж'],
        category: 'Lifestyle',
        tags: ['#cafe', '#vibe', '#reels', '#ташкент'],
        galleryIds: ['UV5cvvYmJJI', 'H-9qGWrW83M', '97sq802BCBE'],
      },
    ],
  },
  {
    id: 'youtube', num: '02', genre: 'YouTube-шоу', layout: 'landscape',
    cases: [
      {
        id: 'y1', title: 'Рекламный промо — рекорд канала',
        creator: 'Jasur Yusupov', initials: 'JY', avatarColor: '#4A3A5C',
        spec: 'Монтажёр', views: '320K', viewsNum: 320,
        youtubeId: 'RgKAFK5djSk', isPro: true, duration: '1:45',
        task: 'Бренд рекламавий ролик', result: 'Рекорд канала 320K',
        city: 'Ташкент', rating: 4.9,
        story: 'Монтировал рекламный ролик для известного узбекского бренда — 4 часа съёмки в финальный 1:45. Каждый кат отсмотрен по трижды. Итог стал рекордом канала: 320K за первые 48 часов.',
        roles: ['Монтаж', 'Цветокоррекция', 'Звук', 'Motion'],
        category: 'Реклама',
        tags: ['#монтаж', '#реклама', '#youtube', '#ташкент'],
        galleryIds: ['dQw4w9WgXcQ', 'hT_nvWreIhg', 'YQHsXMglC9A'],
      },
      {
        id: 'y2', title: 'Tech обзор ноутбука — 12 мин',
        creator: 'Jasur Yusupov', initials: 'JY', avatarColor: '#4A3A5C',
        spec: 'Монтажёр', views: '180K', viewsNum: 180,
        youtubeId: 'dQw4w9WgXcQ', isPro: true, duration: '12:30',
        task: 'Tech обзор монтажи', result: '180K просмотров',
        city: 'Ташкент', rating: 4.9,
        story: 'Монтаж 12-минутного tech-обзора с задачей удержать зрителя там, где средняя досматриваемость в нише 40%. Через структуру, тайминги и динамичный ритм — финальная досматриваемость вышла 68%.',
        roles: ['Монтаж', 'Цветокоррекция', 'Субтитры', 'Превью'],
        category: 'Tech',
        tags: ['#tech', '#review', '#youtube', '#монтаж'],
        galleryIds: ['RgKAFK5djSk', 'hT_nvWreIhg', 'YQHsXMglC9A'],
      },
      {
        id: 'y3', title: 'Сценарий YouTube — разбор',
        creator: 'Azizbek Karimov', initials: 'AK', avatarColor: '#3A4A5C',
        spec: 'Сценарист', views: '120K', viewsNum: 120,
        youtubeId: 'hT_nvWreIhg', isPro: false, duration: '8:15',
        task: 'Обзор сценарийи', result: '120K просмотров',
        city: 'Ташкент', rating: 5.0,
        story: 'Написал сценарий для YouTube-разбора по новой структуре: «крючок → проблема → решение → доказательство → призыв». Видео набрало 120K — лучший результат канала за всё время.',
        roles: ['Сценарий', 'Структура', 'Крючки', 'SEO-заголовок'],
        category: 'Education',
        tags: ['#сценарий', '#youtube', '#контент', '#ташкент'],
        galleryIds: ['RgKAFK5djSk', 'dQw4w9WgXcQ', 'YQHsXMglC9A'],
      },
      {
        id: 'y4', title: 'E-commerce продакшн',
        creator: 'Doniyor Toshmatov', initials: 'DT', avatarColor: '#5C4A3A',
        spec: 'Продюсер', views: '45K', viewsNum: 45,
        youtubeId: 'YQHsXMglC9A', isPro: false, duration: '2:40',
        task: 'Предметли съёмка', result: 'Конверсия +25%',
        city: 'Бухара', rating: 4.6,
        story: 'Продюсировал продуктовую съёмку для e-commerce бренда: команда 4 человека, 6 SKU за один день в Бухаре. Конверсия продуктовых страниц выросла на 25% после обновления фото и видео.',
        roles: ['Продюсирование', 'Координация', 'Кастинг', 'Локация'],
        category: 'E-commerce',
        tags: ['#продакшн', '#ecommerce', '#продукт', '#бухара'],
        galleryIds: ['RgKAFK5djSk', 'hT_nvWreIhg', 'dQw4w9WgXcQ'],
      },
    ],
  },
  {
    id: 'music', num: '03', genre: 'Муз. клипы', layout: 'landscape', dark: true,
    cases: [
      {
        id: 'm1', title: 'Клип для местного артиста',
        creator: 'Jasur Yusupov', initials: 'JY', avatarColor: '#6B5B3A',
        spec: 'Монтажёр', views: '210K', viewsNum: 210,
        youtubeId: 'kJQP7kiw5Fk', isPro: true, duration: '3:22',
        task: 'Локал артист клип', result: '210K просмотров',
        city: 'Ташкент', rating: 4.9,
        story: 'Монтировал клип для молодого узбекского исполнителя: индастриал-локации + мягкое студийное освещение. Каждый кат бит-в-бит синхронизирован вручную — 210K за первый месяц без рекламы.',
        roles: ['Монтаж', 'Цветокоррекция', 'Грейдинг', 'VFX'],
        category: 'Музыка',
        tags: ['#клип', '#музыка', '#монтаж', '#ташкент'],
        galleryIds: ['RgKAFK5djSk', 'OPf0YbXqDm0', 'JGwWNGJdvx8'],
      },
      {
        id: 'm2', title: 'Кино-стиль монтаж',
        creator: 'Otabek Xoliqov', initials: 'OX', avatarColor: '#3A5B6B',
        spec: 'Колорист', views: '150K', viewsNum: 150,
        youtubeId: 'RgKAFK5djSk', isPro: false, duration: '4:10',
        task: 'Короткометраж монтаж', result: 'Фестивальный победитель',
        city: 'Ташкент', rating: 4.8,
        story: 'Цветокоррекция и монтаж короткометражного фильма в кино-стиле. Референс — Teal & Orange с тёплыми тенями в DaVinci Resolve. Работа выиграла приз на локальном кинофестивале.',
        roles: ['Цветокоррекция', 'Грейдинг', 'DaVinci Resolve', 'Монтаж'],
        category: 'Кино',
        tags: ['#колористика', '#shortfilm', '#davinci', '#фестиваль'],
        galleryIds: ['kJQP7kiw5Fk', 'OPf0YbXqDm0', 'dQw4w9WgXcQ'],
      },
      {
        id: 'm3', title: 'Цветокоррекция — реклама',
        creator: 'Otabek Xoliqov', initials: 'OX', avatarColor: '#3A5B6B',
        spec: 'Монтажёр', views: '92K', viewsNum: 92,
        youtubeId: 'OPf0YbXqDm0', isPro: false, duration: '2:55',
        task: 'Реклама колоринг', result: '92K просмотров',
        city: 'Ташкент', rating: 4.8,
        story: 'Цветокоррекция рекламного ролика для FMCG-бренда — задача сделать продукт «вкусным» на экране. Работа в LOG → Rec.709 с авторским LUT-пакетом под палитру бренда.',
        roles: ['Цветокоррекция', 'LUT', 'Финализация', 'Экспорт'],
        category: 'Реклама',
        tags: ['#coloring', '#реклама', '#постпродакшн', '#ташкент'],
        galleryIds: ['RgKAFK5djSk', 'kJQP7kiw5Fk', 'JGwWNGJdvx8'],
      },
    ],
  },
  {
    id: 'campaigns', num: '04', genre: 'Кампейны', layout: 'bento',
    cases: [
      {
        id: 'c1', title: 'Таргет ROAS x4.2 за 2 месяца',
        creator: 'Shahlo Mirzayeva', initials: 'SM', avatarColor: '#5C3A4A',
        spec: 'Таргетолог', views: '32K', viewsNum: 32,
        youtubeId: 'JGwWNGJdvx8', isPro: true, duration: null,
        task: 'Магазин таргет', result: 'ROAS 4.2',
        city: 'Ташкент', rating: 4.7,
        story: 'Таргетированная реклама для интернет-магазина одежды. За 2 месяца оптимизировала аудитории, масштабировала конвертящие объявления и сократила CPA в 3 раза. ROAS вырос с 1.1 до 4.2.',
        roles: ['Таргетинг', 'A/B тест', 'Аналитика', 'Стратегия'],
        category: 'Performance',
        tags: ['#таргет', '#roas', '#ecommerce', '#ташкент'],
        galleryIds: ['9bZkp7q19f0', 'fRh_vgS2dFE', 'OPf0YbXqDm0'],
      },
      {
        id: 'c2', title: 'Бренд-видео для имиджа',
        creator: 'Doniyor Toshmatov', initials: 'DT', avatarColor: '#5C4A3A',
        spec: 'Продюсер', views: '67K', viewsNum: 67,
        youtubeId: '9bZkp7q19f0', isPro: false, duration: '1:30',
        task: 'Имидж видео', result: '67K просмотров',
        city: 'Бухара', rating: 4.6,
        story: 'Продюсировал имиджевый бренд-видео для производственной компании. Задача: показать людей, а не завод. 2 съёмочных дня, 8 локаций — 67K просмотров и два входящих корпоративных запроса.',
        roles: ['Продюсирование', 'Сценарий', 'Кастинг', 'Координация'],
        category: 'Branding',
        tags: ['#бренд', '#имидж', '#видео', '#бухара'],
        galleryIds: ['JGwWNGJdvx8', 'fRh_vgS2dFE', 'RgKAFK5djSk'],
      },
      {
        id: 'c3', title: 'Лайфстайл серия — 5 роликов',
        creator: 'Feruza Nazarova', initials: 'FN', avatarColor: '#3A5C48',
        spec: 'Мобилограф', views: '110K', viewsNum: 110,
        youtubeId: 'fRh_vgS2dFE', isPro: true, duration: '0:45',
        task: 'Лайфстайл серия', result: '110K просмотров',
        city: 'Ташкент', rating: 4.9,
        story: 'Серия из 5 лайфстайл-роликов для бренда здорового питания. Концепция: «обычный день — необычный угол зрения». Снято на iPhone, обработка в Lightroom Mobile — 110K суммарных просмотров.',
        roles: ['Съёмка', 'Монтаж', 'Обработка', 'Концепция'],
        category: 'Lifestyle',
        tags: ['#lifestyle', '#reels', '#healthyfood', '#ташкент'],
        galleryIds: ['JGwWNGJdvx8', '9bZkp7q19f0', 'OPf0YbXqDm0'],
      },
    ],
  },
];

export const HERO_ITEMS = [
  SECTIONS[0].cases[1], // 540K Viral Shorts
  SECTIONS[1].cases[0], // 320K Promo
  SECTIONS[2].cases[0], // 210K Clip
];

export const TICKER_ITEMS = [
  '540K просмотров за 3 дня',
  '12 новых кейсов сегодня',
  'Хакатон завершается через 3 дня',
  '8 авторов онлайн прямо сейчас',
  'Fashion кейс набрал 142K за 24ч',
  'Новый автор из Бухары',
  'ROAS x4.2 — кейс недели',
];

export const ALL_CASES = SECTIONS.flatMap(s => s.cases);

export function findCase(id: string): CaseItem | undefined {
  return ALL_CASES.find(c => c.id === id);
}

export function findCaseSection(id: string): Section | undefined {
  return SECTIONS.find(s => s.cases.some(c => c.id === id));
}

export type BrowseItem = CaseItem & { thumbId: string; browseKey: string };

export function getBrowseItems(sectionId: string, count = 24): BrowseItem[] {
  const section = SECTIONS.find(s => s.id === sectionId);
  if (!section) return [];
  const base = section.cases;
  const items: BrowseItem[] = [];
  let passIndex = 0;
  while (items.length < count) {
    for (const item of base) {
      if (items.length >= count) break;
      const thumbId =
        passIndex === 0
          ? item.youtubeId
          : (item.galleryIds[(passIndex - 1) % item.galleryIds.length] ?? item.youtubeId);
      items.push({ ...item, thumbId, browseKey: `${item.id}-${passIndex}` });
    }
    passIndex++;
  }
  return items;
}
