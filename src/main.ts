import '@fontsource/source-sans-3/latin-400.css'
import '@fontsource/source-sans-3/latin-600.css'
import './style.css'
import { flow, type CircleGeometry, type Fragment, type LineLayouter } from './layout'
import { MANDARIN_ESSAY } from './mandarin-essay'

const MAX_CHARS = 5000
const TEXT_GAP = 12
const BAND_HEIGHT_FACTOR = 0.7
const MIN_BAND_HEIGHT = 240
const FONT_FAMILY = '"Source Sans 3"'
const ARROW_STEP = 8
const ARROW_STEP_LARGE = 24
const BUTTON_STEP = 16
const INITIAL_NX = 0.6
const INITIAL_NY = 0.3
const INITIAL_RADIUS = 72
const MIN_RADIUS = 24
const MAX_RADIUS = 140

type Mode = 'loading' | 'ready' | 'fallback'
type Language = 'en' | 'zh'

type State = {
  language: Language
  texts: Record<Language, string>
  nx: number
  ny: number
  radius: number
  layoutView: boolean
  editorOpen: boolean
}

function must<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (element === null) throw new Error(`Missing element: ${selector}`)
  return element
}

const field = must<HTMLDivElement>('#field')
const canvas = must<HTMLDivElement>('#canvas')
const fallback = must<HTMLDivElement>('#fallback')
const status = must<HTMLParagraphElement>('#status')
const plainText = must<HTMLParagraphElement>('#plain-text')
const emptyState = must<HTMLParagraphElement>('#empty-state')
const circleElement = must<HTMLButtonElement>('#circle')
const ring = must<HTMLDivElement>('#ring')
const slider = must<HTMLInputElement>('#size-slider')
const editButton = must<HTMLButtonElement>('#edit-text')
const editor = must<HTMLDivElement>('#editor')
const textarea = must<HTMLTextAreaElement>('#editor-text')
const counter = must<HTMLParagraphElement>('#counter')
const errorMessage = must<HTMLParagraphElement>('#error')
const applyButton = must<HTMLButtonElement>('#apply-text')
const cancelButton = must<HTMLButtonElement>('#cancel-text')
const layoutToggle = must<HTMLButtonElement>('#layout-toggle')
const explanation = must<HTMLDivElement>('#explanation')
const resetButton = must<HTMLButtonElement>('#reset-all')
const languageToggle = must<HTMLButtonElement>('#language-toggle')
const announceRegion = must<HTMLDivElement>('#announce')
const moveButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-move]'))

const state: State = {
  language: 'en',
  texts: { en: '', zh: '' },
  nx: INITIAL_NX,
  ny: INITIAL_NY,
  radius: INITIAL_RADIUS,
  layoutView: false,
  editorOpen: false,
}

const originals: Record<Language, string> = { en: '', zh: '' }

let mode: Mode = 'loading'
let library: typeof import('@chenglou/pretext') | null = null
let layouters: (LineLayouter | null)[] = []
let fontSize = 24
let lineHeight = 35
let canvasFont = `400 24px ${FONT_FAMILY}`
let currentGeometry: CircleGeometry | null = null
let lastFieldWidth = -1
let radiusInitialized = false
let circleBoundsHeight = 0
let boundsDirty = true
let draft = ''
let rafId = 0
let activePointer: number | null = null
let grabX = 0
let grabY = 0
let dragRectLeft = 0
let dragRectTop = 0
let dragWidth = 0

const pool: HTMLSpanElement[] = []

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function currentText(): string {
  return state.texts[state.language]
}

function provisionalHeight(): number {
  return Math.max(MIN_BAND_HEIGHT, window.innerHeight * BAND_HEIGHT_FACTOR)
}

function boundsHeight(): number {
  return circleBoundsHeight > 0 ? circleBoundsHeight : provisionalHeight()
}

function fieldWidth(): number {
  return field.getBoundingClientRect().width
}

