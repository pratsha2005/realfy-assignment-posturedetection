import React, {useRef, useState} from "react"
import Webcam from "react-webcam"
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision"
import Card from "../components/Card"
import {calculateAngle} from "../utilities/calculateAngle.js"


let poseLandmarker = undefined
let lastVideoTime = -1


function PushUps() {
    const webRef = useRef(null)
    const canvasRef = useRef(null)
    const [backAngle, setBackAngle] = useState(0)
    const [elbowAngle, setElbowAngle] = useState(0)

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
    createPoseLandMarker();

    const detectPosture = async() => {
        if(poseLandmarker){
            console.log("PostureLandmarker is Loaded")
            
        }
        setInterval(pushUpDetection,1)
    }

    const pushUpDetection = async() => {
        const ctx = canvasRef.current.getContext("2d")
        const drawingUtils = new DrawingUtils(ctx)
        const video = webRef.current.video
        const videoHeight = video.videoHeight
        const videoWidth = video.videoWidth

        webRef.current.video.width = videoWidth
        webRef.current.video.height = videoHeight

        const canvas = canvasRef.current
        canvas.width = videoWidth
        canvas.height = videoHeight
        let startTimeMs = performance.now();
        if (lastVideoTime !== video.currentTime) {
            lastVideoTime = video.currentTime;
            poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
                ctx.save();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (const landmark of result.landmarks) {
                    drawingUtils.drawLandmarks(landmark, {
                        color: "green",
                    radius: (data) => DrawingUtils.lerp(data.from?.z, -0.15, 0.1, 5, 1)
                    });
                    drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS,{
                        color: "green",
                    });
                }
                ctx.restore()
                const shoulder = [result.landmarks[0][11].x, result.landmarks[0][11].y]
                const elbow = [result.landmarks[0][13].x, result.landmarks[0][13].y]
                const wrist = [result.landmarks[0][15].x, result.landmarks[0][15].y]
                const hip = [result.landmarks[0][23].x, result.landmarks[0][23].y]
                const knee = [result.landmarks[0][25].x, result.landmarks[0][25].y]
                // Calculate Elbow Angle
                const angle1 = calculateAngle(shoulder, elbow, wrist)
                setElbowAngle(angle2)
                // Calculate Back Angle
                const angle2 = calculateAngle(shoulder, hip, knee)
                setBackAngle(angle2)


                // Considering safe back angle to be 150 - 180
                // Considering safe elbow angle to be 80 - 180
                if(elbowAngle < 80 || backAngle < 150){
                    for (const landmark of result.landmarks) {
                        drawingUtils.drawLandmarks(landmark, {
                            color: 'red',
                            radius: (data) => DrawingUtils.lerp(data.from?.z, -0.15, 0.1, 5, 1)
                            }
                        );
                        drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS,
                            {
                                color: 'red',
                            }
                        );
                    }
                }
            });
        }
    }
    detectPosture()

  return (
    <>
    <div className="fixed top-4 right-4 z-50 bg-white shadow-lg p-4 rounded-xl">
        <Card angle1={backAngle} angle2={elbowAngle} text1={"Back Angle"} text2={"Elbow Angle"}/> 
    </div>
    
    <Webcam ref = {webRef}
      style={{
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 9,
        width: 950,
        height: 720
      }}
      />
      <canvas ref={canvasRef}
      style={
        {
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 9,
        width: 950,
        height: 720
        }
      }/>

    </>
  )
}

export default PushUps