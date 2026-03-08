import hashlib

def generate_hash(file_path):
    sha = hashlib.sha256()

    with open(file_path, "rb") as f:
        sha.update(f.read())

    return sha.hexdigest()
