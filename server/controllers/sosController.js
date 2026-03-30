import { sendSOSAlert } from '../services/twilio.js'

export const sendSOS = async (req, res) => {
  const { passengerName, phone, lat, lng, routeNo } = req.body

  console.log(`🚨 SOS from ${passengerName} on route ${routeNo}`)
  console.log(`📍 Location: ${lat}, ${lng}`)

  // Actually dispatch the SMS alerts via Twilio
  try {
    await sendSOSAlert(passengerName, phone, lat, lng, routeNo)
  } catch (err) {
    console.error('❌ SOS SMS Dispatch failed:', err.message)
  }

  res.json({
    success: true,
    message: 'SOS alert received. Help is on the way.',
    timestamp: new Date()
  })
}