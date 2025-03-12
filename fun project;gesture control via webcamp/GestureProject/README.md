# Gesture Control System

Control your computer using hand gestures detected through your webcam. This project uses MediaPipe for hand tracking and gesture recognition, and PyAutoGUI for controlling your device.

## Features

- **Real-time hand tracking**: Detect and track hand landmarks using MediaPipe.
- **Gesture recognition**: Recognize specific hand gestures (open palm, closed fist, pointing finger).
- **Device control**: Control your computer with gestures:
  - Open palm: Scroll down
  - Closed fist: Scroll up
  - Pointing finger: Mouse click

## Requirements

- Python 3.6+
- Webcam
- Web browser with WebRTC support (Chrome, Firefox, Edge, etc.)

## Installation

1. Clone this repository or download the files
2. Create and activate a virtual environment (recommended):

```bash
# On Windows
python -m venv gesture_env
gesture_env\Scripts\activate

# On macOS/Linux
python -m venv gesture_env
source gesture_env/bin/activate
```

3. Install the required packages:

```bash
pip install -r requirements.txt
```

## Usage

1. Start the Flask server:

```bash
python app.py
```

2. Open your web browser and navigate to:

```
http://localhost:5000
```

3. Click the "Start Camera" button to enable webcam access
4. Allow webcam access when prompted by your browser
5. Perform the supported gestures in front of your webcam:
   - Show an open palm to scroll down
   - Make a fist to scroll up
   - Point with your index finger to click

## How It Works

1. The frontend accesses your webcam using WebRTC and MediaPipe's Hands solution to track hand landmarks.
2. The JavaScript code analyzes the hand landmarks to recognize specific gestures.
3. When a gesture is recognized, a request is sent to the Flask backend.
4. The backend uses PyAutoGUI to simulate device actions based on the detected gesture.

## Troubleshooting

- **Webcam access denied**: Make sure to access the application via localhost (not via file:// protocol)
- **Gesture not recognized**: Position your hand clearly in front of the camera with good lighting
- **Actions not working**: Ensure the Flask server is running and the browser can communicate with it

## License

This project is licensed under the MIT License - see the LICENSE file for details. 