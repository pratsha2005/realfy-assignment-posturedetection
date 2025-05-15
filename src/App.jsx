import { useRef } from "react"
import Webcam from "react-webcam"
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";

let lastVideoTime = -1
let poseLandmarker = undefined;
function App() {
  const webRef = useRef(null)
  const canvasRef = useRef(null)

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


  const detection = async () => {

    const ctx = canvasRef.current.getContext("2d")
    const drawingUtils = new DrawingUtils(ctx)
    // get video parameters
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
          radius: (data) => DrawingUtils.lerp(data.from?.z, -0.15, 0.1, 5, 1)
        });
        drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
      }
      ctx.restore();
        console.log(result)
      });
    }
  }

  setInterval(detection, 1)
  
  return (
    <>
      <Webcam ref = {webRef}
      style={{
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 9,
        width: 640,
        height: 480
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
        width: 640,
        height: 480
        }
      }
      />
    </>
  )
}

export default App
