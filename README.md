# LOOP-X シャトルバス時刻表｜次のバスまであと何分（田町駅）

田町駅 ⇔ LOOP-X 無料シャトルバスの「次のバスまであと何分」を表示する Web アプリ。

🔗 **公開ページ: https://katsurashima.github.io/loop-x-next-bus/**

## 特徴

- 次のバスまでの待ち時間をリアルタイム表示（日本時間基準）
- 上り・下り両方向、平日ダイヤ対応（土日祝・年末年始は運休判定）
- ホーム画面に追加できる PWA・オフライン動作
- サーバー不要・コスト0運用

## 非公式について

このサイトは有志による非公式の時刻表ビューアーです。シダックスおよび LOOP-X とは関係ありません。時刻表データは公式ページ（<https://www.shidax.co.jp/dst/loop-x/>）をもとに手入力しています。実際の運行は事業者の最新案内をご確認ください。

## 開発

Vite + TypeScript（vanilla）/ パッケージマネージャは pnpm。

```sh
pnpm dev      # 開発サーバー
pnpm build    # 本番ビルド（tsc + vite build）
pnpm test     # ユニットテスト（vitest）
```

`main` への push で GitHub Actions が GitHub Pages へ自動デプロイします。
