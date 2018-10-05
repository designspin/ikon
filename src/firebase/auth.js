import { auth, functions, db } from './firebase';
import store from '../store';

export const getUID = () =>
  auth.currentUser.uid;

//Sign Up
export const doCreateUserWithEmailAndPassword = (email, password, username, clientAccessRequired) =>
  auth.createUserWithEmailAndPassword(email, password)
  .then((data) => {
    console.log(username);
    const fullname = username.toLowerCase();

    data.user.updateProfile({
      displayName: fullname
    })
    .catch((error) => {
      console.log("There was a problem creating the users display name");
    });

    db.collection('user_roles').doc(`${data.user.uid}`).set({
      roles: {
        admin: false,
        staff: false,
        client: clientAccessRequired
      }
    })
    .catch((error) => {
      console.log("There was a problem setting initial user roles");
    });
    return data;
  })

//Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password)
  .then((authUser) => {
    return auth.currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        if(!!idTokenResult.claims.roles) {
          const authRoles = idTokenResult.claims.roles
          return store.dispatch({ type: "AUTH_ROLE_SET", authRoles})
        } else {
          const setClaims = functions.httpsCallable('setClaims');
          return setClaims().then((result) => {
            if(result.data.roles) {
              auth.currentUser.getIdToken(true)
              auth.currentUser.getIdTokenResult()
              .then((idTokenResult) => {
                if(!!idTokenResult.claims.roles) {
                  const authRoles = idTokenResult.claims.roles;
                  return store.dispatch({ type: "AUTH_ROLE_SET", authRoles })
                }
              });
            }
          });
        }
      })
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