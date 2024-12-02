document.getElementById('store-form').addEventListener('submit', function(event) {
    event.preventDefault(); // デフォルトのフォーム送信動作を防止

    const storeName = document.getElementById('store-name').value.trim();
    const storePeriod = parseInt(document.getElementById('store-period').value.trim(), 10); // 保存期間

    if (!storeName || isNaN(storePeriod)) {
        alert('店舗名と保存期間を正しく入力してください。');
        return;
    }

    // ローカルストレージからデータを取得
    const storesData = JSON.parse(localStorage.getItem('storesData')) || {};

    // 新しい店舗がすでに登録されているか確認
    if (storesData[storeName]) {
        alert(`店舗 "${storeName}" は既に登録されています。`);
        return;
    }

    // 新店舗を追加
    storesData[storeName] = { medalDuration: storePeriod, medals: {} }; // 保存期間とメダルデータを初期化
    localStorage.setItem('storesData', JSON.stringify(storesData));

    alert(`店舗 "${storeName}" を登録しました。`);
    displayStores(); // 登録後にリストを更新
});
