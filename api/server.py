from flask import Flask, request, jsonify
import torch
from torchvision import transforms
from PIL import Image
import io

app = Flask(__name__)

# Load model
model = torch.jit.load("khmerst.pt")
model.eval()

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Resize to match model input
    transforms.ToTensor(),
])

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image = request.files["image"].read()
    image = Image.open(io.BytesIO(image)).convert("RGB")
    image = transform(image).unsqueeze(0)  # Add batch dimension

    with torch.no_grad():
        output = model(image)  # Run prediction

    # Simulated bounding box output (Modify based on your model)
    result = {
        "boxes": [[50, 50, 200, 200]],  # Example bounding box
        "labels": ["khmer character"]
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
