import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import busRoutes from './routes/busRoutes.js'
import sosRoutes from './routes/sosRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { initSocket } from './socket.js'
import { loadCSV } from './controllers/busController.js'
import authRoutes from './routes/authRoutes.js'
import smsRoutes from './routes/smsRoutes.js'
import whatsappRoutes from './routes/whatsappRoutes.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST']
  }
})
global.io = io

// Middleware
app.use(cors())
// Note: order matters for webhooks
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use('/api/routes', busRoutes)
app.use('/api/sos', sosRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/sms', smsRoutes)
app.use('/api/whatsapp', whatsappRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'BusNear backend running ✅', time: new Date() })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 3001

// Load CSV first, then start server
loadCSV().then(() => {
  initSocket(io)
  httpServer.listen(PORT, () => {
    console.log(`🚌 BusNear server running on http://localhost:${PORT}`)
  })
}).catch(err => {
  console.error('❌ Failed to load CSV:', err)
  process.exit(1)
})