import admin from 'firebase-admin'
import fs from 'fs'
import path from 'path'

let serviceAccount = null

const searchPaths = [
  path.resolve('./serviceAccountKey.json'),
  path.resolve('./server/services/serviceAccountKey.json'),
  path.resolve('./services/serviceAccountKey.json'),
  path.resolve('/opt/render/project/src/server/serviceAccountKey.json')
]

for (const p of searchPaths) {
  if (fs.existsSync(p)) {
    try {
      serviceAccount = JSON.parse(fs.readFileSync(p, 'utf8'))
      console.log(`✅ Loaded Firebase key from: ${p}`)
      break
    } catch (e) {
      console.error(`❌ Failed to parse key at ${p}:`, e.message)
    }
  }
}

if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gps-busnear-default-rtdb.firebaseio.com'
  })
} else if (!serviceAccount) {
  console.warn("⚠️ Firebase key NOT FOUND. Real-time tracking will be disabled.")
}

export const db = admin.database()
export const auth = admin.auth()
export default admin
