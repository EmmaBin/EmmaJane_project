import os

# Generate a random 32-byte key
jwt_secret_key = os.urandom(32)
print(jwt_secret_key.hex())  # Print the key in hexadecimal format
