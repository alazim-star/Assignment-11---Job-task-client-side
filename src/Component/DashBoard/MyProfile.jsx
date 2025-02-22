import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Authentication/AuthProvider";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [usersData, setUsersData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://y-one-steel.vercel.app/users")
      .then((res) => res.json())
      .then((data) => {
        setUsersData(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);


  const today = new Date();
  const options = { weekday: "long", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);



  return (
    <div className="p-6  min-h-screen container mx-auto">
      <header className="mb-6 text-center">
        <h1 className="text-2xl text-purple-600 font-bold">My Profile</h1>
        <div className="divider divider-primary"></div>
        <p className="">{formattedDate}</p>
        <p className="">
        {user?.displayName || "User"}.
        </p>
        <p className="">
        {user?.email}
        </p>

        <div className="flex justify-center mt-4">
          {loading ? (
          

          <span className="loading loading-spinner w-20 h-20 text-primary"></span>


          ) : (
            <img
              src={user?.photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-600"
            />
          )}
        </div>
      </header>

      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Work</h2>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <button className="text-sm font-semibold">My tasks</button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <span className="text-sm">My Project</span>
        </div>
      </section>
    </div>
  );
};

export default MyProfile;
