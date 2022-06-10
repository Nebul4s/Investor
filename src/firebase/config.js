import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAykeYup8ui6OvAZfk6oPRnIFVcDpCroPs",
  authDomain: "investor-277aa.firebaseapp.com",
  projectId: "investor-277aa",
  storageBucket: "investor-277aa.appspot.com",
  messagingSenderId: "663291786158",
  appId: "1:663291786158:web:26e0dc760deccfedf50e3f",
};

firebase.initializeApp(firebaseConfig);

const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();

const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, timestamp };
