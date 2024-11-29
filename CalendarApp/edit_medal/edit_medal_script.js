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

    // localStorage から店舗データを取得
    const storesData = JSON.parse(localStorage.getItem('storesData')) || {};

    if (Object.keys(storesData).length === 0) {
        console.log('店舗データが存在しません');
        return;
    }

    Object.keys(storesData).forEach(storeName => {
        const option = document.createElement('option');
        option.value = storeName;
        option.textContent = storeName;
        storeSelect.appendChild(option);
    });
}



// 店舗データを取得
function getStoreData(storeName) {
    const stores = JSON.parse(localStorage.getItem('stores')) || [];
    return stores.find(store => store.name === storeName);
}

function saveStoreData(storeName, data) {
    const storesData = JSON.parse(localStorage.getItem('storesData')) || {};

    // 該当店舗のデータがない場合は初期化
    if (!storesData[storeName]) {
        storesData[storeName] = {};
    }

    // メダルデータを保存
    storesData[storeName][date] = data;

    // ローカルストレージに更新データを保存
    localStorage.setItem('storesData', JSON.stringify(storesData));
}


// 差分を計算して表示
function getLastMedal(storeName, date) {
    const storesData = JSON.parse(localStorage.getItem('storesData')) || {};
    const storeData = storesData[storeName] || {};

    const storeDates = Object.keys(storeData).filter(d => new Date(d) < new Date(date));
    if (storeDates.length === 0) return null;

    const lastDate = storeDates.sort((a, b) => new Date(b) - new Date(a))[0];
    return { date: lastDate, medals: storeData[lastDate] };
}


// フォーム送信時の処理
document.getElementById('medal-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const storeName = document.getElementById('store-select').value;
    const medals = parseInt(document.getElementById('medals').value, 10);

    if (!storeName) {
        alert('店舗を選択してください。');
        return;
    }

    const storeData = getStoreData(storeName);
    const previousMedalData = getLastMedal(storeName, date);

    // メダルデータを保存
    saveStoreData(storeName, medals);

    // 差分の計算と表示
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
    window.location.href = "../index/index.html"; // カレンダーのページへ遷移
}


// ページ読み込み時に店舗一覧を初期化
populateStoreDropdown();
