# PostureDetector 🏋️‍♀️

A real-time posture detection application for workout exercises, built with React, MediaPipe and Webcam integration. The application provides immediate feedback on your form during exercises, helping you maintain proper posture and prevent injuries.

[Link to website](https://realfy-assignment-posturedetection.vercel.app/)

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
git clone https://github.com/pratsha2005/realfy-assignment-posturedetection.git
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


