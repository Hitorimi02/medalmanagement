document.getElementById('store-form').addEventListener('submit', function(event) {
    event.preventDefault(); // デフォルトのフォーム送信動作を防止

    const storeName = document.getElementById('store-name').value.trim();
    const storePeriod = parseInt(document.getElementById('store-period').value.trim(), 10); // 保存期間

    let stores = JSON.parse(localStorage.getItem('stores')) || [];

    // 同じ名前の店舗が既に登録されているか確認
    const isDuplicate = stores.some(existingStore => existingStore.name.toLowerCase() === storeName.toLowerCase());

    if (isDuplicate) {
        alert(`店舗 "${storeName}" は既に登録されています。`);
    } else {
        // 新しい店舗を登録
        stores.push({ name: storeName, medalDuration: storePeriod, medals: {} });

        // ローカルストレージに店舗リストを保存
        localStorage.setItem('stores', JSON.stringify(stores));

        alert(`店舗 "${storeName}" を登録しました。`);
    }
});
