import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCh6PkKD1c8k5TEL1TPkexapL6Q_NMVvYs",
    authDomain: "medalmanagement0299.firebaseapp.com",
    projectId: "medalmanagement0299",
    storageBucket: "medalmanagement0299.firebasestorage.app",
    messagingSenderId: "325142497563",
    appId: "1:325142497563:web:e05486843edee5009d2bbe",
    measurementId: "G-X0GPFPYTBF"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();