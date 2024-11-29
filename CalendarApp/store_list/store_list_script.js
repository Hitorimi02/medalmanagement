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
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.marginBottom = '10px';
        li.style.padding = '10px';
        li.style.border = '1px solid #ccc';
        li.style.borderRadius = '5px';
        li.style.backgroundColor = '#f9f9f9';

        // 店舗名を表示
        const storeInfo = document.createElement('span');
        storeInfo.textContent = `${storeName} - 保存期間: 不明`; // 保存期間のデータがない場合「不明」と表示
        li.appendChild(storeInfo);

        // 削除ボタンを作成
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '🗑️'; // ゴミ箱アイコン
        deleteButton.style.background = 'none';
        deleteButton.style.border = 'none';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.fontSize = '1.2em';
        deleteButton.style.color = 'red';

        // 削除ボタンのクリックイベントを設定
        deleteButton.addEventListener('click', () => {
            // 該当店舗をローカルストレージから削除
            delete storesData[storeName];
            localStorage.setItem(STORES_KEY, JSON.stringify(storesData)); // 更新
            displayStores(); // 再描画
        });

        // リストアイテムに削除ボタンを追加
        li.appendChild(deleteButton);
        storeList.appendChild(li);
    });
}

// 初期描画
displayStores();
