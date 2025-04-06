package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
)

const annotationDir = "./annotations"
const annotationFile = "annotations.json"

type Region struct {
	ImageName   string `json:"image_name"`
	Class       string `json:"class"`
	Description string `json:"description"`
	X           int    `json:"x"`
	Y           int    `json:"y"`
	Width       int    `json:"width"`
	Height      int    `json:"height"`
}

func main() {
	// Make sure annotation directory exists
	if _, err := os.Stat(annotationDir); os.IsNotExist(err) {
		err := os.MkdirAll(annotationDir, os.ModePerm)
		if err != nil {
			log.Fatal("❌ Failed to create annotation directory:", err)
		}
	}

	r := mux.NewRouter()

	// POST /sync
	r.HandleFunc("/sync", syncHandler).Methods("POST")

	log.Println("🚀 Sync API server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}

func syncHandler(w http.ResponseWriter, r *http.Request) {
	var newRegion Region

	err := json.NewDecoder(r.Body).Decode(&newRegion)
	if err != nil {
		http.Error(w, "❌ Invalid JSON", http.StatusBadRequest)
		return
	}

	// Path to JSON
	jsonPath := filepath.Join(annotationDir, annotationFile)

	var regions []Region

	// Check if file exists
	if _, err := os.Stat(jsonPath); err == nil {
		// Read existing JSON
		data, err := ioutil.ReadFile(jsonPath)
		if err == nil {
			_ = json.Unmarshal(data, &regions)
		}
	}

	// Append new region
	regions = append(regions, newRegion)

	// Save updated JSON
	final, err := json.MarshalIndent(regions, "", "  ")
	if err != nil {
		http.Error(w, "❌ Failed to encode JSON", http.StatusInternalServerError)
		return
	}

	err = ioutil.WriteFile(jsonPath, final, 0644)
	if err != nil {
		http.Error(w, "❌ Failed to save JSON", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("✅ Region saved!"))
}
