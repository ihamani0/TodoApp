
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



export const firebaseConfig = {
    apiKey: "AIzaSyCxCbXX7nRKD7QV9usJmz4prDt3-4JLkhg",
    authDomain: "todoapp-7b3bd.firebaseapp.com",
    projectId: "todoapp-7b3bd",
    storageBucket: "todoapp-7b3bd.firebasestorage.app",
    messagingSenderId: "639772856249",
    appId: "1:639772856249:web:921759ed1b432e0717b068"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore and Export it
export const db = getFirestore(firebaseApp);


//npm install -g firebase-tools
//firebase login
//firebase init
//firebase deploy