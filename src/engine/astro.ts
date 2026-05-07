/**
 * COSMOS Astrology Engine — astronomy-engine (NASA/JPL accuracy)
 * Calculates: all planets, ASC, MC, houses, aspects, nodes, Lilith
 */
import * as Astronomy from 'astronomy-engine'

export const SIGNS_RU = ['Овен','Телец','Близнецы','Рак','Лев','Дева','Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы'] as const
export const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'] as const

export const PLANET_META: Record<string, { symbol: string; color: string; nameRu: string }> = {
  Sun:       { symbol: '☉', color: '#ffd700', nameRu: 'Солнце' },
  Moon:      { symbol: '☽', color: '#c8c8d4', nameRu: 'Луна' },
  Mercury:   { symbol: '☿', color: '#a0c4ff', nameRu: 'Меркурий' },
  Venus:     { symbol: '♀', color: '#ffb3c6', nameRu: 'Венера' },
  Mars:      { symbol: '♂', color: '#ff6b6b', nameRu: 'Марс' },
  Jupiter:   { symbol: '♃', color: '#d4af37', nameRu: 'Юпитер' },
  Saturn:    { symbol: '♄', color: '#b8860b', nameRu: 'Сатурн' },
  Uranus:    { symbol: '♅', color: '#4a9eff', nameRu: 'Уран' },
  Neptune:   { symbol: '♆', color: '#6644ff', nameRu: 'Нептун' },
  Pluto:     { symbol: '♇', color: '#cc3333', nameRu: 'Плутон' },
  NorthNode: { symbol: '☊', color: '#50c878', nameRu: 'Северный узел' },
  Lilith:    { symbol: '⚸', color: '#9b59b6', nameRu: 'Лилит' },
  Ascendant: { symbol: 'AC', color: '#d4af37', nameRu: 'Асцендент' },
  MC:        { symbol: 'MC', color: '#d4af37', nameRu: 'MC' },
}

export const ASPECT_DEFS = [
  { angle: 0,   name: 'Соединение', symbol: '☌', color: '#d4af37', orb: 8, type: 'neutral' },
  { angle: 60,  name: 'Секстиль',   symbol: '⚹', color: '#50c878', orb: 6, type: 'harmonious' },
  { angle: 90,  name: 'Квадрат',    symbol: '□', color: '#ff6b6b',  orb: 8, type: 'difficult' },
  { angle: 120, name: 'Трин',       symbol: '△', color: '#4a9eff',  orb: 8, type: 'harmonious' },
  { angle: 150, name: 'Квинконс',   symbol: '⚻', color: '#ff9944', orb: 3, type: 'tense' },
  { angle: 180, name: 'Оппозиция',  symbol: '☍', color: '#ff4444', orb: 8, type: 'difficult' },
]

export interface PlanetData {
  key: string; nameRu: string; symbol: string; color: string
  longitude: number; sign: string; signSymbol: string; signIndex: number
  degree: number; degreeFormatted: string; house: number
  retrograde: boolean; speed: number
}

export interface AspectData {
  planet1: string; planet2: string; type: string; symbol: string
  color: string; aspectType: string; angle: number; orb: number; applying: boolean
}

export interface HouseData {
  number: number; cusp: number; sign: string; signSymbol: string; degree: number
}

export interface ChartData {
  planets: Record<string, PlanetData>
  houses: HouseData[]
  aspects: AspectData[]
  ascendant: number; mc: number
  dominantElement: string; dominantModality: string
  chartRuler: string; stelliums: string[][]
}

export interface BirthData {
  date: string; time: string; place: string
  lat: number; lon: number; utcOffset: number
}

// ─── Math helpers ─────────────────────────────────────────────────────────────
const mod360 = (d: number) => ((d % 360) + 360) % 360
const degToRad = (d: number) => d * Math.PI / 180
const radToDeg = (r: number) => r * 180 / Math.PI

