import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

import bgIMG from "../assets/background.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="Login">
      <div
        className="bg-img"
        style={{ backgroundImage: `url(${bgIMG})` }}
      ></div>
      <div className="wrapper">
        <div className="title">
          <h2>Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Email:</span>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          <label>
            <span>Password:</span>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label>
          {!isPending && <button>Login</button>}
          {isPending && <button disabled>Loading..</button>}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
