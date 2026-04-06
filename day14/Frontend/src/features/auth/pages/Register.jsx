import { Link } from "react-router";
import axios from "axios";
import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  async function handleSubmit(e) {
e.preventDefault();

axios.post("http://localhost:3000/auth/register", {
  username,
  email,
  password,
},{
  //for setuping cookies 
  withCredentials: true,
})
.then((res) => {
  console.log(res.data);
})
.catch((err) => {
  console.error(err);
});

  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
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
              setemail(e.target.value);
            }}
            type="email"
            name="email"
            placeholder="EnterEmail"
          />
          <input
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            type="password"
            name="password"
            placeholder="EnterPassword"
          />
          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account?{" "}
          <Link className="toggleAuthForm" to="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
