// firebaseConfig.js

const firebaseConfig = {
  apiKey: "AIzaSyAbQD6qqWsP4NeIZcrerDr3GjzcFBVkHwM",
  authDomain: "kiwicash-b690d.firebaseapp.com",
  projectId: "kiwicash-b690d",
  storageBucket: "kiwicash-b690d.firebasestorage.app",
  messagingSenderId: "56859082209",
  appId: "1:56859082209:web:eee9677a246ef6e62126a0"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener Firestore
const db = firebase.firestore();

// Hacerlo accesible globalmente
window.db = db;
