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
import { SVG_CENTER, SVG_RADIUS, ratioValue } from '../constants/kamon'

const GOLDEN_RATIO = ratioValue.golden

const lerp = (from: number, to: number, t: number) => from + (to - from) * t

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

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
  const circles: PreviewCircle[] = []
  const accents: PreviewCircle[] = []
  const strength = clamp(params.ratioStrength / 100, 0, 1)
  const normalizedRatio = (ratioValue[params.ratioMode] - 1) / (GOLDEN_RATIO - 1)
  const harmonicBias = normalizedRatio * strength
  const decay = lerp(0.84, lerp(0.68, 0.76, 1 - normalizedRatio), strength)
  const outerRadius = lerp(SVG_RADIUS * 0.82, SVG_RADIUS * (0.72 + normalizedRatio * 0.18), strength)
  const spacingLift = lerp(0.9, 1.08 - normalizedRatio * 0.12, strength)

  let radius = outerRadius

  for (let index = 0; index < ringCount; index += 1) {
    const taper = lerp(1, 1 - index / (ringCount * (1.55 + harmonicBias * 0.35)), strength * 0.8)

    circles.push({
      id: `concentric-${index}`,
      index,
      cx: SVG_CENTER,
      cy: SVG_CENTER,
      r: Math.max(18, radius * taper),
    })

    radius *= decay * spacingLift
  }

  const accentCount = Math.max(4, Math.floor(params.divisions / 3))
  const accentOrbit = circles[Math.min(1, circles.length - 1)]?.r ?? outerRadius * 0.7
  const accentOffset = (params.angleStep * Math.PI) / 180
  const accentPhase = lerp(0, Math.PI / Math.max(4, accentCount), strength * normalizedRatio)
  const accentDistance = accentOrbit * lerp(0.88, 1.08 - normalizedRatio * 0.08, strength)
  const accentSize = lerp(
    0,
    Math.max(3, params.strokeWidth * (1.6 - normalizedRatio * 0.2)),
    strength * (0.35 + normalizedRatio * 0.65),
  )

  if (accentSize > 0.5) {
    for (let index = 0; index < accentCount; index += 1) {
      const angle = accentOffset + accentPhase + (index / accentCount) * Math.PI * 2

      accents.push({
        id: `accent-${index}`,
        index,
        cx: SVG_CENTER + Math.cos(angle) * accentDistance,
        cy: SVG_CENTER + Math.sin(angle) * accentDistance,
        r: accentSize,
      })
    }
  }

  return { circles, accents }
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
