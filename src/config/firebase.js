import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCew0cxL04Q-Wae1Er9xwS96j__7-O5MCY",
    authDomain: "fire-drive-c049a.firebaseapp.com",
    projectId: "fire-drive-c049a",
    storageBucket: "fire-drive-c049a.appspot.com",
    messagingSenderId: "43249081876",
    appId: "1:43249081876:web:984056b87a78f9484b1101"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {db, storage, auth, provider}