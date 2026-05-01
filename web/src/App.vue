<script setup lang="ts">
import { reactive } from 'vue'

type RatioMode = 'golden' | 'silver' | 'square'
type EngineType = 'radial' | 'grid' | 'concentric'

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
              <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" :stroke-width="params.strokeWidth" />
              <circle cx="200" cy="200" r="90" fill="none" stroke="currentColor" :stroke-width="params.strokeWidth" class="opacity-80" />
              <circle cx="200" cy="200" r="40" fill="none" stroke="currentColor" :stroke-width="params.strokeWidth" class="opacity-60" />
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
