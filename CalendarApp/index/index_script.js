document.addEventListener('DOMContentLoaded', () => {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    // カレンダーを更新する関数
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

        // 空のセルを埋める
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.classList.add('day');
            calendar.appendChild(empty);
        }

        // 実際の日付を描画
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = day;

            const dayOfWeek = new Date(year, month, day).getDay();

            if (dayOfWeek === 0) dayElement.classList.add('sunday');
            if (dayOfWeek === 6) dayElement.classList.add('saturday');

            if (day === currentDay && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                dayElement.classList.add('today');
            }

            // クリックしたときにメダル保存画面に遷移
            dayElement.addEventListener('click', () => {
                const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                console.log(`日付がクリックされました: ${formattedDate}`);
                window.location.href = `../edit_medal/edit_medal.html?date=${formattedDate}`;
            });

            calendar.appendChild(dayElement);
        }

        // カレンダーが更新されるたびに店舗情報を更新
        StoreDetails();
    }

    // 店舗情報を表示する関数
    function StoreDetails() {
        console.log("StoreDetailsが呼び出されました");
    
        const storesData = JSON.parse(localStorage.getItem('storesData')) || {};
        console.log("取得したstoresData:", storesData); // デバッグ用
        const storeDetailsDiv = document.getElementById('store-details');
        storeDetailsDiv.innerHTML = ''; // 既存の情報をクリア
    
        // 各店舗のデータを取得して残り日数でソート
        const sortedStores = Object.keys(storesData)
            .map(storeName => {
                const medalsData = storesData[storeName].medals || {};
                const lastSavedDate = Object.keys(medalsData)
                    .sort((a, b) => new Date(b) - new Date(a))[0]; // 最後に保存された日付
                const medals = lastSavedDate ? medalsData[lastSavedDate] : 0;
                const duration = storesData[storeName].medalDuration || 0;
                const daysLeft = calculateDaysLeft(lastSavedDate, duration); // 残り日数を計算
    
                return {
                    name: storeName,
                    lastSavedDate: lastSavedDate || "記録なし",
                    medals: medals,
                    daysLeft: daysLeft,
                };
            })
            .sort((a, b) => a.daysLeft - b.daysLeft) // 残り日数が少ない順にソート
            .slice(0, 2); // 残り日数が少ない2店舗を選択
    
        // 店舗情報を表示
        sortedStores.forEach(store => {
            // 残り日数が7日以内の場合は赤字スタイルを適用
            const daysLeftStyle = store.daysLeft <= 7 && store.daysLeft >= 0 ? 'style="color: red;"' : '';
    
            const storeInfo = `
                <div>
                    <strong>店舗名:</strong> ${store.name}<br>
                    <strong>最終保存日:</strong> ${store.lastSavedDate}<br>
                    <strong>保存メダル枚数:</strong> ${store.medals}<br>
                    <strong>残り日数:</strong> <span ${daysLeftStyle}>${store.daysLeft >= 0 ? store.daysLeft + "日" : "有効期限切れ"}</span>
                </div>
                <hr>
            `;
            storeDetailsDiv.innerHTML += storeInfo;
        });
    }
    
    
    
    

    // 残り日数を計算する関数
    function calculateDaysLeft(lastSavedDate, duration) {
        if (!lastSavedDate || !duration) {
            return -1; // 日付や保存期間が存在しない場合、有効期限切れとして扱う
        }
    
        const today = new Date(); // 今日の日付
        const savedDate = new Date(lastSavedDate); // 最終保存日
        const expiryDate = new Date(savedDate); // 有効期限の日付
        expiryDate.setDate(savedDate.getDate() + duration); // 保存期間を加算
    
        console.log("今日の日付:", today);
        console.log("保存された日付:", savedDate);
        console.log("有効期限の日付:", expiryDate);
    
        const diffTime = expiryDate - today; // 有効期限と今日の日付の差分
        const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // ミリ秒を日数に変換
    
        console.log("計算された残り日数:", remainingDays);
        return remainingDays; // 正の値なら有効期限までの残り日数、負の値なら期限切れ
    }
    
    
    
    

    // 前月・次月ボタンの処理
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

    // 最初にカレンダーを表示
    updateCalendar();
});

