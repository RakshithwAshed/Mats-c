import { useState } from "react";
import api from "../utils/api";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await api.post("/api/auth/login", {
        email,
        password
      });

      console.log(res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.reload();

    }

    catch(err){

      console.log(err);

      alert("Login failed");

    }

  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>

    </div>

  );

}

export default Login;