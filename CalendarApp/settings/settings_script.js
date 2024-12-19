document.addEventListener('DOMContentLoaded', () => {
    const STORES_KEY = 'storesData';
    const deleteAllButton = document.getElementById('delete-all');

    // 確認ダイアログ表示関数
    function showConfirmationDialog(message, onConfirm) {
        const confirmDialog = document.createElement('div');
        confirmDialog.classList.add('confirm-dialog');
        confirmDialog.innerHTML = `
            <div class="confirm-content">
                <p>${message}</p>
                <div style="display: flex; justify-content: center; gap: 10px;">
                    <button id="confirm-yes" style="background-color: #e74c3c; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">はい</button>
                    <button id="confirm-no" style="background-color: #ccc; color: black; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">いいえ</button>
                </div>
            </div>
        `;
        document.body.appendChild(confirmDialog);

        document.getElementById('confirm-yes').addEventListener('click', () => {
            onConfirm();
            document.body.removeChild(confirmDialog);
        });

        document.getElementById('confirm-no').addEventListener('click', () => {
            document.body.removeChild(confirmDialog);
        });
    }

    // すべてのデータを削除
    deleteAllButton.addEventListener('click', () => {
        showConfirmationDialog(
            'すべてのデータが削除されます。本当によろしいですか？',
            () => {
                localStorage.removeItem(STORES_KEY);
                alert('すべてのデータが削除されました。');
            }
        );
    });
});
