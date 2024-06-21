import {  Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type AuthUserType={
  id:string;
  fullname:string;
  username:string;
  profilePic:string;
  gender:string
}
const AuthContext = createContext<{
  authUser:AuthUserType | null;
  setAuthUser:Dispatch<SetStateAction<AuthUserType|null>>;
  isLoading:boolean;
}>({
  authUser:null,
  setAuthUser:()=>{},
  isLoading:true
})



export const useAuthContext = ()=>{
  return useContext(AuthContext)
}

export const AuthContextProvider = ({children}:{children:ReactNode})=>{
  const [authUser,setAuthUser]= useState<AuthUserType| null>(null)
  const [isLoading,setIsLoading]=useState(true)


  useEffect(()=>{
    const fetchAuthUser = async()=>{
      try{
        const res = await fetch("/api/auth/me")
        const data = await res.json();
        console.log(data)
        if(!res.ok){
          if (res.status !== 401) {
            throw new Error(data.error || "Failed to fetch user.");
          }
        }
        setAuthUser(data)
      }catch(error:any){
         if (error.message === "Unexpected response format.") {
          console.error("Received non-JSON response from server.");
        } else {
          toast.error(error.message);
        }      }finally{
        setIsLoading(false)
      }
    }
    fetchAuthUser();
  },[]) // mounts on loading that is ..it will run only once during the first load

  return (
    <AuthContext.Provider value={{authUser,isLoading,setAuthUser}}>
      {children}
    </AuthContext.Provider>
  )
}
