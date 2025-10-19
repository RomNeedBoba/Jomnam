import { useNavigate } from "react-router-dom";
import { auth, googleProvider, githubProvider } from "../../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function AuthForm() {
  const navigate = useNavigate();
  // ... your state: email, password

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    navigate("/profile");
  };

  const handleGithubLogin = async () => {
    const result = await signInWithPopup(auth, githubProvider);
    navigate("/profile");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Email/Password</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={handleLogin}>Login</button>

      <h2>Social Login</h2>
      <button onClick={handleGoogleLogin}>Google</button>
      <button onClick={handleGithubLogin}>GitHub</button>
    </div>
  );
}
