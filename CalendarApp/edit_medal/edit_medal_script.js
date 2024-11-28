// URLパラメータから日付情報を取得する
const urlParams = new URLSearchParams(window.location.search);
const date = urlParams.get('date');
document.getElementById('selected-date').textContent = `📅 ${date}`;

// 日付を降順でソートする関数
function sortDates(dates) {
    return dates.sort((a, b) => new Date(b) - new Date(a));
}

// 過去のメダル記録を取得
function getLastMedalBefore(date) {
    const allDates = Object.keys(localStorage)
        .filter(key => key.startsWith('medals_'))
        .map(key => key.replace('medals_', ''))
        .filter(d => new Date(d) < new Date(date));

    const sortedDates = sortDates(allDates);
    if (sortedDates.length === 0) return null;

    const latestDate = sortedDates[0];
    return {
        date: latestDate,
        medals: parseInt(localStorage.getItem(`medals_${latestDate}`), 10)
    };
}

const previousMedalData = getLastMedalBefore(date);
const differenceEl = document.getElementById('difference');

if (previousMedalData) {
    differenceEl.textContent = `前回 (${previousMedalData.date}) の枚数：${previousMedalData.medals} 枚`;
} else {
    differenceEl.textContent = '過去の記録はありません';
}

document.getElementById('medal-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const medals = parseInt(document.getElementById('medals').value);
    localStorage.setItem(`medals_${date}`, medals);

    if (previousMedalData) {
        const difference = medals - previousMedalData.medals;
        differenceEl.textContent = `前回 (${previousMedalData.date}) 比：${difference} 枚`;
    } else {
        differenceEl.textContent = '今回が最初の記録です';
    }

    alert(`メダルが保存されました: ${medals} 枚`);
});

function goBack() {
    window.location.href = "../index/index.html";
}

// メニュー制御
const menu = document.getElementById('menu');
const menuButton = document.getElementById('menu-button');
const closeMenuButton = document.getElementById('close-menu');

menuButton.addEventListener('click', () => {
    menu.classList.add('open');
});
closeMenuButton.addEventListener('click', () => {
    menu.classList.remove('open');
});
window.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !menuButton.contains(e.target)) {
        menu.classList.remove('open');
    }
});
