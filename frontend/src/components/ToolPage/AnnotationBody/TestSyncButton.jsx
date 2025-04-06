import React from 'react';

const TestSyncButton = () => {
  const handleSync = async () => {
    try {
      const response = await fetch('http://localhost:8080/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_name: "img1.jpg",
          class: "Text",
          description: "Title header",
          x: 100,
          y: 150,
          width: 200,
          height: 50
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert("✅ Sync successful: " + result.message);
      } else {
        alert("❌ Sync failed. Status: " + response.status);
      }
    } catch (error) {
      console.error("Error during sync:", error);
      alert("❌ Sync error: " + error.message);
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <button onClick={handleSync} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Test Sync API
      </button>
    </div>
  );
};

export default TestSyncButton;
