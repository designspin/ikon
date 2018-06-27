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
  const { ids, claims } = data;
  const failed = [];

  if(!context.auth.token.claims.roles.admin) {
    throw new functions.HttpsError('failed-precondition', 'This operation requires an admin user.');
  }

  const setClaimsData = () => {
    let success = [];
    let fail = [];

    return new Promise((resolve, reject) => {
      ids.forEach((userId) => {
        const ref = admin.firestore().collection('user_roles').doc(`${userId}`);
        ref.set(claims)
        .then(() => {
          success.push(userId);
        })
        .catch(() => {
          fail.push(userId);
        })
      });

      resolve({ fail, success});
    })
  }

  const setClaimsUser = () => {
    let success = [];
    let fail = [];

    return new Promise((resolve, reject) => {
      ids.forEach((userId) => {
        admin.auth().setCustomUserClaims(userId, { roles: claims })
        .then(() => {
          success.push(userId);
        })
        .catch(() => {
          fail.push(userId)
        })
      })

      resolve({ fail, success });
    })
  }

  return Promise.all([setClaimsUser, setClaimsData]).then((values) => {
    return { data: values[0], claims: values[1] };
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