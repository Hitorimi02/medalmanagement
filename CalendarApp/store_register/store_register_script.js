document.getElementById('store-form').addEventListener('submit', function(event) {
    event.preventDefault(); // デフォルトのフォーム送信動作を防止

    const storeName = document.getElementById('store-name').value.trim();
    const storePeriod = parseInt(document.getElementById('store-period').value.trim(), 10); // 保存期間

    // 旧データから新データ形式への変換
    const oldStores = JSON.parse(localStorage.getItem('stores')) || [];
    const newStoresData = JSON.parse(localStorage.getItem('storesData')) || {};

    oldStores.forEach(store => {
        if (!newStoresData[store.name]) {
            newStoresData[store.name] = store.medals || {};
        }
    });

    // 新データ形式をローカルストレージに保存
    localStorage.setItem('storesData', JSON.stringify(newStoresData));

    // 旧形式のデータを削除（必要に応じてコメントアウト）
    localStorage.removeItem('stores');

    // 新しい店舗がすでに登録されているか確認
    if (newStoresData[storeName]) {
        alert(`店舗 "${storeName}" は既に登録されています。`);
        return;
    }

    // 新店舗を追加
    newStoresData[storeName] = {}; // 初期状態でメダルデータなし
    localStorage.setItem('storesData', JSON.stringify(newStoresData));

    alert(`店舗 "${storeName}" を登録しました。`);
});