function lonToSign(lon: number) {
  const idx = Math.floor(mod360(lon) / 30)
  const deg = mod360(lon) % 30
  const d = Math.floor(deg), m = Math.floor((deg - d) * 60)
  return {
    sign: SIGNS_RU[idx], signSymbol: SIGN_SYMBOLS[idx], signIndex: idx,
    degree: parseFloat(deg.toFixed(4)),
    degreeFormatted: `${d}°${m.toString().padStart(2,'0')}′`,
  }
}

function birthToUTC(date: string, time: string, utcOffset: number): Date {
  const [y, mo, d] = date.split('-').map(Number)
  const [h, mi] = (time || '12:00').split(':').map(Number)
  return new Date(Date.UTC(y, mo - 1, d, h - utcOffset, mi, 0))
}

// ─── Planet positions ─────────────────────────────────────────────────────────
function getPlanetLon(body: string, date: Date): { lon: number; speed: number } {
  const vec = Astronomy.GeoVector(body as Astronomy.Body, date, false)
  const ecl = Astronomy.Ecliptic(vec)
  const lon = mod360(ecl.elon)
  const vec2 = Astronomy.GeoVector(body as Astronomy.Body, new Date(date.getTime() + 86400000), false)
  let speed = mod360(Astronomy.Ecliptic(vec2).elon) - lon
  if (speed > 180) speed -= 360
  if (speed < -180) speed += 360
  return { lon, speed }
}

function getNorthNode(date: Date): number {
  const T = (date.getTime() / 86400000 - 10957.5) / 36525
  return mod360(125.0445479 - 1934.1362608 * T + 0.0020754 * T * T)
}

function getLilith(date: Date): number {
  const T = (date.getTime() / 86400000 - 10957.5) / 36525
  return mod360(83.3532465 + 4069.0137287 * T - 0.0103200 * T * T)
}

// ─── ASC / MC ─────────────────────────────────────────────────────────────────
function getGMST(date: Date): number {
  const jd = date.getTime() / 86400000 + 2440587.5
  const T = (jd - 2451545.0) / 36525
  return mod360(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000)
}

function calcASC(date: Date, lat: number, lon: number): number {
  const lst = mod360(getGMST(date) + lon)
  const eps = degToRad(23.4397)
  const lstR = degToRad(lst), latR = degToRad(lat)
  return mod360(radToDeg(Math.atan2(Math.cos(lstR), -(Math.sin(lstR) * Math.cos(eps) + Math.tan(latR) * Math.sin(eps)))))
}

function calcMC(date: Date, lon: number): number {
  const lst = mod360(getGMST(date) + lon)
  const eps = degToRad(23.4397), lstR = degToRad(lst)
  return mod360(radToDeg(Math.atan2(Math.sin(lstR), Math.cos(lstR) * Math.cos(eps))))
}

// ─── Houses (Whole Sign) ──────────────────────────────────────────────────────
function wholeSignHouses(asc: number): number[] {
  const start = Math.floor(asc / 30) * 30
  return Array.from({ length: 12 }, (_, i) => mod360(start + i * 30))
}

function getHouse(lon: number, cusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const s = cusps[i], e = cusps[(i + 1) % 12]
    if (e > s ? (lon >= s && lon < e) : (lon >= s || lon < e)) return i + 1
  }
  return 1
}

