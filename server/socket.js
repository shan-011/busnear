import { routesCache } from './controllers/busController.js'

const cityCoords = {
  CHENNAI: [13.0827, 80.2707],
  MADURAI: [9.9252, 78.1198],
  COIMBATORE: [11.0168, 76.9558],
  TRICHY: [10.7905, 78.7047],
  SALEM: [11.6643, 78.1460],
  TIRUNELVELI: [8.7139, 77.7567],
  NAGERCOIL: [8.1833, 77.4119],
  KUMBAKONAM: [10.9602, 79.3845],
  BANGALORE: [12.9716, 77.5946],
  PUDUCHERRY: [11.9416, 79.8083],
  VELLORE: [12.9165, 79.1325],
  ERODE: [11.3410, 77.7172],
  DINDIGUL: [10.3624, 77.9695],
  KANYAKUMARI: [8.0883, 77.5385],
}

const interpolate = (from, to, t) => [
  from[0] + (to[0] - from[0]) * t,
  from[1] + (to[1] - from[1]) * t,
]

const findCoords = (cityName) => {
  if (!cityName) return [10.7, 78.8]
  const key = Object.keys(cityCoords).find(k =>
    cityName.toUpperCase().includes(k)
  )
  return key ? cityCoords[key] : [10.7, 78.8]
}

export const initSocket = (io) => {
  const liveBuses = {}

  // Simulate 5 buses
  const simulatedRoutes = routesCache.slice(0, 5)
  const dummyDrivers = [
    'Ravi Kumar', 'S. Mani', 'K. Arul',
    'P. Selvam', 'M. Ganesan'
  ]

  simulatedRoutes.forEach((route, i) => {
    const fromCoords = findCoords(route.from)
    const toCoords = findCoords(route.to)
    let progress = Math.random()

    liveBuses[route.route_no] = {
      busId: `BUS-${i + 1}`,
      routeId: route.route_no,
      driverName: dummyDrivers[i],
      from: route.from,
      to: route.to,
      lat: fromCoords[0],
      lng: fromCoords[1],
      speed: Math.floor(60 + Math.random() * 20),
      depot: route.depot,
    }

    setInterval(() => {
      progress += 0.005
      if (progress > 1) progress = 0

      const [lat, lng] = interpolate(fromCoords, toCoords, progress)
      liveBuses[route.route_no].lat = lat
      liveBuses[route.route_no].lng = lng
      liveBuses[route.route_no].speed = Math.floor(55 + Math.random() * 30)

      io.emit('busUpdate', liveBuses[route.route_no])
    }, 3000)
  })

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`)
    socket.emit('allBuses', Object.values(liveBuses))

    socket.on('sosAlert', (data) => {
      console.log('🚨 SOS via socket:', data)
      io.emit('sosReceived', data)
    })

    socket.on('disconnect', () => {
      console.log(`❌ Disconnected: ${socket.id}`)
    })
  })
}