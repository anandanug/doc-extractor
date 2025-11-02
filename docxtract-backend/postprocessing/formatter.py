import time

def format_response(output, start_time):
    end_time = time.time()
    execution_time = end_time - start_time

    return {
        "execution_time": execution_time,
        "data": output.dict()
    }