function maxRadius(width: number): number {
  const sideGuard = Math.max(72, width * 0.22)
  const limit = Math.min(
    MAX_RADIUS,
    width / 2 - TEXT_GAP - sideGuard,
    boundsHeight() / 2 - TEXT_GAP - 16,
  )
  return Math.max(MIN_RADIUS, limit)
}

function geometryFor(width: number): CircleGeometry {
  const radius = clamp(state.radius, MIN_RADIUS, maxRadius(width))
  state.radius = radius
  const height = boundsHeight()
  const cx = clamp(state.nx * width, radius + 2, width - radius - 2)
  const cy = clamp(state.ny * height, radius + 2, Math.max(radius + 2, height - radius - 4))
  return { cx, cy, exclusionRadius: radius + TEXT_GAP }
}

function readFontMetrics(): void {
  const styles = getComputedStyle(field)
  fontSize = parseFloat(styles.fontSize)
  lineHeight = parseFloat(styles.lineHeight)
  canvasFont = `400 ${fontSize}px ${styles.fontFamily}`
}

function prepareText(text: string): void {
  const lib = library
  if (lib === null) return
  boundsDirty = true
  layouters = text.split('\n').map((paragraph) => {
    if (paragraph.trim() === '') return null
    const prepared = lib.prepareWithSegments(paragraph, canvasFont)
    return (cursor, width) => {
      const range = lib.layoutNextLineRange(prepared, cursor, width)
      return range === null ? null : lib.materializeLineRange(prepared, range)
    }
  })
}

function renderFragments(fragments: Fragment[]): void {
  for (let index = 0; index < fragments.length; index += 1) {
    const fragment = fragments[index]
    let element = pool[index]
    if (element === undefined) {
      element = document.createElement('span')
      element.className = 'frag'
      canvas.append(element)
      pool.push(element)
    }
    element.textContent = fragment.text
    element.style.transform = `translate(${fragment.x}px, ${fragment.y}px)`
    element.style.width = `${fragment.availableWidth}px`
    element.hidden = false
  }
  for (let index = fragments.length; index < pool.length; index += 1) {
    pool[index].hidden = true
  }
}

function render(): void {
  if (mode === 'fallback') {
    plainText.textContent = currentText()
    return
  }
  if (mode !== 'ready') return

  const width = fieldWidth()
  if (width === 0) return

  if (!radiusInitialized) {
    state.radius = Math.min(INITIAL_RADIUS, maxRadius(width) * 0.62)
    radiusInitialized = true
  }

  const geometryBase = geometryFor(width)

  const minInterval = Math.max(56, fontSize * 3.5)
  let geometry = geometryBase
  let result = flow(layouters, width, lineHeight, geometry, minInterval)

  if (boundsDirty) {
    boundsDirty = false
    circleBoundsHeight = Math.max(result.height, lineHeight * 2)
    const radiusNow = state.radius
    const cy = clamp(geometry.cy, radiusNow + 2, Math.max(radiusNow + 2, circleBoundsHeight - radiusNow - 4))
    if (cy !== geometry.cy) {
      state.nx = geometry.cx / width
      state.ny = cy / circleBoundsHeight
      geometry = geometryFor(width)
      result = flow(layouters, width, lineHeight, geometry, minInterval)
    }
  }

  state.nx = geometry.cx / width
  state.ny = geometry.cy / boundsHeight()
  currentGeometry = geometry

  const isEmpty = currentText().trim() === ''
  emptyState.hidden = !isEmpty
  canvas.style.minHeight = `${Math.max(result.height, lineHeight * (isEmpty ? 4 : 2))}px`
  renderFragments(result.fragments)

  const radius = state.radius
  circleElement.style.width = `${radius * 2}px`
  circleElement.style.height = `${radius * 2}px`
  circleElement.style.transform = `translate(${geometry.cx - radius}px, ${geometry.cy - radius}px)`

  ring.style.width = `${geometry.exclusionRadius * 2}px`
  ring.style.height = `${geometry.exclusionRadius * 2}px`
  ring.style.transform = `translate(${geometry.cx - geometry.exclusionRadius}px, ${geometry.cy - geometry.exclusionRadius}px)`

  const sliderMax = Math.floor(maxRadius(width))
  slider.min = String(Math.min(MIN_RADIUS, sliderMax))
  slider.max = String(sliderMax)
  const sliderValue = String(Math.round(radius))
  if (slider.value !== sliderValue) slider.value = sliderValue
}

