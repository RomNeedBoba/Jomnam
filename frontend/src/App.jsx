import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./page/home";
import Tool from "./page/tool";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tool" element={<Tool />} />
      </Routes>
    </Router>
  );
};

export default App;


// import { useState } from "react";

// function App() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [prediction, setPrediction] = useState(null);

//   const handleImageChange = (event) => {
//     setSelectedImage(event.target.files[0]);
//   };

//   const handlePredict = async () => {
//     if (!selectedImage) return;

//     const formData = new FormData();
//     formData.append("image", selectedImage);

//     try {
//       const response = await fetch("http://localhost:8080/detect", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       setPrediction(data);
//     } catch (error) {
//       console.error("Prediction failed:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Upload Image for Khmer Text Detection</h1>
//       <input type="file" onChange={handleImageChange} />
//       <button onClick={handlePredict}>Predict</button>

//       {prediction && (
//         <div>
//           <h2>Prediction Result</h2>
//           <pre>{JSON.stringify(prediction, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
