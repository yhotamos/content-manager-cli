#!/usr/bin/env node

import { readFileSync } from "fs";
import { Command } from 'commander';
import initCommand from './commands/setup/init.js';
import createCommand from './commands/manage/create.js';
import buildCommand from './commands/manage/build.js';
import ghPagesCommand from './commands/setup/gh-pages.js';

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf-8"));

const program = new Command().configureHelp({
  subcommandTerm: (cmd) => cmd.name() + ' ' + cmd.usage(),
});

program
  .name('content')
  .usage('<command> [arguments] [options]')
  .description('Description: カテゴリごとに Markdown コンテンツとメタ情報を管理できる汎用 CLI ツール')
  .version(pkg.version)
  .showHelpAfterError()
  .addHelpText('after',
    `\nExamples:
  $ content init my-blog     # 新しいブログ用フォルダを初期化
  $ content build ./docs     # ./docs をビルド`)
  .addHelpText('afterAll', `\nContent Manager CLI v${pkg.version}`)
  .addHelpText('afterAll', 'GitHub: https://github.com/yhotamos/content-manager-cli')
  .addHelpText('afterAll', '\nCopyright (c) 2025 yhotamos');

program.addCommand(initCommand);
program.addCommand(createCommand);
program.addCommand(buildCommand);
program.addCommand(ghPagesCommand);


program.parse();
