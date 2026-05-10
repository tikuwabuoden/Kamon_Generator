<script setup lang="ts">
import type { KamonParams, RatioMode, TemplateType } from '../types/kamon'
import { ratioLabel, templateLabel } from '../constants/kamon'

interface Props {
  params: KamonParams
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:ratioMode': [value: RatioMode]
  'update:compareMode': [value: boolean]
  'update:templateType': [value: TemplateType]
  'update:divisions': [value: number]
  'update:iterations': [value: number]
  'update:angleStep': [value: number]
  'update:ratioStrength': [value: number]
  'update:strokeWidth': [value: number]
  'update:fillMode': [value: 'outline' | 'filled']
}>()

const handleRatioModeChange = (mode: RatioMode) => {
  emit('update:ratioMode', mode)
}

const handleCompareModeToggle = () => {
  emit('update:compareMode', !props.params.compareMode)
}

const handleTemplateTypeChange = (template: TemplateType) => {
  emit('update:templateType', template)
}

const handleDivisionsChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:divisions', parseInt(target.value, 10))
}

const handleIterationsChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:iterations', parseInt(target.value, 10))
}

const handleAngleStepChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:angleStep', parseInt(target.value, 10))
}

const handleRatioStrengthChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:ratioStrength', parseInt(target.value, 10))
}

const handleStrokeWidthChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:strokeWidth', parseInt(target.value, 10))
}

const handleFillModeChange = (mode: 'outline' | 'filled') => {
  emit('update:fillMode', mode)
}
</script>

<template>
  <section class="rounded-2xl border border-stone-300 bg-white p-4 md:p-6">
    <h2 class="mb-4 text-base font-semibold md:text-lg">Control Panel</h2>

    <div class="space-y-4">
      <div>
        <label class="mb-2 block text-sm font-medium">表示モード</label>
        <button
          type="button"
          class="flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left text-sm transition"
          :class="params.compareMode ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 bg-stone-100 hover:bg-stone-200'"
          @click="handleCompareModeToggle"
        >
          <span>{{ params.compareMode ? '比較ビュー ON' : '単一ビュー' }}</span>
          <span class="text-xs opacity-80">{{ params.compareMode ? '黄金比 / 白銀比' : '現在の比率モード' }}</span>
        </button>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">テンプレート</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="template in ['emblem', 'mon']"
            :key="template"
            type="button"
            class="rounded-lg border px-3 py-2 text-left text-xs transition md:text-sm"
            :class="params.templateType === template ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 bg-stone-100 hover:bg-stone-200'"
            @click="handleTemplateTypeChange(template as TemplateType)"
          >
            {{ templateLabel[template as TemplateType] }}
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
            @click="handleRatioModeChange(mode as RatioMode)"
          >
            {{ ratioLabel[mode as RatioMode] }}
          </button>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-sm">分割数 n: {{ params.divisions }}</label>
        <input
          :value="params.divisions"
          type="range"
          min="6"
          max="24"
          step="1"
          class="w-full"
          @input="handleDivisionsChange"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm">反復段数 k: {{ params.iterations }}</label>
        <input
          :value="params.iterations"
          type="range"
          min="2"
          max="12"
          step="1"
          class="w-full"
          @input="handleIterationsChange"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm">回転角 θ: {{ params.angleStep }}</label>
        <input
          :value="params.angleStep"
          type="range"
          min="5"
          max="45"
          step="1"
          class="w-full"
          @input="handleAngleStepChange"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm">比率適用強度 r: {{ params.ratioStrength }}%</label>
        <input
          :value="params.ratioStrength"
          type="range"
          min="0"
          max="100"
          step="1"
          class="w-full"
          @input="handleRatioStrengthChange"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm">線太さ w: {{ params.strokeWidth }}</label>
        <input
          :value="params.strokeWidth"
          type="range"
          min="1"
          max="12"
          step="1"
          class="w-full"
          @input="handleStrokeWidthChange"
        />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">塗りモード</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="rounded-lg border px-3 py-2 text-sm transition"
            :class="params.fillMode === 'outline' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 bg-stone-100 hover:bg-stone-200'"
            @click="handleFillModeChange('outline')"
          >
            線画
          </button>
          <button
            type="button"
            class="rounded-lg border px-3 py-2 text-sm transition"
            :class="params.fillMode === 'filled' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300 bg-stone-100 hover:bg-stone-200'"
            @click="handleFillModeChange('filled')"
          >
            ベタ
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
