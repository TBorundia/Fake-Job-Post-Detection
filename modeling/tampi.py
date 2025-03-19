import pandas as pd
import hashlib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

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

def encode_dataset(input_csv):
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

    return df

# Step 1: Encode the dataset
input_csv = "/home/raj-ubn/Desktop/Project/Fake-Job-Post-Detection/modeling/encoded_dataset.csv"  # Replace with your input CSV file
df = encode_dataset(input_csv)

# Step 2: Separate features (X) and target (y)
X = df.iloc[:, :-1]  # All columns except the last one
y = df.iloc[:, -1]   # Last column (target)

# Step 3: Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Encode target labels as 0 and 1
label_encoder = LabelEncoder()
y_train_encoded = label_encoder.fit_transform(y_train)  # Convert 'No'/'Yes' → 0/1
y_test_encoded = label_encoder.transform(y_test)

# Step 5: Train XGBoost Model
xgb = XGBClassifier(n_estimators=100, learning_rate=0.1, max_depth=6, random_state=42)
xgb.fit(X_train, y_train_encoded)  # Use encoded labels

# Step 6: Save the model to a .pkl file
joblib.dump(xgb, 'xgboost_model.pkl')

# Step 7: Save the label encoder as well (optional, but useful if you need to decode predictions)
joblib.dump(label_encoder, 'label_encoder.pkl')

# Step 8: Predictions
y_pred_xgb = xgb.predict(X_test)

# Step 9: Evaluate Model
accuracy_xgb = accuracy_score(y_test_encoded, y_pred_xgb)
print(f"XGBoost Model Accuracy: {accuracy_xgb:.4f}")
print("\nClassification Report:\n", classification_report(y_test_encoded, y_pred_xgb))