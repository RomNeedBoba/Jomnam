import pandas as pd
import glob
import os
from bs4 import BeautifulSoup

# Load all CSV files in the current directory
csv_files = glob.glob(os.path.join(os.getcwd(), "*.csv"))

if not csv_files:
    print("❌ No CSV files found! Check the directory path.")
    exit()

dataframes = {}
for file in csv_files:
    try:
        df = pd.read_csv(file)
        if df.empty:
            print(f"⚠️ Warning: {file} is empty!")
            continue
        dataframes[file.split("/")[-1]] = df
    except Exception as e:
        print(f"Error reading {file}: {e}")

if not dataframes:
    print("❌ No valid data found in CSV files!")
    exit()

# Debug: Print available columns for one file
first_df = next(iter(dataframes.values()))
print("🔍 Available Columns:", first_df.columns)

# Function to fetch column data safely
def get_value(df, row, possible_names):
    """Returns the first available column value from possible names, handling variations."""
    for col in df.columns:
        for possible_col in possible_names:
            if possible_col in col:  # Allow partial matches (e.g., "metrics/mAP50(B)")
                return row[col]
    return "N/A"  # Use "N/A" if column is missing

# Extract key metrics from the last row
results = []
for model_name, df in dataframes.items():
    last_row = df.iloc[-1]  # Get last row (final epoch data)

    # Debug: Print last row for inspection
    print(f"\n📄 {model_name} - Last Row Data:\n", last_row)

    results.append({
        "Model": model_name,
        "Epochs Trained": last_row.get("epoch", "N/A"),
        "mAP@0.5": get_value(df, last_row, ["metrics/mAP50", "map50"]),
        "mAP@0.5:0.95": get_value(df, last_row, ["metrics/mAP50-95", "map50-95"]),
        "Precision": get_value(df, last_row, ["metrics/precision"]),
        "Recall": get_value(df, last_row, ["metrics/recall"]),
        "Box Loss": get_value(df, last_row, ["val/box_loss"]),
        "Objectness Loss": get_value(df, last_row, ["val/dfl_loss"]),  # Adjusted from "loss/obj"
        "Classification Loss": get_value(df, last_row, ["val/cls_loss"]),
    })

# Convert results to a DataFrame
df_results = pd.DataFrame(results)
print("\n📊 Model Comparison Table:")
print(df_results)

# Apply text color red for the best performance in each column
def highlight_best_performance(s):
    is_best = s == s.max()  # Check if value is the best in the column
    return ['color: red' if v else '' for v in is_best]

# Highlight best values in each column
df_highlighted = df_results.style.apply(highlight_best_performance, subset=["mAP@0.5", "mAP@0.5:0.95", "Precision", "Recall", "Box Loss", "Objectness Loss", "Classification Loss"])

# Save to CSV
df_results.to_csv("model_comparison.csv", index=False)

# Save the styled table as an image
def save_table_as_image(df_styler, filename):
    """Save a styled DataFrame as an image."""
    # Use _render() to generate the HTML from the Styler object
    # Generate HTML from the Styler object
    html = df_styler.to_html()

    # Beautify the HTML using BeautifulSoup
    soup = BeautifulSoup(html, "html.parser")
    pretty_html = soup.prettify()

    # Save the HTML to a file
    with open(f"{filename}.html", "w") as f:
        f.write(pretty_html)
    print(f"📄 HTML table saved as '{filename}.html'. Convert it to an image using an external tool.")
# Save the highlighted table as an image
save_table_as_image(df_highlighted, "model_comparison_highlighted.png")
print("📸 Highlighted table saved as 'model_comparison_highlighted.png'")
