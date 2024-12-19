document.getElementById('store-form').addEventListener('submit', function(event) {
    event.preventDefault(); // デフォルトのフォーム送信動作を防止

    const storeName = document.getElementById('store-name').value.trim();
    const storePeriod = parseInt(document.getElementById('store-period').value.trim(), 10); // 保存期間

    if (!storeName || isNaN(storePeriod)) {
        showMessage('店舗名と保存期間を正しく入力してください。', 'error');
        return;
    }

    // ローカルストレージからデータを取得
    const storesData = JSON.parse(localStorage.getItem('storesData')) || {};

    // 新しい店舗がすでに登録されているか確認
    if (storesData[storeName]) {
        showMessage(`店舗 「${storeName}」 は既に登録されています。`, 'error');
        return;
    }

    // 現在の日時を取得
    const createdAt = new Date().toISOString(); // 作成日時をISO形式で記録

    // 新店舗を追加
    storesData[storeName] = { 
        medalDuration: storePeriod, 
        createdAt: createdAt, // 作成日時を保存
        medals: {}           // メダルデータを初期化
    };
    localStorage.setItem('storesData', JSON.stringify(storesData));

    showMessage(`店舗 「${storeName}」 を登録しました。`, 'success');
    displayStores(); // 登録後にリストを更新
    document.getElementById('store-form').reset(); // フォームをリセット
});

// メッセージ表示関数
function showMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = message;
    messageContainer.className = ''; // 既存クラスをクリア
    messageContainer.classList.add(type); // success または error クラスを追加

    // 5秒後にメッセージを消す
    setTimeout(() => {
        messageContainer.textContent = '';
        messageContainer.className = '';
    }, 5000);
}
