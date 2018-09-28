import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/firestore';
import 'firebase/messaging';
import store from '../store';

const config = {
  apiKey: `${process.env.REACT_APP_FIREBASE_APIKEY}`,
  authDomain: `${process.env.REACT_APP_FIREBASE_AUTHDOMAIN}`,
  databaseURL: `${process.env.REACT_APP_FIREBASE_DATABASEURL}`,
  projectId: `${process.env.REACT_APP_FIREBASE_PROJECTID}`,
  storageBucket: `${process.env.REACT_APP_FIREBASE_STORAGEBUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID}`,
}

if(!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const functions = firebase.functions();
const db = firebase.firestore();
db.settings = {
  timestampInSnapshots: true
}
const messaging = firebase.messaging();

messaging.onMessage((payload) => {
  store.dispatch({ type: 'NOTICE_MESSAGE_SET', payload: { variant:"info", message:`${payload.data.status}` }});
  console.log("onMessage", payload);
});

export {
  auth,
  functions,
  db,
  messaging,
  firebase,
};