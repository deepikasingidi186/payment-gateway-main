import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "test@example.com") {
      navigate("/dashboard");
    }
  };

  return (
    <form data-test-id="login-form" onSubmit={handleSubmit}>
      <input
        data-test-id="email-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        data-test-id="password-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button data-test-id="login-button">Login</button>
    </form>
  );
}
