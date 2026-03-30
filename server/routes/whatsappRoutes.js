import express from 'express'
import { whatsappWebhook } from '../controllers/whatsappController.js'

const router = express.Router()

// To work with Twilio, this must be a POST request
// Note: Twilio sends application/x-www-form-urlencoded
router.post('/webhook', express.urlencoded({ extended: false }), whatsappWebhook)

export default router
