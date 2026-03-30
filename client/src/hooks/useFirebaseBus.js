import { useEffect, useState } from 'react'
import { db } from '../services/firebase'
import { ref, onValue } from 'firebase/database'

export const useFirebaseBus = () => {
  const [busLocation, setBusLocation] = useState(null)
  const [isLive, setIsLive]           = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const busRef = ref(db, 'bus1')
    const unsubscribe = onValue(busRef, (snapshot) => {
      const data = snapshot.val()
      if (data && data.lat && data.lng) {
        setBusLocation({ lat: data.lat, lng: data.lng })
        setIsLive(true)
        setLastUpdated(new Date(data.time))
      } else {
        setIsLive(false)
      }
    })
    return () => unsubscribe()
  }, [])

  return { busLocation, isLive, lastUpdated }
}
