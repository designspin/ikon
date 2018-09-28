import { db } from './firebase';

export const createUserGroups = (name) => 
  db.collection("staff_groups").doc(name).set({
    users: []
  })

export const getUserGroups = () =>
  db.collection("staff_groups").get()