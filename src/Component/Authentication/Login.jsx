import React, { useContext, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { AuthContext } from './AuthProvider';
import Lottie from "react-lottie-player";
import Lotti from "../../assets/Lotti.json"; // Ensure this JSON file is correctly placed

const Login = () => {
    const location = useLocation();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { signInUser, signInWithGoogle } = useContext(AuthContext);
    const emailRef = useRef();
    const auth = getAuth();

    const handleLogin = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        setError("");

        signInUser(email, password)
            .then((result) => {
                const user = { email: email };
                toast.success("Login successful!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                e.target.reset();
                axios.post('https://y-one-steel.vercel.app/jwt', user, { withCredentials: true })
                    .then(res => console.log(res.data));

                navigate(location?.state || "/");

                // Update last login time
                const lastSignInTime = result?.user?.metadata?.lastSignInTime;
                fetch(`https://y-one-steel.vercel.app/users`, {
                    method: 'PATCH',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ email, lastSignInTime })
                })
                    .then(res => res.json())
                    .then(data => console.log('Sign-in info updated in DB', data))
                    .catch(error => console.log(error));
            })
            .catch((error) => {
                setError(error.message);
                toast.error("Login failed: " + error.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
            });
    };

    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then(result => {
                navigate('/');
            })
            .catch((error) => {
                console.error("ERROR:", error.message);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#23085a]">
             {/* Lottie */}
              
     
            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg shadow-lg rounded-lg p-6 sm:p-10">
                <ToastContainer />

               
               

                <h2 className="text-3xl font-bold text-center text-white mb-8">
                    Login to Your Account
                </h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white">Email</label>
                        <input
                            name="email"
                            ref={emailRef}
                            type="email"
                            placeholder="Enter your email"
                            className="text-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            className="text-white mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        <div className="mt-2 text-right">
                            <button type="button" className="text-sm text-red-600 hover:text-indigo-500">
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Login
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-white">
                    Don’t have an account?{" "}
                    <Link to="/register" className="font-medium text-red-500 hover:text-indigo-500">
                        Register
                    </Link>
                </p>

                <div className="mt-6">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50"
                    >
                        <img
                            className="w-5 h-5 mr-2"
                            src="https://i.ibb.co/k9sCr1Z/Logo-google-icon-PNG.png"
                            alt="Google Logo"
                        />
                        <span>Log in with Google</span>
                    </button>
                </div>
            </div>
            <Lottie
                        play
                        loop
                        animationData={Lotti}
                        style={{ width: "100%", height: "auto", maxWidth: "400px" }}
                    />
        </div>
    );
};

export default Login;
