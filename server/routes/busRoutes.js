import express from 'express'
import {
  getAllRoutes,
  getRouteByNumber,
  searchRoutes,
  filterRoutes
} from '../controllers/busController.js'

const router = express.Router()

router.get('/', getAllRoutes)
router.get('/search', searchRoutes)
router.get('/filter', filterRoutes)
router.get('/:route_no', getRouteByNumber)

export default router