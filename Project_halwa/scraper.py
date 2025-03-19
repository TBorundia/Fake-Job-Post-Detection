import joblib

# Step 1: Load the pre-trained model and label encoder
try:
    model = joblib.load('xgboost_model.pkl')
    label_encoder = joblib.load('label_encoder.pkl')
    print("Model and label encoder loaded successfully!")
except FileNotFoundError:
    print("Error: Model files not found. Ensure 'xgboost_model.pkl' and 'label_encoder.pkl' are in the correct directory.")
    exit()

# Step 2: Define the feature names (example features for a job post)
feature_names = [
    'job_title', 'job_location', 'department', 'range_of_salary', 'profile',
    'job_description', 'requirements', 'job_benefits', 'telecommunication',
    'company_logo', 'type_of_employment', 'experience', 'qualification',
    'type_of_industry', 'operations'
]

# Step 3: Take input values from the user
print("Enter the following details about the job post:")
user_input = {}
for feature in feature_names:
    value = input(f"{feature}: ")
    user_input[feature] = value

# Step 4: Convert user input into a feature vector
# Ensure all features are converted to numerical values
try:
    feature_vector = [
        int(user_input['job_title']),  # Convert to int
        int(user_input['job_location']),
        int(user_input['department']),
        int(user_input['range_of_salary']),
        int(user_input['profile']),
        int(user_input['job_description']),
        int(user_input['requirements']),
        int(user_input['job_benefits']),
        int(user_input['telecommunication']),  # Convert to int (0 or 1)
        int(user_input['company_logo']),       # Convert to int (0 or 1)
        int(user_input['type_of_employment']),
        int(user_input['experience']),
        int(user_input['qualification']),
        int(user_input['type_of_industry']),
        int(user_input['operations'])
    ]
except ValueError as e:
    print(f"Error: Invalid input. Please ensure all values are numbers. Details: {e}")
    exit()

# Step 5: Make a prediction using the loaded model
try:
    prediction_encoded = model.predict([feature_vector])
    prediction = label_encoder.inverse_transform(prediction_encoded)
    print(f"\nPrediction: The job post is {prediction[0]} (fraudulent).")
except Exception as e:
    print(f"Error making prediction: {e}")