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
  const strength = clamp(params.ratioStrength / 100, 0, 1)
  const normalizedRatio = (ratioValue[params.ratioMode] - 1) / (GOLDEN_RATIO - 1)
  const ornamentBias = normalizedRatio * strength
  const spokeReach = lerp(SVG_RADIUS * 0.82, SVG_RADIUS * (0.76 + normalizedRatio * 0.22), strength)
  const innerRadius = lerp(28, lerp(44, 34, 1 - normalizedRatio), strength)
  const petalOrbit = lerp(SVG_RADIUS * 0.54, SVG_RADIUS * (0.48 + normalizedRatio * 0.16), strength)
  const petalRadius = lerp(
    0,
    Math.max(10, SVG_RADIUS * (0.08 + normalizedRatio * 0.06)),
    strength * (0.35 + normalizedRatio * 0.65),
  )

  const spokes = Array.from({ length: spokeCount }, (_, index) => {
    const angle = baseRotation + (index / spokeCount) * Math.PI * 2

    return {
      id: `spoke-${index}`,
      index,
      x1: SVG_CENTER + Math.cos(angle) * innerRadius,
      y1: SVG_CENTER + Math.sin(angle) * innerRadius,
      x2: SVG_CENTER + Math.cos(angle) * spokeReach,
      y2: SVG_CENTER + Math.sin(angle) * spokeReach,
    }
  })

  const rings = Array.from({ length: ringCount }, (_, index) => {
    const progress = (index + 1) / (ringCount + 1)
    const easedProgress = Math.pow(progress, lerp(1.08, 0.8, ornamentBias))
    const radius = lerp(SVG_RADIUS * 0.22, SVG_RADIUS * (0.52 + normalizedRatio * 0.18), easedProgress)

    return {
      id: `ring-${index}`,
      index,
      cx: SVG_CENTER,
      cy: SVG_CENTER,
      r: radius,
    }
  })

  const dots: PreviewDot[] = Array.from({ length: spokeCount }, (_, index) => {
    const angle = baseRotation + (index / spokeCount) * Math.PI * 2
    const dotRadius = lerp(
      4 + params.strokeWidth * 0.4,
      5 + params.strokeWidth * (0.8 + normalizedRatio * 0.25),
      strength,
    )

    return {
      id: `dot-${index}`,
      index,
      cx: SVG_CENTER + Math.cos(angle) * lerp(SVG_RADIUS * 0.72, SVG_RADIUS * (0.7 + normalizedRatio * 0.18), strength),
      cy: SVG_CENTER + Math.sin(angle) * lerp(SVG_RADIUS * 0.72, SVG_RADIUS * (0.7 + normalizedRatio * 0.18), strength),
      r: dotRadius,
    }
  })

  const petals: PreviewCircle[] = []

  if (petalRadius > 0.5) {
    const petalCount = Math.max(6, Math.floor(params.divisions / 2) * 2)
    const petalPhase = lerp(0, Math.PI / petalCount, strength * 0.6)

    for (let index = 0; index < petalCount; index += 1) {
      const angle = baseRotation + petalPhase + (index / petalCount) * Math.PI * 2

      petals.push({
        id: `petal-${index}`,
        index,
        cx: SVG_CENTER + Math.cos(angle) * petalOrbit,
        cy: SVG_CENTER + Math.sin(angle) * petalOrbit,
        r: petalRadius,
      })
    }
  }

  return { rings, spokes, dots, petals }
}

const buildMonPreview = (params: KamonParams): MonPreviewData => {
  const ringCount = Math.max(3, params.iterations + 1)
  const circles: PreviewCircle[] = []
  const accents: PreviewCircle[] = []
  const strength = clamp(params.ratioStrength / 100, 0, 1)
  const normalizedRatio = (ratioValue[params.ratioMode] - 1) / (GOLDEN_RATIO - 1)
  const harmonicBias = normalizedRatio * strength
  const calmBias = (1 - normalizedRatio) * strength
  const decay = lerp(0.84, lerp(0.64, 0.8, 1 - normalizedRatio), strength)
  const outerRadius = lerp(
    SVG_RADIUS * 0.82,
    SVG_RADIUS * lerp(0.67, 0.86, normalizedRatio),
    strength,
  )
  const spacingLift = lerp(0.9, lerp(1.18, 0.92, normalizedRatio), strength)
  const minimumRadius = lerp(18, lerp(28, 16, normalizedRatio), strength)

  let radius = outerRadius

  for (let index = 0; index < ringCount; index += 1) {
    const taperBase = 1 - index / (ringCount * (1.45 + harmonicBias * 0.4 + calmBias * 0.2))
    const taper = lerp(1, taperBase, strength * 0.85)
    const pulse = 1 + Math.sin((index / Math.max(1, ringCount - 1)) * Math.PI) * harmonicBias * 0.09

    circles.push({
      id: `concentric-${index}`,
      index,
      cx: SVG_CENTER,
      cy: SVG_CENTER,
      r: Math.max(minimumRadius, radius * taper * pulse),
    })

    radius *= decay * spacingLift
  }

  const accentCount = Math.max(4, Math.floor(params.divisions / 3))
  const accentOrbit = circles[Math.min(1, circles.length - 1)]?.r ?? outerRadius * 0.7
  const accentOffset = (params.angleStep * Math.PI) / 180
  const accentPhase = lerp(0, Math.PI / Math.max(4, accentCount), strength * (0.2 + normalizedRatio * 0.8))
  const accentDistance = accentOrbit * lerp(0.84, lerp(1.14, 0.92, 1 - normalizedRatio), strength)
  const accentSize = lerp(
    0,
    Math.max(3, params.strokeWidth * lerp(1.25, 1.9, normalizedRatio)),
    strength * (0.28 + normalizedRatio * 0.72),
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
