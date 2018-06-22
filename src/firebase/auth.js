import { auth, functions, db } from './firebase';
import store from '../store';

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
  .then((authUser) => {
    const setClaims = functions.httpsCallable('setClaims');
      setClaims().then((result) => {
        if(result.data.roles) {
          auth.currentUser.getIdToken(true)
          auth.currentUser.getIdTokenResult()
          .then((idTokenResult) => {
            if(!!idTokenResult.claims.roles) {
              const authRoles = idTokenResult.claims.roles;
              store.dispatch({ type: "AUTH_ROLE_SET", authRoles })
            }
          });
        }
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