import Header from "../components/layout/Header";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import Footer from "../components/layout/footer";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <HeroSection />
      <FeaturesSection />
      <div style={{ textAlign: "center", margin: "50px 0" }}>
        <button
          onClick={() => navigate("/auth")}
          style={{ padding: "12px 24px", fontSize: "16px", cursor: "pointer" }}
        >
          Get Started
        </button>
      </div>
      <Footer />
    </>
  );
}
