import express from 'express'
import { registerUser, loginUser, getProfile }
  from '../controllers/authController.js'

const router = express.Router()
router.post('/register', registerUser)
router.post('/login',    loginUser)
router.get('/profile/:uid/:userType', getProfile)
export default router
