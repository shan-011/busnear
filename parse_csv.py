import csv
import json

def get_region(depot):
    mapping = {
        "CC": "Chennai",
        "HSR": "Chennai",
        "MDU": "Madurai",
        "CBE": "Coimbatore",
        "PDY": "Puducherry",
        "NGL": "Nagercoil",
        "TRY": "Trichy",
        "TNJ": "Thanjavur",
        "SLM": "Salem",
        "KKM": "Kumbakonam",
        "KKD": "Kanyakumari",
        "SHN": "Shencottah",
        "TCN": "Tuticorin",
        "TNVA": "Tirunelveli",
        "TNVB": "Tirunelveli",
        "DGL": "Dindigul",
        "NGP": "Nagapattinam",
        "MAR": "Marthandam",
        "CA": "Karur",
        "CB": "Coimbatore (CB)",
        "KKDI": "Karaikudi",
        "TVM": "Trivandrum"
    }
    return mapping.get(depot, "Other")

def parse_csv(csv_path):
    routes = []
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not row['Sl. No.']: continue # Skip empty lines
            
            raw_timings = row['Departure Timings'].strip()
            # Handle quoted strings and comma separated values
            timings_array = [t.strip() for t in raw_timings.split(',') if t.strip()]
            
            first_bus = timings_array[0] if timings_array else ""
            last_bus = timings_array[-1] if timings_array else ""
            
            type_val = row['Type'].upper()
            color = "#0f3460" if type_val == "ULTRA" else "#533483"
            
            route = {
                "sl_no": int(row['Sl. No.']),
                "depot": row['Depot'],
                "route_no": row['Route No.'],
                "from": row['From'],
                "to": row['To'],
                "route_length": int(row['Route Length']),
                "type": type_val,
                "no_of_service": int(row['No.of Service']),
                "departure_timings": raw_timings,
                "timings_array": timings_array,
                "first_bus": first_bus,
                "last_bus": last_bus,
                "color": color,
                "region": get_region(row['Depot'])
            }
            routes.append(route)
    return routes

csv_file = 'e:/antigravity/busnear/SETCbustimings_1_0.csv'
routes_data = parse_csv(csv_file)

js_content = f"""// Generated data from CSV
export const setcRoutes = {json.dumps(routes_data, indent=2)};

export const getRoutesByFrom = (city) => setcRoutes.filter(r => r.from.toLowerCase() === city.toLowerCase());
export const getRoutesByTo = (city) => setcRoutes.filter(r => r.to.toLowerCase() === city.toLowerCase());
export const getRouteByNumber = (no) => setcRoutes.find(r => r.route_no === no);
export const searchRoutes = (query) => {{
  if (!query) return setcRoutes;
  const q = query.toLowerCase();
  return setcRoutes.filter(r => 
    r.from.toLowerCase().includes(q) || 
    r.to.toLowerCase().includes(q) || 
    r.route_no.toLowerCase().includes(q) || 
    r.depot.toLowerCase().includes(q)
  );
}};
export const getAllCities = () => {{
  const cities = new Set();
  setcRoutes.forEach(r => {{
    cities.add(r.from);
    cities.add(r.to);
  }});
  return Array.from(cities).sort();
}};
export const getDepotRegions = () => {{
  const regions = new Set();
  setcRoutes.forEach(r => regions.add(r.region));
  return Array.from(regions).sort();
}};
"""

with open('setcRoutes.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
