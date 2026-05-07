/**
 * Matrix of Destiny Engine
 * Based on the 22 Major Arcana numerology system.
 * Calculates all matrix positions, chakras, karmic lines, life purpose.
 */

export const ARCANA: Record<number, { name: string; keyword: string; description: string; energy: string; shadow: string }> = {
  1:  { name: 'Маг',           keyword: 'Воля',         description: 'Сила воли, мастерство, манифестация желаний. Умение использовать все ресурсы.', energy: 'Активная, творческая', shadow: 'Манипуляция, самообман' },
  2:  { name: 'Жрица',         keyword: 'Интуиция',     description: 'Глубокая интуиция, тайное знание, связь с подсознанием и высшими силами.', energy: 'Пассивная, мистическая', shadow: 'Изоляция, холодность' },
  3:  { name: 'Императрица',   keyword: 'Изобилие',     description: 'Творчество, плодородие, материнская любовь, природная красота и изобилие.', energy: 'Питающая, творческая', shadow: 'Зависимость, расточительность' },
  4:  { name: 'Император',     keyword: 'Власть',       description: 'Структура, порядок, авторитет, стабильность. Способность создавать системы.', energy: 'Стабилизирующая, властная', shadow: 'Тирания, жёсткость' },
  5:  { name: 'Иерофант',      keyword: 'Традиция',     description: 'Духовное наставничество, традиции, мудрость, связь с высшим знанием.', energy: 'Учительская, духовная', shadow: 'Догматизм, конформизм' },
  6:  { name: 'Влюблённые',    keyword: 'Выбор',        description: 'Любовь, союз, важный выбор, ценности. Гармония противоположностей.', energy: 'Объединяющая, любящая', shadow: 'Нерешительность, зависимость' },
  7:  { name: 'Колесница',     keyword: 'Победа',       description: 'Воля к победе, движение вперёд, контроль над ситуацией, триумф.', energy: 'Динамичная, целеустремлённая', shadow: 'Агрессия, самонадеянность' },
  8:  { name: 'Сила',          keyword: 'Мужество',     description: 'Внутренняя сила, терпение, укрощение инстинктов, мягкая власть.', energy: 'Укрощающая, терпеливая', shadow: 'Подавление, слабость' },
  9:  { name: 'Отшельник',     keyword: 'Мудрость',     description: 'Уединение, поиск истины, внутренний свет, духовный путь.', energy: 'Созерцательная, мудрая', shadow: 'Изоляция, одиночество' },
  10: { name: 'Колесо',        keyword: 'Судьба',       description: 'Циклы судьбы, удача, перемены, кармические повороты жизни.', energy: 'Циклическая, судьбоносная', shadow: 'Непостоянство, зависимость от судьбы' },
  11: { name: 'Справедливость',keyword: 'Баланс',       description: 'Справедливость, равновесие, карма, честность, объективность.', energy: 'Уравновешивающая, честная', shadow: 'Жёсткость, бесчувственность' },
  12: { name: 'Повешенный',    keyword: 'Жертва',       description: 'Добровольная жертва, новый взгляд, ожидание, духовное посвящение.', energy: 'Трансформирующая, смиренная', shadow: 'Мученичество, пассивность' },
  13: { name: 'Смерть',        keyword: 'Трансформация',description: 'Конец и начало, трансформация, освобождение от старого, обновление.', energy: 'Трансформирующая, освобождающая', shadow: 'Страх перемен, разрушение' },
  14: { name: 'Умеренность',   keyword: 'Гармония',     description: 'Баланс, синтез, терпение, исцеление, умеренность во всём.', energy: 'Исцеляющая, гармонизирующая', shadow: 'Нерешительность, компромисс' },
  15: { name: 'Дьявол',        keyword: 'Тень',         description: 'Материализм, привязанности, тёмная сторона, скрытые силы.', energy: 'Притягивающая, материальная', shadow: 'Зависимость, манипуляция' },
  16: { name: 'Башня',         keyword: 'Откровение',   description: 'Разрушение иллюзий, внезапные перемены, освобождение через кризис.', energy: 'Разрушительная, освобождающая', shadow: 'Хаос, катастрофа' },
  17: { name: 'Звезда',        keyword: 'Надежда',      description: 'Вдохновение, надежда, исцеление, связь с высшим, обновление.', energy: 'Вдохновляющая, исцеляющая', shadow: 'Наивность, мечтательность' },
  18: { name: 'Луна',          keyword: 'Иллюзия',      description: 'Подсознание, иллюзии, страхи, интуиция, скрытые процессы.', energy: 'Интуитивная, мистическая', shadow: 'Страхи, самообман' },
  19: { name: 'Солнце',        keyword: 'Радость',      description: 'Успех, радость, ясность, жизненная сила, детская непосредственность.', energy: 'Жизнеутверждающая, радостная', shadow: 'Эгоизм, поверхностность' },
  20: { name: 'Суд',           keyword: 'Пробуждение',  description: 'Духовное пробуждение, призыв, трансформация, новый уровень сознания.', energy: 'Пробуждающая, трансформирующая', shadow: 'Самосуд, непрощение' },
  21: { name: 'Мир',           keyword: 'Завершение',   description: 'Завершение цикла, интеграция, успех, гармония с миром.', energy: 'Интегрирующая, завершающая', shadow: 'Стагнация, самодовольство' },
  22: { name: 'Шут',           keyword: 'Свобода',      description: 'Начало пути, свобода, доверие жизни, спонтанность, новые возможности.', energy: 'Свободная, спонтанная', shadow: 'Безответственность, наивность' },
}

