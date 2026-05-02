import type { RatioMode, EngineType } from '../types/kamon'

export const SVG_SIZE = 400
export const SVG_CENTER = SVG_SIZE / 2
export const SVG_RADIUS = 140

export const ratioScale: Record<RatioMode, number> = {
  golden: 0.8,
  silver: 0.86,
  square: 0.92,
}

export const ratioLabel: Record<RatioMode, string> = {
  golden: '黄金比 (1:1.618)',
  silver: '白銀比 (1:1.414)',
  square: '正方形 (1:1)',
}

export const engineLabel: Record<EngineType, string> = {
  radial: '放射型（菊系）',
  grid: '格子交差型（七宝・麻の葉寄り）',
  concentric: '同心反復型（輪重ね）',
}

export const initialParams = {
  ratioMode: 'silver' as RatioMode,
  engineType: 'radial' as EngineType,
  divisions: 12,
  iterations: 5,
  angleStep: 15,
  ratioStrength: 70,
  strokeWidth: 2,
  fillMode: 'outline' as 'outline' | 'filled',
}
