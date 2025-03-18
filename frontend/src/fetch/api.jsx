import { useState } from "react";

const App = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: "" }),
      });

      if (!response.ok) throw new Error("Prediction failed");

      const result = await response.json();
      setPrediction(result);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Predicting..." : "Predict"}
      </button>
      {prediction && <pre>{JSON.stringify(prediction, null, 2)}</pre>}
    </div>
  );
};

export default App;
