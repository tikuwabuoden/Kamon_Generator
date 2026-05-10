export type RatioMode = 'golden' | 'silver' | 'square'
export type TemplateType = 'emblem' | 'mon' | 'shippo'

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
  compareMode: boolean
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
  petals: PreviewCircle[]
}

export type MonPreviewData = {
  circles: PreviewCircle[]
  accents: PreviewCircle[]
}

export type ShippoPreviewData = {
  circles: PreviewCircle[]
}

export type PreviewBundle = {
  emblemPreview: EmblemPreviewData
  monPreview: MonPreviewData
  shippoPreview: ShippoPreviewData
}
