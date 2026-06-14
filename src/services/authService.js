import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

export async function logout() {
  await signOut(auth)
}

export async function register({ email, password, name, role, division }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    email,
    name,
    role,
    division,
    createdAt: serverTimestamp(),
  })
  return cred.user
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

export async function getOrCreateProfile(user) {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)

  if (snap.exists()) return snap.data()

  // Auto-create minimal profile on first login
  const profile = {
    uid: user.uid,
    email: user.email,
    name: user.displayName || user.email.split('@')[0],
    role: 'sales',        // default role — Admin can update later
    division: 'Sales',    // default division
    createdAt: serverTimestamp(),
  }
  await setDoc(ref, profile)
  return profile
}
