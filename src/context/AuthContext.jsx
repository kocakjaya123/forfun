import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabaseClient'

const AuthContext = createContext()

export function useAuth(){
  return useContext(AuthContext)
}

export function AuthProvider({children}){
  const [user, setUser] = useState(null)

  useEffect(()=>{
    // placeholder for supabase auth listener
  },[])

  return (
    <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>
  )
}
