import Header from "../components/Home/Header/Header";
import MainContent from "../components/Home/Content/MainContent";
import Footer from "../components/Home/Footer/footer"

const Home = () => {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <MainContent />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
