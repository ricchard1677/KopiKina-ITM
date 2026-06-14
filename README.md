# KopiKina CMS — Branding & Visual Division

Internal CMS ticketing system for managing visual collateral requests.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd "KopiKina ITM"
npm install
```

### 2. Configure Firebase
Copy `.env.example` to `.env.local` and fill in your Firebase project credentials:
```bash
cp .env.example .env.local
```

Get your config from: **Firebase Console → Project Settings → General → Your apps → Web app**

### 3. Run the dev server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (e.g. `kopikina-cms`)
3. Enable **Authentication → Email/Password**
4. Create **Firestore Database** (start in production mode)
5. Create **Storage** bucket
6. Deploy security rules:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules,storage
   ```

### Seed Demo Users
After setting up Firebase Admin SDK:
```bash
FIREBASE_SERVICE_ACCOUNT=./serviceAccount.json node scripts/seedUsers.js
```

Or manually create users in Firebase Console → Authentication → Add user.

---

## 👥 Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@kopikina.id | admin123 | Admin (Branding & Visual) |
| sales@kopikina.id | sales123 | Sales |
| pmo@kopikina.id | pmo123 | PMO |
| hrd@kopikina.id | hrd123 | HRD |
| operational@kopikina.id | ops123 | Operational |
| ep@kopikina.id | ep1234 | EP Internal |
| eppopup@kopikina.id | popup123 | EP Pop Up |
| procurement@kopikina.id | proc123 | Procurement |

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── common/          # Reusable: Modal, StatusBadge, EmptyState, LoadingScreen
│   └── layout/          # Layout, Sidebar, Topbar
├── firebase/            # Firebase config
├── hooks/               # useAuth, useTickets (real-time listeners)
├── pages/               # All route pages
├── services/            # authService, ticketService (Firestore + Storage)
├── store/               # Zustand stores (authStore, ticketStore)
└── utils/               # constants.js, helpers.js
```

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Role-based authentication | ✅ |
| Create / view ticket requests | ✅ |
| Admin: update status, assign PIC, upload final | ✅ |
| Calendar view (request + delivery dates) | ✅ |
| Kanban board (drag & drop) | ✅ |
| Dashboard with charts | ✅ |
| Brand Asset Library | ✅ |
| CSV export | ✅ |
| File uploads (reference + final) | ✅ |
| Overdue detection | ✅ |
| Real-time Firestore updates | ✅ |
| Search & filter | ✅ |

---

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **State**: Zustand
- **Backend**: Firebase (Auth + Firestore + Storage)
- **Calendar**: FullCalendar
- **Drag & Drop**: @hello-pangea/dnd
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Icons**: Lucide React
