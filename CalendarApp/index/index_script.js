document.addEventListener('DOMContentLoaded', () => {
    // カレンダーのスクリプト内容（メニュー関連部分は削除済み）
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    function updateCalendar() {
        const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        document.getElementById('current-month').textContent = `${currentYear}年 ${monthNames[currentMonth]}`;
        renderCalendar(currentYear, currentMonth);
    }

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

            dayElement.addEventListener('click', () => {
                const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                window.location.href = `../edit_medal/edit_medal.html?date=${formattedDate}`;
            });

            calendar.appendChild(dayElement);
        }
    }

    document.getElementById('prev-month').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });

    updateCalendar();
});
