import os
import time
from flask import jsonify
from preprocessing.pdf_reader import extract_text_from_pdf
from postprocessing.formatter import format_response

def handle_extraction_request(file, extractor_class, extract_method_name, api_key):
    pdf_path = f'temp_{file.filename}'
    file.save(pdf_path)

    try:
        # preprocessing
        text = extract_text_from_pdf(pdf_path)

        # processing
        start_time = time.time()
        extractor = extractor_class(api_key=api_key)
        extract_method = getattr(extractor, extract_method_name)
        output = extract_method(text)

        # postprocessing
        response = format_response(output, start_time)
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # cleanup
        try:
            if os.path.exists(pdf_path):
                os.remove(pdf_path)
                print(f"Temporary file deleted: {pdf_path}")
        except Exception as cleanup_error:
            print(f"Failed to delete temporary file: {cleanup_error}")
