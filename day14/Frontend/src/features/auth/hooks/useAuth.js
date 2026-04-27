import {useContext} from "react"
import { AuthContext } from "../auth.context.jsx"
import {loginUser, registerUser,getMe} from "../services/auth.api";

export const useAuth = () => {

  const context = useContext(AuthContext);
  
const {user, setUser, loading, setLoading} = context;

const handleLogin = async (username, password) => {
  setLoading(true);

  const response = await loginUser(username, password);
  setUser(response.user);
  setLoading(false);
}

const handleRegister = async (username, email, password) => {
  setLoading(true);
  const response = await registerUser(username, email, password);
  setUser(response.user);
  setLoading(false);
}

return {user, loading, handleLogin, handleRegister};

}