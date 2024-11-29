// 日付情報を取得
const urlParams = new URLSearchParams(window.location.search);
const date = urlParams.get('date');
document.getElementById('selected-date').textContent = `📅 ${date}`;

// ローカルストレージに店舗ごとのデータを保存するキー
const STORES_KEY = 'storesData';

// 店舗一覧をプルダウンに表示する関数
function populateStoreDropdown() {
    const storeSelect = document.getElementById('store-select');
    storeSelect.innerHTML = '<option value="" selected disabled>店舗を選択</option>'; // 初期オプション

    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    Object.keys(storesData).forEach(store => {
        const option = document.createElement('option');
        option.value = store;
        option.textContent = store;
        storeSelect.appendChild(option);
    });
}

// 店舗ごとのメダルデータを取得する関数
function getStoreData(storeName) {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    return storesData[storeName] || {};
}

// データを保存する関数
function saveStoreData(storeName, data) {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    storesData[storeName] = data;
    localStorage.setItem(STORES_KEY, JSON.stringify(storesData));
}

// 指定された店舗と日付で過去のメダル記録を取得する関数
function getLastMedal(storeName, date) {
    const storeData = getStoreData(storeName);
    const dates = Object.keys(storeData)
        .filter(d => new Date(d) < new Date(date)) // 指定日付より前をフィルタリング
        .sort((a, b) => new Date(b) - new Date(a)); // 降順でソート

    if (dates.length === 0) return null;
    const latestDate = dates[0];
    return { date: latestDate, medals: storeData[latestDate] };
}

// フォーム送信時の処理
document.getElementById('medal-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const storeName = document.getElementById('store-select').value;
    const medals = parseInt(document.getElementById('medals').value, 10);

    if (!storeName) {
        alert('店舗を選択してください。');
        return;
    }

    const storeData = getStoreData(storeName);

    // 過去の記録を取得
    const previousMedalData = getLastMedal(storeName, date);

    // データを保存
    storeData[date] = medals;
    saveStoreData(storeName, storeData);

    // 差分の計算
    const differenceEl = document.getElementById('difference');
    if (previousMedalData) {
        const difference = medals - previousMedalData.medals;
        differenceEl.textContent = `前回 (${previousMedalData.date}) 比：${difference} 枚`;
    } else {
        differenceEl.textContent = '今回が最初の記録です';
    }

    alert(`店舗 "${storeName}" のメダルが保存されました: ${medals} 枚`);
});

// 「戻る」ボタンの処理
function goBack() {
    window.location.href = "../index/index.html";
}

// ページ読み込み時に店舗一覧を初期化
populateStoreDropdown();
