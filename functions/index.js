const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setClaims = functions.https.onCall((data, context) => {
  
  const ref = admin.firestore().collection('user_roles').doc(`${context.auth.uid}`);
  
  return ref.get().then((doc) => {
    if ( doc.exists ) {

        const docData = doc.data();

        console.log( docData );

        return admin.auth().setCustomUserClaims(context.auth.uid, { roles: docData.roles })
        .then(() => {
          console.log(`Claims Set`);
          return { roles: docData.roles };
        })
    } else {
      return { roles: false }
    }
  })
});