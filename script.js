async function loadIngredients() {
    try {
        const response = await fetch('data/ingredients.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // If the data is an object, access the array within it
        if (Array.isArray(data)) {
            ingredients = data;
        } else if (data.ingredients && Array.isArray(data.ingredients)) {
            ingredients = data.ingredients;
        } else {
            throw new Error("Loaded data is not an array.");
        }

        console.log("Ingredients loaded:", ingredients);
    } catch (error) {
        console.error("Error loading ingredients:", error);
        showNotification("Failed to load ingredients. Please try again.", true);
    }
}




function handleFileInput() {
    document.getElementById('imageContainer').style.display = 'none';
    document.getElementById('checkButton').style.display = 'block';
}

function takePicture() {
    const imageInput = document.getElementById('imageInput');
    imageInput.click();
}

async function processImage() {
    await loadIngredients(); // Load ingredients before doing anything else

    if (!Array.isArray(ingredients)) {
        showNotification("Ingredients data is invalid. Please check the JSON file.", true);
        return;
    }

    const file = document.getElementById('imageInput').files[0];
    const reader = new FileReader();

    // Show spinner
    document.getElementById('spinner').style.display = 'block';

    reader.onloadend = async function () {
        const base64Image = reader.result.split(',')[1];

        try {
            const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=API_KEY', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requests: [
                        {
                            image: {
                                content: base64Image
                            },
                            features: [
                                {
                                    type: 'TEXT_DETECTION'
                                }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Hide spinner
            document.getElementById('spinner').style.display = 'none';

            if (data.responses && data.responses[0] && data.responses[0].fullTextAnnotation) {
                const textAnnotations = data.responses[0].textAnnotations;
                const text = textAnnotations[0].description;
                document.getElementById('results').innerText = text;

                const imageContainer = document.getElementById('imageContainer');
                imageContainer.style.display = 'block';
                setTimeout(() => imageContainer.classList.add('show'), 10);

                drawImageAndHighlight(textAnnotations, base64Image);
                await checkIngredients(text);

                showNotification("Image processed successfully!");
            } else {
                throw new Error("No text detected or bad response format");
            }
        } catch (error) {
            console.error("Error processing image:", error.message);
            document.getElementById('results').innerText = `Error: ${error.message}`;
            document.getElementById('spinner').style.display = 'none';
            showNotification("Failed to process image. Please try again.", true);
        }
    };

    reader.readAsDataURL(file);
}






function drawImageAndHighlight(textAnnotations, base64Image) {
    const canvas = document.getElementById('imageCanvas');
    const context = canvas.getContext('2d');
    const image = new Image();

    image.onload = function () {
        // Set canvas size to match the image
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the image onto the canvas
        context.drawImage(image, 0, 0);

        // Loop through text annotations and highlight matches
        textAnnotations.slice(1).forEach(annotation => {
            const vertices = annotation.boundingPoly.vertices;
            context.beginPath();
            context.moveTo(vertices[0].x, vertices[0].y);
            context.lineTo(vertices[1].x, vertices[1].y);
            context.lineTo(vertices[2].x, vertices[2].y);
            context.lineTo(vertices[3].x, vertices[3].y);
            context.closePath();

            const ingredientFound = ingredients.find(ingredient =>
                annotation.description.includes(ingredient.name)
            );

            if (ingredientFound) {
                context.fillStyle = ingredientFound.status === 'haram' ? 'rgba(255, 0, 0, 0.4)' : 'rgba(255, 255, 0, 0.4)';
                context.fill();
                context.strokeStyle = ingredientFound.status === 'haram' ? 'red' : 'yellow';
                context.lineWidth = 2;
                context.stroke();
            }
        });
    };

    image.src = `data:image/jpeg;base64,${base64Image}`;
}

async function checkIngredients(ocrText) {
    console.log("Starting checkIngredients function");
    console.log("OCR Text:", ocrText);
    console.log("Ingredients:", ingredients);

    let resultHTML = "";
    let foundHaram = false;
    let foundQuestionable = false;

    ingredients.forEach(ingredient => {
        console.log("Checking ingredient:", ingredient); // Log each ingredient to debug
        if (ocrText.toLowerCase().includes(ingredient.name.toLowerCase())) {
            let resultClass = "";

            if (ingredient.status === "haram") {
                resultClass = "haram";
                foundHaram = true;
            } else if (ingredient.status === "questionable") {
                resultClass = "questionable";
                foundQuestionable = true;
            } else {
                resultClass = "halal";
            }

            resultHTML += `
                <p class="${resultClass}">
                    <strong>${ingredient.name}:</strong> ${ingredient.status.toUpperCase()} - ${ingredient.description}
                </p>`;
        }
    });

    if (!foundHaram && !foundQuestionable) {
        resultHTML = `<p class="halal"><strong>No haram or questionable ingredients detected:</strong> This product appears to be halal.</p>`;
    }

    console.log("Final Result HTML:", resultHTML);
    document.getElementById('results').innerHTML = resultHTML;
}





document.getElementById('takePictureButton').onclick = function() {
    document.getElementById('imageInput').click();
};


// Get the <span> element that closes the modal
document.addEventListener("DOMContentLoaded", function() {
    const infoBtn = document.getElementById("infoButton");
    const infoContent = document.getElementById("infoContent");
    const infoDetails = document.querySelector(".info-details");

    infoBtn.onclick = function() {
        if (infoDetails.classList.contains("show")) {
            // Hide the information
            infoDetails.classList.remove("show");
            setTimeout(() => {
                infoContent.classList.add("hidden");
            }, 300);
        } else {
            // Show the information
            infoContent.classList.remove("hidden");
            setTimeout(() => {
                infoDetails.classList.add("show");
            }, 10);
        }
    };
});





function showNotification(message, isError = false) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `notification ${isError ? 'error' : ''} show`;

    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
    }, 3000);
}

document.addEventListener("DOMContentLoaded", function() {
    const tooltips = document.querySelectorAll('.tooltip .tooltiptext');

    tooltips.forEach(tooltip => {
        // Check if the tooltip is outside of the viewport
        const bounding = tooltip.getBoundingClientRect();
        if (bounding.top < 0) {
            tooltip.classList.add('adjusted');
        }
    });
});

