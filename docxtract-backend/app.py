from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from utils.extract_handler import handle_extraction_request
from processing.invoice_extractor import InvoiceExtractor
# from processing.packinglist_extractor import PackingListExtractor
# from processing.awb_extractor import AWBExtractor

load_dotenv()  

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route('/extract/invoice', methods=['POST'])
def extract_invoice():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    return handle_extraction_request(file, InvoiceExtractor, "extract_invoice", OPENAI_API_KEY)


@app.route('/extract/packing-list', methods=['POST'])
def extract_packing_list():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    return handle_extraction_request(file, PackingListExtractor, "extract_packinglist", OPENAI_API_KEY)


@app.route('/extract/awb', methods=['POST'])
def extract_awb():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    file = request.files['file']
    return handle_extraction_request(file, AWBExtractor, "extract_awb", OPENAI_API_KEY)

if __name__ == "__main__":
    # app.run(debug=True, port=5003)
    app.run(host="0.0.0.0", debug=True)
