import { initializeApp } from "node_modules/@firebase/app";
import { getAuth } from "node_modules/@firebase/auth";
import { GoogleAuthProvider } from "node_modules/@firebase/auth";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js";  // 修正: 正しいURLでインポート

const firebaseConfig = {
  apiKey: "AIzaSyDVu57B4166bQN6FAQF5av7Xt_AFPME078",
  authDomain: "medalmanagement0202.firebaseapp.com",
  projectId: "medalmanagement0202",
  storageBucket: "medalmanagement0202.firebasestorage.app",
  messagingSenderId: "724094016415",
  appId: "1:724094016415:web:6c216e723b562535f23baa",
  measurementId: "G-MT5R29JQ1N"
};

const app = initializeApp(firebaseConfig);

// 必要なサービスをエクスポート
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);  // 必要なら使用
export const provider = new GoogleAuthProvider();
