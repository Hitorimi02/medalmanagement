function initializeMenu() {
    // メニュー要素、メニューボタン、閉じるボタンを取得
    const menu = document.getElementById('menu');
    const menuButton = document.getElementById('menu-button');
    const closeMenuButton = document.getElementById('close-menu');

    // すべての要素が存在する場合のみ、以下のイベントリスナーを設定
    if (menu && menuButton && closeMenuButton) {
        // メニューボタンをクリックしたときにメニューを開閉
        menuButton.addEventListener('click', () => {
            menu.classList.toggle('open'); // メニューの表示状態を切り替える
        });

        // 閉じるボタンをクリックしたときにメニューを閉じる
        closeMenuButton.addEventListener('click', () => {
            menu.classList.remove('open'); // メニューから 'open' クラスを削除して非表示
        });

        // ウィンドウのどこかをクリックしたときにメニューを閉じる処理
        window.addEventListener('click', (e) => {
            // クリックイベントがメニュー要素やメニューボタン以外で発生した場合
            if (!menu.contains(e.target) && !menuButton.contains(e.target)) {
                menu.classList.remove('open'); // メニューを閉じる
            }
        });
    }
}