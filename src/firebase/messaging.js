import { messaging, db, auth, firebase } from './firebase';

import store from '../store';

export const requestMessagingPermission = async () => {
  try {
    //Browser permissions
    await messaging.requestPermission();
    const token = await messaging.getToken();

    //Update user infor with notification tokens
    const uid = auth.currentUser.uid;
    const userInfoRef = db.collection('user_info').doc(uid);
    
    await userInfoRef.update({
      notification_tokens: firebase.firestore.FieldValue.arrayUnion(token)
    }).catch((error) => {
      userInfoRef.set({
        notification_tokens: [token]
      })
    })

    const { authRoles } = store.getState().sessionState;
    
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `key=${process.env.REACT_APP_FIREBASE_SERVERKEY}`
      },
      body: JSON.stringify({
        data: {
          status: "You'll now receive releavant notifications, thanks!"
        },
        to: token
      })
    });
    
    return {
      token,
      success: true
    }

  } catch (error) {
    return {
      error,
      success: false
    }
  }
}