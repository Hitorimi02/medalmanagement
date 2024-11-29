document.getElementById('reset-button').addEventListener('click', function () {
    // 確認ダイアログを表示
    if (confirm('すべてのデータを削除しますか？')) {
        localStorage.clear();  // localStorage のすべてのデータを削除
        alert('データが削除されました');
        window.location.href = '../index/index.html';  // カレンダーのページに戻る
    }
});
