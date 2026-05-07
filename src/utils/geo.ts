import type { GeoLocation } from '@/types'

// Common cities with UTC offsets
const CITY_DB: Record<string, GeoLocation> = {
  'москва':           { lat: 55.7558, lon: 37.6173, utcOffset: 3,  displayName: 'Москва, Россия' },
  'moscow':           { lat: 55.7558, lon: 37.6173, utcOffset: 3,  displayName: 'Москва, Россия' },
  'санкт-петербург':  { lat: 59.9311, lon: 30.3609, utcOffset: 3,  displayName: 'Санкт-Петербург, Россия' },
  'saint petersburg': { lat: 59.9311, lon: 30.3609, utcOffset: 3,  displayName: 'Санкт-Петербург, Россия' },
  'спб':              { lat: 59.9311, lon: 30.3609, utcOffset: 3,  displayName: 'Санкт-Петербург, Россия' },
  'новосибирск':      { lat: 54.9884, lon: 82.9657, utcOffset: 7,  displayName: 'Новосибирск, Россия' },
  'екатеринбург':     { lat: 56.8389, lon: 60.6057, utcOffset: 5,  displayName: 'Екатеринбург, Россия' },
  'казань':           { lat: 55.8304, lon: 49.0661, utcOffset: 3,  displayName: 'Казань, Россия' },
  'нижний новгород':  { lat: 56.2965, lon: 43.9361, utcOffset: 3,  displayName: 'Нижний Новгород, Россия' },
  'челябинск':        { lat: 55.1644, lon: 61.4368, utcOffset: 5,  displayName: 'Челябинск, Россия' },
  'омск':             { lat: 54.9885, lon: 73.3242, utcOffset: 6,  displayName: 'Омск, Россия' },
  'самара':           { lat: 53.2038, lon: 50.1606, utcOffset: 4,  displayName: 'Самара, Россия' },
  'ростов-на-дону':   { lat: 47.2357, lon: 39.7015, utcOffset: 3,  displayName: 'Ростов-на-Дону, Россия' },
  'уфа':              { lat: 54.7388, lon: 55.9721, utcOffset: 5,  displayName: 'Уфа, Россия' },
  'красноярск':       { lat: 56.0153, lon: 92.8932, utcOffset: 7,  displayName: 'Красноярск, Россия' },
  'воронеж':          { lat: 51.6720, lon: 39.1843, utcOffset: 3,  displayName: 'Воронеж, Россия' },
  'пермь':            { lat: 58.0105, lon: 56.2502, utcOffset: 5,  displayName: 'Пермь, Россия' },
  'волгоград':        { lat: 48.7080, lon: 44.5133, utcOffset: 3,  displayName: 'Волгоград, Россия' },
  'краснодар':        { lat: 45.0448, lon: 38.9760, utcOffset: 3,  displayName: 'Краснодар, Россия' },
  'тюмень':           { lat: 57.1522, lon: 65.5272, utcOffset: 5,  displayName: 'Тюмень, Россия' },
  'иркутск':          { lat: 52.2978, lon: 104.2964,utcOffset: 8,  displayName: 'Иркутск, Россия' },
  'хабаровск':        { lat: 48.4827, lon: 135.0840,utcOffset: 10, displayName: 'Хабаровск, Россия' },
  'владивосток':      { lat: 43.1332, lon: 131.9113,utcOffset: 10, displayName: 'Владивосток, Россия' },
  'киев':             { lat: 50.4501, lon: 30.5234, utcOffset: 2,  displayName: 'Киев, Украина' },
  'kiev':             { lat: 50.4501, lon: 30.5234, utcOffset: 2,  displayName: 'Киев, Украина' },
  'харьков':          { lat: 49.9935, lon: 36.2304, utcOffset: 2,  displayName: 'Харьков, Украина' },
  'минск':            { lat: 53.9045, lon: 27.5615, utcOffset: 3,  displayName: 'Минск, Беларусь' },
  'minsk':            { lat: 53.9045, lon: 27.5615, utcOffset: 3,  displayName: 'Минск, Беларусь' },
  'алматы':           { lat: 43.2220, lon: 76.8512, utcOffset: 6,  displayName: 'Алматы, Казахстан' },
  'almaty':           { lat: 43.2220, lon: 76.8512, utcOffset: 6,  displayName: 'Алматы, Казахстан' },
  'астана':           { lat: 51.1801, lon: 71.4460, utcOffset: 6,  displayName: 'Астана, Казахстан' },
  'ташкент':          { lat: 41.2995, lon: 69.2401, utcOffset: 5,  displayName: 'Ташкент, Узбекистан' },
  'tashkent':         { lat: 41.2995, lon: 69.2401, utcOffset: 5,  displayName: 'Ташкент, Узбекистан' },
  'баку':             { lat: 40.4093, lon: 49.8671, utcOffset: 4,  displayName: 'Баку, Азербайджан' },
  'тбилиси':          { lat: 41.6938, lon: 44.8015, utcOffset: 4,  displayName: 'Тбилиси, Грузия' },
  'ереван':           { lat: 40.1872, lon: 44.5152, utcOffset: 4,  displayName: 'Ереван, Армения' },
  'london':           { lat: 51.5074, lon: -0.1278, utcOffset: 0,  displayName: 'Лондон, Великобритания' },
  'лондон':           { lat: 51.5074, lon: -0.1278, utcOffset: 0,  displayName: 'Лондон, Великобритания' },
  'paris':            { lat: 48.8566, lon: 2.3522,  utcOffset: 1,  displayName: 'Париж, Франция' },
  'париж':            { lat: 48.8566, lon: 2.3522,  utcOffset: 1,  displayName: 'Париж, Франция' },
  'berlin':           { lat: 52.5200, lon: 13.4050, utcOffset: 1,  displayName: 'Берлин, Германия' },
  'берлин':           { lat: 52.5200, lon: 13.4050, utcOffset: 1,  displayName: 'Берлин, Германия' },
  'new york':         { lat: 40.7128, lon: -74.0060,utcOffset: -5, displayName: 'Нью-Йорк, США' },
  'нью-йорк':         { lat: 40.7128, lon: -74.0060,utcOffset: -5, displayName: 'Нью-Йорк, США' },
  'los angeles':      { lat: 34.0522, lon: -118.2437,utcOffset:-8, displayName: 'Лос-Анджелес, США' },
  'dubai':            { lat: 25.2048, lon: 55.2708, utcOffset: 4,  displayName: 'Дубай, ОАЭ' },
  'дубай':            { lat: 25.2048, lon: 55.2708, utcOffset: 4,  displayName: 'Дубай, ОАЭ' },
  'istanbul':         { lat: 41.0082, lon: 28.9784, utcOffset: 3,  displayName: 'Стамбул, Турция' },
  'стамбул':          { lat: 41.0082, lon: 28.9784, utcOffset: 3,  displayName: 'Стамбул, Турция' },
  'tokyo':            { lat: 35.6762, lon: 139.6503,utcOffset: 9,  displayName: 'Токио, Япония' },
  'токио':            { lat: 35.6762, lon: 139.6503,utcOffset: 9,  displayName: 'Токио, Япония' },
  'beijing':          { lat: 39.9042, lon: 116.4074,utcOffset: 8,  displayName: 'Пекин, Китай' },
  'пекин':            { lat: 39.9042, lon: 116.4074,utcOffset: 8,  displayName: 'Пекин, Китай' },
}

export async function resolveLocation(query: string): Promise<GeoLocation> {
  const key = query.toLowerCase().trim()

  // Exact match
  if (CITY_DB[key]) return CITY_DB[key]

  // Partial match
  for (const [city, data] of Object.entries(CITY_DB)) {
    if (key.includes(city) || city.includes(key)) return data
  }

  // Try Nominatim geocoding API (free, no key needed)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'ru,en' } }
    )
    if (res.ok) {
      const data = await res.json()
      if (data[0]) {
        const lat = parseFloat(data[0].lat)
        const lon = parseFloat(data[0].lon)
        const utcOffset = Math.round(lon / 15)
        return { lat, lon, utcOffset, displayName: data[0].display_name }
      }
    }
  } catch { /* fall through */ }

  // Default to Moscow
  return { lat: 55.7558, lon: 37.6173, utcOffset: 3, displayName: 'Москва, Россия (по умолчанию)' }
}
