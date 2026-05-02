import { computed } from 'vue'
import type {
  KamonParams,
  RadialPreviewData,
  GridPreviewData,
  ConcentricPreviewData,
  PreviewLine,
  PreviewDot,
  PreviewCircle,
} from '../types/kamon'
import { SVG_CENTER, SVG_RADIUS, ratioScale } from '../constants/kamon'

export function useKamonPreview(params: KamonParams) {
  const radialPreview = computed((): RadialPreviewData => {
    const spokeCount = Math.max(3, params.divisions)
    const ringCount = Math.max(2, params.iterations)
    const baseRotation = (params.angleStep * Math.PI) / 180

    const spokes = Array.from({ length: spokeCount }, (_, index) => {
      const angle = baseRotation + (index / spokeCount) * Math.PI * 2
      const innerRadius = 30

      return {
        id: `spoke-${index}`,
        index,
        x1: SVG_CENTER + Math.cos(angle) * innerRadius,
        y1: SVG_CENTER + Math.sin(angle) * innerRadius,
        x2: SVG_CENTER + Math.cos(angle) * SVG_RADIUS,
        y2: SVG_CENTER + Math.sin(angle) * SVG_RADIUS,
      }
    })

    const rings = Array.from({ length: ringCount }, (_, index) => ({
      id: `ring-${index}`,
      index,
      cx: SVG_CENTER,
      cy: SVG_CENTER,
      r: SVG_RADIUS * ((index + 1) / (ringCount + 1)),
    }))

    const dots: PreviewDot[] = Array.from({ length: spokeCount }, (_, index) => {
      const angle = baseRotation + (index / spokeCount) * Math.PI * 2
      const dotRadius = 5 + params.strokeWidth * 0.45

      return {
        id: `dot-${index}`,
        index,
        cx: SVG_CENTER + Math.cos(angle) * (SVG_RADIUS * 0.78),
        cy: SVG_CENTER + Math.sin(angle) * (SVG_RADIUS * 0.78),
        r: dotRadius,
      }
    })

    return { rings, spokes, dots }
  })

  const gridPreview = computed((): GridPreviewData => {
    const lineCount = Math.max(3, Math.floor(params.divisions / 2))
    const rotation = `rotate(${params.angleStep} ${SVG_CENTER} ${SVG_CENTER})`
    const spacing = (SVG_RADIUS * 2) / (lineCount + 1)
    const start = SVG_CENTER - (lineCount * spacing) / 2

    const lines: PreviewLine[] = []
    const circles: PreviewCircle[] = []

    for (let index = 0; index < lineCount; index += 1) {
      const position = start + spacing * index

      lines.push({
        id: `v-${index}`,
        index,
        x1: position,
        y1: SVG_CENTER - SVG_RADIUS,
        x2: position,
        y2: SVG_CENTER + SVG_RADIUS,
      })

      lines.push({
        id: `h-${index}`,
        index,
        x1: SVG_CENTER - SVG_RADIUS,
        y1: position,
        x2: SVG_CENTER + SVG_RADIUS,
        y2: position,
      })

      circles.push({
        id: `c-h-${index}`,
        index,
        cx: position,
        cy: SVG_CENTER,
        r: spacing * 0.95,
      })

      circles.push({
        id: `c-v-${index}`,
        index,
        cx: SVG_CENTER,
        cy: position,
        r: spacing * 0.95,
      })
    }

    return { lines, circles, rotation }
  })

  const concentricPreview = computed((): ConcentricPreviewData => {
    const ringCount = Math.max(3, params.iterations + 1)
    const scale = ratioScale[params.ratioMode]
    const circles: PreviewCircle[] = []

    for (let index = 0; index < ringCount; index += 1) {
      circles.push({
        id: `concentric-${index}`,
        index,
        cx: SVG_CENTER,
        cy: SVG_CENTER,
        r: SVG_RADIUS * Math.pow(scale, index) * (1 - index / (ringCount * 1.6)),
      })
    }

    return { circles }
  })

  return {
    radialPreview,
    gridPreview,
    concentricPreview,
  }
}
