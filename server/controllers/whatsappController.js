import twilio from 'twilio'
import { routesCache } from './busController.js'

const { MessagingResponse } = twilio.twiml

export const whatsappWebhook = (req, res) => {
  const twiml = new MessagingResponse()
  const msg = req.body.Body || ''
  const q = msg.toLowerCase().trim()
  
  console.log(`🤖 WhatsApp Webhook Received: "${msg}" from ${req.body.From}`)

  const sendResponse = (text) => {
    twiml.message(text)
    return res.type('text/xml').send(twiml.toString())
  }

  // 1. Welcome Message
  if (q.includes('hi') || q.includes('hello') || q.includes('welcome') || q.includes('busnear')) {
    return sendResponse(
      `👋 Welcome to BusNear SETC Chatbot!\n\n` +
      `I can help you find bus schedules for all 549 SETC routes.\n\n` +
      `Try these commands:\n` +
      `📍 Send a Route Number (e.g., *831UD*)\n` +
      `🏙️ Send a City Name (e.g., *Chennai*)\n` +
      `❓ Type *Help* to see this again.`
    )
  }

  // 2. Help Command
  if (q === 'help') {
    return sendResponse(
      `📖 *BusNear Help Guide*\n\n` +
      `To get route info: Simply send the route number.\n` +
      `To find routes from cities: Send the city name.\n\n` +
      `Example: "Search Chennai" or "965A"`
    )
  }

  // 3. Search logic
  // Priority 1: Exact Route Match
  const route = routesCache.find(r => r.route_no?.toLowerCase() === q)
  if (route) {
    return sendResponse(
      `🚌 *Route Info: #${route.route_no}*\n\n` +
      `🛤️ *${route.from} → ${route.to}*\n` +
      `📏 Distance: ${route.route_length} km\n` +
      `✨ Type: ${route.type}\n` +
      `🏢 Depot: ${route.depot}\n\n` +
      `⏱️ *Schedules:*\n` +
      `☀️ First Bus: *${route.first_bus}*\n` +
      `🌙 Last Bus: *${route.last_bus}*\n` +
      `🔢 Services Daily: ${route.no_of_service}\n\n` +
      `🔗 Track live at: ${process.env.CLIENT_URL || 'http://localhost:5173'}/map`
    )
  }

  // Priority 2: City Search (Return top 3)
  const filtered = routesCache.filter(r =>
    r.from?.toLowerCase().includes(q) ||
    r.to?.toLowerCase().includes(q)
  ).slice(0, 3)

  if (filtered.length > 0) {
    let reply = `🗺️ *Routes found for "${msg}":*\n\n`
    filtered.forEach(r => {
      reply += `🚌 *#${r.route_no}*: ${r.from} ➔ ${r.to}\n`
      if (r.last_bus) reply += `   Last Bus: *${r.last_bus}*\n\n`
    })
    reply += `Send the #ID for full details!`
    return sendResponse(reply)
  } else {
    return sendResponse(
      `🛑 Sorry, I couldn't find any information for "${msg}".\n` +
      `Try searching for a different city or route number!`
    )
  }
}
