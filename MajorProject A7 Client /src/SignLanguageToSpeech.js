// Import dependencies
import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import { useSpeechSynthesis } from "react-speech-kit";


function SignLanguageToSpeech() {
    const [generatedTextFromModel, setGeneratedTextFromModel] = useState("");
    const [sentence, setSentence] = useState([]);
    const [displayText, setdisplayText] = useState("");
    const { speak } = useSpeechSynthesis();

    // Define our labelmap
    const labelMap = {
        1: { name: 'Hello', color: 'red' },
        2: { name: 'Thank You', color: 'yellow' },
        3: { name: 'I Love You', color: 'lime' },
        4: { name: 'Yes', color: 'blue' },
        5: { name: 'No', color: 'purple' },
        6: { name:'I am sorry', color: 'green'},
        7: { name:'what happened', color: 'orange'},
        8: { name:'I have an idea', color: 'pink'},
        9: { name:'No', color: 'jade'},
        10:{ name:'where are you going', color: 'brown'},
    }


    // Define a drawing function
    const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx) => {

        for (let i = 0; i <= boxes.length; i++) {
            if (boxes[i] && classes[i] && scores[i] > threshold) {
                // Extract variables
                const [y, x, height, width] = boxes[i]
                const text = classes[i]

                // Set styling
                ctx.strokeStyle = labelMap[text]['color']
                ctx.lineWidth = 10
                ctx.fillStyle = 'white'
                ctx.font = '30px Arial'


                // DRAW!!
                ctx.beginPath()
                ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i] * 100) / 100, x * imgWidth, y * imgHeight - 10)
                ctx.rect(x * imgWidth, y * imgHeight, width * imgWidth / 2, height * imgHeight / 1.5);
                ctx.stroke()

                setGeneratedTextFromModel(labelMap[text]['name']);

                break;
            }
        }
    }

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    // Main function
    const runCoco = async () => {
        const net = await tf.loadGraphModel('https://majorprojecta7.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json')

        //  Loop and detect hands
        setInterval(() => {
            detect(net);
        }, 16.7);
    };

    const detect = async (net) => {
        // Check data is available
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // Make Detections
            const img = tf.browser.fromPixels(video)
            const resized = tf.image.resizeBilinear(img, [640, 480])
            const casted = resized.cast('int32')
            const expanded = casted.expandDims(0)
            const obj = await net.executeAsync(expanded)
            // console.log(obj)

            const boxes = await obj[1].array()
            const classes = await obj[2].array()
            const scores = await obj[4].array()

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");

            // drawSomething(obj, ctx)  
            requestAnimationFrame(() => { drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx) });
            tf.dispose(img)
            tf.dispose(resized)
            tf.dispose(casted)
            tf.dispose(expanded)
            tf.dispose(obj)

        }
    };

    useEffect(() => { runCoco() }, []);

    const captureText = () =>{
        if (generatedTextFromModel === "") {
            speak({text: "No predicted text to capture"})
            setdisplayText("No predicted text to capture");
            return;
        }
        setSentence([...sentence, generatedTextFromModel]);
        setdisplayText("Captured " + generatedTextFromModel);
    }

    const sayText = () => {
        if (sentence.length === 0) {
            speak({text: "No captured text to say"})
            setdisplayText("No captured text to say");
            return;
        }
        speak({text: sentence.join(" ")})
        setdisplayText(sentence.join(" "));
    }

    const clearText = () => {
        setGeneratedTextFromModel("");
        setdisplayText("");
        setSentence([]);
    }

    return (
        <>
            <div className="container position-absolute top-50 start-50 translate-middle">
                <div class="row">
                    <div class="col-sm-8">
                        <div class="card shadow border-0" style={{ width: 640, height: 480 }}>
                            <Webcam
                                ref={webcamRef}
                                muted={true}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    width: 640,
                                    height: 480,
                                    zindex: 8,
                                }}
                            />
                            <canvas
                                ref={canvasRef}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    width: 640,
                                    height: 480,
                                    zindex: 9,
                                }}
                            />
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="card shadow border-0">
                            <div class="card-body">
                                <h5 class="card-title">Predicted Text</h5>
                                <div class="d-grid gap-2 d-md-block">
                                    <button type="button" className="btn btn-info btn-sm" style={{ marginRight: 10 }} onClick={captureText}>Capture Text</button>
                                    <button type="button" className="btn btn-danger btn-sm" style={{ marginRight: 10 }} onClick={clearText}>Clear Text</button>
                                    <button type="button" className="btn btn-primary btn-sm" onClick={sayText}>Say Text</button>
                                </div>
                                <hr />
                                <h5>{displayText === '' ? sentence : displayText}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignLanguageToSpeech;
