import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import AuthForm from "./components/AuthForm";
import MainContent from "./pages/MainContent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<AuthForm />} />
      <Route path="/app" element={<MainContent />} />
    </Routes>
  );
}

export default App;
