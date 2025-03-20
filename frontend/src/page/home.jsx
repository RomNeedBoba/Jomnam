import Header from "../components/Home/Header/Header";
import MainContent from "../components/Home/Content/MainContent";

const Home = () => {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <MainContent />
      </main>
    </div>
  );
};

export default Home;
