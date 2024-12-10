// ローカルストレージから店舗データを取得
const STORES_KEY = 'storesData';
const storeSelect = document.getElementById('store-select'); // HTMLの<select>要素が正しいか確認
let currentChart = null; // 現在のチャートを保持する変数
let currentIndex = 0; // 現在表示しているデータの開始位置

// 店舗一覧をプルダウンに表示
function populateStoreDropdown() {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};

    // デバッグ: ローカルストレージの内容を表示
    console.log('ローカルストレージの店舗データ:', storesData);

    // 店舗データが存在しない場合の処理
    if (Object.keys(storesData).length === 0) {
        console.warn('店舗データがローカルストレージにありません');
        return; // データがない場合は何も表示しない
    }

    // プルダウンリストを初期化
    storeSelect.innerHTML = '<option value="" selected disabled>店舗を選択</option>';

    // 店舗名をプルダウンに追加
    Object.keys(storesData).forEach(storeName => {
        const option = document.createElement('option');
        option.value = storeName;
        option.textContent = `${storeName} (保存期間: ${storesData[storeName].medalDuration || '不明'}日)`;
        storeSelect.appendChild(option);
    });

    // 初期選択: 最初の店舗を選択状態に
    const firstStore = Object.keys(storesData)[0];
    if (firstStore) {
        storeSelect.value = firstStore;
        renderMedalTransition([firstStore]); // 最初の店舗のデータを表示
    }
}

// 店舗選択時の処理
storeSelect.addEventListener('change', function () {
    const selectedOptions = Array.from(storeSelect.selectedOptions);
    const selectedStores = selectedOptions.map(option => option.value);

    // 選択された店舗があればデータを表示
    if (selectedStores.length > 0) {
        currentIndex = 0; // 最初から表示
        renderMedalTransition(selectedStores);
    }
});

// デバッグ用: ページ読み込み時のデータ確認
document.addEventListener('DOMContentLoaded', function () {
    console.log('ページ読み込み時にローカルストレージを確認');
    populateStoreDropdown(); // プルダウンを初期化
});


// 直近10日分のデータを描画
function renderMedalTransition(storeNames) {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    const mergedData = {}; // 各日付ごとにメダル数を合計

    storeNames.forEach(storeName => {
        const storeData = storesData[storeName]?.medals || {};
        Object.keys(storeData).forEach(date => {
            if (!mergedData[date]) {
                mergedData[date] = 0;
            }
            mergedData[date] += storeData[date];
        });
    });

    const dates = Object.keys(mergedData).sort((a, b) => new Date(b) - new Date(a)); // 日付で降順にソート
    const medals = dates.map(date => mergedData[date]);

    // 直近10日分のデータを取り出す
    const last10DaysDates = dates.slice(currentIndex, currentIndex + 10).reverse(); // reverseで順序を逆に
    const last10DaysMedals = last10DaysDates.map(date => mergedData[date]);

    if (currentChart) {
        currentChart.destroy();
    }

    const ctx = document.getElementById('medal-chart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last10DaysDates,
            datasets: [{
                label: `選択された店舗の直近10日メダル遷移`,
                data: last10DaysMedals,
                borderColor: 'rgb(75, 192, 192)',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '日付'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'メダル数'
                    }
                }
            }
        }
    });

    // ボタンの表示/非表示を更新
    updateNavigationButtons(dates.length);
}

// ボタンの表示/非表示を更新
function updateNavigationButtons(totalDays) {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    // 「前へ」ボタンの有効/無効
    prevButton.disabled = currentIndex + 10 >= totalDays;

    // 「次へ」ボタンの有効/無効
    nextButton.disabled = currentIndex <= 0;
}

// データの移動処理（前へ/次へ）
function changeData(direction) {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    const selectedStore = storeSelect.value;
    if (!selectedStore) return;

    const storeData = storesData[selectedStore]?.medals || {};
    const dates = Object.keys(storeData).sort((a, b) => new Date(b) - new Date(a));

    if (direction === 'prev' && currentIndex + 10 < dates.length) {
        currentIndex += 10;
    } else if (direction === 'next' && currentIndex > 0) {
        currentIndex -= 10;
    }

    renderMedalTransition([selectedStore]);
}

// ボタンのイベントリスナーを追加
document.getElementById('prev-button').addEventListener('click', function () {
    changeData('prev');
});

document.getElementById('next-button').addEventListener('click', function () {
    changeData('next');
});

// ページ読み込み時に店舗一覧を初期化
document.addEventListener('DOMContentLoaded', function() {
    populateStoreDropdown(); // 確実にこの関数が呼ばれるようにする
});