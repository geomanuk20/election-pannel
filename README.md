# Election 140 - MERN Scoreboard

A premium, real-time election lead scorecard application built with the MERN stack.

## Features
- **Real-time Updates**: Scoreboard polls the backend every 3 seconds for live updates.
- **Premium Design**: Clean, bold typography (Oswald & Inter) with animated transitions.
- **Admin Panel**: Easy-to-use interface to update seat counts.
- **Responsive**: Fully optimized for mobile and desktop views.

## Project Structure
- `/client`: React frontend (Vite)
- `/server`: Node.js & Express backend with MongoDB

## How to Run

### 1. Prerequisites
- Node.js installed
- MongoDB installed and running locally (or provide a MONGO_URI)

### 2. Setup Backend
```bash
cd server
npm install
npm run dev
```
*Server will run on http://localhost:5001*

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```
*Frontend will run on http://localhost:5173*

## Routes
- `/`: Public Scoreboard
- `/admin`: Admin Panel to update data
