import { createBrowserRouter, Link } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Feed from "./features/post/pages/Feed";
import CreatePost from "./features/post/pages/CreatePost.jsx";



 export const routes = createBrowserRouter([
   {
     path: "/login",
     element: <Login />,
   },
   {
     path: "/register",
     element: <Register />,
   },
   {
     path: "/",
     element: <Feed/>
   },
   {
    path:"/create-post",
    element:<CreatePost/>
   }
 ]);