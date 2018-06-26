const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.setClaims = functions.https.onCall((data, context) => {
  
  const ref = admin.firestore().collection('user_roles').doc(`${context.auth.uid}`);
  
  return ref.get().then((doc) => {
    if ( doc.exists ) {
        const docData = doc.data();
        return admin.auth().setCustomUserClaims(context.auth.uid, { roles: docData.roles })
        .then(() => {
          return { roles: docData.roles };
        })
    } else {
      return { roles: false }
    }
  })
});

exports.allUsers = functions.https.onCall((data, context) => {
  if(data.nextPageToken) {
    return admin.auth().listUsers(data.qty, data.nextPageToken)
    .then((usersResult) => {
      return usersResult;
    })
  } else {
    return admin.auth().listUsers(data.qty)
    .then((usersResult) => {
      return usersResult;
    })
  }
});