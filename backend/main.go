package main

import (
	"bytes"
	"github.com/gin-gonic/gin"
	"io"
	"net/http"
)

func main() {
	r := gin.Default()

	// API endpoint to send image to ML API
	r.POST("/detect", func(c *gin.Context) {
		file, err := c.FormFile("image")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "No image uploaded"})
			return
		}

		// Open file
		src, err := file.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open image"})
			return
		}
		defer src.Close()

		// Convert file to bytes
		buf := new(bytes.Buffer)
		io.Copy(buf, src)

		// Send image to ML API
		resp, err := http.Post("http://localhost:5000/predict", "multipart/form-data", buf)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send request to ML API"})
			return
		}
		defer resp.Body.Close()

		// Read ML API response
		body, _ := io.ReadAll(resp.Body)
		c.Data(http.StatusOK, "application/json", body)
	})

	// Start Golang server
	r.Run(":8080")
}
