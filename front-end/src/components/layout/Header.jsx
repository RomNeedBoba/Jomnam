import "../../styles/Header.css";

export default function Header() {
  return (
    <header className="header">
      <h1 className="logo">Apsara<span>Annotate</span></h1>
      <nav className="nav">
        <a href="#docs">Docs</a>
        <a href="#faq">FAQ</a>
        <button className="btn-primary">Get Started</button>
      </nav>
    </header>
  );
}
