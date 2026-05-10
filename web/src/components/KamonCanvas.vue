<script setup lang="ts">
import type { KamonParams, PreviewBundle, RatioMode } from '../types/kamon'
import { SVG_CENTER, SVG_RADIUS, ratioLabel, templateLabel } from '../constants/kamon'

interface Props {
  params: KamonParams
  preview: PreviewBundle
  ratioMode: RatioMode
  showBadge?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="flex h-full min-h-[260px] flex-col rounded-xl border border-dashed border-stone-400 bg-stone-50">
    <div v-if="showBadge" class="flex items-center justify-between border-b border-stone-300 px-4 py-3">
      <span class="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700">{{ ratioLabel[ratioMode] }}</span>
      <span class="text-xs text-stone-500">{{ templateLabel[params.templateType] }}</span>
    </div>

    <div class="flex flex-1 items-center justify-center">
      <svg viewBox="0 0 400 400" class="h-full w-full max-w-[540px] p-8">
        <g v-if="params.templateType === 'emblem'" :transform="`rotate(${params.angleStep} ${SVG_CENTER} ${SVG_CENTER})`">
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
            v-for="ring in preview.emblemPreview.rings"
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
            v-for="spoke in preview.emblemPreview.spokes"
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
            v-for="dot in preview.emblemPreview.dots"
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

        <g v-else>
          <circle
            v-for="circle in preview.monPreview.circles"
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
  </div>
</template>
