import express from 'express'
import { requestSchedule, triggerSOS }
  from '../controllers/smsController.js'

const router = express.Router()
router.post('/schedule', requestSchedule)
router.post('/sos',      triggerSOS)
export default router
