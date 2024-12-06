const storeList = document.getElementById('store-list');
const STORES_KEY = 'storesData'; // 新しいデータ形式のキー

// 店舗リストを表示する関数
function displayStores() {
    storeList.innerHTML = ''; // リストを一旦クリア

    // ローカルストレージから新しい形式のデータを取得
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};

    const storeNames = Object.keys(storesData);
    if (storeNames.length === 0) {
        // 店舗が登録されていない場合の表示
        storeList.innerHTML = '<li>登録された店舗はありません。</li>';
        return;
    }

    // 店舗ごとにリストアイテムを作成
    storeNames.forEach(storeName => {
        const storeData = storesData[storeName]; // 店舗データを取得
        const { medalDuration = '不明' } = storeData; // 保存期間を取得（デフォルトは「不明」）

        const li = document.createElement('li');
        
        // 店舗名と保存期間を表示
        const storeInfo = document.createElement('span');
        storeInfo.textContent = `${storeName} - 保存期間: ${medalDuration}日`;
        li.appendChild(storeInfo);

        // 削除ボタンを作成
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '🗑️'; // ゴミ箱アイコン
        deleteButton.addEventListener('click', () => {
            // 該当店舗をローカルストレージから削除
            delete storesData[storeName];
            localStorage.setItem(STORES_KEY, JSON.stringify(storesData)); // 更新
            displayStores(); // 再描画
        });

        // 削除ボタンをリストアイテムに追加
        li.appendChild(deleteButton);
        storeList.appendChild(li);
    });
}

// 初期描画
displayStores();
