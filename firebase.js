import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAir6fwvpWUMMRklK_7EaL-aJ33kllh9lk",
    authDomain: "voiceup-3a49a.firebaseapp.com",
    projectId: "voiceup-3a49a",
    storageBucket: "voiceup-3a49a.appspot.com",
    messagingSenderId: "119111710909",
    appId: "1:119111710909:web:8f519a2ac8f0ca90535fd4"
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