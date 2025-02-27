import { useState, useEffect } from 'react';
import { FaHome } from 'react-icons/fa';
import { AiOutlineLogin } from "react-icons/ai";
import { NavLink, Outlet } from 'react-router-dom';

const DashBoard = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetching or processing delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="min-h-screen bg-gradient-to-l from-pink-800 to-[#23085a] text-white lg:w-64 shadow-lg">
                <div className="lg:mt-10 mt-3 ml-5 lg:text-2xl font-bold">
                
                        <h2>Dashboard</h2>
                </div>

                <ul className='lg:p-2 menu'>
                    
           
                    <li>
                        <NavLink to="/dashBoard/addTasks" className={({ isActive }) =>
                            ` rounded-xl transition hover:translate-y-1 hover:font-bold hover:text-[#9f004d] ${isActive ? "text-blue-900 font-bold" : ""}`
                        }>
                            Add Tasks
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashBoard/mytasks2" className={({ isActive }) =>
                            `  rounded-xl transition hover:translate-y-1 hover:font-bold hover:text-[#9f004d] ${isActive ? "text-blue-900 font-bold" : ""}`
                        }>
                            My Tasks2
                        </NavLink>
                    </li>
                  
                </ul>

                {/* Common Links */}
                <NavLink to="/" className={({ isActive }) =>
                    `p-3 mx-4 rounded-xl transition hover:translate-y-1 hover:font-bold hover:text-[#9f004d] ${isActive ? "text-blue-900 font-bold" : ""}`
                }>
                    <div className="divider divider-primary"></div>
                    <div className="flex items-center gap-2 px-5">
                        <FaHome />
                        <p>Home</p>
                    </div>
                </NavLink>

                <NavLink to="/login" className={({ isActive }) =>
                    `p-3 mx-4 rounded-xl transition hover:translate-y-1 hover:font-bold hover:text-[#9f004d] ${isActive ? "text-blue-900 font-bold" : ""}`
                }>
                    <div className="flex items-center gap-2 px-5">
                        <AiOutlineLogin />
                        <p>Login</p>
                    </div>
                </NavLink>
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:p-2">
                {isLoading ? (
                    <div className="flex justify-center items-center h-screen">
                        <span className="loading loading-spinner w-20 h-20 text-primary"></span>
                    </div>
                ) : (
                    <Outlet />
                )}
            </div>
        </div>
    );
};

export default DashBoard;
