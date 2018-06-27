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

exports.bulkClaims = functions.https.onCall((data, context) => {
  
  const setClaimsData = () => {
    let success = [];
    let fail = [];
      return data.ids.map((userId) => {
        const ref = admin.firestore().collection('user_roles').doc(`${userId}`);
        return ref.set(data.claims)
        .then(() => {
          success.push(userId);
        })
        .catch(() => {
          fail.push(userId);
        })
      });
  }

  const setClaimsUser = () => {
    let success = [];
    let fail = [];
      return data.ids.map((userId) => {
        return admin.auth().setCustomUserClaims(userId, { roles: data.claims })
        .then(() => {
          success.push(userId);
        })
        .catch(() => {
          fail.push(userId)
        })
      });
  }

  return Promise.all([...setClaimsUser(), ...setClaimsData()]).then((values) => {
    console.log(values);
    return values;
  });
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