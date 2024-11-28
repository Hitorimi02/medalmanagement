// URLパラメータから日付情報を取得する
const urlParams = new URLSearchParams(window.location.search);
const date = urlParams.get('date'); // "date" パラメータを取得
document.getElementById('selected-date').textContent = `📅 ${date}`; // 取得した日付をページに表示

// 日付を降順（最新が先頭）でソートする関数
function sortDates(dates) {
    return dates.sort((a, b) => new Date(b) - new Date(a));
}

// 指定された日付より前の最も新しいメダル記録を取得する関数
function getLastMedalBefore(date) {
    const allDates = Object.keys(localStorage) // localStorage の全キーを取得
        .filter(key => key.startsWith('medals_')) // "medals_"で始まるキーを抽出（メダル記録）
        .map(key => key.replace('medals_', '')) // キーから"medals_"を取り除いて日付を取得
        .filter(d => new Date(d) < new Date(date)); // 指定日付より前の日付をフィルタリング

    const sortedDates = sortDates(allDates); // 日付を降順にソート
    if (sortedDates.length === 0) return null; // 該当する日付がない場合は null を返す

    const latestDate = sortedDates[0]; // 最も新しい日付を取得
    return { 
        date: latestDate, // 最新の日付
        medals: parseInt(localStorage.getItem(`medals_${latestDate}`), 10) // 該当日付のメダル枚数を取得
    };
}

// 過去のメダルデータを取得
const previousMedalData = getLastMedalBefore(date);
const differenceEl = document.getElementById('difference'); // 差分を表示する要素を取得

// 過去の記録がある場合の処理
if (previousMedalData) {
    differenceEl.textContent = `前回 (${previousMedalData.date}) の枚数：${previousMedalData.medals} 枚`;
} else {
    // 過去の記録がない場合の表示
    differenceEl.textContent = '過去の記録はありません';
}

// フォーム送信時の処理
document.getElementById('medal-form').addEventListener('submit', function(event) {
    event.preventDefault(); // デフォルトのフォーム送信動作をキャンセル
    const medals = parseInt(document.getElementById('medals').value); // 入力されたメダル枚数を取得

    // 入力されたメダル枚数をlocalStorageに保存
    localStorage.setItem(`medals_${date}`, medals);

    // 過去の記録がある場合、差分を計算して表示
    if (previousMedalData) {
        const difference = medals - previousMedalData.medals; // 差分を計算
        differenceEl.textContent = `前回 (${previousMedalData.date}) 比：${difference} 枚`;
    } else {
        // 今回が最初の記録の場合
        differenceEl.textContent = '今回が最初の記録です';
    }

    // 保存完了の通知
    alert(`メダルが保存されました: ${medals} 枚`);
});

// 「戻る」ボタンの処理
function goBack() {
    window.location.href = "../index/index.html"; // カレンダー画面に戻る
}
