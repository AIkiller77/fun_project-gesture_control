from flask import Flask, request, jsonify, render_template
import pyautogui
import os

# Configure PyAutoGUI to prevent failures with large screens
pyautogui.FAILSAFE = True

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/perform_action', methods=['POST'])
def perform_action():
    """Endpoint to handle gesture data and perform device actions"""
    try:
        data = request.json
        gesture = data.get('gesture')
        
        if not gesture:
            return jsonify({'status': 'error', 'message': 'No gesture provided'}), 400
            
        # Map gestures to actions
        if gesture == 'open_palm':
            # Scroll down
            pyautogui.scroll(-100)
            action_performed = 'Scrolled down'
        elif gesture == 'closed_fist':
            # Scroll up
            pyautogui.scroll(100)
            action_performed = 'Scrolled up'
        elif gesture == 'pointing':
            # Simulate a mouse click
            pyautogui.click()
            action_performed = 'Mouse click'
        else:
            return jsonify({'status': 'error', 'message': f'Unrecognized gesture: {gesture}'}), 400
            
        return jsonify({
            'status': 'success',
            'message': f'Action performed: {action_performed}',
            'gesture': gesture
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Enable CORS for development
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    return response

if __name__ == '__main__':
    # Create directories if they don't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    
    # Run the Flask app
    app.run(debug=True) 