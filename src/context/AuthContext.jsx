/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth(){
  return useContext(AuthContext)
}

export function AuthProvider({children}){
  // avoid creating an unused setState variable so lint stays happy
  const userState = useState(null)
  const user = userState[0]

  useEffect(()=>{
    // placeholder for supabase auth listener
    // (real auth listener will update state via userState[1])
  },[])

  return (
    <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>
  )
}
