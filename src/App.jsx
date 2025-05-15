import { useRef } from "react"
import Webcam from "react-webcam"

function App() {
  const webRef = useRef(null)
  const canvasRef = useRef(null)
  return (
    <>
      <Webcam ref = {webRef}
      style={{
        position: "initial",
        marginLeft: "25%",
        marginRight: "20%",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 9,
        width: 1000,
        height: 700
      }}
      />
      <canvas ref={canvasRef}
      style={
        {
        position: "absolute",
        marginLeft: "25%",
        marginRight: "20%",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 9,
        width: 1000,
        height: 700
        }
      }
      />
    </>
  )
}

export default App
