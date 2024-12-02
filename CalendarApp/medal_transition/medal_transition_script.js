// ローカルストレージから店舗データを取得
const STORES_KEY = 'storesData';
const storeSelect = document.getElementById('store-select');
let currentChart = null; // 現在のチャートを保持する変数

// 店舗一覧をプルダウンに表示
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

// 店舗選択時の処理
storeSelect.addEventListener('change', function () {
    const selectedOptions = Array.from(storeSelect.selectedOptions);
    const selectedStores = selectedOptions.map(option => option.value);
    
    if (selectedStores.length > 0) {
        renderMedalTransition(selectedStores);
    }
});

// 店舗ごとのメダル遷移を描画 (複数店舗の遷移を同時に表示)
function renderMedalTransition(storeNames) {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    const datasets = [];
    let allDates = new Set();

    // 各店舗のデータセットを作成
    storeNames.forEach(storeName => {
        const storeData = storesData[storeName]?.medals || {};
        const dates = Object.keys(storeData);
        allDates = new Set([...allDates, ...dates]); // 全日付を収集

        const data = dates.map(date => ({
            date,
            medals: storeData[date]
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        datasets.push({
            label: `${storeName} のメダル遷移`,
            data: data.map(entry => entry.medals),
            borderColor: getRandomColor(),
            fill: false,
            tension: 0.1
        });
    });

    // 日付をソートし配列化
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));

    // 各データセットの不足部分を補完 (null で埋める)
    datasets.forEach(dataset => {
        const filledData = sortedDates.map(date => {
            const index = Object.keys(storesData[dataset.label.replace(" のメダル遷移", "")]?.medals || {}).indexOf(date);
            return index > -1 ? dataset.data[index] : null;
        });
        dataset.data = filledData;
    });

    if (currentChart) {
        currentChart.destroy();
    }

    const ctx = document.getElementById('medal-chart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDates,
            datasets: datasets
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

// ランダムな色を生成する関数
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// ページ読み込み時に店舗一覧を初期化
populateStoreDropdown();
