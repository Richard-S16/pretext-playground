export type Interval = { left: number; right: number }

export type Point = { segmentIndex: number; graphemeIndex: number }

export type LaidLine = { text: string; width: number; end: Point }

export type LineLayouter = (cursor: Point, maxWidth: number) => LaidLine | null

export type Fragment = { x: number; y: number; text: string; availableWidth: number }

export type CircleGeometry = { cx: number; cy: number; exclusionRadius: number }

export type FlowResult = { fragments: Fragment[]; height: number }

export function ringIntervals(
  fieldWidth: number,
  rowTop: number,
  rowBottom: number,
  circle: CircleGeometry,
  minInterval: number,
): Interval[] {
  const dy = circle.cy < rowTop ? rowTop - circle.cy : circle.cy > rowBottom ? circle.cy - rowBottom : 0
  if (dy >= circle.exclusionRadius) return [{ left: 0, right: fieldWidth }]

  const half = Math.sqrt(circle.exclusionRadius * circle.exclusionRadius - dy * dy)
  const intervals: Interval[] = []

  const leftEdge = circle.cx - half
  const rightEdge = circle.cx + half
  if (leftEdge >= minInterval) intervals.push({ left: 0, right: leftEdge })
  if (rightEdge <= fieldWidth - minInterval) intervals.push({ left: rightEdge, right: fieldWidth })

  return intervals
}

export function flow(
  layouters: (LineLayouter | null)[],
  fieldWidth: number,
  lineHeight: number,
  circle: CircleGeometry,
  minInterval: number,
): FlowResult {
  const fragments: Fragment[] = []
  let y = 0

  for (const layouter of layouters) {
    if (layouter === null) {
      y += lineHeight
      continue
    }

    let cursor: Point = { segmentIndex: 0, graphemeIndex: 0 }
    let cursorKey = '0:0'

    for (;;) {
      const intervals = ringIntervals(fieldWidth, y, y + lineHeight, circle, minInterval)
      let consumed = false
      let exhausted = false

      for (const interval of intervals) {
        const line = layouter(cursor, interval.right - interval.left)
        if (line === null) {
          exhausted = true
          break
        }
        consumed = true

        const key = `${line.end.segmentIndex}:${line.end.graphemeIndex}`
        if (key === cursorKey) {
          exhausted = true
          break
        }
        cursorKey = key
        cursor = line.end

        if (line.text.length > 0) {
          fragments.push({
            x: interval.left,
            y,
            text: line.text,
            availableWidth: interval.right - interval.left,
          })
        }
      }

      if (consumed || intervals.length === 0) y += lineHeight
      if (exhausted) break
    }
  }

  return { fragments, height: y }
}
