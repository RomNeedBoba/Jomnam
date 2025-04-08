package main

import (
	"encoding/base64"
	"encoding/json"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

type AutoLabelRequest struct {
	ImageBase64 string `json:"image_base64"`
	ImageName   string `json:"image_name"`
}

func main() {
	r := gin.Default()
	r.Use(cors.Default()) // ✅ Allow CORS from frontend

	r.POST("/autolabel", func(c *gin.Context) {
		var req AutoLabelRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// ✅ Write image to ./python/input.jpg
		tempPath := filepath.Join("python", "input.jpg")
		imgData, err := base64.StdEncoding.DecodeString(req.ImageBase64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid base64 image"})
			return
		}
		if err := ioutil.WriteFile(tempPath, imgData, 0644); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}

		// ✅ Run Python script inside ./python directory
		cmd := exec.Command("python3", "autolabel.py", "input.jpg")
		cmd.Dir = "python"
		output, err := cmd.CombinedOutput()
		if err != nil {
			log.Printf("🚨 Python script failed: %v\n📦 Output:\n%s\n", err, string(output))
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Python script failed",
				"details": string(output),
			})
			return
		}

		// ✅ Extract JSON from last valid line
		lines := strings.Split(string(output), "\n")
		var jsonLine string
		for i := len(lines) - 1; i >= 0; i-- {
			line := strings.TrimSpace(lines[i])
			if strings.HasPrefix(line, "[") && strings.HasSuffix(line, "]") {
				jsonLine = line
				break
			}
		}

		if jsonLine == "" {
			log.Println("❌ Could not extract valid JSON from output.")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "No valid JSON found"})
			return
		}

		var result []map[string]interface{}
		if err := json.Unmarshal([]byte(jsonLine), &result); err != nil {
			log.Printf("🚨 Failed to parse extracted JSON:\n%s\n", jsonLine)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to parse JSON",
				"details": jsonLine,
			})
			return
		}

		_ = os.Remove(tempPath) // ✅ Optional cleanup

		c.JSON(http.StatusOK, gin.H{
			"regions": result,
		})
	})

	log.Println("✅ AutoLabel API running on http://localhost:8080")
	r.Run(":8080")
}
