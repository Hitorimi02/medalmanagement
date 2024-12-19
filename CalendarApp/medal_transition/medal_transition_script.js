const STORES_KEY = 'storesData';
const storeSelect = document.getElementById('store-select');
let currentChart = null;
let currentIndex = 0;

// 店舗一覧をプルダウンに表示
function populateStoreDropdown() {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    storeSelect.innerHTML = '<option value="" disabled selected>店舗を選択</option>';

    Object.keys(storesData).forEach(storeName => {
        const option = document.createElement('option');
        option.value = storeName;
        option.textContent = `${storeName} (保存期間: ${storesData[storeName].medalDuration || '不明'}日)`;
        storeSelect.appendChild(option);
    });

    if (Object.keys(storesData).length > 0) {
        storeSelect.value = Object.keys(storesData)[0];
        currentIndex = 0; // リセット
        renderMedalTransition([storeSelect.value]);
    }
}

// データを表示
function renderMedalTransition(storeNames) {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    const mergedData = {};

    storeNames.forEach(storeName => {
        const storeData = storesData[storeName]?.medals || {};
        Object.keys(storeData).forEach(date => {
            if (!mergedData[date]) mergedData[date] = 0;
            mergedData[date] += storeData[date];
        });
    });

    const dates = Object.keys(mergedData).sort((a, b) => new Date(b) - new Date(a));
    const last10Days = dates.slice(currentIndex, currentIndex + 10).reverse();
    const last10Medals = last10Days.map(date => mergedData[date]);

    if (currentChart) currentChart.destroy();

    const ctx = document.getElementById('medal-chart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last10Days,
            datasets: [{
                label: 'メダル遷移',
                data: last10Medals,
                borderColor: 'rgb(75, 192, 192)',
                fill: false,
            }]
        }
    });

    updateNavigationButtons(dates.length);
}

// ボタンの有効/無効を更新
function updateNavigationButtons(totalDays) {
    document.getElementById('prev-button').disabled = currentIndex + 10 >= totalDays;
    document.getElementById('next-button').disabled = currentIndex <= 0;
}

// データの移動
function changeData(direction) {
    const storesData = JSON.parse(localStorage.getItem(STORES_KEY)) || {};
    const selectedStore = storeSelect.value;

    if (!selectedStore) return;

    const dates = Object.keys(storesData[selectedStore]?.medals || {}).sort((a, b) => new Date(b) - new Date(a));

    if (direction === 'prev' && currentIndex + 10 < dates.length) {
        currentIndex += 10;
    } else if (direction === 'next' && currentIndex > 0) {
        currentIndex -= 10;
    }

    renderMedalTransition([selectedStore]);
}

// イベントリスナー設定
document.getElementById('prev-button').addEventListener('click', () => changeData('prev'));
document.getElementById('next-button').addEventListener('click', () => changeData('next'));
storeSelect.addEventListener('change', () => {
    currentIndex = 0;
    renderMedalTransition([storeSelect.value]);
});

// 初期化
document.addEventListener('DOMContentLoaded', populateStoreDropdown);
