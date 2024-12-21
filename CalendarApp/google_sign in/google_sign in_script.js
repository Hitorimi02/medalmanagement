import { auth, provider } from './firebase.js';
import { signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";
import { db } from "../firebase.js"; // firebase.jsからdbをインポート

// サインイン
document.getElementById('google-signin-btn').addEventListener('click', () => {
  console.log("サインインボタンがクリックされました");  // このログが表示されるか確認
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("サインイン成功:", result.user);
    })
    .catch((error) => {
      console.error("サインインエラー:", error);
    });
});

// サインアウト
document.getElementById('signout-btn').addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log("サインアウトしました");
    })
    .catch((error) => {
      console.error("サインアウトエラー:", error);
    });
});

// サインイン状態の監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("ログイン中のユーザー:", user);
    document.getElementById('google-signin-btn').style.display = "none";
    document.getElementById('signout-btn').style.display = "block";
  } else {
    console.log("サインインしていません");
    document.getElementById('google-signin-btn').style.display = "block";
    document.getElementById('signout-btn').style.display = "none";
  }
});

// Firestoreにデータを書き込む
async function addTestData() {
    try {
        const docRef = await addDoc(collection(db, "testCollection"), {
            testField: "正常に動作しています",
            timestamp: new Date()
        });
        console.log("ドキュメントが追加されました:", docRef.id);
    } catch (e) {
        console.error("エラーが発生しました:", e);
    }
}

// Firestoreからデータを読み込む
async function getTestData() {
    try {
        const querySnapshot = await getDocs(collection(db, "testCollection"));
        querySnapshot.forEach((doc) => {
            console.log(`ドキュメントID: ${doc.id}, データ:`, doc.data());
        });
    } catch (e) {
        console.error("エラーが発生しました:", e);
    }
}

// テストデータを書き込み、読み込み
addTestData();
getTestData();