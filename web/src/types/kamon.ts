export type RatioMode = 'golden' | 'silver' | 'square'
export type EngineType = 'radial' | 'grid' | 'concentric'

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
  engineType: EngineType
  divisions: number
  iterations: number
  angleStep: number
  ratioStrength: number
  strokeWidth: number
  fillMode: 'outline' | 'filled'
}

export type RadialPreviewData = {
  rings: PreviewCircle[]
  spokes: PreviewLine[]
  dots: PreviewDot[]
}

export type GridPreviewData = {
  lines: PreviewLine[]
  circles: PreviewCircle[]
  rotation: string
}

export type ConcentricPreviewData = {
  circles: PreviewCircle[]
}
