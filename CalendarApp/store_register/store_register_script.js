document.getElementById('store-form').addEventListener('submit', function(event) {
    event.preventDefault(); // デフォルトのフォーム送信動作を防止

    // 入力された店舗名を取得し、前後の空白を削除
    const storeName = document.getElementById('store-name').value.trim(); 

    // ローカルストレージから現在の店舗リストを取得（もしリストが存在しない場合は空の配列）
    let stores = JSON.parse(localStorage.getItem('stores')) || [];

    // 同じ名前の店舗が既に登録されているかを確認（大文字小文字を区別しない）
    const isDuplicate = stores.some(existingStore => existingStore.toLowerCase() === storeName.toLowerCase());

    if (isDuplicate) {
        // 同じ名前の店舗が存在する場合、エラーメッセージを表示
        alert(`店舗 "${storeName}" は既に登録されています。`);
    } else {
        // 重複がない場合、新しい店舗名をリストに追加
        stores.push(storeName);

        // ローカルストレージに店舗リストを保存（JSON形式に変換）
        localStorage.setItem('stores', JSON.stringify(stores)); 

        // 成功メッセージを表示
        alert(`店舗 "${storeName}" を登録しました。`);
    }
});
