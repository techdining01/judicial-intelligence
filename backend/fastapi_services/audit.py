import json
import datetime
from pathlib import Path

AUDIT_DIR = Path("llm_audit_logs")
AUDIT_DIR.mkdir(exist_ok=True)

def log_llm_call(action: str, input_data, output_data):
    timestamp = datetime.datetime.utcnow().isoformat()

    record = {
        "action": action,
        "input": input_data,
        "output": output_data,
        "timestamp": timestamp
    }

    file_path = AUDIT_DIR / f"{timestamp}_{action}.json"

    with open(file_path, "w") as f:
        json.dump(record, f, indent=2)
