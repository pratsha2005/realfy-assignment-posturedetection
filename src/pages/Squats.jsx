import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { FilesetResolver, PoseLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";
import Card from "../components/Card";
import { calculateAngle } from "../utilities/calculateAngle.js";
import { useMediaQuery } from "../hooks/useMediaQuery";

let poseLandmarker = undefined;
let lastVideoTime = -1;

function Squats() {
    const webRef = useRef(null);
    const canvasRef = useRef(null);
    const [backAngle, setBackAngle] = useState(0);
    const [kneeAngle, setKneeAngle] = useState(0);
    const isMobile = useMediaQuery('(max-width: 768px)');

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
        );
    };
    createPoseLandMarker();

    const detectPosture = async () => {
        if (poseLandmarker) {
            console.log("PostureLandmarker is Loaded");
        }
        setInterval(squatDetection, 1);
    };

    const squatDetection = async () => {
        if (!canvasRef.current || !webRef.current?.video) return;
        
        const ctx = canvasRef.current.getContext("2d");
        const drawingUtils = new DrawingUtils(ctx);
        const video = webRef.current.video;
        const videoHeight = video.videoHeight;
        const videoWidth = video.videoWidth;

        webRef.current.video.width = videoWidth;
        webRef.current.video.height = videoHeight;

        const canvas = canvasRef.current;
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        let startTimeMs = performance.now();
        if (lastVideoTime !== video.currentTime) {
            lastVideoTime = video.currentTime;
            poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
                ctx.save();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                if (result.landmarks && result.landmarks.length > 0) {
                    for (const landmark of result.landmarks) {
                        drawingUtils.drawLandmarks(landmark, {
                            color: "green",
                            radius: (data) => DrawingUtils.lerp(data.from?.z, -0.15, 0.1, 5, 1)
                        });
                        drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, {
                            color: "green",
                        });
                    }
                    ctx.restore();
                    
                    // Calculate Back Angle
                    const shoulder = [result.landmarks[0][11].x, result.landmarks[0][11].y];
                    const hip = [result.landmarks[0][23].x, result.landmarks[0][23].y];
                    const knee = [result.landmarks[0][25].x, result.landmarks[0][25].y];
                    const ankle = [result.landmarks[0][27].x, result.landmarks[0][27].y];

                    const angle1 = calculateAngle(shoulder, hip, knee);
                    setBackAngle(angle1);
                    
                    // Calculate Knee Angle
                    const angle2 = calculateAngle(hip, knee, ankle);
                    setKneeAngle(angle2);

                    // Considering Safe Knee Angle Between 80-180 degrees
                    // Considering Safe Back Angle Between 130-180 degrees
                    if (angle2 < 80 || angle1 < 130) {
                        for (const landmark of result.landmarks) {
                            drawingUtils.drawLandmarks(landmark, {
                                color: 'red',
                                radius: (data) => DrawingUtils.lerp(data.from?.z, -0.15, 0.1, 5, 1)
                            });
                            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, {
                                color: 'red',
                            });
                        }
                    }
                }
            });
        }
    };
    
    useEffect(() => {
        detectPosture();
        
        // Cleanup function
        return () => {
            lastVideoTime = -1;
        };
    }, []);

    // Determine dimensions based on screen size
    const containerStyle = isMobile ? {
        width: '100vw',
        height: '60vh',
        paddingBottom: '50px' // Space for mobile navigation
    } : {
        width: '950px',
        height: '720px'
    };

    return (
        <>
            <div className={`fixed ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} z-50`}>
                <Card angle1={backAngle} angle2={kneeAngle} text1={"Back Angle"} text2={"Knee Angle"} />
            </div>

            <div className="relative flex justify-center items-center" style={{ height: isMobile ? 'calc(100vh - 50px)' : '100vh' }}>
                <Webcam
                    ref={webRef}
                    style={{
                        position: "relative",
                        zIndex: 9,
                        ...containerStyle
                    }}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        zIndex: 10,
                        ...containerStyle
                    }}
                />
            </div>
        </>
    );
}

export default Squats;