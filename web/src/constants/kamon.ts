import type { RatioMode, TemplateType } from '../types/kamon'

export const SVG_SIZE = 400
export const SVG_CENTER = SVG_SIZE / 2
export const SVG_RADIUS = 140

export const ratioValue: Record<RatioMode, number> = {
  golden: 1.618,
  silver: 1.414,
  square: 1,
}

export const ratioLabel: Record<RatioMode, string> = {
  golden: '黄金比 (1:1.618)',
  silver: '白銀比 (1:1.414)',
  square: '正方形 (1:1)',
}

export const templateLabel: Record<TemplateType, string> = {
  emblem: 'Emblem',
  mon: 'Mon',
  shippo: '七宝',
}

export const initialParams = {
  ratioMode: 'silver' as RatioMode,
  compareMode: false,
  templateType: 'mon' as TemplateType,
  divisions: 12,
  iterations: 5,
  angleStep: 15,
  ratioStrength: 70,
  strokeWidth: 2,
  fillMode: 'outline' as 'outline' | 'filled',
}
