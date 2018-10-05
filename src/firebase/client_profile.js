import { db, firebase } from './firebase';

export const getClientProfile = (id) =>
  db.collection("client_profile").doc(id).get()

export const saveClientProfile = (id, data) =>
  db.collection("client_profile").doc(id).set({
    ...data
  });