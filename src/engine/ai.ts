/**
 * AI synthesis layer — uses real chart data, never hallucinates placements.
 * Routes to backend API if available, falls back to structured local interpretations.
 */
import type { ChartData } from './astro'
import type { MatrixResult } from './matrix'
import { PLANET_IN_SIGN, PLANET_IN_HOUSE, getAspectInterpretation } from './interpretations'

const API_URL = import.meta.env.VITE_API_URL || ''

// ─── Build chart context string for AI ───────────────────────────────────────
export function buildChartContext(chart: ChartData, name: string, birthDate: string): string {
  const lines = [`Натальная карта: ${name}, ${birthDate}`, '', 'ПЛАНЕТЫ:']
  for (const [key, p] of Object.entries(chart.planets)) {
    if (['NorthNode','Lilith','MC'].includes(key)) continue
    lines.push(`  ${p.nameRu}: ${p.sign} ${p.degreeFormatted}, ${p.house} дом${p.retrograde ? ' ℞' : ''}`)
  }
  lines.push(`  Асцендент: ${chart.planets['Ascendant']?.sign || '—'}`)
  lines.push(`  MC: ${chart.planets['MC']?.sign || '—'}`)
  lines.push(`  Северный узел: ${chart.planets['NorthNode']?.sign || '—'}`)
  lines.push(`  Лилит: ${chart.planets['Lilith']?.sign || '—'}`)
  lines.push('', 'АСПЕКТЫ:')
  for (const asp of chart.aspects.slice(0, 12)) {
    const p1 = chart.planets[asp.planet1]?.nameRu || asp.planet1
    const p2 = chart.planets[asp.planet2]?.nameRu || asp.planet2
    lines.push(`  ${p1} ${asp.symbol} ${p2} (${asp.type}, орб ${asp.orb}°)`)
  }
  lines.push('', `Доминирующая стихия: ${chart.dominantElement}`)
  lines.push(`Доминирующая модальность: ${chart.dominantModality}`)
  if (chart.stelliums.length > 0) {
    lines.push(`Стеллиумы: ${chart.stelliums.map(s => s.join(', ')).join(' | ')}`)
  }
  return lines.join('\n')
}

// ─── Stream AI report section ─────────────────────────────────────────────────
export async function* streamChartReport(
  chart: ChartData,
  section: string,
  name: string,
  birthDate: string
): AsyncGenerator<string> {
  const context = buildChartContext(chart, name, birthDate)

  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/chart/report/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, section, name, birthDate }),
      })
      if (res.ok && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          yield decoder.decode(value)
        }
        return
      }
    } catch { /* fall through to local */ }
  }

  // Local fallback — structured interpretations
  yield* localReport(chart, section, name)
}

// ─── AI chat with chart context ───────────────────────────────────────────────
export async function askAI(
  message: string,
  chart: ChartData | null,
  history: Array<{ role: string; content: string }>,
  name: string,
  birthDate: string
): Promise<string> {
  if (API_URL) {
    try {
      const context = chart ? buildChartContext(chart, name, birthDate) : ''
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context, history: history.slice(-8) }),
      })
      if (res.ok) {
        const data = await res.json()
        return data.response
      }
    } catch { /* fall through */ }
  }
  return localAIResponse(message, chart, name)
}

// ─── Local report generation (no API needed) ─────────────────────────────────
async function* localReport(chart: ChartData, section: string, name: string): AsyncGenerator<string> {
  const sun = chart.planets['Sun']
  const moon = chart.planets['Moon']
  const asc = chart.planets['Ascendant']
  const saturn = chart.planets['Saturn']
  const node = chart.planets['NorthNode']

  const sections: Record<string, string> = {
    portrait: buildPortrait(chart, name),
    sun: buildSunSection(chart),
    moon: buildMoonSection(chart),
    ascendant: buildAscSection(chart),
    karma: buildKarmaSection(chart),
    relationships: buildRelSection(chart),
    career: buildCareerSection(chart),
    aspects: buildAspectsSection(chart),
    recommendations: buildRecommendations(chart, name),
  }

  const text = sections[section] || sections.portrait
  // Simulate streaming by yielding word by word
  const words = text.split(' ')
  for (let i = 0; i < words.length; i++) {
    yield words[i] + (i < words.length - 1 ? ' ' : '')
    if (i % 8 === 0) await new Promise(r => setTimeout(r, 20))
  }
}

