function initializeMenu() {
    // メニュー要素、メニューボタン、閉じるボタン、ログインボタンを取得
    const menu = document.getElementById('menu');
    const menuButton = document.getElementById('menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const loginButton = document.getElementById('login-btn'); // ログインボタン

    // すべての要素が存在する場合のみ、以下のイベントリスナーを設定
    if (menu && menuButton && closeMenuButton && loginButton) {
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

        // ログインボタンをクリックしたときに Google でログイン処理
        loginButton.addEventListener('click', async () => {
            const provider = new GoogleAuthProvider();

            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                console.log('ログイン成功:', user);

                // ユーザー情報の保存（Firestore 例）
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName,
                    email: user.email,
                    lastLogin: new Date()
                });
                alert(`ようこそ、${user.displayName} さん！`);
            } catch (error) {
                console.error('ログインエラー:', error);
                alert('ログインに失敗しました。');
            }
        });
    }
}
