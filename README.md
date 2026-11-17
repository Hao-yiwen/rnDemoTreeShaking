# rnDemoTreeShaking

[![React Native](https://img.shields.io/badge/React%20Native-0.72.5-61DAFB?logo=react&logoColor=white)](https://reactnative.dev)
[![React](https://img.shields.io/badge/React-18.2.0-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.8.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

用 React Native 0.72.5 搭的学习工程，用来试验 Metro 打包时的 Tree Shaking 配置。界面仍是 CLI 脚手架生成的默认欢迎页。

## 背景

仓库由 [`@react-native-community/cli`](https://github.com/react-native-community/cli) 初始化，首次业务提交说明是「初始化 treeshaking 工程」。相对默认模板，改动集中在打包配置：

- `metro.config.js` 打开 `experimentalImportSupport` 与 `inlineRequires`，并把 `transformer.unstable_treeShaking` 设为 `true`。`watchFolders` 额外指向作者本机的 Metro 源码目录，注释写的是给 `yarn link` 的本地模块用。
- `babel.config.js` 给 `metro-react-native-babel-preset` 传入 `disableImportExportTransform: true`。该选项为真时，preset 不再插入 `@babel/plugin-transform-modules-commonjs`。
- `package.json` 增加 `inspect` 脚本：用 `node --inspect-brk` 在生成 iOS release bundle 时停在调试器上。

随 `yarn.lock` 安装的 Metro（顶层 `metro@0.76.8`；`react-native bundle` 启动时打印 Metro v0.76.9）源码中没有 `unstable_treeShaking` 字段。本仓库也没有附带 `watchFolders` 指向的那份本地 Metro。

## 仓库里已有的内容

| 路径 | 实际内容 |
| --- | --- |
| `App.tsx` | 默认 `NewAppScreen`：Step One、See Your Changes、Debug、Learn More，并跟随系统深色模式 |
| `index.js` | 读取 `app.json` 的 `name`，向 `AppRegistry` 注册组件 `rnDemoTreeShaking` |
| `__tests__/App.test.tsx` | 用 `react-test-renderer` 渲染一次 `<App />` |
| `android/` | 默认 Android 工程。应用名 `rnDemoTreeShaking`，`applicationId` 为 `com.rndemotreeshaking` |
| `ios/` | 默认 iOS 工程，target 名 `rnDemoTreeShaking`，另有 `rnDemoTreeShakingTests` |

没有自定义页面、导航或第三方原生模块。仓库里也没有应用截图；Android 启动图标在 `android/app/src/main/res/mipmap-*`。

## 技术栈与版本

版本取自 `package.json` 与 `yarn.lock` 的锁定结果。

| 依赖 | 锁定版本 |
| --- | --- |
| react | 18.2.0 |
| react-native | 0.72.5 |
| typescript | 4.8.4 |
| metro（顶层） | 0.76.8 |
| metro-react-native-babel-preset | 0.76.8（锁文件中另有 0.76.9） |
| @react-native/metro-config | 0.72.12 |
| @babel/core | 7.25.7 |
| jest / babel-jest | 29.7.0 |
| eslint | 8.57.1 |
| @react-native/eslint-config | 0.72.2 |
| prettier | 2.8.8 |
| react-test-renderer | 18.2.0 |

原生侧（写在工程文件里，本环境未编译）：

- **Android**：Gradle 8.0.1，Build Tools 33.0.0，`compileSdk` / `targetSdk` 33，`minSdk` 21，NDK `23.1.7779620`。`android/gradle.properties` 中 `hermesEnabled=true`、`newArchEnabled=false`，Flipper `0.182.0`。Release 的 Proguard 关闭，签名仍用 debug keystore。`versionName` 1.0，`versionCode` 1。
- **iOS**：`project.pbxproj` 中 Deployment Target 为 12.4，`MARKETING_VERSION` 为 1.0，Bundle Identifier 为 `org.reactjs.native.example.rnDemoTreeShaking`。`Podfile` 按 React Native 默认打开 Hermes；Flipper 默认启用，设置 `NO_FLIPPER=1` 可关闭。`Gemfile` 要求 Ruby `>= 2.6.10`、CocoaPods `~> 1.12`。

## 目录结构

```text
.
├── App.tsx                 # 默认欢迎页
├── index.js                # 入口，注册根组件
├── app.json                # name / displayName：rnDemoTreeShaking
├── metro.config.js        # Tree Shaking 试验配置与本机 watchFolders
├── babel.config.js        # disableImportExportTransform
├── package.json            # 脚本与依赖；engines.node >= 16
├── yarn.lock               # Yarn 1 lockfile
├── tsconfig.json           # 继承 @tsconfig/react-native
├── jest.config.js          # preset: react-native
├── __tests__/App.test.tsx
├── android/                # Gradle 工程
├── ios/                    # Xcode 工程与 Podfile
├── Gemfile                 # CocoaPods
└── .vscode/launch.json     # 调试 index.js，以及附加到 9229
```

`node_modules/`、`ios/Pods/`、`vendor/bundle/` 和 `*.jsbundle` 被 `.gitignore` 忽略。

## 环境要求

- Node.js `>= 16`（`package.json` 的 `engines`）。
- Yarn 1。仓库是 `yarn.lock` v1，没有 `package-lock.json`。
- 跑 Android 需要 JDK、Android SDK，以及上表中的 SDK / NDK 版本。
- 跑 iOS 需要 macOS、Xcode，以及 Ruby、CocoaPods。

## 安装

```bash
yarn install --frozen-lockfile
```

已在本环境用 Node v22.23.4、Yarn 1.22.22 执行，安装成功。

## 运行

### 启动 Metro

```bash
yarn start
```

`metro.config.js` 里的 `watchFolders` 是：

- 仓库下的 `node_modules`
- `/Users/yw.hao/Documents/rn/metro/packages`
- `/Users/yw.hao/Documents/rn/metro/node_modules`

后两项传入 `path.resolve` 时已经是绝对路径，结果就是这两个字面路径。本环境不存在 `/Users/yw.hao/Documents/rn/metro/packages`。`yarn start` 已复现失败，Metro v0.76.8 报：

```text
Error: ENOENT: no such file or directory, watch '/Users/yw.hao/Documents/rn/metro/packages'
```

要把开发服务器跑起来，需要本机存在该 Metro 检出，或把 `watchFolders` 改成自己的路径。本次只更新文档，没有改配置。

### Android / iOS

依赖安装完成、且 Metro 能启动之后：

```bash
yarn android
yarn ios
```

本环境是 Linux，没有 Android SDK，也没有 Xcode，这两条命令没有执行。iOS 只能在 macOS 上构建。首次安装 Pod 可在 macOS 上执行：

```bash
cd ios
bundle install
bundle exec pod install
```

`.bundle/config` 把 gem 安装到 `vendor/bundle`。

### 用 inspector 打 release bundle

```bash
yarn inspect
```

脚本内容：

```bash
node --inspect-brk node_modules/react-native/local-cli/cli.js bundle \
  --platform ios --dev false --entry-file index.js \
  --bundle-output ios/main.jsbundle --assets-dest ios \
  --minify true --reset-cache
```

`--inspect-brk` 会在调试器连上之前停住，默认端口 9229。`.vscode/launch.json` 里的 Attach 配置使用同一端口。产物 `ios/main.jsbundle` 匹配 `.gitignore` 的 `*.jsbundle`。本环境没有挂调试器，因此没有跑这条会一直等待的命令。

不挂调试器、只打 Android bundle 的命令已执行：

```bash
yarn react-native bundle --platform android --dev false \
  --entry-file index.js \
  --bundle-output /tmp/index.android.bundle \
  --assets-dest /tmp/rn-assets \
  --minify true --reset-cache
```

它在同一处失败（日志里的 Metro 版本为 v0.76.9），没有生成 bundle。

### 测试与 lint

```bash
yarn test
yarn lint
```

本环境（Node v22.23.4）的结果：

- `yarn test` 失败。加载 `node_modules/react-native/jest/react-native-env.js` 时抛出 `ReferenceError: require is not defined in ES module scope`。`babel.config.js` 的 `disableImportExportTransform: true` 会跳过 CommonJS 模块转换，Jest 预设依赖这次转换。
- `yarn lint` 失败。`babel.config.js` 文件末尾没有换行，Prettier 报 `Insert` 换行（规则 `eol-last`）。

## 配置在做什么

`metro.config.js` 里和摇树相关的片段：

```js
transformer: {
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: true,
      inlineRequires: true,
    },
  }),
  unstable_treeShaking: true,
},
```

- `experimentalImportSupport` 让转换保留 import / export，供按导入关系裁剪依赖。
- `inlineRequires` 把 `require` 挪到使用处。React Native 0.72 自带的 Metro 默认配置里同样打开了它；本文件用自己的 `getTransformOptions` 再次写上。
- `unstable_treeShaking` 写在 `transformer` 上。已安装的 `node_modules` 中搜索不到这个名字，随仓库锁定的 Metro 0.76 不会读取它。

`babel.config.js` 的 `disableImportExportTransform: true` 与 `experimentalImportSupport` 配套，避免 Babel 先把 ESM 编成 `require`。

## 备注

- npm 包名、Android 显示名、iOS `CFBundleDisplayName` 都是 `rnDemoTreeShaking`。包版本 `0.0.1`，`private: true`。
- 仓库没有 `LICENSE` 文件。
- 参考：[React Native 环境准备](https://reactnative.dev/docs/environment-setup)、[Metro 配置](https://facebook.github.io/metro/docs/configuration)（`metro.config.js` 顶部注释中的文档地址）。
