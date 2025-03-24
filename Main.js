import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import Payment from "./Payment";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import * as tf from '@tensorflow/tfjs';
import { KNNImageClassifier } from 'deeplearn-knn-image-classifier'; // or 'tfjs-knn-classifier'

const promise = loadStripe(
    "pk_test_51K4ntxSIRMH73BuVCmDmkP5zDFuQS0XEUvEK7y81ONc9okubPOYPT3GH0tvy7AwK6AzpNFGcWuGPrIp7NnwzIJme00nEMJR9m5"
);

// Component for demonstrating tensorflow and object detection functions (tensorflow object detection API code inside)
function TensorFlowComponent() {
    useEffect(() => {
        async function runTensorFlow() {
            console.log("Running TensorFlow Demo...");

            // Suppress TensorFlow C++ logs (optional)
            //os.environ['TFCPPMINLOGLEVEL'] = '2';  // This won't work directly in JS, only in Python

            // Define file paths - These need to be accessible for Javascript.
            const IMAGE_PATHS = '/content/training_demo/images/train/image1.jpg'; // won't work in browser without a web server
            const PATH_TO_MODEL_DIR = '/content/training_demo/exported_models/mymodel'; // won't work in browser
            const PATH_TO_LABELS = '/content/training_demo/annotations/label_map.pbtxt'; // won't work in browser
            const MIN_CONF_THRESH = 0.60;
            const PATH_TO_SAVED_MODEL = ${PATH_TO_MODEL_DIR}/saved_model;

            // Load the saved model
            console.log('Loading model...');
            const start_time = tf.util.now();

            //Load saved_model bundle (only works if model is hosted somewhere accessible by browser)
            //const detect_fn = await tf.loadGraphModel(PATH_TO_SAVED_MODEL + "/model.json"); // this is not correct usage but you can load GraphModel

            // To use an object detection model in Javascript, you would need to use Tensorflow.js
            // compatible models, like those found here: https://tfhub.dev/s?deployment-format=tfjs

            // For example:
            //import * as cocoSsd from '@tensorflow-models/coco-ssd';
            //const model = await cocoSsd.load();
            //const predictions = await model.detect(imageElement); // See MDN documentation on html <img> tag.

            const end_time = tf.util.now();
            const elapsed_time = end_time - start_time;
            console.log(Done! Took ${elapsed_time} ms);

            // Example object detection call - this will not work unless a model is loaded.
            // const image_tensor = tf.browser.fromPixels(imageElement);  // You'd also need an image element.

            //const input_tensor = tf.convert_to_tensor(image_expanded, dtype=tf.float32);
            //const detections = detect_fn(input_tensor);

            // ...rest of TensorFlow code would go here
            //Display the image.  Because this is in browser-side javascript, it doesn't make sense to read a file.
            // You'd have to handle file uploads.

        }

        //Placeholder KNN classifier example

        async function runKNNExample(){

            const IMAGE_SIZE = 227;
            const TOPK = 10;

            const knnClassifier = new KNNImageClassifier(3, TOPK);

            // Assume you have a video element
            //const videoElement = document.getElementById('videoElement');

            // Function to add examples for training
            async function addExample(classId, video) {

                console.log("Adding example to classifier " + classId)

                // Capture a frame from the video element (replace with your video element)
                const img = await tf.browser.fromPixels(video);

                // Add the example to the classifier
                knnClassifier.addExample(img, classId);

                img.dispose();

            }

             // addExample(0, videoElement);
             // addExample(1, videoElement);
             // addExample(2, videoElement);


        }

        runTensorFlow();
        runKNNExample();

    }, []);

    return (
        <div>
            {/* TensorFlow/Object Detection Component */}
            <h2>TensorFlow Object Detection Demo (Placeholder)</h2>
            <p>This section is a placeholder demonstrating how to integrate TensorFlow object detection, but requires a properly configured model and compatible TFJS code, as well as an HTML image element for input.  See comments for details.</p>
        </div>
    );
}

function App() {
    const [{}, dispatch] = useStateValue();

    useEffect(() => {
        auth.onAuthStateChanged((authUser) => {
            console.log("THE USER IS >>> ", authUser);

            if (authUser) {
                dispatch({
                    type: "SET_USER",
                    user: authUser,
                });
            } else {
                dispatch({
                    type: "SET_USER",
                    user: null,
                });
            }
        });
    }, []);

    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/checkout" element={<><Header /><Checkout /></>} />
                    <Route path="/payment" element={<><Header /><Elements stripe={promise}><Payment /></Elements></>} />
                    <Route path="/" element={<><Header /><Home /><TensorFlowComponent /></>} /> {/* Adding the TF component to the Home Route*/}
                </Routes>
            </div>
        </Router>
    );
}

export default App;