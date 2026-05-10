<script setup lang="ts">
import type { KamonParams, PreviewBundle } from '../types/kamon'
import { ratioLabel, templateLabel } from '../constants/kamon'
import KamonCanvas from './KamonCanvas.vue'

interface Props {
  params: KamonParams
  currentPreview: PreviewBundle
  goldenPreview: PreviewBundle
  silverPreview: PreviewBundle
}

defineProps<Props>()
</script>

<template>
  <section class="rounded-2xl border border-stone-300 bg-white p-4 md:p-6">
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-base font-semibold md:text-lg">Preview</h2>
      <div class="flex flex-wrap items-center justify-end gap-2">
        <span class="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700">{{ templateLabel[params.templateType] }}</span>
        <span class="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700">
          {{ params.compareMode ? '比較ビュー' : ratioLabel[params.ratioMode] }}
        </span>
      </div>
    </div>

    <div v-if="params.compareMode" class="grid gap-4 md:grid-cols-2">
      <KamonCanvas :params="params" :preview="goldenPreview" ratio-mode="golden" show-badge />
      <KamonCanvas :params="params" :preview="silverPreview" ratio-mode="silver" show-badge />
    </div>
    <div v-else class="h-[62vh] min-h-[420px]">
      <KamonCanvas :params="params" :preview="currentPreview" :ratio-mode="params.ratioMode" />
    </div>
  </section>
</template>
