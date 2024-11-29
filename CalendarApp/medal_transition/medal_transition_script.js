// ローカルストレージから店舗データを取得
const STORES_KEY = 'storesData';
const storeSelect = document.getElementById('store-select');
let currentChart = null; // 現在のチャートを保持する変数

// 店舗一覧をプルダウンに表示
function populateStoreDropdown() {
    const storeSelect = document.getElementById('store-select');
    storeSelect.innerHTML = '<option value="" selected disabled>店舗を選択</option>';

    // localStorage から店舗データを取得
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};

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

// 店舗を選択した時の処理
storeSelect.addEventListener('change', function () {
    const storeName = storeSelect.value;
    if (storeName) {
        renderMedalTransition(storeName);
    }
});

// 店舗ごとのメダル遷移を描画
function renderMedalTransition(storeName) {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    const storeData = storesData[storeName] || {};

    // 日付とメダル数の配列を作成
    const dates = Object.keys(storeData).sort((a, b) => new Date(a) - new Date(b)); // 日付でソート
    const medals = dates.map(date => storeData[date]);

    // 既存のチャートがあれば破棄
    if (currentChart) {
        currentChart.destroy();
    }

    // Chart.js で折れ線グラフを描画
    const ctx = document.getElementById('medal-chart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `${storeName} のメダル遷移`,
                data: medals,
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
}

// ページ読み込み時に店舗一覧を初期化
populateStoreDropdown();
