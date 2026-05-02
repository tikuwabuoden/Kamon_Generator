<script setup lang="ts">
import { computed, reactive } from 'vue'

type RatioMode = 'golden' | 'silver' | 'square'
type EngineType = 'radial' | 'grid' | 'concentric'

type PreviewLine = {
  id: string
  index: number
  x1: number
  y1: number
  x2: number
  y2: number
}

type PreviewCircle = {
  id: string
  index: number
  cx: number
  cy: number
  r: number
}

type PreviewDot = {
  id: string
  index: number
  cx: number
  cy: number
  r: number
}

const SVG_SIZE = 400
const SVG_CENTER = SVG_SIZE / 2
const SVG_RADIUS = 140

const ratioScale: Record<RatioMode, number> = {
  golden: 0.8,
  silver: 0.86,
  square: 0.92,
}

const params = reactive({
  ratioMode: 'silver' as RatioMode,
  engineType: 'radial' as EngineType,
  divisions: 12,
  iterations: 5,
  angleStep: 15,
  ratioStrength: 70,
  strokeWidth: 2,
  fillMode: 'outline' as 'outline' | 'filled',
})

const ratioLabel: Record<RatioMode, string> = {
  golden: '黄金比 (1:1.618)',
  silver: '白銀比 (1:1.414)',
  square: '正方形 (1:1)',
}

const engineLabel: Record<EngineType, string> = {
  radial: '放射型（菊系）',
  grid: '格子交差型（七宝・麻の葉寄り）',
  concentric: '同心反復型（輪重ね）',
}

