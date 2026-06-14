import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  where,
  serverTimestamp,
  getCountFromServer,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/config'

export function subscribeToTickets(callback, userRole, userDivision) {
  const col = collection(db, 'requests')
  let q

  if (userRole === 'admin') {
    q = query(col, orderBy('createdAt', 'desc'))
  } else {
    q = query(col, where('division', '==', userDivision), orderBy('createdAt', 'desc'))
  }

  return onSnapshot(q, (snap) => {
    const tickets = snap.docs.map((d, i) => ({
      id: d.id,
      ticketId: d.data().ticketId || `BVD-${String(i + 1).padStart(4, '0')}`,
      ...d.data(),
    }))
    callback(tickets)
  })
}

export async function createTicket(data) {
  const col = collection(db, 'requests')

  // get count for ticket ID
  const snap = await getCountFromServer(col)
  const count = snap.data().count + 1
  const year = new Date().getFullYear()
  const ticketId = `BVD-${year}-${String(count).padStart(4, '0')}`

  const ref_ = await addDoc(col, {
    ...data,
    ticketId,
    status: 'Pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref_.id
}

export async function updateTicket(id, data) {
  await updateDoc(doc(db, 'requests', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteTicket(id) {
  await deleteDoc(doc(db, 'requests', id))
}

export async function uploadFile(file, path) {
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
