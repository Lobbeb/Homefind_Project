#import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
import xgboost as xgb
#import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score
#import seaborn as sns

def load_and_preprocess_data(file_path, delimiter=';', target_column='Loan_Status', positive_class_label='Y'):

    #Load data and format it correctly
    loan_data = pd.read_csv(file_path, delimiter=delimiter)

    # Convert necessary columns to numeric
    numeric_columns = ['Dependents', 'ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 'Loan_Amount_Term']
    for col in numeric_columns:
        loan_data[col] = pd.to_numeric(loan_data[col], errors='coerce')

    # Remove rows with NaN values
    loan_data = loan_data.dropna()

    # Feature engineering steps
    loan_data['Has_Cosigner'] = (loan_data['CoapplicantIncome'] > 0).astype(int)
    loan_data['Term_to_Amount_Ratio'] = loan_data['Loan_Amount_Term'] / loan_data['LoanAmount']
    loan_data['Total_Income'] = loan_data['ApplicantIncome'] + loan_data['CoapplicantIncome']
    loan_data['DTI'] = loan_data['LoanAmount'] / loan_data['ApplicantIncome']
    loan_data['Dependents_to_Income_Ratio'] = loan_data['Dependents'] / loan_data['ApplicantIncome']

    # One-hot encode categorical variables (excluding the target)
    categorical_columns = ['Gender', 'Married', 'Education', 'Self_Employed', 'Credit_History', 'Property_Area']
    loan_data = pd.get_dummies(loan_data, columns=categorical_columns, drop_first=True)

    # Encode the target variable
    loan_data[target_column] = loan_data[target_column].map({positive_class_label: 1, 'N': 0})

    return loan_data

# Outlier handling function
def handle_outliers(df, column):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR

    return df[(df[column] >= lower_bound) & (df[column] <= upper_bound)]

def split_data(loan_data, target_column):
    # Separate features and target variable
    X = loan_data.drop(target_column, axis=1)  # Features
    y = loan_data[target_column]  # Target variable

    # Split data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

    return X_train, X_test, y_train, y_test

def train_and_evaluate_models(X_train, y_train):
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "SVM": SVC(),
        "Decision Tree": DecisionTreeClassifier(),
        "Random Forest": RandomForestClassifier(),
        "Gradient Boosting": GradientBoostingClassifier(),
        "XGBoost": xgb.XGBClassifier(eval_metric='logloss'),
    }

    trained_models = {}
    cv_scores = {}
    for name, model in models.items():
        model.fit(X_train, y_train)  # Train the model
        trained_models[name] = model  # Store the trained model
        scores = cross_val_score(model, X_train, y_train, cv=5)
        cv_scores[name] = scores.mean()
        print(f"{name} CV average accuracy: {scores.mean() * 100:.2f}%")

    return trained_models, cv_scores

def find_best_model(trained_models, cv_scores):
    best_model_name = max(cv_scores, key=cv_scores.get)
    best_model = trained_models[best_model_name]
    print(f"Best performing model: {best_model_name} with CV average accuracy: {cv_scores[best_model_name] * 100:.2f}%")
    return best_model

# Testing the code and getting results
file_path = 'Loan_Train_resampled.csv'  # Update the file path as needed
loan_data = load_and_preprocess_data(file_path) # Feature computation
loan_data = handle_outliers(loan_data, 'ApplicantIncome')  # Removes outliers
X_train, X_test, y_train, y_test = split_data(loan_data, 'Loan_Status') # Splitting the data
trained_models, cv_scores = train_and_evaluate_models(X_train, y_train) # evaluate models and returns CV score and the trained models
best_model = find_best_model(trained_models, cv_scores) # returns the best model


# Evaluate on test data
y_pred = best_model.predict(X_test) # let the best model to predict the test data
test_accuracy = accuracy_score(y_test, y_pred) # gives the accuracy
print(f"Test Accuracy of {best_model}: {test_accuracy * 100:.2f}%") # prints the result

import joblib

# Save the trained model
joblib.dump(best_model, 'AI_model.joblib')