function requestRender(): void {
  if (rafId !== 0) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    render()
  })
}

function announce(message: string): void {
  announceRegion.textContent = message
}

function moveBy(dx: number, dy: number): void {
  if (mode !== 'ready' || currentGeometry === null) return
  const width = fieldWidth()
  if (width === 0) return
  state.nx = (currentGeometry.cx + dx) / width
  state.ny = (currentGeometry.cy + dy) / boundsHeight()
  requestRender()
}

function syncLayoutToggle(): void {
  layoutToggle.setAttribute('aria-pressed', String(state.layoutView))
  field.classList.toggle('show-layout', state.layoutView)
  explanation.hidden = !state.layoutView
}

function updateCounter(): void {
  const length = draft.length
  counter.textContent = `${length.toLocaleString('en-US')} / ${MAX_CHARS.toLocaleString('en-US')}`
  counter.classList.toggle('over', length > MAX_CHARS)
}

function openEditor(): void {
  draft = currentText()
  textarea.value = draft
  errorMessage.hidden = true
  updateCounter()
  editor.hidden = false
  state.editorOpen = true
  textarea.focus()
}

function closeEditor(): void {
  editor.hidden = true
  state.editorOpen = false
  editButton.focus()
}

function setControlsEnabled(interactive: boolean): void {
  for (const button of moveButtons) button.disabled = !interactive
  slider.disabled = !interactive
  layoutToggle.disabled = !interactive
  circleElement.disabled = !interactive
  const editing = mode === 'ready' || mode === 'fallback'
  editButton.disabled = !editing
  resetButton.disabled = !editing
  applyButton.disabled = !editing
  cancelButton.disabled = !editing
  textarea.disabled = !editing
  languageToggle.disabled = !editing
}

function commitText(text: string): void {
  state.texts[state.language] = text
  prepareText(currentText())
  render()
}

function switchLanguage(): void {
  state.language = state.language === 'en' ? 'zh' : 'en'
  const isChinese = state.language === 'zh'
  field.dataset.lang = state.language
  field.lang = isChinese ? 'zh-CN' : 'en'
  languageToggle.textContent = isChinese ? 'English' : '中文'
  languageToggle.lang = isChinese ? 'en' : 'zh-CN'
  languageToggle.setAttribute(
    'aria-label',
    isChinese ? 'Show the essay in English' : 'Show the essay in Mandarin Chinese',
  )
  readFontMetrics()
  prepareText(currentText())
  if (state.editorOpen) {
    draft = currentText()
    textarea.value = draft
    errorMessage.hidden = true
    updateCounter()
  }
  render()
  announce(isChinese ? 'Essay switched to Mandarin Chinese.' : 'Essay switched to English.')
}

function endDrag(pointerId: number): void {
  if (activePointer !== pointerId) return
  activePointer = null
  circleElement.classList.remove('dragging')
}

circleElement.addEventListener('pointerdown', (event) => {
  if (mode !== 'ready' || currentGeometry === null || activePointer !== null) return
  if (event.pointerType === 'mouse' && event.button !== 0) return
  const rect = field.getBoundingClientRect()
  dragRectLeft = rect.left
  dragRectTop = rect.top
  dragWidth = rect.width
  grabX = event.clientX - rect.left - currentGeometry.cx
  grabY = event.clientY - rect.top - currentGeometry.cy
  activePointer = event.pointerId
  circleElement.setPointerCapture(event.pointerId)
  circleElement.classList.add('dragging')
  circleElement.focus({ preventScroll: true })
  event.preventDefault()
})

circleElement.addEventListener('pointermove', (event) => {
  if (event.pointerId !== activePointer || dragWidth === 0) return
  state.nx = (event.clientX - dragRectLeft - grabX) / dragWidth
  state.ny = (event.clientY - dragRectTop - grabY) / boundsHeight()
  requestRender()
})

