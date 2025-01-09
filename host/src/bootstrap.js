// Webpack Module Federationを介してリモートのコンポーネントを呼び出す例
// Vueコンポーネントの場合は、実際にはVueインスタンスをマウントする必要があるため
// ここではデモとして HTML要素を動的に作ってマウントさせる形にしてみます。

(async () => {
  // // --- Vue アプリの読み込み ---
  // const { default: VueApp } = await import('remoteVue/VueApp'); 
  // // --- React アプリの読み込み ---
  // const { default: ReactApp } = await import('remoteReact/ReactApp');

  // // Vue コンポーネントを埋め込む例
  // const vueContainer = document.getElementById('vue-container');
  // if (vueContainer) {
  //   // ここで実際には createApp(VueApp).mount(...) とする必要がありますが
  //   // exposed が .vue の場合そのままではコンストラクタとして扱えません
  //   // そのため、本当のアプローチとしては remote-vue 側で
  //   //     './VueApp': './src/ExposedVueApp.js'
  //   // のようにファイルを分けて createApp(App).mount() を行う関数をexportする方法があります

  //   vueContainer.innerHTML = `
  //     <h3 style="color:red">
  //       Vueコンポーネントをホストから呼び出すにはもう少し仕組みが必要です
  //     </h3>
  //   `;
  // }

  // // React コンポーネントを埋め込む例
  // const reactContainer = document.getElementById('react-container');
  // if (reactContainer) {
  //   reactContainer.innerHTML = `
  //     <h3 style="color:red">
  //       Reactコンポーネントも同様、実際には ReactDOM.render などで扱います
  //     </h3>
  //   `;
  // }
  // Vue のマウント関数、React のレンダリング関数をimport
  const { mountVueApp } = await import('remoteVue/VueApp');
  const { renderReactApp } = await import('remoteReact/ReactApp');

  // Vueコンポーネントを実際にホストページ上にマウント
  mountVueApp('#vue-container');

  // Reactコンポーネントを実際にホストページ上にレンダリング
  renderReactApp('#react-container');
})();