import React, { useContext, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import axios from 'axios';
import { AuthContext } from './AuthProvider';

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
                console.log(result.user.email);
                const user = { email: email };
                toast.success("Login successful!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                e.target.reset();
                axios.post('http://localhost:5000/jwt', user, { withCredentials: true })
                    .then(res => {
                        console.log(res.data);
                    });
                navigate(location?.state || "/");

                // Update last login time
                const lastSignInTime = result?.user?.metadata?.lastSignInTime;
                const loginInfo = { email, lastSignInTime };
                fetch(`http://localhost:5000/users`, {
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(loginInfo)
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log('Sign-in info updated in DB', data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                setError(error.message);
                toast.error("Login failed: " + error.message, {
                    position: "top-right",
                    autoClose: 3000,
                });
            });
    };

    const handleForgetPassword = () => {
        const email = emailRef.current.value;
        if (!email) {
            toast.warn("Please provide a valid email address.", {
                position: "top-right",
                autoClose: 3000,
            });
        } else {
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    toast.success("Password reset email sent! Please check your inbox.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                })
                .catch((error) => {
                    toast.error("Failed to send password reset email: " + error.message, {
                        position: "top-right",
                        autoClose: 3000,
                    });
                });
        }
    };

    const handleGoogleSignIn = () => {
        signInWithGoogle()
            .then(result => {
                console.log(result.user);
                navigate('/');
            })
            .catch((error) => {
                console.error("ERROR:", error.message);
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <ToastContainer />
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    Login to Your Account
                </h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            name="email"
                            ref={emailRef}
                            type="email"
                            placeholder="Enter your email"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            autoComplete="email"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            autoComplete="current-password"
                        />
                        <div className="mt-2 text-right">
                            <button
                                type="button"
                                onClick={handleForgetPassword}
                                className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    {/* Display Error */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Login
                        </button>
                    </div>
                </form>

                {/* Register Redirect */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Register
                    </Link>
                </p>

                {/* Google Sign-In Button */}
                <div className="mt-6">
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <img
                            className="w-5 h-5 mr-2"
                            src="https://i.ibb.co.com/k9sCr1Z/Logo-google-icon-PNG.png"
                            alt="Google Logo"
                        />
                        <span>Log in with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;