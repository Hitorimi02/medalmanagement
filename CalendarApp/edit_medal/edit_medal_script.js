// 日付情報を取得
const urlParams = new URLSearchParams(window.location.search);
const date = urlParams.get('date');
document.getElementById('selected-date').textContent = `📅 ${date}`;

// ローカルストレージに店舗ごとのデータを保存するキー
const STORES_KEY = 'storesData';

// 店舗のプルダウンを初期化
function populateStoreDropdown() {
    const storeSelect = document.getElementById('store-select');
    storeSelect.innerHTML = '<option value="" selected disabled>店舗を選択</option>';

    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    Object.keys(storesData).forEach(storeName => {
        const option = document.createElement('option');
        option.value = storeName;
        option.textContent = `${storeName} (保存期間: ${storesData[storeName].medalDuration || '不明'}日)`;
        storeSelect.appendChild(option);
    });
}

// 店舗データを取得
function getStoreData(storeName) {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    return storesData[storeName] || { medalDuration: null, medals: {} };
}

// 店舗データを保存
function saveStoreData(storeName, date, medalCount) {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};

    // 該当店舗のデータがない場合は初期化
    if (!storesData[storeName]) {
        alert(`店舗 "${storeName}" が存在しません。`);
        return;
    }

    // メダルデータを保存
    if (!storesData[storeName].medals) {
        storesData[storeName].medals = {};
    }
    storesData[storeName].medals[date] = medalCount;

    // ローカルストレージに更新データを保存
    localStorage.setItem(STORES_KEY, JSON.stringify(storesData));
}

// 前回のメダルデータを取得
function getLastMedal(storeName, date) {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    const storeData = storesData[storeName] || { medals: {} };

    const storeDates = Object.keys(storeData.medals).filter(d => new Date(d) < new Date(date));
    if (storeDates.length === 0) return null;

    const lastDate = storeDates.sort((a, b) => new Date(b) - new Date(a))[0];
    return { date: lastDate, medals: storeData.medals[lastDate] };
}

// フォーム送信時の処理
document.getElementById('medal-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const storeName = document.getElementById('store-select').value;
    const medals = parseInt(document.getElementById('medals').value, 10);
    const date = new URLSearchParams(window.location.search).get('date');

    if (!storeName) {
        alert('店舗を選択してください。');
        return;
    }

    if (isNaN(medals)) {
        alert('メダル数を正しく入力してください。');
        return;
    }

    const previousMedalData = getLastMedal(storeName, date);

    // メダルデータを保存
    saveStoreData(storeName, date, medals);

    // 差分の計算と表示
    const differenceEl = document.getElementById('difference');
    if (previousMedalData) {
        const difference = medals - previousMedalData.medals;
        differenceEl.textContent = `前回 (${previousMedalData.date}) 比：${difference} 枚 - 保存しました`;
    } else {
        differenceEl.textContent = `今回が最初の記録です - 保存しました`;
    }

    // 保存完了のメッセージを表示（アラートを廃止）
    const saveMessage = document.getElementById('save-message');
    saveMessage.textContent = `店舗 "${storeName}" のメダルが保存されました: ${medals} 枚`;
    saveMessage.style.display = 'block';

    // 数秒後に保存メッセージを非表示にする
    setTimeout(() => {
        saveMessage.style.display = 'none';
    }, 3000);

    // 入力欄をクリア
    document.getElementById('medals').value = '';
});

// 「戻る」ボタンの処理
function goBack() {
    window.location.href = "../index/index.html"; // カレンダーのページへ遷移
}

// ページ読み込み時に店舗一覧を初期化
populateStoreDropdown();