const radialPreview = computed(() => {
  const spokeCount = Math.max(3, params.divisions)
  const ringCount = Math.max(2, params.iterations)
  const baseRotation = (params.angleStep * Math.PI) / 180

  const spokes = Array.from({ length: spokeCount }, (_, index) => {
    const angle = baseRotation + (index / spokeCount) * Math.PI * 2
    const innerRadius = 30

    return {
      id: `spoke-${index}`,
      x1: SVG_CENTER + Math.cos(angle) * innerRadius,
      y1: SVG_CENTER + Math.sin(angle) * innerRadius,
      x2: SVG_CENTER + Math.cos(angle) * SVG_RADIUS,
      y2: SVG_CENTER + Math.sin(angle) * SVG_RADIUS,
    }
  })

  const rings = Array.from({ length: ringCount }, (_, index) => ({
    id: `ring-${index}`,
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

const gridPreview = computed(() => {
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

const concentricPreview = computed(() => {
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
</script>

<template>
  <div class="min-h-screen bg-stone-100 text-stone-900">
    <div class="mx-auto flex min-h-screen max-w-7xl flex-col p-4 md:p-6">
      <header class="mb-4 rounded-2xl border border-stone-300 bg-white px-5 py-4">
        <h1 class="text-xl font-semibold tracking-wide md:text-2xl">Kamon Generator PoC</h1>
        <p class="mt-1 text-sm text-stone-600">
          フェーズ1: Vue + TypeScript + Vite + Tailwind の土台と2ペインUI
        </p>
      </header>

      <main class="grid flex-1 gap-4 md:grid-cols-[1.5fr_1fr]">
        <section class="rounded-2xl border border-stone-300 bg-white p-4 md:p-6">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-base font-semibold md:text-lg">Preview</h2>
            <div class="flex flex-wrap items-center justify-end gap-2">
              <span class="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700">{{ ratioLabel[params.ratioMode] }}</span>
              <span class="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700">{{ engineLabel[params.engineType] }}</span>
            </div>
          </div>

          <div class="flex h-[62vh] min-h-[420px] items-center justify-center rounded-xl border border-dashed border-stone-400 bg-stone-50">
            <svg viewBox="0 0 400 400" class="h-full w-full max-w-[540px] p-8">
              <g v-if="params.engineType === 'radial'" :transform="`rotate(${params.angleStep} ${SVG_CENTER} ${SVG_CENTER})`">
                <circle
                  cx="200"
                  cy="200"
                  :r="SVG_RADIUS"
                  fill="none"
                  stroke="currentColor"
                  :stroke-width="Math.max(2, params.strokeWidth)"
                  class="opacity-85"
                />
                <circle
                  v-for="ring in radialPreview.rings"
                  :key="ring.id"
                  :cx="ring.cx"
                  :cy="ring.cy"
                  :r="ring.r"
                  fill="none"
                  stroke="currentColor"
                  :stroke-width="params.strokeWidth"
                  class="opacity-70"
                />
                <line
                  v-for="spoke in radialPreview.spokes"
                  :key="spoke.id"
                  :x1="spoke.x1"
                  :y1="spoke.y1"
                  :x2="spoke.x2"
                  :y2="spoke.y2"
                  stroke="currentColor"
                  :stroke-width="params.strokeWidth"
                  stroke-linecap="round"
                  class="opacity-85"
                />
                <circle
                  v-for="dot in radialPreview.dots"
                  :key="dot.id"
                  :cx="dot.cx"
                  :cy="dot.cy"
                  :r="dot.r"
                  :fill="params.fillMode === 'filled' ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  :stroke-width="Math.max(1, params.strokeWidth * 0.7)"
                  :class="dot.index % 2 === 0 ? 'opacity-85' : 'opacity-60'"
                />
                <circle
                  cx="200"
                  cy="200"
                  :r="18 + params.strokeWidth * 1.5"
                  :fill="params.fillMode === 'filled' ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  :stroke-width="params.strokeWidth"
                  class="opacity-90"
                />
              </g>

              <g v-else-if="params.engineType === 'grid'" :transform="gridPreview.rotation">
                <circle
                  cx="200"
                  cy="200"
                  :r="SVG_RADIUS"
                  fill="none"
                  stroke="currentColor"
                  :stroke-width="Math.max(2, params.strokeWidth)"
                  class="opacity-85"
                />
                <rect
                  :x="SVG_CENTER - SVG_RADIUS"
                  :y="SVG_CENTER - SVG_RADIUS"
                  :width="SVG_RADIUS * 2"
                  :height="SVG_RADIUS * 2"
                  fill="none"
                  stroke="currentColor"
                  :stroke-width="params.strokeWidth"
                  class="opacity-80"
                />
                <circle
                  v-for="circle in gridPreview.circles"
                  :key="circle.id"
                  :cx="circle.cx"
                  :cy="circle.cy"
                  :r="circle.r"
                  :fill="params.fillMode === 'filled' && circle.index % 2 === 0 ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  :stroke-width="Math.max(1, params.strokeWidth * 0.9)"
                  class="opacity-50"
                />
                <line
                  v-for="line in gridPreview.lines"
                  :key="line.id"
                  :x1="line.x1"
                  :y1="line.y1"
                  :x2="line.x2"
                  :y2="line.y2"
                  stroke="currentColor"
                  :stroke-width="params.strokeWidth"
                  stroke-linecap="round"
                  :class="line.index % 2 === 0 ? 'opacity-70' : 'opacity-45'"
                />
                <circle
                  cx="200"
                  cy="200"
                  :r="40"
                  :fill="params.fillMode === 'filled' ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  :stroke-width="params.strokeWidth"
                  class="opacity-70"
                />
              </g>

              <g v-else>
                <circle
                  v-for="circle in concentricPreview.circles"
                  :key="circle.id"
                  :cx="circle.cx"
                  :cy="circle.cy"
                  :r="circle.r"
                  :fill="params.fillMode === 'filled' && circle.index % 2 === 0 ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  :stroke-width="params.strokeWidth"
                  :class="circle.index % 2 === 0 ? 'opacity-80' : 'opacity-60'"
                />
              </g>
            </svg>
          </div>
        </section>

        <section class="rounded-2xl border border-stone-300 bg-white p-4 md:p-6">
          <h2 class="mb-4 text-base font-semibold md:text-lg">Control Panel</h2>

          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium">生成エンジンの型</label>
              <div class="grid grid-cols-1 gap-2">
                <button
                  v-for="engine in ['radial', 'grid', 'concentric']"
                  :key="engine"
                  type="button"
                  class="rounded-lg border px-3 py-2 text-left text-xs transition md:text-sm"
                  :class="params.engineType === engine ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 bg-stone-100 hover:bg-stone-200'"
                  @click="params.engineType = engine as EngineType"
                >
                  {{ engineLabel[engine as EngineType] }}
                </button>
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium">比率モード</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="mode in ['golden', 'silver', 'square']"
                  :key="mode"
                  type="button"
                  class="rounded-lg border px-2 py-2 text-xs transition md:text-sm"
                  :class="params.ratioMode === mode ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 bg-stone-100 hover:bg-stone-200'"
                  @click="params.ratioMode = mode as RatioMode"
                >
                  {{ ratioLabel[mode as RatioMode] }}
                </button>
              </div>
            </div>

            <div>
              <label class="mb-1 block text-sm">分割数 n: {{ params.divisions }}</label>
              <input v-model="params.divisions" type="range" min="6" max="24" step="1" class="w-full" />
            </div>

            <div>
              <label class="mb-1 block text-sm">反復段数 k: {{ params.iterations }}</label>
              <input v-model="params.iterations" type="range" min="2" max="12" step="1" class="w-full" />
            </div>

            <div>
              <label class="mb-1 block text-sm">回転角 θ: {{ params.angleStep }}</label>
              <input v-model="params.angleStep" type="range" min="5" max="45" step="1" class="w-full" />
            </div>

            <div>
              <label class="mb-1 block text-sm">比率適用強度 r: {{ params.ratioStrength }}%</label>
              <input v-model="params.ratioStrength" type="range" min="0" max="100" step="1" class="w-full" />
            </div>

            <div>
              <label class="mb-1 block text-sm">線太さ w: {{ params.strokeWidth }}</label>
              <input v-model="params.strokeWidth" type="range" min="1" max="12" step="1" class="w-full" />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium">塗りモード</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  class="rounded-lg border px-3 py-2 text-sm transition"
                  :class="params.fillMode === 'outline' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 bg-stone-100 hover:bg-stone-200'"
                  @click="params.fillMode = 'outline'"
                >
                  線画
                </button>
                <button
                  type="button"
                  class="rounded-lg border px-3 py-2 text-sm transition"
                  :class="params.fillMode === 'filled' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 bg-stone-100 hover:bg-stone-200'"
                  @click="params.fillMode = 'filled'"
                >
                  ベタ
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
