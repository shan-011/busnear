import { routesCache } from './busController.js'
import { sendScheduleSMS, sendSOSAlert } from '../services/twilio.js'
import { db } from '../services/firebase.js'

export const requestSchedule = async (req, res) => {
  try {
    const { phone, routeNo } = req.body
    if (!phone || !routeNo)
      return res.status(400).json({ error: 'phone and routeNo required' })

    const route = routesCache.find(
      r => r.route_no?.toLowerCase() === routeNo.toLowerCase()
    )
    if (!route)
      return res.status(404).json({ error: `Route ${routeNo} not found` })

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`
    await sendScheduleSMS(formattedPhone, route)
    res.json({ success: true, message: `Schedule sent to ${formattedPhone}` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const triggerSOS = async (req, res) => {
  try {
    const { passengerName, phone, lat, lng, routeNo } = req.body
    if (!passengerName || !phone)
      return res.status(400).json({ error: 'passengerName and phone required' })

    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`

    await db.ref('sos_alerts').push({
      passengerName,
      passengerPhone: formattedPhone,
      lat: lat || 0, lng: lng || 0,
      routeNo: routeNo || 'Unknown',
      timestamp: Date.now(),
      status: 'sent'
    })

    await sendSOSAlert(passengerName, formattedPhone, lat, lng, routeNo)

    if (global.io) {
      global.io.emit('sosReceived', {
        passengerName, phone: formattedPhone,
        lat, lng, routeNo, timestamp: Date.now()
      })
    }

    res.json({ success: true, message: 'SOS alert sent' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
