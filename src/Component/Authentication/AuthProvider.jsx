
import {createContext, useEffect, useState } from "react";
import {  createUserWithEmailAndPassword,getAuth,GoogleAuthProvider,onAuthStateChanged,signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile} from "firebase/auth";

import axios from "axios";
import app from "../../../firebase/firebase.init";






export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider=new GoogleAuthProvider()
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);


   
   
    // for loading 
    const [loading,setLoading]=useState(true)
   
// create user 
const createUser=(email,password)=>{
    setLoading(true)
    return createUserWithEmailAndPassword(auth,email,password)
}

// signin 
const signInUser =(email,password)=>{
    setLoading(true)
    return signInWithEmailAndPassword(auth, email, password)
}


// sign out 
const signOutUser=()=>{
    setLoading(true)
    return signOut(auth)

}




// for loading 
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        console.log("Current user:", currentUser);
        setUser(currentUser);

        try {
            if (currentUser?.email) {
                const user = { email: currentUser.email };
                axios.post('http://localhost:5000/jwt',user,{withCredentials:true})
                .then(res=>{
                    console.log('login token',res.data)
                    setLoading(false)
                  })
                  
            } else {
                const response = await axios.post(
                    'http://localhost:5000/logout',
                    {},
                    { withCredentials: true }
                    .then(res=>{
                        console.log('logout',res.data)
                        setLoading(false)
                      })
                );
               
            }
        } catch (error) {
            console.error("Error during authentication flow:", error);
        } finally {
            setLoading(false);
        }
    });

    return () => {
        unsubscribe();
    };
}, []);

const updateUserProfile=(updatedData)=>{
    return updateProfile(auth.currentUser,  updatedData)


}
// google sign in 
const signInWithGoogle=()=>{
    return signInWithPopup(auth,googleProvider)
}



const authInfo = {
    user,
   loading,
   createUser,
   signInUser,
   signOutUser,
   updateUserProfile,
   signInWithGoogle

   
 
};
  



    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
