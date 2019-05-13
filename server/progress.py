from flask import Flask
from flask import request
from flask_cors import CORS
import spacy, json
from flask import jsonify
import numpy as np

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
CORS(app)


@app.route('/progress', methods=['GET'])
def get_progress():
	with open("progress.txt", 'r') as f:
		pi = f.read()
	return jsonify(int(pi))
