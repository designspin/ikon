import { auth, functions, db } from './firebase';

//Sign Up
export const doCreateUserWithEmailAndPassword = (email, password, username) =>
  auth.createUserWithEmailAndPassword(email, password)
  .then((data) => {
    db.collection('users').doc(`${data.user.uid}`).set({
      username
    });
    return data;
  })

//Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password)
  .then((result) =>{
    const setClaims = functions.httpsCallable('setClaims');
      return setClaims(result.user.uid).then((result) => {
        console.log(result);
      });
  });

//Sign Out
export const doSignOut = () =>
  auth.signOut();

// Password Reset
export const doPasswordReset = (email) =>
  auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = (password) =>
  auth.currentUser.updatePassword(password);