function buildPortrait(chart: ChartData, name: string): string {
  const sun = chart.planets['Sun']
  const moon = chart.planets['Moon']
  const asc = chart.planets['Ascendant']
  const sunInterp = PLANET_IN_SIGN['Sun']?.[sun?.sign] || ''
  const moonInterp = PLANET_IN_SIGN['Moon']?.[moon?.sign] || ''

  return `✦ ${name}, ваша натальная карта раскрывает многогранную и глубокую личность.

${sunInterp}

${moonInterp}

Ваш Асцендент в ${asc?.sign || '—'} определяет то, как вас воспринимает мир — это ваша маска и стиль взаимодействия с реальностью. Первое впечатление, которое вы производите, несёт энергию ${asc?.sign || 'этого знака'}.

Доминирующая стихия вашей карты — ${chart.dominantElement}. Это означает, что ${getElementDescription(chart.dominantElement)}

${chart.stelliums.length > 0 ? `В вашей карте есть стеллиум в ${chart.stelliums[0].map(k => chart.planets[k]?.nameRu).join(', ')} — концентрация энергии, которая делает эту сферу жизни особенно значимой.` : ''}

Ваша карта указывает на человека, способного к глубокой трансформации и духовному росту. ✦`
}

function buildSunSection(chart: ChartData): string {
  const sun = chart.planets['Sun']
  if (!sun) return ''
  const signInterp = PLANET_IN_SIGN['Sun']?.[sun.sign] || ''
  const houseInterp = PLANET_IN_HOUSE['Sun']?.[sun.house] || ''
  return `☉ Солнце в ${sun.sign} ${sun.degreeFormatted}, ${sun.house} дом${sun.retrograde ? ' ℞' : ''}

${signInterp}

${houseInterp}

Ваше Солнце в ${sun.house} доме указывает на то, что самореализация происходит именно через эту сферу жизни. Здесь вы можете найти своё истинное призвание и раскрыть потенциал. ✦`
}

function buildMoonSection(chart: ChartData): string {
  const moon = chart.planets['Moon']
  if (!moon) return ''
  const signInterp = PLANET_IN_SIGN['Moon']?.[moon.sign] || ''
  const houseInterp = PLANET_IN_HOUSE['Moon']?.[moon.house] || ''
  return `☽ Луна в ${moon.sign} ${moon.degreeFormatted}, ${moon.house} дом${moon.retrograde ? ' ℞' : ''}

${signInterp}

${houseInterp}

Ваши эмоциональные потребности и подсознательные паттерны формируются этим положением Луны. Здесь скрыты ваши детские программы и отношения с матерью. ✦`
}

function buildAscSection(chart: ChartData): string {
  const asc = chart.planets['Ascendant']
  const mc = chart.planets['MC']
  if (!asc) return ''
  return `AC Асцендент в ${asc.sign} ${asc.degreeFormatted}
MC Середина Неба в ${mc?.sign || '—'} ${mc?.degreeFormatted || ''}

Асцендент — это ваша маска, стиль взаимодействия с миром и первое впечатление. Люди видят вас через призму ${asc.sign}.

Середина Неба показывает ваше призвание и публичный образ. ${mc?.sign || '—'} на MC указывает на карьерный путь, связанный с качествами этого знака.

Правитель вашего Асцендента — ${chart.chartRuler}. Его положение в карте особенно важно для понимания вашего жизненного пути. ✦`
}

function buildKarmaSection(chart: ChartData): string {
  const node = chart.planets['NorthNode']
  const saturn = chart.planets['Saturn']
  const lilith = chart.planets['Lilith']
  return `☊ Северный узел в ${node?.sign || '—'}, ${node?.house || '—'} дом
♄ Сатурн в ${saturn?.sign || '—'}, ${saturn?.house || '—'} дом
⚸ Лилит в ${lilith?.sign || '—'}, ${lilith?.house || '—'} дом

Северный узел в ${node?.sign || '—'} указывает на вашу кармическую миссию в этой жизни. Это направление, в котором вам нужно развиваться, даже если оно кажется незнакомым и пугающим.

Сатурн в ${saturn?.sign || '—'} в ${saturn?.house || '—'} доме — это ваш главный кармический урок. Здесь вы встречаете ограничения, которые призваны научить вас мастерству и ответственности.

Лилит в ${lilith?.sign || '—'} указывает на подавленные аспекты вашей природы, которые требуют интеграции. ✦`
}

function buildRelSection(chart: ChartData): string {
  const venus = chart.planets['Venus']
  const mars = chart.planets['Mars']
  const house7 = chart.houses[6]
  return `♀ Венера в ${venus?.sign || '—'}, ${venus?.house || '—'} дом
♂ Марс в ${mars?.sign || '—'}, ${mars?.house || '—'} дом
7 дом: ${house7?.sign || '—'}

${PLANET_IN_SIGN['Venus']?.[venus?.sign || ''] || ''}

${PLANET_IN_SIGN['Mars']?.[mars?.sign || ''] || ''}

Ваш 7 дом в ${house7?.sign || '—'} описывает качества, которые вы ищете в партнёре и которые вам нужно развить в себе. ✦`
}

