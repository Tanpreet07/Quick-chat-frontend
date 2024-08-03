import { createContext, useState } from "react";
import React from 'react'

export const AccountContext = createContext(null);

const AccountProvider = ({children}) => {
    const [Username, setUsername] = useState("");
    const [email,setemail] = useState("");
    const [profilepic,setprofilepic] = useState("");
  return (
    <AccountContext.Provider value={{
        Username,
        setUsername,
        email,
        setemail,
        profilepic,
        setprofilepic
    }}>
        {children}
    </AccountContext.Provider>
  )
}

export default AccountProvider
