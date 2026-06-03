# 🚌 BusNear – Real-Time Bus Tracking & Crowd Monitoring System

## 📌 Overview
**BusNear** is a smart transportation system designed to improve public bus travel by providing real-time tracking, crowd monitoring, and easy web access. The system integrates GPS technology, a camera module, and web technologies to enhance passenger convenience and safety.

-------

## 🚀 Features

- 📍 **Live Bus Tracking**
  - Displays real-time location of buses using GPS
  - Helps passengers know exact bus position

- ⏱️ **Estimated Arrival Time (ETA)**
  - Predicts bus arrival time at stops
  - Reduces waiting uncertainty

- 🎥 **Crowd Monitoring System**
  - Camera module installed inside the bus
  - Detects and monitors passenger count
  - Helps avoid overcrowding

- 🌐 **Web Application**
  - User-friendly website for accessing bus details
  - Works on mobile and desktop browsers

- 🔔 **Real-Time Updates**
  - Continuous updates for location and crowd status

---

## 🛠️ Technologies Used

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Node.js / Python (Flask)  
- **Database:** Firebase Realtime Database  
- **Hardware:** GPS Module, Camera Module (CCTV)  
- **Libraries/Tools:** OpenCV, PyTorch  

---

## 🧠 System Architecture

1. GPS module collects bus location 📡  
2. Data sent to backend server 🌐  
3. Camera module captures passenger data 🎥  
4. Crowd detection algorithm processes data 🤖  
5. Website displays:
   - Live location 📍  
   - ETA ⏱️  
   - Crowd status 👥  

---

## 📷 Use Case

### For Passengers:
- Check live bus location
- View estimated arrival time
- Avoid crowded buses

### For Authorities:
- Monitor bus occupancy
- Improve transport efficiency

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/busnear.git

# Navigate to project folder
cd busnear

# Install dependencies
npm install

# Run the project
npm start
