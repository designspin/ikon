import { db, firebase } from './firebase';

export const createUserGroups = (name) => 
  db.collection("staff_groups").doc(name).set({})
  
export const addUserToGroup = (id, name, username) =>
  db.collection("staff_groups").doc(name).update({
    [id]: username
  })

export const removeUserFromGroup = (id, name) =>
  db.collection("staff_groups").doc(name).update({
    [id]: firebase.firestore.FieldValue.delete()
  })

export const removeFromAllGroups = (id) => {
  const query = db.collection("staff_groups").where(id, '>', '');

  return query.get()
  .then((querySnapShot) => {
    querySnapShot.forEach((doc) => {
      doc.ref.update({
        [id]: firebase.firestore.FieldValue.delete()
      })
    })
  })
}
  
export const getUserGroups = () =>
  db.collection("staff_groups").get()

export const subscribeUserGroups = (callback) => 
  db.collection("staff_groups").onSnapshot(querySnapshot => callback(querySnapshot))

export const unsubscribeUserGroups = () =>
  db.collection("staff_groups").onSnapshot(function(){})