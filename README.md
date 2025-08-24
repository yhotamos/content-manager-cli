# Content Manager CLI

![NPM Version](https://img.shields.io/npm/v/%40yhotamos%2Fcontent-manager-cli)
![NPM Downloads](https://img.shields.io/npm/dm/%40yhotamos%2Fcontent-manager-cli)
![NPM License](https://img.shields.io/npm/l/%40yhotamos%2Fcontent-manager-cli)

カテゴリごとに Markdown コンテンツとメタ情報を管理できる汎用 CLI ツールです．

## 主な特徴

- **柔軟なディレクトリ管理**: カテゴリ・日付・タイトルを自由に組み合わせ，分かりやすい構造でコンテンツを整理．
- **メタ情報付き Markdown**: メタデータ入りの Markdown ファイルをそのまま作成・管理できる．
- **メタデータ自動集約**: 複数のコンテンツからメタ情報をまとめ上げ，一覧やサイトマップを自動生成．
- **GitHub Pages 公開対応**: GitHub Pages へのデプロイ用ワークフローも自動で用意．

## 要件

- Node.js (LTS 版を推奨)

## インストール

```bash
npm install -g @yhotamos/content-manager-cli
```

## 基本的な構文

```
content <command> [contentDir] [options]
```

- `<command>`: 実行するコマンド (`init`, `create`, `build` など)
- `[contentDir]`: `content.config.json` が配置されている，または作成されるディレクトリ．多くのコマンドで必須です．
- `[options]`: `-c, --category` のようなコマンド固有のオプション．

## 基本的な使い方

1.  **プロジェクトディレクトリの作成**

    ```bash
    mkdir my-project
    cd my-project
    ```

2.  **コンテンツ管理の初期化**

    プロジェクト内に，コンテンツを管理するためのディレクトリを作成します．(デフォルトでは `content` という名前になります)

    ```bash
    content init
    ```

3.  **コンテンツの作成**

    カテゴリ `news`，タイトル `my-first-post` でコンテンツを作成します．
    `--structure category/title` は `<カテゴリ>/<タイトル>` というディレクトリ構造を意味します．

    ```bash
    # ./content/news/my-first-post/index.md が作成される
    content create content --structure category/title --category news --title "my-first-post"
    ```

    ショートカット記法を使用すると，以下のように書くこともできます．

    ```bash
    content create content -s c/t -c news -t "my-first-post"
    ```

4.  **メタデータのビルド**

    カテゴリ(`--category news`)を指定し，そのカテゴリのディレクトリ(`--target category`)をビルドします．これにより，`content/news/content.meta.json` が生成されます．

    ```bash
    content build content --target category --category news
    ```

    ショートカット記法を使用すると，以下のように書くこともできます．

    ```bash
    content build content --target c -c news
    ```

上記のコマンドを実行すると，最終的なディレクトリ構成は以下のようになります．

```bash
my-project/
└── content/
    ├── news/
    │   ├── my-first-post/
    │   │   └── index.md           # createコマンドで生成
    │   └── content.meta.json      # buildコマンドで生成
    └── content.config.json　      # initコマンドで生成
```

---

## ドキュメント

より詳細な情報については，以下のドキュメントを参照してください．

- **[コマンドリファレンス](./docs/command-reference.md)**: 全てのコマンドと，そのオプションの詳細な説明．
- **[ベストプラクティス](./docs/best-practices.md)**: 推奨されるコンテンツ管理のワークフローと実践的な例．

## コマンド一覧

| コマンド           | 説明                                                         |
| ------------------ | ------------------------------------------------------------ |
| `content init`     | 新しいコンテンツ管理プロジェクトを初期化します．             |
| `content create`   | 新しいコンテンツを作成します．                               |
| `content build`    | コンテンツのメタデータをビルドし，一覧ファイルを生成します． |
| `content gh-pages` | GitHub Pages への公開用ワークフローを生成します．            |

詳細は[コマンドリファレンス](./docs/command-reference.md)を参照してください．

## 設定ファイル (`content.config.json`)

`content init` で生成される設定ファイルです．プロジェクトの挙動をカスタマイズできます．

```json
{
  "contentDir": "content",
  "contentName": "content",
  "metaIndexFile": "content.meta.json",
  "defaultMeta": {
    "lang": "ja",
    "author": ""
  },
  "filePatterns": ["**/*.md", "**/*.txt", "**/*.html"],
  "structures": []
}
```

## コントリビュート

バグ報告，機能提案，プルリクエストはいつでも歓迎します．Issue やプルリクエストを作成する前に，既存の Issue がないか確認してください．

1.  このリポジトリをフォークします．
2.  フィーチャーブランチを作成します (`git checkout -b feature/your-feature`)．
3.  変更をコミットします (`git commit -m 'Add some feature'`)．
4.  ブランチにプッシュします (`git push origin feature/your-feature`)．
5.  プルリクエストを作成します．

## ライセンス

このプロジェクトは [MIT ライセンス](LICENSE) の下で公開されています．
