const storeList = document.getElementById('store-list');

// ローカルストレージからデータを取得
let stores = JSON.parse(localStorage.getItem('stores')) || [];

// 既存データが文字列のみの場合を補正
stores = stores.map(store => {
    if (typeof store === 'string') {
        return { name: store, medalDuration: 0 }; // デフォルトの保存期間を設定
    }
    return store;
});

// 修正されたデータを再保存
localStorage.setItem('stores', JSON.stringify(stores));

// 店舗リストを表示する関数
function displayStores() {
    storeList.innerHTML = ''; // リストを一旦クリア
    if (stores.length === 0) {
        // 店舗が登録されていない場合の表示
        storeList.innerHTML = '<li>登録された店舗はありません。</li>';
    } else {
        // 店舗ごとにリストアイテムを作成
        stores.forEach((storeData, index) => {
            const { name, medalDuration } = storeData;

            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.marginBottom = '10px';
            li.style.padding = '10px';
            li.style.border = '1px solid #ccc';
            li.style.borderRadius = '5px';
            li.style.backgroundColor = '#f9f9f9';

            // 店舗名と保存期間を表示
            const storeInfo = document.createElement('span');
            storeInfo.textContent = `${name} - 保存期間: ${medalDuration}日`;

            // 削除ボタンを作成（ゴミ箱アイコンを使用）
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '🗑️'; // ゴミ箱アイコン
            deleteButton.style.background = 'none';
            deleteButton.style.border = 'none';
            deleteButton.style.cursor = 'pointer';
            deleteButton.style.fontSize = '1.2em';
            deleteButton.style.color = 'red';

            // 削除ボタンのクリックイベントを設定
            deleteButton.addEventListener('click', () => {
                // 該当店舗をリストから削除
                stores.splice(index, 1);
                localStorage.setItem('stores', JSON.stringify(stores)); // ローカルストレージを更新
                displayStores(); // 再描画
            });

            // リストアイテムに内容と削除ボタンを追加
            li.appendChild(storeInfo);
            li.appendChild(deleteButton);
            storeList.appendChild(li);
        });
    }
}

// 初期描画
displayStores();
