# Kamon_Generator

- PoC仕様: [PoC_Spec.md](PoC_Spec.md)

## フロントエンド実装（web）

- フロント実装は `web/` 配下に作成
- 技術: Vue + TypeScript + Vite + Tailwind CSS + SVG

起動手順:

1. `cd web`
2. `npm install`
3. `npm run dev`

ビルド確認:

- `npm run build`

## Commit Message Rule

コミットメッセージは先頭に種別プレフィックスを付ける。

- feat: 新機能追加
- fix: バグ修正
- docs: ドキュメント修正
- refactor: 振る舞いを変えない内部改善
- test: テスト追加・修正
- chore: 雑務的変更（設定、依存更新など）
- add: 新規ファイルや初期追加を強調したいときに使用可

形式:

- type: summary

例:

- feat: 家紋の比率モード切り替えを追加
- fix: 回転角スライダーの境界値バグを修正
- docs: PoC仕様に受け入れ条件を追記
- add: 初期SVGテンプレートを追加