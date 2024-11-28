// 現在の年月を管理する変数
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0:1月, 1:2月...

// 月を更新してカレンダーを再描画する関数
function updateCalendar() {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    document.getElementById('current-month').textContent = `${currentYear}年 ${monthNames[currentMonth]}`;
    renderCalendar(currentYear, currentMonth);
}

// カレンダーを描画する関数
function renderCalendar(year, month) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    daysOfWeek.forEach(day => {
        const header = document.createElement('div');
        header.classList.add('header');
        header.textContent = day;
        calendar.appendChild(header);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.classList.add('day');
        calendar.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = day;

        const dayOfWeek = new Date(year, month, day).getDay();

        if (dayOfWeek === 0) dayElement.classList.add('sunday');
        if (dayOfWeek === 6) dayElement.classList.add('saturday');

        // 日付をクリックした際の処理
        dayElement.addEventListener('click', () => {
            const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            window.location.href = `../edit_medal/edit_medal.html?date=${formattedDate}`;
        });

        calendar.appendChild(dayElement);
    }
}

// 前の月を表示する
document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar();
});

// 次の月を表示する
document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
});

// 初期描画
updateCalendar();

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
