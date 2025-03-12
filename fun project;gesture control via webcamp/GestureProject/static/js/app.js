// DOM Elements
const videoElement = document.querySelector('.input-video');
const canvasElement = document.querySelector('.output-canvas');
const canvasCtx = canvasElement.getContext('2d');
const toggleCameraButton = document.getElementById('toggleCamera');
const gestureDisplay = document.getElementById('gestureDisplay');
const actionFeedback = document.getElementById('actionFeedback');

// Global variables
let camera;
let hands;
let isCameraActive = false;
let lastGesture = '';
let gestureTimer = null;
const GESTURE_COOLDOWN = 1000; // 1 second cooldown between gestures

// Function to initialize the camera
function initCamera() {
    camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({image: videoElement});
        },
        width: 640,
        height: 480
    });
}

// Function to initialize MediaPipe Hands
function initHandTracking() {
    hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });
    
    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    
    hands.onResults(onHandResults);
}

// Process the hand detection results
function onHandResults(results) {
    // Clear the canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Draw the video feed on the canvas
    canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Draw hand landmarks
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
        }
        
        // Process the landmarks to recognize gestures
        recognizeGesture(results.multiHandLandmarks[0]);
    } else {
        // No hand detected
        updateGestureDisplay('No hand detected');
    }
    
    canvasCtx.restore();
}

// Recognize gestures based on hand landmarks
function recognizeGesture(landmarks) {
    if (!landmarks) return;
    
    // Extract finger landmarks
    const thumb = landmarks[4];
    const indexFinger = landmarks[8];
    const middleFinger = landmarks[12];
    const ringFinger = landmarks[16];
    const pinkyFinger = landmarks[20];
    const wrist = landmarks[0];
    
    // Calculate if fingers are extended
    const thumbExtended = isFingerExtended(wrist, landmarks[2], thumb);
    const indexExtended = isFingerExtended(wrist, landmarks[6], indexFinger);
    const middleExtended = isFingerExtended(wrist, landmarks[10], middleFinger);
    const ringExtended = isFingerExtended(wrist, landmarks[14], ringFinger);
    const pinkyExtended = isFingerExtended(wrist, landmarks[18], pinkyFinger);
    
    // Recognize gestures
    let currentGesture = 'Unknown';
    
    // Open palm - All fingers extended
    if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
        currentGesture = 'open_palm';
    }
    // Closed fist - No fingers extended
    else if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
        currentGesture = 'closed_fist';
    }
    // Pointing - Only index finger extended
    else if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
        currentGesture = 'pointing';
    }
    
    updateGestureDisplay(currentGesture);
    
    // Send gesture to backend if it's different from the last one and cooldown has expired
    if (currentGesture !== 'Unknown' && currentGesture !== lastGesture && !gestureTimer) {
        lastGesture = currentGesture;
        sendGestureToBackend(currentGesture);
        
        // Set cooldown timer
        gestureTimer = setTimeout(() => {
            gestureTimer = null;
            lastGesture = '';
        }, GESTURE_COOLDOWN);
    }
}

// Check if a finger is extended
function isFingerExtended(wrist, knuckle, fingertip) {
    // Calculate the distance from wrist to fingertip and from wrist to knuckle
    const wristToFingertip = distance3D(wrist, fingertip);
    const wristToKnuckle = distance3D(wrist, knuckle);
    
    // If fingertip is further from wrist than knuckle, the finger is likely extended
    return wristToFingertip > wristToKnuckle * 1.2;
}

// Calculate 3D distance between two points
function distance3D(a, b) {
    return Math.sqrt(
        Math.pow(a.x - b.x, 2) +
        Math.pow(a.y - b.y, 2) +
        Math.pow(a.z - b.z, 2)
    );
}

// Update the gesture display
function updateGestureDisplay(gesture) {
    // Map internal gesture names to user-friendly names
    const gestureNames = {
        'open_palm': 'Open Palm',
        'closed_fist': 'Closed Fist',
        'pointing': 'Pointing Finger',
        'Unknown': 'Unknown',
        'No hand detected': 'No hand detected'
    };
    
    gestureDisplay.textContent = gestureNames[gesture] || gesture;
}

// Send the recognized gesture to the backend
function sendGestureToBackend(gesture) {
    fetch('/perform_action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gesture: gesture })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        actionFeedback.textContent = data.message;
        // Show feedback briefly
        actionFeedback.style.opacity = 1;
        setTimeout(() => {
            actionFeedback.style.opacity = 0;
        }, 2000);
    })
    .catch((error) => {
        console.error('Error:', error);
        actionFeedback.textContent = 'Error: Could not perform action';
    });
}

// Toggle camera functionality
toggleCameraButton.addEventListener('click', () => {
    if (isCameraActive) {
        // Stop the camera
        camera.stop();
        toggleCameraButton.textContent = 'Start Camera';
        isCameraActive = false;
        updateGestureDisplay('No hand detected');
    } else {
        // Start the camera
        camera.start();
        toggleCameraButton.textContent = 'Stop Camera';
        isCameraActive = true;
    }
});

// Initialize the application
function init() {
    initHandTracking();
    initCamera();
    // Camera is not started automatically, user must click the button
}

// Start the application when the page loads
window.onload = init; 