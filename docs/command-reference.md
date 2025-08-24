---
id: wl68kvnhivc
title: コマンドリファレンス
date: "2025-08-24"
updated: "2025-08-24"
category: ""
thumbnail: ""
tags: ["command", "reference", "guide"]
slug: docs
lang: ja
---

# コマンドリファレンス

このドキュメントは `content-manager-cli` の各コマンドの詳しい使い方とオプションを解説します．

> 推奨される実践的なワークフローについては，**[ベストプラクティス](./best-practices.md)** を参照してください．

---

## `init`

新しいコンテンツ管理プロジェクトを初期化し，設定ファイル `content.config.json` を作成します．

### 書式

```bash
content init [contentDir] [options]
```

### 引数

- **`[contentDir]`** (任意)
  - 初期化するディレクトリのパスを指定します．
  - デフォルト: `content`

### オプション

- **`-c, --content-name <name>`**
  - コンテンツプロジェクトの名前を定義します．省略した場合，`contentDir` のディレクトリ名が使われます．
- **`-m, --meta-index-file <filename>`**
  - `build` コマンドで生成されるメタ情報ファイルのデフォルト名を指定します．
- **`-a, --author <name>`**
  - コンテンツ作成時のデフォルトの著者名を設定します．
- **`-l, --lang <lang>`**
  - コンテンツのデフォルト言語コードを設定します (例: `ja`, `en`)．
- **`-f, --file-patterns <patterns>`**
  - `build` コマンドがスキャンするファイルのパターンをカンマ区切りで指定します (例: `**/*.md,**/*.html`)．

---

## `create`

新しいコンテンツファイル（Markdown）を，指定したディレクトリ構造で作成します．

### 書式

```bash
content create <contentDir> [options]
```

### 引数

- **`<contentDir>`** (必須)
  - `content.config.json` が配置されているディレクトリを指定します．

### オプション

- **`-s, --structure <structure>`** (必須)
  - コンテンツを作成する際のディレクトリ構造を，`category`，`date`，`title` を使って指定します．
  - `/` はディレクトリ階層の区切り，`-` は同一階層内での単語の連結を意味します．
  - 例: `category/date-title` は `<contentDir>/<category>/<date>-<title>` という構造を生成します．
- **`-c, --category <category>`**
  - コンテンツのカテゴリ名を指定します．`structure` に `category` を含む場合は必須です．
- **`-d, --date [date]`**
  - 作成日を `YYYY-MM-DD` 形式または `today` で指定します．
  - デフォルト: `today`
- **`-t, --title [title]`**
  - コンテンツのタイトルを指定します．
  - デフォルト: `untitled`
- **`-f, --filename [filename]`**
  - 作成するファイルの名前（拡張子なし）を指定します．
  - デフォルト: `index`
- **`--force`**
  - 同名のファイルが既に存在する場合，確認なしで上書きします．

### 使用例

```bash
# カテゴリ/タイトルの構造でコンテンツを作成
content create content --structure category/title --category news --title "new-product-release"

# 日付-タイトル という名前のディレクトリ配下に作成
content create content --structure date-title --date 2025-08-23 --title "recap-of-the-event"
```

---

## `build`

コンテンツファイルを解析し，メタデータファイル (`content.meta.json`) を生成・更新します．

### 書式

```bash
content build <contentDir> [options]
```

### 引数

- **`<contentDir>`** (必須)
  - `content.config.json` が配置されているディレクトリを指定します．

### オプション

- **`--target <structure>`**
  - メタデータ生成の対象とするディレクトリ構造を限定します (例: `--target category` でカテゴリのトップレベルのみを対象とする)．
- **`-c, --category <category>`**
  - 指定したカテゴリ名のディレクトリのみをビルド対象とします．
- **`-o, --outFile <path>`**
  - メタデータファイルの出力パスを上書きします．
- **`--pretty`**
  - 出力する JSON ファイルを整形（インデント付き）します．

---

## `gh-pages`

GitHub Actions のワークフローファイル (`.github/workflows/content-gh-pages.yml`) を生成し，コンテンツの自動デプロイを設定します．

### 書式

```bash
content gh-pages <contentDir> [options]
```

### 引数

- **`<contentDir>`** (必須)
  - `content.config.json` が配置されているディレクトリを指定します．

### オプション

- **`-b, --branch <branch>`**
  - ワークフローを起動するトリガーとなるブランチ名．
  - デフォルト: `main`
- **`-d, --build-dir <dir>`**
  - ビルド後の成果物が格納されるディレクトリ．
- **`-p, --publish-type <type>`**
  - 公開方法を指定します．
  - デフォルト: `sameRepoMain`
  - 指定可能な値:
    - `sameRepoMain`: 同じリポジトリの `main` ブランチをソースとして GitHub Pages にデプロイ．
    - `sameRepoGhPages`: 同じリポジトリの `gh-pages` ブランチにプッシュして公開．
    - `otherRepoMain`: 別のリポジトリの `main` ブランチにプッシュ．
    - `otherRepoGhPages`: 別のリポジトリの `gh-pages` ブランチにプッシュ．
    - `privateRepo`: プライベートリポジトリにプッシュ．
    - `externalService`: Vercel などの外部サービスにデプロイ．
- **`-r, --ext-repo <repo>`**
  - `publish-type` で `otherRepo~` を選択した場合に，デプロイ先の外部リポジトリを `owner/repo` の形式で指定します．
- **`-t, --token-name <name>`**
  - デプロイに使用する Personal Access Token の Secret 名を指定します．
  - デフォルト: `ACTIONS_DEPLOY_KEY`
- **`-j, --jekyll`**
  - Jekyll を使用してビルドするステップをワークフローに追加します．
- **`--force`**
  - 既にワークフローファイルが存在する場合でも，確認メッセージなしで上書きします．

---

## `config`

設定ファイル (`content.config.json`) の内容を表示・変更します．

**注意:** このコマンドは現在実装されていません．将来のバージョンで追加される予定です．
