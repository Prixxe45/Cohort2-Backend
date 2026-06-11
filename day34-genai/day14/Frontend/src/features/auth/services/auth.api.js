import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/auth",
  withCredentials: true
});

export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password
    });
    console.log("register response:", response.data.user);
   return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/login", {
      username,
      password
    });
    console.log("Login response:", response.data.user);
    return response.data;
  }catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

export const getMe = async () => {
  try {
    const response = await api.get("/get-me");
    return response.data;
  }catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
   }}