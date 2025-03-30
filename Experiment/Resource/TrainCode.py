import os
import json
import torch
import time
from ultralytics import YOLO

# Check if GPU is available it for power computing
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Paths
dataset_path = "/home/romjr/Project/Train/Part 3/arksor3.v1i.yolov8"  # Change to your dataset directory
json_path = os.path.join(dataset_path, "annotations.json")  # Adjust as needed
yaml_path = os.path.join(dataset_path, "data.yaml")

# Ensure required files exist
if not os.path.exists(yaml_path):
    raise FileNotFoundError(f"YAML file not found: {yaml_path}")
if not os.path.exists(json_path):
    print(f"⚠️ JSON file {json_path} not found. Ensure annotations exist.")

# Function to check if dataset is in YOLO format
def check_yolo_format(data_yaml):
    with open(data_yaml, "r") as f:
        yaml_content = f.read()
    return "train" in yaml_content and "val" in yaml_content

# Verify dataset format byy convert to yoloformat
if not check_yolo_format(yaml_path):
    raise ValueError("Dataset is not in YOLO format. Convert annotations before training.")

# Load pre-trained YOLO model
model = YOLO("yolov'model'.pt")  # load your pre train model as i will accept any pre train model but higher parameter 

# Training configuration of the hyperparameter, adjust the batch size by it 
epochs = 100
batch_size = 32
optimizer = "Adam"
lr0 = 5e-4
weight_decay = 1e-4
augment = True
conf = 0.001
iou = 0.5
workers = 4

# Create logs directory as the will contain graph and many more
os.makedirs("training_logs", exist_ok=True)
experiment_name = "yolov8_experiment"
experiment_path = os.path.join("training_logs", experiment_name)

# Define a custom model name, if you dont want to define by it own paramter name , you can adjust by your time
pongtea = f"yolov8_model_epoch{epochs}_batch{batch_size}_lr{lr0}".replace('.', '_')

# Start training timer
start_time = time.time()

# Train the model
results = model.train(
    data=yaml_path,  # Use dataset YAML file
    epochs=epochs,
    batch=batch_size,
    optimizer=optimizer,
    lr0=lr0,
    weight_decay=weight_decay,
    augment=augment,
    conf=conf,
    iou=iou,
    device=device,
    workers=workers,
    project="training_logs",  # Keep the log project directory as is
    name=experiment_name,
    save=True,
    save_period=10,  # Save model every 10 epochs
)

# End training timer
end_time = time.time()
total_time = end_time - start_time

# Get final performance metrics
metrics = model.val()
map50 = metrics.box.map50
map50_95 = metrics.box.map

# Save training results
log_file = os.path.join(experiment_path, "training_summary.txt")
with open(log_file, "w") as f:
    f.write(f"Training completed in {total_time:.2f} seconds\n")
    f.write(f"Final mAP@0.5: {map50:.4f}\n")
    f.write(f"Final mAP@0.5:0.95: {map50_95:.4f}\n")
    f.write(f"Best model saved at: {pongtea}.pt\n")

# Save the final model manually in the current directory (same as script)
model.save(f"{pongtea}.pt")  # Save the model in the current folder

# Print summary of the train
print("\n✅ Training Complete!")
print(f"📌 Training Time: {total_time:.2f} seconds")
print(f"📈 Final mAP@0.5: {map50:.4f}")
print(f"📈 Final mAP@0.5:0.95: {map50_95:.4f}")
print(f"📝 Check training_logs/training_summary.txt for details.")
