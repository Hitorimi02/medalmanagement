  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
  import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";
  import { getAnalytics } from "firebase/analytics";

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

  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const analytics = getAnalytics(app);
  export const provider = new GoogleAuthProvider();