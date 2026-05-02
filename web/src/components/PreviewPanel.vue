<script setup lang="ts">
import type { KamonParams, RadialPreviewData, GridPreviewData, ConcentricPreviewData } from '../types/kamon'
import { ratioLabel, engineLabel, SVG_CENTER, SVG_RADIUS } from '../constants/kamon'

interface Props {
  params: KamonParams
  radialPreview: RadialPreviewData
  gridPreview: GridPreviewData
  concentricPreview: ConcentricPreviewData
}

defineProps<Props>()
</script>

<template>
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
</template>
