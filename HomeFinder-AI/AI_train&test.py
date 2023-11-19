#WIP, do not push


# Import necessary libraries
import pandas as pd
from sklearn import datasets
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load training data
file_path = 'Loan_train_dv.csv'
loan_data = pd.read_csv(file_path)

# Select the target variable
X = loan_data.drop('Loan_Status', axis=1)  # Features
y = loan_data['Loan_Status']  # Target variable

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Define different classifiers
classifiers = {
    'Logistic Regression': LogisticRegression(),
    'K-Nearest Neighbors': KNeighborsClassifier(),
    'Support Vector Machine': SVC(),
    'Decision Tree': DecisionTreeClassifier(),
    'Random Forest': RandomForestClassifier()
}

# Train and evaluate each classifier using cross-validation
for name, clf in classifiers.items():
    scores = cross_val_score(clf, X_train, y_train, cv=5)
    print(f'{name} - Cross-validated accuracy: {scores.mean():.4f} +/- {scores.std():.4f}')

# Choose the best classifier based on cross-validated performance
best_classifier = max(classifiers, key=lambda k: cross_val_score(classifiers[k], X_train, y_train, cv=5).mean())
print(f'\nBest Classifier: {best_classifier}')

# Train the best classifier on the full training set
best_model = classifiers[best_classifier]
best_model.fit(X_train, y_train)

# Make predictions on the test set and evaluate
y_pred = best_model.predict(X_test)
test_accuracy = accuracy_score(y_test, y_pred)
print(f'Test Accuracy of the Best Model: {test_accuracy:.4f}')
