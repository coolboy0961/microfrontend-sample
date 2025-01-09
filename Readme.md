# Microfrontend Sample (Vue + React + Host)

このリポジトリは、Webpack Module Federation を使用して **Vue** (remote-vue) と **React** (remote-react) をマイクロフロントエンドとして構築し、それらを **host** アプリから読み込むサンプルです。

## ディレクトリ構成

    microfrontend-sample/
    ├── host
    │   ├── package.json
    │   ├── webpack.config.js
    │   └── src
    │       └── bootstrap.js
    ├── remote-vue
    │   ├── package.json
    │   ├── webpack.config.js
    │   └── src
    │       ├── App.vue
    │       └── ...
    └── remote-react
        ├── package.json
        ├── webpack.config.js
        └── src
            ├── App.jsx
            └── ...

---

## 環境準備

- Node.js (推奨: LTS バージョン)
- npm または yarn

ここでは例として npm を使用します。  
各ディレクトリごとに依存関係をインストールしてください。

    cd remote-vue
    npm install

    cd ../remote-react
    npm install

    cd ../host
    npm install

---

## remote-vue の起動と確認方法

1. **remote-vue** ディレクトリに移動
       
       cd remote-vue

2. **開発サーバを起動**
       
       npm run serve

3. **ブラウザで確認**  
   デフォルト設定の場合、`http://localhost:8081` を開いて、Vue アプリ（Remote）が単体で表示されるか確認してください。

---

## remote-react の起動と確認方法

1. **remote-react** ディレクトリに移動
       
       cd remote-react

2. **開発サーバを起動**
       
       npm run serve

3. **ブラウザで確認**  
   デフォルト設定の場合、`http://localhost:8082` を開いて、React アプリ（Remote）が単体で表示されるか確認してください。

---

## host の起動と確認方法

1. **host** ディレクトリに移動
       
       cd host

2. **開発サーバを起動**
       
       npm run serve

3. **ブラウザで確認**  
   `http://localhost:8080` を開くと、ホストアプリの画面が表示されます。

---

## host で remote-vue / remote-react を導入する方法

### 1. remote を exposes しているか確認

- **remote-vue**: `webpack.config.js` でたとえば以下のように設定されているか確認してください。

      new ModuleFederationPlugin({
        name: 'remote_vue',
        filename: 'remoteEntry.js',
        exposes: {
          './VueApp': './src/ExposedVueApp.js'
        },
        shared: {
          vue: {
            singleton: true,
            requiredVersion: '^3.0.0',
            eager: true,
          },
        },
      })

- **remote-react**: 同様に

      new ModuleFederationPlugin({
        name: 'remote_react',
        filename: 'remoteEntry.js',
        exposes: {
          './ReactApp': './src/ExposedReactApp.js'
        },
        shared: {
          react: {
            singleton: true,
            requiredVersion: '^19.0.0',
            eager: true,
          },
          'react-dom': {
            singleton: true,
            requiredVersion: '^19.0.0',
            eager: true,
          },
        },
      })

### 2. host 側で remotes を設定

`host/webpack.config.js` 内で:

      new ModuleFederationPlugin({
        name: 'host',
        remotes: {
          remoteVue: 'remote_vue@http://localhost:8081/remoteEntry.js',
          remoteReact: 'remote_react@http://localhost:8082/remoteEntry.js',
        },
        // ...
      });

### 3. host のコードから import する

`host/src/bootstrap.js` などで、以下のように **マウント用関数** や **レンダリング用関数** を import & 呼び出します。

    (async () => {
      // remote-vue で export している関数の import
      const { mountVueApp } = await import('remoteVue/VueApp');

      // remote-react で export している関数の import
      const { renderReactApp } = await import('remoteReact/ReactApp');

      // Vue コンポーネントを実際にホストの要素にマウント
      mountVueApp('#vue-container');

      // React コンポーネントを実際にホストの要素にレンダリング
      renderReactApp('#react-container');
    })();

### 4. ブラウザで確認

- host を起動 (`npm run serve`) して `http://localhost:8080` を開きます。
- ホストページ内にある `#vue-container` と `#react-container` に、それぞれリモートの Vue / React が正しく表示されるか確認してください。

---

## 補足

- **バージョン整合性**  
  React / Vue ともに `shared` に指定しているバージョン（`singleton: true, requiredVersion: '^19.0.0'` など）と実際の依存バージョンが合わないとエラーが出やすいです。  
- **開発フロー**  
  1. `remote-vue` と `remote-react` を先に起動  
  2. `host` を起動  
  3. ブラウザで `host` のポートを確認  
- **単体起動での確認**  
  - `remote-vue` と `remote-react` は、それぞれ単体でも動かせるよう `main.js` / `index.jsx` が用意されている。  
  - Module Federation と共存させる場合、単体動作用のエントリーポイントと `ExposedVueApp.js` / `ExposedReactApp.js` のような Module Federation 用ファイルを分けると管理しやすいです。