export interface MatrixResult {
  // Core positions
  personalEnergy: number      // A — личная энергия (день рождения)
  soulEnergy: number          // B — энергия души (месяц)
  destinyEnergy: number       // C — энергия судьбы (год)
  lifeTask: number            // D — задача жизни (сумма A+B+C)
  karmicTail: number          // Кармический хвост (прошлое)
  karmicHead: number          // Кармическая голова (будущее)

  // Chakra line (vertical)
  chakras: ChakraPoint[]

  // Money channel
  moneyChannel: number[]

  // Relationship line
  relationshipLine: number[]

  // Talent line
  talentLine: number[]

  // Personal year
  personalYear: number

  // Summary
  name: string
  birthDate: string
}

export interface ChakraPoint {
  name: string
  arcana: number
  level: number  // 1-7
  energy: 'blocked' | 'weak' | 'balanced' | 'strong' | 'overactive'
  color: string
  description: string
}

const CHAKRA_NAMES = ['Муладхара','Свадхистана','Манипура','Анахата','Вишудха','Аджна','Сахасрара']
const CHAKRA_COLORS = ['#FF0000','#FF7F00','#FFFF00','#00CC44','#4488FF','#6600CC','#9900FF']

function reduce22(n: number): number {
  if (n <= 22) return n
  const sum = String(n).split('').reduce((a, d) => a + parseInt(d), 0)
  return sum <= 22 ? sum : reduce22(sum)
}

function reduceToSingle(n: number): number {
  while (n > 9) n = String(n).split('').reduce((a, d) => a + parseInt(d), 0)
  return n
}

export function calculateMatrix(birthDate: string, name: string): MatrixResult {
  const [year, month, day] = birthDate.split('-').map(Number)

  // Core numbers
  const A = reduce22(day)
  const B = reduce22(month)
  const C = reduce22(year % 100 === 0 ? year / 100 : year % 100 > 22 ? reduceToSingle(year) : year % 100)
  const D = reduce22(A + B + C)

  // Karmic tail (past) — sum of all birth digits reduced
  const allDigits = String(day).split('').concat(String(month).split('')).concat(String(year).split('')).map(Number)
  const karmicTail = reduce22(allDigits.reduce((a, b) => a + b, 0))

  // Karmic head (future) — complement
  const karmicHead = reduce22(D + karmicTail)

  // Chakra line — 7 points from root to crown
  const chakraBase = [A, reduce22(A + B), B, reduce22(B + C), C, reduce22(C + D), D]
  const chakras: ChakraPoint[] = chakraBase.map((arcana, i) => {
    const level = arcana / 22
    let energy: ChakraPoint['energy'] = 'balanced'
    if (level < 0.2) energy = 'blocked'
    else if (level < 0.4) energy = 'weak'
    else if (level > 0.8) energy = 'overactive'
    else if (level > 0.6) energy = 'strong'

    return {
      name: CHAKRA_NAMES[i],
      arcana,
      level: i + 1,
      energy,
      color: CHAKRA_COLORS[i],
      description: ARCANA[arcana]?.description || '',
    }
  })

  // Money channel
  const moneyChannel = [
    reduce22(A + C),
    reduce22(A + C + reduce22(A + C)),
    C,
    reduce22(C + D),
  ]

  // Relationship line
  const relationshipLine = [
    A,
    reduce22(A + B),
    B,
    reduce22(A + B + reduce22(A + B)),
  ]

  // Talent line
  const talentLine = [
    reduce22(A + D),
    reduce22(B + D),
    reduce22(C + D),
    D,
  ]

  // Personal year (current)
  const currentYear = new Date().getFullYear()
  const personalYear = reduce22(day + month + reduceToSingle(currentYear))

  return {
    personalEnergy: A,
    soulEnergy: B,
    destinyEnergy: C,
    lifeTask: D,
    karmicTail,
    karmicHead,
    chakras,
    moneyChannel,
    relationshipLine,
    talentLine,
    personalYear,
    name,
    birthDate,
  }
}
