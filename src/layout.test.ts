import { describe, expect, it } from 'vitest'
import { flow, ringIntervals, type CircleGeometry, type LineLayouter } from './layout'

const circle = (cx: number, cy: number, exclusionRadius: number): CircleGeometry => ({ cx, cy, exclusionRadius })

function wordLayouter(words: string[], charWidth = 10): LineLayouter {
  let next = 0
  return (_cursor, maxWidth) => {
    if (next >= words.length) return null
    const maxChars = Math.floor(maxWidth / charWidth)
    const parts: string[] = []
    let length = 0
    while (next < words.length) {
      const word = words[next]
      const add = parts.length === 0 ? word.length : word.length + 1
      if (parts.length > 0 && length + add > maxChars) break
      parts.push(word)
      length += add
      next += 1
      if (length >= maxChars) break
    }
    const text = parts.join(' ')
    return { text, width: text.length * charWidth, end: { segmentIndex: next, graphemeIndex: 0 } }
  }
}

const words = (count: number) => Array.from({ length: count }, () => 'w')

describe('ringIntervals', () => {
  it('returns the full width when the row clears the circle', () => {
    expect(ringIntervals(600, 300, 335, circle(300, 100, 80), 28)).toEqual([{ left: 0, right: 600 }])
  })

  it('splits around the exclusion circle at its center row', () => {
    const intervals = ringIntervals(600, 90, 125, circle(300, 100, 80), 28)
    expect(intervals).toHaveLength(2)
    expect(intervals[0]).toEqual({ left: 0, right: 220 })
    expect(intervals[1]).toEqual({ left: 380, right: 600 })
  })

  it('keeps only the usable side near an edge', () => {
    expect(ringIntervals(300, 90, 125, circle(40, 100, 80), 28)).toEqual([{ left: 120, right: 300 }])
  })

  it('returns nothing when both sides are too narrow', () => {
    expect(ringIntervals(140, 90, 125, circle(70, 100, 120), 28)).toEqual([])
  })

  it('narrows gradually as the row approaches the circle', () => {
    const intervals = ringIntervals(600, 20, 55, circle(300, 100, 80), 28)
    expect(intervals).toHaveLength(2)
    expect(intervals[0].right).toBeCloseTo(300 - Math.sqrt(80 * 80 - 45 * 45), 6)
    expect(intervals[1].left).toBeCloseTo(300 + Math.sqrt(80 * 80 - 45 * 45), 6)
  })

  it('drops sides below the readable minimum', () => {
    expect(ringIntervals(400, 90, 125, circle(200, 100, 60), 100)).toHaveLength(2)
    expect(ringIntervals(400, 90, 125, circle(200, 100, 60), 160)).toEqual([])
  })
})

describe('flow', () => {
  it('lays text at full width and reports the height when the circle is far away', () => {
    const text = 'a a a a a a a a a a'
    const result = flow([wordLayouter(text.split(' '))], 200, 35, circle(100, -1000, 50), 28)
    expect(result.fragments).toHaveLength(1)
    expect(result.fragments[0]).toMatchObject({ x: 0, y: 0, text })
    expect(result.height).toBe(35)
  })

  it('uses both sides of the circle on the same row', () => {
    const result = flow([wordLayouter(words(40))], 600, 35, circle(300, 20, 100), 28)
    expect(result.fragments.length).toBeGreaterThanOrEqual(2)
    const [first, second] = result.fragments
    expect(first).toMatchObject({ x: 0, y: 0 })
    expect(second).toMatchObject({ x: 400, y: 0 })
    expect(first.x + first.availableWidth).toBeLessThanOrEqual(200)
    expect(second.x).toBeGreaterThanOrEqual(400)
    const joined = result.fragments.map((f) => f.text).join(' ')
    expect(joined).toBe(words(40).join(' '))
  })

  it('consumes one row per blank line between paragraphs', () => {
    const result = flow([wordLayouter(['one']), null, wordLayouter(['two'])], 600, 35, circle(300, -1000, 50), 28)
    const [first, second] = result.fragments
    expect(first).toMatchObject({ y: 0, text: 'one' })
    expect(second).toMatchObject({ y: 70, text: 'two' })
    expect(result.height).toBe(105)
  })

  it('starts a new paragraph on a fresh row instead of reusing a row beside the circle', () => {
    const result = flow([wordLayouter(['left']), wordLayouter(['next'])], 600, 35, circle(300, 0, 100), 28)
    const [first, second] = result.fragments
    expect(first).toMatchObject({ x: 0, y: 0, text: 'left' })
    expect(second).toMatchObject({ y: 35, text: 'next' })
  })

  it('skips blocked rows and uses the first usable sliver beside the circle', () => {
    const result = flow([wordLayouter(['after'])], 300, 35, circle(150, 0, 200), 28)
    expect(result.fragments).toHaveLength(1)
    const fragment = result.fragments[0]
    expect(fragment.y).toBe(175)
    expect(fragment.x).toBe(0)
    expect(fragment.availableWidth).toBeCloseTo(150 - Math.sqrt(200 * 200 - 175 * 175), 6)
    expect(fragment.text).toBe('after')
    expect(result.height).toBe(210)
  })

  it('stops when a layouter makes no progress', () => {
    const stuck: LineLayouter = () => ({ text: '', width: 0, end: { segmentIndex: 0, graphemeIndex: 0 } })
    const result = flow([stuck], 200, 35, circle(100, -1000, 50), 28)
    expect(result.fragments).toEqual([])
    expect(result.height).toBe(35)
  })
})
