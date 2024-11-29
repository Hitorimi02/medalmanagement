// 日付情報を取得
const urlParams = new URLSearchParams(window.location.search);
const date = urlParams.get('date');
document.getElementById('selected-date').textContent = `📅 ${date}`;

// ローカルストレージに店舗ごとのデータを保存するキー
const STORES_KEY = 'storesData';

// 店舗のプルダウンを初期化
function populateStoreDropdown() {
    const storeSelect = document.getElementById('store-select');
    storeSelect.innerHTML = '<option value="" selected disabled>店舗を選択</option>'; // 初期オプション

    // localStorage から店舗データを取得
    const stores = JSON.parse(localStorage.getItem('stores')) || [];

    // stores が空でないか確認
    if (stores.length === 0) {
        console.log('店舗データが存在しません');
        return; // データがない場合はプルダウンに店舗を追加しない
    }

    // 店舗データをプルダウンに追加
    stores.forEach(store => {
        const option = document.createElement('option');
        option.value = store.name;
        option.textContent = `${store.name} (保存期間: ${store.medalDuration}日)`;
        storeSelect.appendChild(option);
    });
}


// 店舗データを取得
function getStoreData(storeName) {
    const stores = JSON.parse(localStorage.getItem('stores')) || [];
    return stores.find(store => store.name === storeName);
}

// メダルデータの保存
function saveStoreData(storeName, data) {
    const stores = JSON.parse(localStorage.getItem('stores')) || [];
    const store = stores.find(store => store.name === storeName);
    store.medals[date] = data; // 日付ごとにメダル枚数を保存
    localStorage.setItem('stores', JSON.stringify(stores));
}

// 差分を計算して表示
function getLastMedal(storeName, date) {
    const store = getStoreData(storeName);
    const storeDates = Object.keys(store.medals).filter(d => new Date(d) < new Date(date));
    if (storeDates.length === 0) return null;

    const lastDate = storeDates.sort((a, b) => new Date(b) - new Date(a))[0];
    return { date: lastDate, medals: store.medals[lastDate] };
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