window.addEventListener(
  'scroll',
  () => {
    if (activePointer === null) return
    const rect = field.getBoundingClientRect()
    dragRectLeft = rect.left
    dragRectTop = rect.top
  },
  { passive: true },
)

for (const type of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) {
  circleElement.addEventListener(type, (event) => endDrag(event.pointerId))
}

circleElement.addEventListener('keydown', (event) => {
  const step = event.shiftKey ? ARROW_STEP_LARGE : ARROW_STEP
  const moves: Record<string, [number, number]> = {
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0],
    ArrowUp: [0, -step],
    ArrowDown: [0, step],
  }
  const move = moves[event.key]
  if (move === undefined) return
  event.preventDefault()
  moveBy(move[0], move[1])
})

for (const button of moveButtons) {
  button.addEventListener('click', () => {
    const dx = Number(button.dataset.dx ?? '0') * BUTTON_STEP
    const dy = Number(button.dataset.dy ?? '0') * BUTTON_STEP
    moveBy(dx, dy)
  })
}

slider.addEventListener('input', () => {
  state.radius = Number(slider.value)
  requestRender()
})

editButton.addEventListener('click', openEditor)

textarea.addEventListener('input', () => {
  draft = textarea.value
  errorMessage.hidden = true
  updateCounter()
})

applyButton.addEventListener('click', () => {
  if (draft.length > MAX_CHARS) {
    errorMessage.hidden = false
    textarea.focus()
    announce('Text is too long. Keep your text to 5,000 characters or fewer.')
    return
  }
  commitText(draft)
  closeEditor()
  announce('Text updated.')
})

cancelButton.addEventListener('click', closeEditor)

layoutToggle.addEventListener('click', () => {
  state.layoutView = !state.layoutView
  syncLayoutToggle()
})

languageToggle.addEventListener('click', switchLanguage)

resetButton.addEventListener('click', () => {
  state.texts.en = originals.en
  state.texts.zh = originals.zh
  state.nx = INITIAL_NX
  state.ny = INITIAL_NY
  radiusInitialized = false
  circleBoundsHeight = 0
  boundsDirty = true
  state.layoutView = false
  syncLayoutToggle()
  if (state.editorOpen) {
    errorMessage.hidden = true
    closeEditor()
    resetButton.focus()
  }
  prepareText(currentText())
  render()
  announce('Starting composition restored.')
})

const resizeObserver = new ResizeObserver(() => {
  const width = fieldWidth()
  if (Math.abs(width - lastFieldWidth) < 0.5) return
  lastFieldWidth = width
  readFontMetrics()
  prepareText(currentText())
  render()
})
resizeObserver.observe(field)

async function start(): Promise<void> {
  originals.en = (plainText.textContent ?? '').trim()
  originals.zh = MANDARIN_ESSAY.trim()
  state.texts.en = originals.en
  state.texts.zh = originals.zh
  readFontMetrics()
  setControlsEnabled(false)

  try {
    library = await import('@chenglou/pretext')
  } catch {
    fail('The interactive layout is unavailable in this browser. Your text is shown below.')
    return
  }

  try {
    await document.fonts.load(`400 24px ${FONT_FAMILY}`)
    await document.fonts.ready
  } catch {
    /* Font loading failed; the check below decides. */
  }
  if (!document.fonts.check(`400 24px ${FONT_FAMILY}`)) {
    fail('The typeface did not load. Your text is shown below.')
    return
  }

  mode = 'ready'
  prepareText(currentText())
  fallback.remove()
  lastFieldWidth = fieldWidth()
  syncLayoutToggle()
  render()
  field.classList.add('ready')
  setControlsEnabled(true)
}

function fail(message: string): void {
  mode = 'fallback'
  field.classList.add('fallback')
  status.textContent = message
  plainText.textContent = currentText()
  setControlsEnabled(false)
}

syncLayoutToggle()
void start()
