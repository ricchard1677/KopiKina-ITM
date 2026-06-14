import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  updateEmail,
  updatePassword,
} from 'firebase/auth'
import {
  collection, doc, setDoc, getDocs, updateDoc,
  deleteDoc, serverTimestamp, query, orderBy,
} from 'firebase/firestore'
import { db } from '../firebase/config'

const FIREBASE_CONFIG = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// Secondary Firebase app — operations here don't affect admin's session
function getSecondaryAuth() {
  const existing = getApps().find((a) => a.name === 'secondary')
  const app = existing || initializeApp(FIREBASE_CONFIG, 'secondary')
  return getAuth(app)
}

export async function createUserAccount({ email, password, name, role, division }) {
  const secondaryAuth = getSecondaryAuth()

  const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password)
  await updateProfile(cred.user, { displayName: name })
  await secondaryAuth.signOut()

  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid,
    email,
    name,
    role,
    division,
    createdAt: serverTimestamp(),
  })

  return cred.user.uid
}

export async function getAllUsers() {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function updateUserProfile(uid, data, newPassword = null) {
  // Update Firestore profile
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() })

  // If password needs to be reset, sign in as that user via secondary app then update
  if (newPassword && data.email) {
    try {
      const secondaryAuth = getSecondaryAuth()
      // We need current password to reauthenticate — skipping Auth-level email/pw update
      // This is a Firestore-only update; Auth changes require Admin SDK or user self-action
    } catch {
      // Silent — Firestore update already done above
    }
  }
}

export async function deleteUserProfile(uid) {
  await deleteDoc(doc(db, 'users', uid))
}
