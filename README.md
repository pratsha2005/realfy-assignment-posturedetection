# PostureDetector 🏋️‍♀️

A real-time posture detection application for workout exercises, built with React, MediaPipe and Webcam integration. The application provides immediate feedback on your form during exercises, helping you maintain proper posture and prevent injuries.

![PostureDetector Demo](https://via.placeholder.com/800x400?text=PostureDetector+Demo)

## 📑 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
  - [Pose Detection](#pose-detection)
  - [Angle Calculation](#angle-calculation)
  - [Feedback System](#feedback-system)
- [Project Structure](#project-structure)
- [Code Walkthrough](#code-walkthrough)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Real-time pose detection** using your webcam
- **Form analysis** for squats and push-ups
- **Immediate visual feedback** when form is incorrect (skeleton turns red)
- **Angle measurements** for key body parts
- **Responsive UI** that works on various devices
- **Easy exercise selection** from the homepage

## 🛠️ Technology Stack

- **React** (v19.1.0) - UI framework
- **Vite** (v6.3.5) - Build tool
- **MediaPipe** - Pose detection library
- **React Webcam** - Camera integration
- **TailwindCSS** - Styling
- **React Router** - Navigation between pages

## 🚀 Installation

To get started with PostureDetector, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/yourusername/posturedetector.git
cd posturedetector
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📲 Usage

1. **Select an exercise** from the homepage (Squats or Push-ups)
2. **Allow camera access** when prompted
3. **Position yourself** so your full body is visible in the frame
4. **Begin exercising** and watch the real-time feedback
   - Green skeleton: Good form
   - Red skeleton: Incorrect form that needs adjustment

## 🧠 How It Works

### Pose Detection

The application uses MediaPipe's PoseLandmarker to detect 33 key points on the human body in real-time from webcam feed. These landmarks include joints like shoulders, elbows, wrists, hips, knees, and ankles.

```javascript
const createPoseLandMarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    poseLandmarker = await PoseLandmarker.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                delegate: "GPU"
            },
            runningMode: "VIDEO"
        }
    )
}
```

### Angle Calculation

The application calculates angles between joints to determine if your form is correct. For example, in squats it monitors:

- **Back angle**: Angle between shoulder, hip, and knee
- **Knee angle**: Angle between hip, knee, and ankle

```javascript
export function calculateAngle(a, b, c) {
    const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
    let angle = Math.abs(radians * 180.0 / Math.PI);

    if (angle > 180.0) {
        angle = 360 - angle;
    }

    return angle;
}
```

### Feedback System

Based on predetermined safe angle ranges, the system provides real-time feedback:

- **For Squats**:
  - Safe back angle: 130-180 degrees
  - Safe knee angle: 80-180 degrees
  
- **For Push-ups**:
  - Safe back angle: 150-180 degrees
  - Safe elbow angle: 80-180 degrees

When angles fall outside these ranges, the skeleton turns red to indicate improper form.

## 📁 Project Structure

```
posturedetector/
│
├── public/
│   ├── vite.svg
│   ├── Pushups.jpg (needed)
│   └── Squats.webp (needed)
│
├── src/
│   ├── components/
│   │   ├── Buttons.jsx
│   │   └── Card.jsx
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── PushUps.jsx
│   │   ├── Squats.jsx
│   │   └── home.css
│   │
│   ├── utilities/
│   │   └── calculateAngle.js
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
└── README.md
```

## 💻 Code Walkthrough

### Main Application

```jsx
// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Squats from './pages/Squats'
import PushUps from './pages/PushUps'

function RoutesList(){
    return(
        <Routes>
            <Route path='/' element = {<HomePage/>}/>
            <Route path='squats' element = {<Squats/>}/>
            <Route path='pushups' element = {<PushUps/>}/>
        </Routes>
    )
}

function App() {
  return (
    <Router>
        <RoutesList/>
    </Router>
  )
}

export default App
```

### Home Page

```jsx
// src/pages/HomePage.jsx
import React from 'react';
import "./home.css"
import { NavLink } from 'react-router-dom';
const HomePage = () => {
  return (
    <div id = "body" className="flex h-screen w-screen">
      {/* Left Image */}
      <div className="w-1/3 h-full" id = "pushups">
        <NavLink to={"pushups"}>
        <img
          src="./Pushups.jpg"
          alt="Left"
          className="object-cover w-full h-full"
        />
        </NavLink>
      </div>

      <div className="w-1/3 h-full flex items-center justify-center" id = "text">
        <h2 className="text-3xl text-center">
          Choose Squats or PushUps
        </h2>
      </div>

      {/* Right Image */}
      <div className="w-1/3 h-full" id = "squats">
        <NavLink to={"squats"}>
        <img
          src="./Squats.webp"
          alt="Right"
          className="object-cover w-full h-full"
        />
        </NavLink>
      </div>
    </div>
  );
};

export default HomePage;
```

### Squats Detection

```jsx
// src/pages/Squats.jsx (abbreviated)
import React, {useEffect, useRef, useState} from "react"
import Webcam from "react-webcam"
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision"
import Card from "../components/Card"
import {calculateAngle} from "../utilities/calculateAngle.js"

let poseLandmarker = undefined
let lastVideoTime = -1

function Squats() {
    const webRef = useRef(null)
    const canvasRef = useRef(null)
    const [backAngle, setBackAngle] = useState(0)
    const [kneeAngle, setKneeAngle] = useState(0)
    
    // ...initialization code...
    
    const squatDetection = async() => {
        // ...video setup...
        
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
            // Draw skeleton in green by default
            
            // Calculate angles
            const shoulder = [result.landmarks[0][11].x, result.landmarks[0][11].y]
            const hip = [result.landmarks[0][23].x, result.landmarks[0][23].y]
            const knee = [result.landmarks[0][25].x, result.landmarks[0][25].y]
            const ankle = [result.landmarks[0][27].x, result.landmarks[0][27].y]

            const angle1 = calculateAngle(shoulder, hip, knee)
            setBackAngle(angle1)
            
            const angle2 = calculateAngle(hip, knee, ankle)
            setKneeAngle(angle2)

            // Check form and change skeleton to red if incorrect
            if(kneeAngle < 80 || backAngle < 130){
                // Draw skeleton in red for bad form
            }
        });
    }
    
    // ...rendering code...
}

export default Squats
```

### Push-ups Detection

```jsx
// src/pages/PushUps.jsx (abbreviated)
import React, {useEffect, useRef, useState} from "react"
import Webcam from "react-webcam"
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision"
import Card from "../components/Card"
import {calculateAngle} from "../utilities/calculateAngle.js"

// ...similar structure to Squats.jsx with different angle calculations...

function PushUps() {
    // ...setup code...
    
    const pushUpDetection = async() => {
        // ...video setup...
        
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
            // Draw skeleton in green by default
            
            // Calculate different angles for push-ups
            const shoulder = [result.landmarks[0][11].x, result.landmarks[0][11].y]
            const elbow = [result.landmarks[0][13].x, result.landmarks[0][13].y]
            const wrist = [result.landmarks[0][15].x, result.landmarks[0][15].y]
            const hip = [result.landmarks[0][23].x, result.landmarks[0][23].y]
            const knee = [result.landmarks[0][25].x, result.landmarks[0][25].y]
            
            // Calculate Elbow Angle
            const angle1 = calculateAngle(shoulder, elbow, wrist)
            setElbowAngle(angle1)
            
            // Calculate Back Angle
            const angle2 = calculateAngle(shoulder, hip, knee)
            setBackAngle(angle2)

            // Check form and change skeleton to red if incorrect
            if(elbowAngle < 80 || backAngle < 150){
                // Draw skeleton in red for bad form
            }
        });
    }
    
    // ...rendering code...
}

export default PushUps
```

### Angle Calculation Utility

```javascript
// src/utilities/calculateAngle.js
export function calculateAngle(a, b, c) {
    const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
    let angle = Math.abs(radians * 180.0 / Math.PI);

    if (angle > 180.0) {
        angle = 360 - angle;
    }

    return angle;
}
```

## 🔧 Customization

### Adding New Exercises

To add a new exercise type:

1. Create a new component in the `pages` directory
2. Set up pose detection similar to existing exercises
3. Define the specific angles to monitor for proper form
4. Add a new route in `App.jsx`
5. Include a link or image on the home page

### Adjusting "Safe" Angle Ranges

You can modify what's considered proper form by adjusting the angle thresholds:

```javascript
// For squats:
if(kneeAngle < 80 || backAngle < 130){
    // Draw red skeleton
}

// For push-ups:
if(elbowAngle < 80 || backAngle < 150){
    // Draw red skeleton
}
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using React and MediaPipe
