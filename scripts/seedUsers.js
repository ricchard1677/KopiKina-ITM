/**
 * Run this ONCE to seed demo users into Firebase Auth + Firestore.
 * Usage: node scripts/seedUsers.js
 * Requires: FIREBASE_SERVICE_ACCOUNT env var pointing to your service account JSON
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'

const serviceAccount = JSON.parse(readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT || './serviceAccount.json', 'utf8'))

initializeApp({ credential: cert(serviceAccount) })

const auth = getAuth()
const db = getFirestore()

const DEMO_USERS = [
  { email: 'admin@kopikina.id',       password: 'admin123',  role: 'admin',       name: 'Rina Susanti',    division: 'Admin (Branding & Visual)' },
  { email: 'sales@kopikina.id',       password: 'sales123',  role: 'sales',       name: 'Budi Santoso',    division: 'Sales' },
  { email: 'pmo@kopikina.id',         password: 'pmo123',    role: 'pmo',         name: 'Dewi Rahayu',     division: 'PMO' },
  { email: 'hrd@kopikina.id',         password: 'hrd123',    role: 'hrd',         name: 'Arif Wibowo',     division: 'HRD' },
  { email: 'operational@kopikina.id', password: 'ops123',    role: 'operational', name: 'Siti Nurhaliza',  division: 'Operational' },
  { email: 'ep@kopikina.id',          password: 'ep1234',    role: 'ep_internal', name: 'Hendra Wijaya',   division: 'EP (Internal)' },
  { email: 'eppopup@kopikina.id',     password: 'popup123',  role: 'ep_popup',    name: 'Maya Putri',      division: 'EP Pop Up (External)' },
  { email: 'procurement@kopikina.id', password: 'proc123',   role: 'procurement', name: 'Fajar Nugraha',   division: 'Procurement' },
]

async function seed() {
  for (const user of DEMO_USERS) {
    try {
      let uid
      try {
        const existing = await auth.getUserByEmail(user.email)
        uid = existing.uid
        console.log(`✓ Exists: ${user.email}`)
      } catch {
        const created = await auth.createUser({ email: user.email, password: user.password, displayName: user.name })
        uid = created.uid
        console.log(`✅ Created: ${user.email}`)
      }
      await db.collection('users').doc(uid).set({
        uid, email: user.email, name: user.name, role: user.role, division: user.division,
        createdAt: new Date(),
      }, { merge: true })
    } catch (err) {
      console.error(`❌ ${user.email}:`, err.message)
    }
  }
  console.log('\n🎉 Seed complete!')
  process.exit(0)
}

seed()
