import pandas as pd
import hashlib

def encode_string_to_number(text, length=8):
    """
    Encodes a string into a numerical value (less than 8 digits) using SHA-256 hashing.
    """
    if not text or not isinstance(text, str):  # Skip non-string values
        return 0  # Return 0 for empty strings or non-string values
    # Use SHA-256 for consistent hashing
    hash_object = hashlib.sha256(text.encode())
    hex_dig = hash_object.hexdigest()
    # Convert the hash to an integer and truncate to the desired length
    return int(hex_dig, 16) % (10 ** length)

def encode_dataset(input_csv, output_csv):
    """
    Encodes all string values in the dataset (including the target column) into numerical values.
    """
    # Read the dataset
    df = pd.read_csv(input_csv)

    # Ensure the dataset has at least 16 columns
    if len(df.columns) < 16:
        raise ValueError("The dataset must have at least 16 columns.")

    # Encode all string columns (including the target column)
    for column in df.columns:
        if df[column].dtype == object:  # Check if the column contains strings
            df[column] = df[column].apply(encode_string_to_number)

    # Save the encoded dataset to a new CSV file
    df.to_csv(output_csv, index=False)
    print(f"Encoded dataset saved to {output_csv}")

# Example usage
input_csv = "/home/raj-ubn/Desktop/Project/Fake-Job-Post-Detection/Project_halwa/merged_GPT.csv"  # Replace with your input CSV file
output_csv = "encoded_dataset.csv"  # Replace with your desired output CSV file
encode_dataset(input_csv, output_csv)