const storeList = document.getElementById('store-list');
const deletedStoresKey = 'deletedStoresData'; // 削除された店舗用キー
const STORES_KEY = 'storesData'; // データのキー

// 確認ダイアログを表示する関数
function showConfirmationDialog(message, onConfirm) {
    const confirmDialog = document.createElement('div');
    confirmDialog.classList.add('confirm-dialog');
    confirmDialog.innerHTML = `
        <div class="confirm-content">
            <p>${message}</p>
            <div style="display: flex; justify-content: center; gap: 10px;">
                <button id="confirm-yes" style="background-color: #e74c3c; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">はい</button>
                <button id="confirm-no" style="background-color: #ccc; color: black; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">いいえ</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmDialog);

    document.getElementById('confirm-yes').addEventListener('click', () => {
        onConfirm();
        document.body.removeChild(confirmDialog);
    });
    document.getElementById('confirm-no').addEventListener('click', () => {
        document.body.removeChild(confirmDialog);
    });
}

// 店舗リストを表示
function displayStores() {
    storeList.innerHTML = ''; // 一旦リストをクリア
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};

    if (Object.keys(storesData).length === 0) {
        storeList.innerHTML = '<li>登録された店舗はありません。</li>';
        return;
    }

    Object.keys(storesData).forEach(storeName => {
        const storeData = storesData[storeName];
        const { medalDuration = '不明' } = storeData;

        const li = document.createElement('li');
        li.innerHTML = `
            <span>${storeName} - 保存期間: ${medalDuration}日</span>
            <button class="delete-store" style="cursor: pointer; border: none; background: none;">🗑️</button>
        `;

        const deleteButton = li.querySelector('.delete-store');
        deleteButton.addEventListener('click', () => {
            showConfirmationDialog(
                `店舗「${storeName}」の情報を削除しますか？`,
                () => {
                    const deletedStores = JSON.parse(localStorage.getItem(deletedStoresKey)) || {};
                    deletedStores[storeName] = { 
                        ...storeData, 
                        deletedAt: Date.now() // 削除時のタイムスタンプを保存
                    };
                    localStorage.setItem(deletedStoresKey, JSON.stringify(deletedStores));

                    delete storesData[storeName];
                    localStorage.setItem(STORES_KEY, JSON.stringify(storesData));
                    showMessage(`店舗「${storeName}」を削除しました。`, 'success');
                    displayStores(); // 再表示
                    displayDeletedStores(); // 削除済み店舗を再表示
                }
            );
        });

        storeList.appendChild(li);
    });
}

// 削除済み店舗を復元する
function restoreDeletedStore(storeName) {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    const deletedStores = JSON.parse(localStorage.getItem(deletedStoresKey)) || {};

    if (!deletedStores[storeName]) return;

    // 既に同名の店舗が存在する場合の処理
    if (storesData[storeName]) {
        showConfirmationDialog(
            `同じ店舗名の店舗が存在します。データが上書きされますが、よろしいですか？`,
            () => {
                // 上書き確認後の復元処理
                storesData[storeName] = { ...deletedStores[storeName] };
                delete storesData[storeName].deletedAt; // 削除タイムスタンプを削除
                delete deletedStores[storeName];

                localStorage.setItem(STORES_KEY, JSON.stringify(storesData));
                localStorage.setItem(deletedStoresKey, JSON.stringify(deletedStores));
                showMessage(`店舗「${storeName}」を復元しました。`, 'success');
                displayStores();
                displayDeletedStores();
            }
        );
        return;
    }

    // 既存店舗がない場合はそのまま復元
    storesData[storeName] = { ...deletedStores[storeName] };
    delete storesData[storeName].deletedAt; // 削除タイムスタンプを削除
    delete deletedStores[storeName];

    localStorage.setItem(STORES_KEY, JSON.stringify(storesData));
    localStorage.setItem(deletedStoresKey, JSON.stringify(deletedStores));
    showMessage(`店舗「${storeName}」を復元しました。`, 'success');
    displayStores();
    displayDeletedStores();


    if (deletedStores[storeName]) {
        storesData[storeName] = deletedStores[storeName];
        delete storesData[storeName].deletedAt; // 削除タイムスタンプを削除
        delete deletedStores[storeName];

        localStorage.setItem(STORES_KEY, JSON.stringify(storesData));
        localStorage.setItem(deletedStoresKey, JSON.stringify(deletedStores));
        showMessage(`店舗「${storeName}」を復元しました。`, 'success');
        displayStores();
        displayDeletedStores(); // 削除済みリストを更新
    }
}

// 削除済み店舗リストを表示
function displayDeletedStores() {
    const deletedStoresContainer = document.getElementById('deleted-stores');
    deletedStoresContainer.innerHTML = ''; // 一旦リストをクリア
    const deletedStores = JSON.parse(localStorage.getItem(deletedStoresKey)) || {};

    const now = Date.now();
    Object.keys(deletedStores).forEach(storeName => {
        const { deletedAt } = deletedStores[storeName];
        const elapsedTime = now - deletedAt;
        const remainingTime = 7 * 24 * 60 * 60 * 1000 - elapsedTime; // 7日分のミリ秒から経過時間を引く

        // 7日以上経過した店舗を削除
        if (remainingTime <= 0) {
            delete deletedStores[storeName];
        } else {
            const remainingDays = Math.ceil(remainingTime / (24 * 60 * 60 * 1000)); // 残り日数を計算

            const li = document.createElement('li');
            li.innerHTML = `
                <span>${storeName}</span>
                <button class="restore-store" style="cursor: pointer; border: none; background: blue; color: white; padding: 5px 10px; border-radius: 5px;">復元</button>
                <span style="margin-left: 10px; color: gray;">復元可能残り日数: ${remainingDays}日</span>
            `;
            const restoreButton = li.querySelector('.restore-store');
            restoreButton.addEventListener('click', () => restoreDeletedStore(storeName));
            deletedStoresContainer.appendChild(li);
        }
    });

    // 削除済みデータを更新
    localStorage.setItem(deletedStoresKey, JSON.stringify(deletedStores));
}


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

// 初期表示
displayStores();
displayDeletedStores();
