import { useState, useEffect } from 'react';

export const CITY_COORDS = {
  CHENNAI:    [13.0827, 80.2707],
  MADURAI:    [9.9252,  78.1198],
  COIMBATORE: [11.0168, 76.9558],
  TRICHY:     [10.7905, 78.7047],
  SALEM:      [11.6643, 78.1460],
  TIRUNELVELI:[8.7139,  77.7567],
  NAGERCOIL:  [8.1833,  77.4119],
  KUMBAKONAM: [10.9602, 79.3845],
  THANJAVUR:  [10.7870, 79.1378],
  BANGALORE:  [12.9716, 77.5946],
  PUDUCHERRY: [11.9416, 79.8083],
  KANYAKUMARI:[8.0883,  77.5385],
  VELLORE:    [12.9165, 79.1325],
  NAGAPATTINAM:[10.7672, 79.8449],
  KARAIKUDI:  [10.0764, 78.7804],
  OOTY:       [11.4102, 76.6950],
  DINDIGUL:   [10.3624, 77.9695],
  PALANI:     [10.4480, 77.5208],
  TIRUPATHI:  [13.6288, 79.4192],
  ERODE:      [11.3410, 77.7172],
};

export const getCoord = (cityName) => {
  const norm = cityName.toUpperCase().split('(')[0].trim();
  // Simple partial match
  for (const key in CITY_COORDS) {
    if (norm.includes(key) || key.includes(norm)) return CITY_COORDS[key];
  }
  return [10.7, 78.8]; // Default TN center
};

export const useBusSimulation = (route) => {
  const [position, setPosition] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!route) return;

    const fromCoord = getCoord(route.from);
    const toCoord = getCoord(route.to);

    setPosition(fromCoord);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 0.05;
        if (next >= 1) return 0;
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [route]);

  useEffect(() => {
    if (!route) return;
    const fromCoord = getCoord(route.from);
    const toCoord = getCoord(route.to);

    const lat = fromCoord[0] + (toCoord[0] - fromCoord[0]) * progress;
    const lng = fromCoord[1] + (toCoord[1] - fromCoord[1]) * progress;
    setPosition([lat, lng]);
  }, [progress, route]);

  return { position, progress };
};
