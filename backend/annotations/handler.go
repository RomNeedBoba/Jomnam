package annotations

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
)

type Annotation struct {
	ImageName   string      `json:"image_name"`
	Class       string      `json:"class"`
	Description string      `json:"description"`
	Shape       string      `json:"shape"`
	Data        interface{} `json:"data"` // Can be rect/polygon etc.
}

func SaveHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var ann Annotation
	if err := json.NewDecoder(r.Body).Decode(&ann); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Ensure folder exists
	outputDir := "./data"
	os.MkdirAll(outputDir, os.ModePerm)

	// Save to JSON per folder/project (e.g., "project_img.json")
	filePath := filepath.Join(outputDir, ann.ImageName+".json")

	var existing []Annotation
	if _, err := os.Stat(filePath); err == nil {
		content, _ := ioutil.ReadFile(filePath)
		json.Unmarshal(content, &existing)
	}

	// Append new annotation
	existing = append(existing, ann)
	finalJSON, _ := json.MarshalIndent(existing, "", "  ")
	ioutil.WriteFile(filePath, finalJSON, 0644)

	fmt.Fprintln(w, "✅ Annotation saved")
}

func LoadHandler(w http.ResponseWriter, r *http.Request) {
	imageName := r.URL.Query().Get("image")
	if imageName == "" {
		http.Error(w, "Missing image name", http.StatusBadRequest)
		return
	}

	filePath := filepath.Join("./data", imageName+".json")

	content, err := ioutil.ReadFile(filePath)
	if err != nil {
		http.Error(w, "No data found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(content)
}