// ─── Aspects ──────────────────────────────────────────────────────────────────
function calcAspects(planets: Record<string, PlanetData>): AspectData[] {
  const aspects: AspectData[] = []
  const keys = Object.keys(planets).filter(k => k !== 'Ascendant' && k !== 'MC')
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const p1 = planets[keys[i]], p2 = planets[keys[j]]
      let diff = Math.abs(p1.longitude - p2.longitude)
      if (diff > 180) diff = 360 - diff
      for (const asp of ASPECT_DEFS) {
        const orb = Math.abs(diff - asp.angle)
        if (orb <= asp.orb) {
          aspects.push({ planet1: keys[i], planet2: keys[j], type: asp.name, symbol: asp.symbol, color: asp.color, aspectType: asp.type, angle: asp.angle, orb: parseFloat(orb.toFixed(2)), applying: p1.speed > 0 && p1.longitude < p2.longitude })
          break
        }
      }
    }
  }
  return aspects.sort((a, b) => a.orb - b.orb)
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const ELEMENTS: Record<string, string> = { 'Овен':'Огонь','Лев':'Огонь','Стрелец':'Огонь','Телец':'Земля','Дева':'Земля','Козерог':'Земля','Близнецы':'Воздух','Весы':'Воздух','Водолей':'Воздух','Рак':'Вода','Скорпион':'Вода','Рыбы':'Вода' }
const MODALITIES: Record<string, string> = { 'Овен':'Кардинальный','Рак':'Кардинальный','Весы':'Кардинальный','Козерог':'Кардинальный','Телец':'Фиксированный','Лев':'Фиксированный','Скорпион':'Фиксированный','Водолей':'Фиксированный','Близнецы':'Мутабельный','Дева':'Мутабельный','Стрелец':'Мутабельный','Рыбы':'Мутабельный' }
const RULERS: Record<string, string> = { 'Овен':'Mars','Телец':'Venus','Близнецы':'Mercury','Рак':'Moon','Лев':'Sun','Дева':'Mercury','Весы':'Venus','Скорпион':'Pluto','Стрелец':'Jupiter','Козерог':'Saturn','Водолей':'Uranus','Рыбы':'Neptune' }

// ─── Main ─────────────────────────────────────────────────────────────────────
export function calculateChart(birth: BirthData): ChartData {
  const utc = birthToUTC(birth.date, birth.time, birth.utcOffset)
  const bodies = ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto']
  const raw: Record<string, { lon: number; speed: number }> = {}
  for (const b of bodies) raw[b] = getPlanetLon(b, utc)
  raw['NorthNode'] = { lon: getNorthNode(utc), speed: -0.053 }
  raw['Lilith']    = { lon: getLilith(utc), speed: 0.111 }
  const ascLon = calcASC(utc, birth.lat, birth.lon)
  const mcLon  = calcMC(utc, birth.lon)
  raw['Ascendant'] = { lon: ascLon, speed: 0 }
  raw['MC']        = { lon: mcLon,  speed: 0 }

  const cusps = wholeSignHouses(ascLon)
  const planets: Record<string, PlanetData> = {}
  for (const [key, r] of Object.entries(raw)) {
    const meta = PLANET_META[key]
    if (!meta) continue
    planets[key] = { key, ...meta, longitude: r.lon, ...lonToSign(r.lon), house: getHouse(r.lon, cusps), retrograde: r.speed < 0, speed: parseFloat(r.speed.toFixed(4)) }
  }

  const elCount: Record<string, number> = {}, modCount: Record<string, number> = {}
  for (const k of ['Sun','Moon','Mercury','Venus','Mars','Jupiter','Saturn','Ascendant']) {
    const p = planets[k]; if (!p) continue
    const el = ELEMENTS[p.sign], mod = MODALITIES[p.sign]
    if (el) elCount[el] = (elCount[el] || 0) + 1
    if (mod) modCount[mod] = (modCount[mod] || 0) + 1
  }
  const dominantElement  = Object.entries(elCount).sort((a,b) => b[1]-a[1])[0]?.[0] || 'Огонь'
  const dominantModality = Object.entries(modCount).sort((a,b) => b[1]-a[1])[0]?.[0] || 'Кардинальный'
  const chartRuler = RULERS[planets['Ascendant']?.sign || 'Овен'] || 'Sun'

  const bySign: Record<string, string[]> = {}
  for (const [k, p] of Object.entries(planets)) { if (!bySign[p.sign]) bySign[p.sign] = []; bySign[p.sign].push(k) }
  const stelliums = Object.values(bySign).filter(g => g.length >= 3)

  const houses: HouseData[] = cusps.map((cusp, i) => ({ number: i + 1, cusp, ...lonToSign(cusp) }))

  return { planets, houses, aspects: calcAspects(planets), ascendant: ascLon, mc: mcLon, dominantElement, dominantModality, chartRuler, stelliums }
}
