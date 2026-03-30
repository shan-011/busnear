import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import csvParser from 'csv-parser'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CSV_PATH = path.join(__dirname, '../data/SETCbustimings_1_0.csv')

let routesCache = []

export const loadCSV = () => {
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(CSV_PATH)
      .pipe(csvParser())
      .on('data', (row) => {
        const timingsRaw = row['Departure Timings'] || ''
        const timingsArray = timingsRaw
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)

        results.push({
          sl_no            : parseInt(row['Sl. No.']),
          depot            : row['Depot']?.trim(),
          route_no         : row['Route No.']?.trim(),
          from             : row['From']?.trim(),
          to               : row['To']?.trim(),
          route_length     : parseFloat(row['Route Length']) || 0,
          type             : row['Type']?.trim(),
          no_of_service    : parseInt(row['No.of Service']) || 0,
          departure_timings: timingsRaw,
          timings_array    : timingsArray,
          first_bus        : timingsArray[0] || '',
          last_bus         : timingsArray[timingsArray.length - 1] || '',
        })
      })
      .on('end', () => {
        routesCache = results
        console.log(`✅ Loaded ${results.length} SETC routes from CSV`)
        resolve(results)
      })
      .on('error', reject)
  })
}

export const getAllRoutes = (req, res) => {
  res.json({ count: routesCache.length, routes: routesCache })
}

export const getRouteByNumber = (req, res) => {
  const route = routesCache.find(
    r => r.route_no?.toLowerCase() === req.params.route_no.toLowerCase()
  )
  if (!route) return res.status(404).json({ error: 'Route not found' })
  res.json(route)
}

export const searchRoutes = (req, res) => {
  const q = (req.query.q || '').toLowerCase()
  if (!q) return res.json({ count: routesCache.length, routes: routesCache })

  const filtered = routesCache.filter(r =>
    r.from?.toLowerCase().includes(q) ||
    r.to?.toLowerCase().includes(q) ||
    r.route_no?.toLowerCase().includes(q) ||
    r.depot?.toLowerCase().includes(q)
  )
  res.json({ count: filtered.length, routes: filtered })
}

export const filterRoutes = (req, res) => {
  const { type, depot } = req.query
  let filtered = [...routesCache]
  if (type)  filtered = filtered.filter(r => r.type === type)
  if (depot) filtered = filtered.filter(r => r.depot === depot)
  res.json({ count: filtered.length, routes: filtered })
}

export { routesCache }