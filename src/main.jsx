import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainLayout from './Component/MainLayout/MainLayout.jsx';
import Home from './Component/Page/Home.jsx';
import AuthProvider from './Component/Authentication/AuthProvider.jsx';
import Login from './Component/Authentication/Login.jsx';
import Register from './Component/Authentication/Register.jsx';
import DashBoard from './Component/Page/DashBoard.jsx';
import MyTasks from './Component/DashBoard/MyTasks.jsx';
import MyProfile from './Component/DashBoard/MyProfile.jsx';
import PrivateRoute from './Component/Authentication/PrivateRoute.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children:[
      {
        path: "/",
        element: <PrivateRoute>
          <Home></Home>
        </PrivateRoute>,
        
      },
      {
        path: "/login",
        element: <Login></Login>,
        
      },
      {
        path: "/register",
        element: <Register></Register>,
        
      },
      {
        path: "/dashBoard",
        element:<PrivateRoute> <DashBoard></DashBoard></PrivateRoute>,
        children:[
          {
            path: "home",
            element: <MyProfile></MyProfile>,
            
          },
          {
            path: "myTasks",
            element: <MyTasks></MyTasks>,
            
          },
        
        ]
        
      },
    ]
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
       <AuthProvider>
       <RouterProvider router={router} />
       </AuthProvider>
  </StrictMode>,
)
