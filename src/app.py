from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import time

app = Flask(__name__)
CORS(app)

# Initialize the toxicity detection model
model = pipeline('text-classification', model='unitary/toxic-bert')

# In-memory storage for tracking users (for simplicity)
users_data = {}

# Expanded and more strict list of profanity and offensive phrases
PROFANITY_LIST = ['fuck', 'shit', 'bitch', 'asshole', 'bastard', 'dick', 'damn', 'slut', 'whore', 'moron', 'stupid', 'idiot', 'suck', 'jerk', 'loser', 'dumb']

# Function to detect toxicity
def detect_toxicity(comment):
    result = model(comment)
    return result[0]['label'] == 'LABEL_1'  # Toxic comments are labeled as LABEL_1

@app.route('/check-comment', methods=['POST'])
def check_comment():
    comment = request.json.get('comment')
    user_id = request.json.get('user_id')  # Assume user_id is passed from frontend

    # Initialize user data if not present
    if user_id not in users_data:
        users_data[user_id] = {'warnings': 0, 'suspended_until': None}

    user = users_data[user_id]
    toxic = detect_toxicity(comment)

    # If user is suspended, reject the comment
    if user['suspended_until'] and time.time() < user['suspended_until']:
        return jsonify({'toxic': True, 'message': 'You are suspended. Please wait for 7 days to comment again.'})

    # If comment is toxic, increment warnings and check for suspension
    if toxic:
        user['warnings'] += 1
        if user['warnings'] >= 3:
            user['suspended_until'] = time.time() + 7 * 24 * 60 * 60  # suspend for 7 days
            return jsonify({'toxic': True, 'message': 'You are suspended for 7 days due to repeated misbehavior.'})
        else:
            return jsonify({'toxic': True, 'message': f'Warning {user["warnings"]}/3: Your comment was inappropriate.'})

    # If comment is not toxic, accept it
    return jsonify({'toxic': False, 'message': 'Your comment was added successfully!'})

if __name__ == '__main__':
    app.run(debug=True)
