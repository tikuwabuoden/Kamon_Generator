<script setup lang="ts">
import { reactive } from 'vue'
import type { KamonParams } from './types/kamon'
import { initialParams } from './constants/kamon'
import { useKamonPreview } from './composables/useKamonPreview'
import PreviewPanel from './components/PreviewPanel.vue'
import ControlPanel from './components/ControlPanel.vue'

const params = reactive<KamonParams>(initialParams)

const { radialPreview, gridPreview, concentricPreview } = useKamonPreview(params)

const updateParam = <K extends keyof KamonParams>(key: K, value: KamonParams[K]) => {
  params[key] = value
}
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
        <PreviewPanel
          :params="params"
          :radial-preview="radialPreview"
          :grid-preview="gridPreview"
          :concentric-preview="concentricPreview"
        />

        <ControlPanel
          :params="params"
          @update:ratio-mode="(v) => updateParam('ratioMode', v)"
          @update:engine-type="(v) => updateParam('engineType', v)"
          @update:divisions="(v) => updateParam('divisions', v)"
          @update:iterations="(v) => updateParam('iterations', v)"
          @update:angle-step="(v) => updateParam('angleStep', v)"
          @update:ratio-strength="(v) => updateParam('ratioStrength', v)"
          @update:stroke-width="(v) => updateParam('strokeWidth', v)"
          @update:fill-mode="(v) => updateParam('fillMode', v)"
        />
      </main>
    </div>
  </div>
</template>
