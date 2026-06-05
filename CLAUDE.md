# loop-x-next-bus

1 路線のバス時刻表 web アプリ。非営利・個人実用目的だが公開する。同じ路線の利用者にも役立つことを狙う。

## 方針

- **コスト 0 運用**。サーバー・DB・有料 SaaS を入れない。時刻表データは静的にリポジトリへ持つ。
- 「次のバスまであと何分」はクライアント側 JS で計算する(ユーザーのブラウザ時刻基準)。バックエンド不要。
- 公開物なので個人情報・位置情報の収集はしない。分析タグも入れない(必要になったら都度判断)。

## 技術スタック

- Vite + TypeScript(vanilla、フレームワーク無し)
- パッケージマネージャ: pnpm
- ホスティング: GitHub Pages(`main` push で `.github/workflows/deploy.yml` が自動デプロイ)

## ビルド / 開発

```sh
pnpm dev      # ローカル開発サーバー
pnpm build    # tsc + vite build → dist/
pnpm preview  # ビルド結果のローカル確認
```

## GitHub Pages 設定の注意

- `vite.config.ts` の `base` はリポジトリ名 `/loop-x-next-bus/` に固定。リポジトリ名を変えたら必ず追従させる。
- 公開 URL: `https://katsurashima.github.io/loop-x-next-bus/`
- Pages の有効化はリポジトリ Settings → Pages → Source を「GitHub Actions」にする(初回のみ手動)。

## 時刻表データ

- ダイヤ改正時に手動更新する前提。データの出所(事業者・改正日)をコメントで必ず残す。
- 著作権: 時刻表の数値データそのものに著作権は及びにくいが、事業者の表記・ロゴ・路線図画像は転載しない。出所は記録する。
