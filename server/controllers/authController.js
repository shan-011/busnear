import { db } from '../services/firebase.js'
import { sendWelcomeSMS } from '../services/twilio.js'

export const registerUser = async (req, res) => {
  try {
    const { uid, name, email, phone, userType, routeNo, depot } = req.body
    if (!uid || !name || !email || !phone || !userType)
      return res.status(400).json({ error: 'Missing required fields' })

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`
    const profile = {
      name, email, phone: formattedPhone,
      userType, createdAt: Date.now(), isActive: false
    }
    if (userType === 'driver') {
      profile.routeNo = routeNo || ''
      profile.depot   = depot || ''
    }

    const path = userType === 'driver' ? `drivers/${uid}` : `passengers/${uid}`
    await db.ref(path).set(profile)
    await sendWelcomeSMS(formattedPhone, name, userType)

    res.json({ success: true, message: `${userType} registered`, profile })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: err.message })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { uid, userType } = req.body
    if (!uid || !userType)
      return res.status(400).json({ error: 'Missing uid or userType' })

    const path = userType === 'driver' ? `drivers/${uid}` : `passengers/${uid}`
    const snapshot = await db.ref(path).once('value')
    const profile  = snapshot.val()

    if (!profile)
      return res.status(404).json({ error: 'User profile not found' })

    res.json({ success: true, profile })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    const { uid, userType } = req.params
    const path = userType === 'driver' ? `drivers/${uid}` : `passengers/${uid}`
    const snapshot = await db.ref(path).once('value')
    const profile  = snapshot.val()
    if (!profile) return res.status(404).json({ error: 'Profile not found' })
    res.json({ success: true, profile })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
