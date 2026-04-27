import { useState } from "react";
import "../style/form.scss";
import { Link } from "react-router";
import {useAuth} from "../hooks/useAuth.js"
import { useNavigate } from "react-router";


const Login = () => {
  const {user, loading, handleLogin} = useAuth();

  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault();

    await handleLogin(username, password);
    console.log("User Logged in Succesfully")

    navigate("/");

    if(loading){
      return (
        <main>
          <h1>Loading...</h1>
        </main>
      );
      
    }

  }

  
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} action="">
          <input
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            name="username"
            placeholder="EnterUsername"
          />
          <input
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            type="password"
            name="password"
            placeholder="EnterPassword"
          />
          <button className="primary-button" type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{" "}
          <Link className="toggleAuthForm" to="/register">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
