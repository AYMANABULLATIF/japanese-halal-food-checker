# Halal Food Checker

## Overview

The **Halal Food Checker** is a web application designed to help users determine whether a product is halal by analyzing the ingredients listed on the product. The application allows users to either take a picture or upload an image of the ingredients list, and it then checks the ingredients against a database of known halal, haram, and questionable ingredients. The application also highlights the detected ingredients on the image and displays the results.

## Features

- **Ingredient Analysis**: Automatically detect and analyze ingredients from an image to determine if the product is halal.
- **Highlighting**: Highlights detected haram or questionable ingredients directly on the image.
- **Interactive Instructions**: Provides easy-to-follow instructions for users on how to use the application.
- **Responsive Design**: The application is designed to work on both desktop and mobile devices.

## Technologies Used

- **HTML5**: Markup language used for structuring the content.
- **CSS3**: Used for styling the application, including responsive design and animations.
- **JavaScript (ES6+)**: Handles the logic for image processing, ingredient analysis, and interaction with the Google Cloud Vision API.
- **Google Cloud Vision API**: Used for Optical Character Recognition (OCR) to detect text in the uploaded images.
- **JSON**: Used to store the database of ingredients that are analyzed by the application.
- **Git & GitHub**: Version control and project hosting.

## How to Use

1. **Load the Ingredients Database**:
   - The application automatically loads a database of ingredients from a JSON file upon initialization.

2. **Upload or Take a Picture**:
   - Click on the "Take a Picture" button to capture an image of the ingredients list using your device's camera.
   - Alternatively, you can upload an image from your device by clicking on the file input.

3. **Analyze the Image**:
   - After uploading the image, click on "Check Halal Status" to analyze the ingredients.
   - The application will display the results and highlight any haram or questionable ingredients on the image.

4. **View the Results**:
   - The results will be shown below the image, indicating whether the product is halal, haram, or contains questionable ingredients.
   - The specific ingredients that are haram or questionable will be highlighted on the image.

## Project Structure

- **index.html**: The main HTML file containing the structure of the application.
- **styles.css**: The CSS file that contains the styling for the application.
- **script.js**: The JavaScript file that handles the functionality, including image processing, ingredient checking, and interaction with the Google Cloud Vision API.
- **data/ingredients.json**: The JSON file containing the database of halal, haram, and questionable ingredients.

## How to Set Up Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AYMANABULLATIF/japanese-halal-food-checker.git
2. **Navigate to the Project Directory:**
cd japanese-halal-food-checker
3. **Run a Local Server:**
python -m http.server 8000
4. **Access the Application:**
Open your web browser and navigate to 'http://localhost:8000' to see the application in action.