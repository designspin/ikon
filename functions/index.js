const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.setClaims = functions.https.onCall((data, context) => {
  console.log(data);
  return data.uid;
  /*const ref = admin.firestore().collection('user_roles').doc(`${data.uid}`)

  return ref.get().then((doc) => {
    if ( doc.exists ) {
      return admin.auth().setCustomUserClaims(data.uid, { admin: doc.data.roles.admin }).then(() => {
        return { admin: doc.data.roles.admin }
      });
    } 
    return { admin: false }
    return doc.data;
  })
  */
});