import sys
import json
import base64
import cv2
import numpy as np
import pytesseract
from ultralytics import YOLO

# Load YOLOv8 model
model = YOLO("Aksorv3.pt")

def base64_to_cv2(base64_str):
    try:
        img_data = base64.b64decode(base64_str)
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Image decoding failed.")
        return img
    except Exception as e:
        raise ValueError(f"Invalid base64 image: {e}")

def apply_otsu_threshold(crop_img):
    gray = cv2.cvtColor(crop_img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return thresh

def detect_and_label(img):
    results = model.predict(img, conf=0.25)
    labeled = []

    img_height, img_width = img.shape[:2]

    for result in results:
        # Get YOLO input shape
        yolo_h, yolo_w = result.orig_shape[:2]
        scale_x = img_width / yolo_w
        scale_y = img_height / yolo_h

        boxes = result.boxes.xyxy.cpu().numpy()
        for box in boxes:
            x1, y1, x2, y2 = box[:4]

            # Scale boxes to match original image size
            x1 *= scale_x
            x2 *= scale_x
            y1 *= scale_y
            y2 *= scale_y

            x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])

            if x2 <= x1 or y2 <= y1:
                continue  # Skip invalid boxes

            poly = [
                {"x": float(x1), "y": float(y1)},
                {"x": float(x2), "y": float(y1)},
                {"x": float(x2), "y": float(y2)},
                {"x": float(x1), "y": float(y2)}
            ]

            crop = img[y1:y2, x1:x2]
            if crop.size == 0:
                continue

            processed_crop = apply_otsu_threshold(crop)
            text = pytesseract.image_to_string(processed_crop, lang='khm').strip()

            labeled.append({
                "id": int(x1 + y1),
                "shape": "polygon",
                "points": poly,
                "description": text,
                "class": "auto"
            })

    return labeled

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            raise ValueError("No image input provided")

        image_input = sys.argv[1]

        if image_input.endswith(('.png', '.jpg', '.jpeg')):
            img = cv2.imread(image_input)
            if img is None:
                raise ValueError("Failed to read image file.")
        else:
            img = base64_to_cv2(image_input)

        result = detect_and_label(img)

        sys.stdout.write(json.dumps(result, ensure_ascii=False))
        sys.stdout.flush()

    except Exception as e:
        sys.stderr.write(f"❌ Error: {str(e)}\n")
        sys.stderr.flush()
        sys.exit(1)
