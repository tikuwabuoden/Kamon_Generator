<script setup lang="ts">
import type { KamonParams, EmblemPreviewData, MonPreviewData } from '../types/kamon'
import { ratioLabel, templateLabel, SVG_CENTER, SVG_RADIUS } from '../constants/kamon'

interface Props {
  params: KamonParams
  emblemPreview: EmblemPreviewData
  monPreview: MonPreviewData
}

defineProps<Props>()
</script>

<template>
  <section class="rounded-2xl border border-stone-300 bg-white p-4 md:p-6">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-base font-semibold md:text-lg">Preview</h2>
      <div class="flex flex-wrap items-center justify-end gap-2">
        <span class="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700">{{ ratioLabel[params.ratioMode] }}</span>
        <span class="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700">{{ templateLabel[params.templateType] }}</span>
      </div>
    </div>

    <div class="flex h-[62vh] min-h-[420px] items-center justify-center rounded-xl border border-dashed border-stone-400 bg-stone-50">
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
            v-for="ring in emblemPreview.rings"
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
            v-for="spoke in emblemPreview.spokes"
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
            v-for="dot in emblemPreview.dots"
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
            v-for="circle in monPreview.circles"
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
