import type { Theme } from '@/types'

export interface ThemeConfig {
  name: string
  accent: string
  accentRgb: string
  bg: string
  particle: string
}

export const THEMES: Record<Theme, ThemeConfig> = {
  nordicObsidian: { name: 'Nordic Obsidian', accent: '#d4af37', accentRgb: '212,175,55',  bg: '#0a0a1a', particle: '#d4af37' },
  cosmicBrass:    { name: 'Cosmic Brass',    accent: '#b8860b', accentRgb: '184,134,11',  bg: '#0f0f1e', particle: '#b8860b' },
  ancientEmerald: { name: 'Ancient Emerald', accent: '#50c878', accentRgb: '80,200,120',  bg: '#0d1b2a', particle: '#50c878' },
  voidBlack:      { name: 'Void Black',      accent: '#e8e0d0', accentRgb: '232,224,208', bg: '#000000', particle: '#ffffff' },
  solarGold:      { name: 'Solar Gold',      accent: '#ffd700', accentRgb: '255,215,0',   bg: '#1c1c1c', particle: '#ffd700' },
}

export const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'] as const
export const SIGNS_RU = ['Овен','Телец','Близнецы','Рак','Лев','Дева','Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы'] as const

export const SIGN_DATA: Record<string, { symbol: string; element: string; modality: string; ruler: string; keyword: string }> = {
  'Овен':      { symbol: '♈', element: 'Огонь',  modality: 'Кардинальный', ruler: 'Марс',    keyword: 'Я есть' },
  'Телец':     { symbol: '♉', element: 'Земля',  modality: 'Фиксированный', ruler: 'Венера',  keyword: 'Я имею' },
  'Близнецы':  { symbol: '♊', element: 'Воздух', modality: 'Мутабельный',  ruler: 'Меркурий',keyword: 'Я думаю' },
  'Рак':       { symbol: '♋', element: 'Вода',   modality: 'Кардинальный', ruler: 'Луна',    keyword: 'Я чувствую' },
  'Лев':       { symbol: '♌', element: 'Огонь',  modality: 'Фиксированный', ruler: 'Солнце', keyword: 'Я творю' },
  'Дева':      { symbol: '♍', element: 'Земля',  modality: 'Мутабельный',  ruler: 'Меркурий',keyword: 'Я анализирую' },
  'Весы':      { symbol: '♎', element: 'Воздух', modality: 'Кардинальный', ruler: 'Венера',  keyword: 'Я уравновешиваю' },
  'Скорпион':  { symbol: '♏', element: 'Вода',   modality: 'Фиксированный', ruler: 'Плутон', keyword: 'Я трансформирую' },
  'Стрелец':   { symbol: '♐', element: 'Огонь',  modality: 'Мутабельный',  ruler: 'Юпитер', keyword: 'Я ищу' },
  'Козерог':   { symbol: '♑', element: 'Земля',  modality: 'Кардинальный', ruler: 'Сатурн', keyword: 'Я использую' },
  'Водолей':   { symbol: '♒', element: 'Воздух', modality: 'Фиксированный', ruler: 'Уран',  keyword: 'Я знаю' },
  'Рыбы':      { symbol: '♓', element: 'Вода',   modality: 'Мутабельный',  ruler: 'Нептун', keyword: 'Я верю' },
}

export const ELEMENT_COLORS: Record<string, string> = {
  'Огонь': '#ff6b35',
  'Земля': '#50c878',
  'Воздух': '#4a9eff',
  'Вода': '#a855f7',
}

export const PLANET_MEANINGS: Record<string, { symbol: string; color: string; rules: string; meaning: string }> = {
  'Солнце':    { symbol: '☉', color: '#ffd700', rules: 'Лев',       meaning: 'Эго, жизненная сила, самовыражение, отец' },
  'Луна':      { symbol: '☽', color: '#c0c0c0', rules: 'Рак',       meaning: 'Эмоции, подсознание, интуиция, мать' },
  'Меркурий':  { symbol: '☿', color: '#a0c4ff', rules: 'Близнецы',  meaning: 'Разум, коммуникация, обучение, торговля' },
  'Венера':    { symbol: '♀', color: '#ffb3c6', rules: 'Телец/Весы',meaning: 'Любовь, красота, ценности, удовольствие' },
  'Марс':      { symbol: '♂', color: '#ff6b6b', rules: 'Овен',      meaning: 'Действие, желание, энергия, конфликт' },
  'Юпитер':    { symbol: '♃', color: '#d4af37', rules: 'Стрелец',   meaning: 'Рост, удача, мудрость, расширение' },
  'Сатурн':    { symbol: '♄', color: '#b8860b', rules: 'Козерог',   meaning: 'Дисциплина, карма, ограничения, время' },
  'Уран':      { symbol: '♅', color: '#4a9eff', rules: 'Водолей',   meaning: 'Революция, свобода, инновации, неожиданность' },
  'Нептун':    { symbol: '♆', color: '#6644ff', rules: 'Рыбы',      meaning: 'Духовность, иллюзии, растворение, мистика' },
  'Плутон':    { symbol: '♇', color: '#cc3333', rules: 'Скорпион',  meaning: 'Трансформация, власть, смерть/возрождение' },
  'Асцендент': { symbol: 'AC', color: '#d4af37', rules: '—',        meaning: 'Маска, первое впечатление, тело, стиль жизни' },
  'MC':        { symbol: 'MC', color: '#d4af37', rules: '—',        meaning: 'Карьера, репутация, призвание, публичный образ' },
  'Северный узел': { symbol: '☊', color: '#50c878', rules: '—',    meaning: 'Кармическая миссия, путь развития в этой жизни' },
  'Лилит':     { symbol: '⚸', color: '#9b59b6', rules: '—',        meaning: 'Тёмная сторона, подавленные желания, дикая природа' },
}
