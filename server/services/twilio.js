import twilio from 'twilio'
import dotenv from 'dotenv'
dotenv.config()

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)
const FROM = process.env.TWILIO_PHONE_NUMBER

export const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message, from: FROM, to
    })
    console.log(`✅ SMS sent to ${to}: ${result.sid}`)
    return result
  } catch (err) {
    console.error(`❌ SMS failed to ${to}:`, err.message)
    throw err
  }
}

export const sendWelcomeSMS = async (to, name, userType) => {
  const message = userType === 'driver'
    ? `Hi ${name}! Welcome to BusNear 🚌 You are registered as a driver. Open the app to start broadcasting your location.`
    : `Hi ${name}! Welcome to BusNear 🚌 You can now track SETC buses live.`
  return sendSMS(to, message)
}

export const sendScheduleSMS = async (to, route) => {
  const timings = route.timings_array.slice(0, 10).join(', ')
  const message =
    `🚌 BusNear Route Info\n` +
    `Route: ${route.route_no}\n` +
    `${route.from} → ${route.to}\n` +
    `Distance: ${route.route_length} km\n` +
    `Type: ${route.type}\n` +
    `First Bus: ${route.first_bus}\n` +
    `Last Bus: ${route.last_bus}\n` +
    `Services/Day: ${route.no_of_service}\n` +
    `Next departures: ${timings}`
  return sendSMS(to, message)
}

export const sendSOSAlert = async (passengerName, phone, lat, lng, routeNo) => {
  const mapsLink = `https://maps.google.com/?q=${lat},${lng}`
  const message =
    `🚨 SOS ALERT - BusNear\n` +
    `Passenger: ${passengerName}\n` +
    `Phone: ${phone}\n` +
    `Route: ${routeNo}\n` +
    `Location: ${mapsLink}\n` +
    `Time: ${new Date().toLocaleString('en-IN')}`

  const officialNumbers = (process.env.SOS_OFFICIAL_NUMBERS || '')
    .split(',').map(n => n.trim()).filter(Boolean)

  const allNumbers = [...officialNumbers]
  if (phone) allNumbers.push(phone)

  return Promise.allSettled(allNumbers.map(num => sendSMS(num, message)))
}
