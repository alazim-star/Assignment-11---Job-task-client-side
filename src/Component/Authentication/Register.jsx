import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { AuthContext } from './AuthProvider';



const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    
    // Password Validation
    if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password)) {
      setPasswordError("Password must have at least 6 characters, include an uppercase and a lowercase letter.");
      return;
    }
    setPasswordError("");

    try {
      // Create User
      const result = await createUser(email, password);
      const createdAt = result.user.metadata.creationTime;
      const newClient = { name, email, photo, createdAt };

      // Save user to database
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });

      const data = await response.json();

      if (data.insertedId) {
        toast.success("Registration successful! Welcome!");
      }

      // Update Profile
      await updateUserProfile({ displayName: `${firstName} ${lastName}`, photoURL: photo });

      e.target.reset();
      setPhoto("");
      navigate('/');
    } catch (error) {
      toast.error("Registration failed: " + error.message);
    }
  };

  // Google Sign-In Function
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      const newUser = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        createdAt: user.metadata.creationTime
      };

      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();

      if (data.insertedId) {
        toast.success("Google Sign-In successful!");
      } else {
        toast.info("User already exists in database.");
      }

      navigate("/");
    } catch (error) {
      toast.error("Google Sign-In failed: " + error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#24085a] px-4">
      {/* Background Image */}

      {/* Registration Card */}
      <div className="relative z-10 w-full max-w-xl bg-white/10 backdrop-blur-lg shadow-lg rounded-lg p-6 sm:p-10">
        <h2 className="text-2xl font-bold text-center text-white">Register Your Account</h2>

        <form onSubmit={handleRegister} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text text-white">First Name</label>
              <input name="firstName" type="text" placeholder="First Name" className="input input-bordered w-full" required />
            </div>
            <div>
              <label className="label-text text-white">Last Name</label>
              <input name="lastName" type="text" placeholder="Last Name" className="input input-bordered w-full" required />
            </div>
          </div>

          <div>
            <label className="label-text text-white">Your Name</label>
            <input name="name" type="text" placeholder="Enter your name" className="input input-bordered w-full" required />
          </div>

          <div>
            <label className="label-text text-white">Email</label>
            <input name="email" type="email" placeholder="Enter your email" className="input input-bordered w-full" required />
          </div>

          <div>
            <label className="label-text text-white">Profile Photo URL</label>
            <input name="photo" type="text" placeholder="Enter Image URL" 
              className="input input-bordered w-full" 
              value={photo} 
              onChange={(e) => setPhoto(e.target.value)} />
          </div>

          <div>
            <label className="label-text text-white">Password</label>
            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className="input input-bordered w-full" required />
              <span className="absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer text-gray-300"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
          </div>

          <div className="mt-4">
            <button className="px-4 py-2 bg-primary text-white rounded-full hover:bg-white shadow-xl hover:text-[#af9556] transition duration-300 w-full">Register</button>
          </div>

          <p className="text-center font-semibold mt-4 text-white">
            Already Have An Account? <Link to="/login" className="text-red-600 underline">Login</Link>
          </p>

          <button onClick={handleGoogleSignIn} className="flex items-center justify-center p-2 shadow-sm bg-white btn w-full mt-4">
            <img className='w-6 h-6 mr-2' src="https://i.ibb.co/k9sCr1Z/Logo-google-icon-PNG.png" alt="Google" />
            <span className="text-gray-600 font-medium">Log in with Google</span>
          </button>
        </form>

        {photo && (
          <div className="mt-4 text-center">
            <img src={photo} alt="Profile Preview" className="w-24 h-24 mx-auto rounded-full border-2 border-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
