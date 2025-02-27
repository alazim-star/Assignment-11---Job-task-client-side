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
import PrivateRoute from './Component/Authentication/PrivateRoute.jsx';
import AddTasks from './Component/DashBoard/AddTasks.jsx';
import MyTasks2 from './Component/DashBoard/MyTasks2.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


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
            path: "addTasks",
            element: <AddTasks></AddTasks>,
            
          },
          {
            path: "mytasks2",
            element: 
            <DndProvider backend={HTML5Backend}>
              < MyTasks2></ MyTasks2></DndProvider>,
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
