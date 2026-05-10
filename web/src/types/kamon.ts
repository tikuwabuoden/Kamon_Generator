export type RatioMode = 'golden' | 'silver' | 'square'
export type TemplateType = 'emblem' | 'mon'

export type PreviewLine = {
  id: string
  index: number
  x1: number
  y1: number
  x2: number
  y2: number
}

export type PreviewCircle = {
  id: string
  index: number
  cx: number
  cy: number
  r: number
}

export type PreviewDot = {
  id: string
  index: number
  cx: number
  cy: number
  r: number
}

export type KamonParams = {
  ratioMode: RatioMode
  templateType: TemplateType
  divisions: number
  iterations: number
  angleStep: number
  ratioStrength: number
  strokeWidth: number
  fillMode: 'outline' | 'filled'
}

export type EmblemPreviewData = {
  rings: PreviewCircle[]
  spokes: PreviewLine[]
  dots: PreviewDot[]
}

export type MonPreviewData = {
  circles: PreviewCircle[]
}
