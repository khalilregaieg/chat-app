import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCNuBsed-0_tpNyY57d57rZr16qwRUHoLo",
    authDomain: "voiceup-83d9e.firebaseapp.com",
    projectId: "voiceup-83d9e",
    storageBucket: "voiceup-83d9e.appspot.com",
    messagingSenderId: "268565842401",
    appId: "1:268565842401:web:b8ffb01d573bd800c6aaa0"
};

let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };