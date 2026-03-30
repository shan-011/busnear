import admin from 'firebase-admin'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const serviceAccount = require('./serviceAccountKey.json')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://gps-busnear-default-rtdb.firebaseio.com'
  })
}

export const db = admin.database()
export const auth = admin.auth()
export default admin
