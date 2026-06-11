import { Link } from "react-router";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Register = () => {
const {user, loading, handleRegister} = useAuth();

  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  
const navigate = useNavigate();

  async function handleSubmit(e) {
e.preventDefault();

 await handleRegister(username, email, password);
 console.log("User Registered Successfully");

 navigate("/");

 if (loading) {
   return (
     <main>
       <h1>Loading...</h1>
     </main>
   );
 }



//ui layer direct kabhi bhi backend se interact nahi karega, isliye humne ek service banayi hai jiska kaam sirf backend se interact karna hai, aur hum ui layer se us service ko call karenge, isse humari code zyada modular aur maintainable banegi, aur agar future me hume backend ke saath interact karne ka tarika change karna pade to hume sirf service me change karna padega, ui layer me nahi
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit} action="">
          <input
            onInput={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            name="username"
            placeholder="EnterUsername"
          />
          <input
            onInput={(e) => {
              setemail(e.target.value);
            }}
            type="email"
            name="email"
            placeholder="EnterEmail"
          />
          <input
            onInput={(e) => {
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