function buildCareerSection(chart: ChartData): string {
  const saturn = chart.planets['Saturn']
  const jupiter = chart.planets['Jupiter']
  const mc = chart.planets['MC']
  return `♄ Сатурн в ${saturn?.sign || '—'}, ${saturn?.house || '—'} дом
♃ Юпитер в ${jupiter?.sign || '—'}, ${jupiter?.house || '—'} дом
MC: ${mc?.sign || '—'}

Ваш MC в ${mc?.sign || '—'} указывает на призвание и публичный образ. Карьера, связанная с качествами этого знака, принесёт наибольшее удовлетворение.

Юпитер в ${jupiter?.sign || '—'} в ${jupiter?.house || '—'} доме показывает, где вас ждёт удача и расширение. Это ваша зона роста и изобилия.

Сатурн в ${saturn?.house || '—'} доме — это сфера, где вы встречаете испытания, но именно здесь возможен наибольший профессиональный рост. ✦`
}

function buildAspectsSection(chart: ChartData): string {
  const topAspects = chart.aspects.slice(0, 5)
  const lines = ['Ключевые аспекты вашей карты:\n']
  for (const asp of topAspects) {
    const p1 = chart.planets[asp.planet1]?.nameRu || asp.planet1
    const p2 = chart.planets[asp.planet2]?.nameRu || asp.planet2
    const interp = getAspectInterpretation(asp.planet1, asp.planet2, asp.type)
    lines.push(`${asp.symbol} ${p1} ${asp.type} ${p2} (орб ${asp.orb}°)`)
    if (interp) lines.push(interp)
    lines.push('')
  }
  return lines.join('\n') + '✦'
}

function buildRecommendations(chart: ChartData, name: string): string {
  const sun = chart.planets['Sun']
  const moon = chart.planets['Moon']
  return `Персональные рекомендации для ${name}:

1. Развивайте качества вашего Солнца в ${sun?.sign || '—'} — это ваш путь к самореализации.

2. Уделяйте внимание эмоциональным потребностям Луны в ${moon?.sign || '—'} — это основа вашего внутреннего равновесия.

3. Работайте с доминирующей стихией ${chart.dominantElement}: ${getElementRecommendation(chart.dominantElement)}

4. Изучите положение вашего правителя карты (${chart.chartRuler}) — он показывает ключевой путь развития.

5. Принимайте уроки Сатурна — они ведут к мастерству и долгосрочному успеху.

Ваша карта — это не приговор, а карта возможностей. Звёзды склоняют, но не обязывают. ✦`
}

function getElementDescription(element: string): string {
  const desc: Record<string, string> = {
    'Огонь': 'вы действуете через вдохновение, энтузиазм и лидерство. Вам нужно движение и творчество.',
    'Земля': 'вы строите через практичность, терпение и материальное воплощение. Вам нужна стабильность.',
    'Воздух': 'вы живёте через идеи, коммуникацию и социальные связи. Вам нужен интеллектуальный обмен.',
    'Вода': 'вы чувствуете через интуицию, эмпатию и глубокие эмоции. Вам нужна эмоциональная безопасность.',
  }
  return desc[element] || ''
}

function getElementRecommendation(element: string): string {
  const rec: Record<string, string> = {
    'Огонь': 'направляйте энергию в творческие проекты, избегайте выгорания.',
    'Земля': 'доверяйте интуиции больше, позволяйте себе спонтанность.',
    'Воздух': 'развивайте эмоциональный интеллект, углубляйте связи.',
    'Вода': 'укрепляйте границы, развивайте практические навыки.',
  }
  return rec[element] || ''
}

function localAIResponse(message: string, chart: ChartData | null, name: string): string {
  if (!chart) return 'Для персонализированного ответа сначала постройте натальную карту. ✦'
  const sun = chart.planets['Sun']
  const moon = chart.planets['Moon']
  const msg = message.toLowerCase()

  if (msg.includes('отношени') || msg.includes('любов') || msg.includes('партнёр')) {
    const venus = chart.planets['Venus']
    return `${name}, ваша Венера в ${venus?.sign || '—'} в ${venus?.house || '—'} доме определяет ваш стиль любви. ${PLANET_IN_SIGN['Venus']?.[venus?.sign || ''] || ''} ✦`
  }
  if (msg.includes('карьер') || msg.includes('работ') || msg.includes('профессия')) {
    const mc = chart.planets['MC']
    return `${name}, ваш MC в ${mc?.sign || '—'} указывает на призвание. Карьера, связанная с качествами ${mc?.sign || 'этого знака'}, принесёт наибольшее удовлетворение. ✦`
  }
  if (msg.includes('сатурн') || msg.includes('карм') || msg.includes('урок')) {
    const saturn = chart.planets['Saturn']
    return `${name}, ваш Сатурн в ${saturn?.sign || '—'} в ${saturn?.house || '—'} доме — это ваш главный кармический урок. Здесь вы встречаете ограничения, которые ведут к мастерству. ✦`
  }
  return `${name}, ваше Солнце в ${sun?.sign || '—'} и Луна в ${moon?.sign || '—'} создают уникальное сочетание. ${PLANET_IN_SIGN['Sun']?.[sun?.sign || ''] || ''} ✦`
}
