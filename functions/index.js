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

exports.bulkDeleteUsers = functions.https.onCall((data, context) => {
  const deleteUsers = () => {
    return data.ids.map((userId) => {
      const ref = admin.firestore().collection('user_roles').doc(`${userId}`);
      return ref.delete().then(() => {
        return admin.auth().deleteUser(userId)
      })
    })
  }

  return Promise.all([...deleteUsers()])
  .then((values) => {
    return values;
  })
  .catch((errors) => {
    return errors;
  });
}) 

exports.bulkClaims = functions.https.onCall((data, context) => {
  
  const setClaimsData = () => {
    let success = [];
    let fail = [];
      return data.ids.map((userId) => {
        const ref = admin.firestore().collection('user_roles').doc(`${userId}`);
        return ref.set(data.claims)
        .then(() => {
          success.push(userId);
          return true;
        })
        .catch(() => {
          fail.push(userId);
          return false;
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
          return true;
        })
        .catch(() => {
          fail.push(userId);
          return false;
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

exports.getUserById = functions.https.onCall((data, context) => {
  return admin.auth.getUser(data.uid)
    .then((userRecord) => { 
      return userRecord;
    })
    .catch((error) => {
      return error;
    }) 
});

/*exports.makeDummyUsers = functions.https.onRequest((req, res) => {

  const createUsers = () => {
    fs.readFile('mock_users.json', 'utf8', (err, data) => {
      if( err ) throw err;
      const file = JSON.parse(data);

      return file.map((item) => {
        return admin.auth().createUser(item)
        .then((record) => {
          const ref = admin.firestore().collection('user_roles').doc(`${record.uid}`);
          return ref.set({
            admin: false,
            staff: false,
            client: false
          })
          .then(() => {
            return admin.auth().setCustomUserClaims(record.uid, { roles: { admin: false, staff: false, client: false }});
          })
        })
      })
    })
  }
  
  Promise.all([...createUsers()])
  .then((values) => {
    return res.redirect(303, "Done");
  })
  .catch((error) => {
    return res.redirect(500, "error");
  });
}); */
