---
id: yirknx3ban9
title: ベストプラクティス
date: "2025-08-24"
updated: "2025-08-24"
category: documentation
thumbnail: ""
tags: ["best-practice", "workflow", "guide"]
slug: docs
lang: ja
---

# ベストプラクティス: 推奨されるコンテンツ管理フロー

このドキュメントでは，`content-manager-cli` を使用して，ブログやドキュメントサイトのようなスケーラブルなコンテンツプロジェクトを管理するための，推奨されるワークフローとディレクトリ構造を解説します．

> 各コマンドの詳しいオプションについては，**[コマンドリファレンス](./command-reference.md)** を参照してください．

---

## 基本方針: `category/date-title` 構造の採用

本ツールは柔軟なディレクトリ構造をサポートしていますが，多くのプロジェクトにとって理想的な構造として `--structure category/date-title` を推奨します．

- **`category` (カテゴリ)**: コンテンツを大きな主題で分類します．これにより，関心事の分離が明確になり，サイトのナビゲーションも作りやすくなります．(例: `tech`, `life`, `docs`)
- **`date-title` (日付-タイトル)**: カテゴリ内でコンテンツが一意に識別できるように，作成日とタイトルをハイフンで連結します．これにより，時系列での並び替えが容易になり，URL も人間が読んで理解しやすいものになります．

この構造 (`<contentDir>/<カテゴリ>/<日付>-<タイトル>/index.md`) を採用することで，コンテンツが増えても破綻しにくい，スケーラブルな管理が可能になります．

---

## 実践的ワークフロー

以下に，`tech` と `event` というカテゴリを持つブログサイトを運営するケースを想定した，具体的なステップを示します．

### Step 1: プロジェクトの初期化

まず，コンテンツを管理するためのプロジェクトを初期化します．ここでは `my-blog` というディレクトリを作成し，その中に `articles` という名前のコンテンツディレクトリを準備します．

```bash
mkdir my-blog
cd my-blog

# `articles` ディレクトリを初期化
content init articles --author "Your Name"
```

このコマンドにより，`articles/content.config.json` が生成され，プロジェクトの基本的な設定が定義されます．

**ファイル構造:**

```
my-blog/
└── articles/
    └── content.config.json
```

### Step 2: 推奨構造でのコンテンツ作成

次に，`tech` と `event` のカテゴリに新しい記事をそれぞれ作成します．`--structure category/date-title` オプションを使い，推奨されるディレクトリ構造でファイルを生成します．

#### 技術記事の作成 (tech)

```bash
content create articles --structure category/date-title --category tech --title "cli-tool-best-practice"
```

ショートカット記法を使用すると，以下のように書くこともできます．

```bash
content create articles -s c/d-t -c tech -t "cli-tool-best-practice"
```

#### イベント告知の作成 (event)

```bash
content create articles --structure category/date-title --category event --title "annual-tech-conference" --date 2025-09-01
```

ショートカット記法を使用すると，以下のように書くこともできます．

```bash
content create articles -s c/d-t -c event -t "annual-tech-conference" -d 2025-09-01
```

これらのコマンドは，`articles/tech/` と `articles/event/` の各カテゴリ内に，`YYYY-MM-DD-title` という名前のディレクトリと，その中に基本的なフロントマターが記述された `index.md` をそれぞれ生成します．

**ファイル構造:**

```
my-blog/
└── articles/
    ├── event/
    │   └── 2025-09-01-annual-tech-conference/
    │       └── index.md
    ├── tech/
    │   └── 2025-08-23-cli-tool-best-practice/
    │       └── index.md
    └── content.config.json
```

### Step 3: メタデータのビルド

コンテンツを作成したら，`build` コマンドでメタデータを集約し，カテゴリごとの記事一覧ページなどに利用できる `content.meta.json` を作成します．

#### 全カテゴリの一括ビルド

まず，プロジェクトに存在する全てのカテゴリを一度にビルドします．`--target category` を指定するのが最も明示的で推奨される方法です．

```bash
content build articles --target category
```

このコマンドは `articles` ディレクトリ全体をスキャンし，コンテンツが存在する各カテゴリ (`tech`, `event`) のディレクトリ直下に，それぞれのメタ情報を集約した `content.meta.json` を生成します．

**ファイル構造:**

```
my-blog/
└── articles/
    ├── event/
    │   ├── 2025-09-01-annual-tech-conference/
    │   │   └── index.md
    │   └── content.meta.json  <-- これが生成される
    ├── tech/
    │   ├── 2025-08-23-cli-tool-best-practice/
    │   │   └── index.md
    │   └── content.meta.json  <-- これが生成される
    └── content.config.json
```

#### (補足) 特定カテゴリのみのビルド

特定のカテゴリのみを更新したい場合は，`--category` (`-c`) オプションを追加します．例えば，`event` カテゴリだけを再ビルドする際は，以下のコマンドを実行します．

```bash
content build articles --target category --category event
```

ショートカット記法を使用すると，以下のように書くこともできます．

```bash
content build articles --target c -c event
```

この場合，`articles/event/content.meta.json` のみが作成・更新されます．

### Step 4: デプロイの自動化

コンテンツの準備ができたら，`gh-pages` コマンドでデプロイを自動化します．このコマンドは，目的に応じて柔軟な公開方法を提供します．

#### ユースケース 1: コンテンツを API として提供する (ヘッドレス CMS)

この方法では，生の Markdown ファイルとメタデータ (`content.meta.json`) をそのままリポジトリに公開します．React や Next.js などで作られたフロントエンドアプリケーションから，これらのファイルを API のようにフェッチして表示する「ヘッドレス CMS」としての利用を想定しています．

以下のコマンドは，この目的のための基本的なワークフロー (`.github/workflows/content-gh-pages.yml`) を生成します．

```bash
content gh-pages articles
```

このワークフローは，`main` ブランチにプッシュがあるたびに，`articles` ディレクトリの内容を GitHub Pages として公開します．フロントエンド側では，まず `content.meta.json` をフェッチして記事一覧を取得し，次にユーザーが選択した記事の Markdown ファイルのパスを特定して，その内容を取得・表示する，といった実装が可能になります．

#### ユースケース 2: 静的サイトとして直接公開する

ブログやドキュメントサイトとして，変換済みの HTML を直接公開したい場合は `--jekyll` オプションを利用します．

```bash
content gh-pages articles --jekyll
```

このコマンドで生成されるワークフローには，Markdown ファイルを HTML に変換する Jekyll のビルドステップが追加されます．これにより，訪問者は GitHub Pages の URL にアクセスするだけで，整形されたコンテンツを直接閲覧できるようになります．

---

## 最終的なプロジェクト構造

ここまでのステップを完了すると，プロジェクトは以下のような整理された構造になります．

```
my-blog/
├── .github/
│   └── workflows/
│       └── content-gh-pages.yml
└── articles/
    ├── event/
    │   ├── 2025-09-01-annual-tech-conference/
    │   │   └── index.md
    │   └── content.meta.json
    ├── tech/
    │   ├── 2025-08-23-cli-tool-best-practice/
    │   │   └── index.md
    │   └── content.meta.json
    └── content.config.json
```

この管理フローに従うことで，コンテンツの追加，メタデータの更新，そしてデプロイまでの一連の作業を，体系的かつ効率的に行うことができます．
