
# Eye Disease Detection Model

This folder contains the TensorFlow.js converted CNN model for eye disease detection.

## Model Information
- Input shape: [224, 224, 3] (RGB image of 224x224 pixels)
- Output: 5 classes (Normal, Glaucoma, Diabetic Retinopathy, Cataract, AMD)
- Model architecture: CNN based on MobileNet

## How to use
1. Place your trained model files in this folder:
   - model.json (model architecture)
   - group*.bin (weight files)

2. The website will automatically load this model when it starts up.

## Training your own model
If you need to train your own CNN model:

1. Train your model using TensorFlow/Keras
2. Convert the model to TensorFlow.js format using the converter
3. Place the converted files in this folder

Example conversion command:
```
tensorflowjs_converter --input_format keras path/to/your/model.h5 path/to/output/folder
```
