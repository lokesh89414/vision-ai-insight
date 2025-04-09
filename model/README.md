
# Model Directory

This directory is intended to hold the TensorFlow.js model files for eye disease detection.

## Required Files

1. **model.json** - The main model configuration file
2. **weights.bin** - The binary weights file(s) for the model

## Using Your Own Model

To use your own trained CNN model for eye disease detection:

1. Train your model using TensorFlow/Keras
2. Convert it to TensorFlow.js format using the tfjs-converter
3. Place the resulting `model.json` and `*.bin` files in this directory
4. Update the model loading path in `js/prediction.js` if needed

## Example Conversion

If you have a Keras model (`.h5` file), you can convert it using:

```bash
# Install tensorflowjs tool if you don't have it
pip install tensorflowjs

# Convert the model
tensorflowjs_converter --input_format keras \
                       path/to/your/model.h5 \
                       ./model
```

## Model Requirements

- The model should be designed to detect common eye diseases like:
  - Diabetic Retinopathy
  - Glaucoma
  - Cataracts
  - Age-related Macular Degeneration (AMD)

- Expected input shape: 224x224x3 (RGB image)
- Output: Disease probabilities (multi-class classification)

## Loading Process

The website is configured to load the model when the prediction page loads:

1. A loading indicator will display during model initialization
2. Once loaded, users can upload eye images for analysis
3. The model will process the image and return disease probabilities

## No Model Available?

If you don't have a trained model, the website includes a mock implementation for demonstration purposes. It will simulate the analysis process without actually performing any real detection.

For a production environment, replace the mock implementation with a properly trained CNN model for accurate disease detection.
