import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

import bgIMG from "../assets/background.jpg";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isPending, error } = useSignup();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, name);
  };

  return (
    <div className="Signup">
      <div
        className="bg-img"
        style={{ backgroundImage: `url(${bgIMG})` }}
      ></div>
      <div className="wrapper">
        <div className="title">
          <h2>Signup</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            <span>
              Name: <strong>*</strong>
            </span>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </label>
          <label>
            <span>
              Email: <strong>*</strong>
            </span>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          <label>
            <span>
              Password: <strong>*</strong>
            </span>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label>
          {!isPending && <button>Signup</button>}
          {isPending && <button disabled>Loading..</button>}
          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
