import { computed } from 'vue'
import type {
  KamonParams,
  EmblemPreviewData,
  MonPreviewData,
  PreviewBundle,
  PreviewDot,
  PreviewCircle,
  RatioMode,
} from '../types/kamon'
import { SVG_CENTER, SVG_RADIUS, ratioScale } from '../constants/kamon'

const buildEmblemPreview = (params: KamonParams): EmblemPreviewData => {
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
}

const buildMonPreview = (params: KamonParams): MonPreviewData => {
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
}

const buildPreviewBundle = (params: KamonParams): PreviewBundle => {
  return {
    emblemPreview: buildEmblemPreview(params),
    monPreview: buildMonPreview(params),
  }
}

const withRatioMode = (params: KamonParams, ratioMode: RatioMode): KamonParams => {
  return {
    ...params,
    ratioMode,
  }
}

export function useKamonPreview(params: KamonParams) {
  const currentPreview = computed((): PreviewBundle => buildPreviewBundle(params))
  const goldenPreview = computed((): PreviewBundle => buildPreviewBundle(withRatioMode(params, 'golden')))
  const silverPreview = computed((): PreviewBundle => buildPreviewBundle(withRatioMode(params, 'silver')))

  return {
    currentPreview,
    goldenPreview,
    silverPreview,
  }
}
