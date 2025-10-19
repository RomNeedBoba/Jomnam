import FeatureCard from "./FeatureCard";
import "../../styles/FeaturesSection.css";

export default function FeaturesSection() {
  const features = [
    { icon: "⚡", title: "Fast Labeling", description: "Speed up your data prep process." },
    { icon: "🧠", title: "AI Assisted", description: "Leverage models to pre-annotate." },
    { icon: "☁️", title: "Cloud Ready", description: "Access your data from anywhere." },
  ];

  return (
    <section className="features-section">
      <h2>Powerful Features</h2>
      <div className="features-grid">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>
    </section>
  );
}
