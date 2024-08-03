"use client";
import { createContext, useState } from "react";
import React from "react";

export const FriendsContext = createContext(null);

const FriendsProvider = ({ children }) => {
  const [users, setusers] = useState(null);
  const [showchatbox, setshowchatbox] = useState(false);
  const [currentuser, setcurrentuser] = useState(null);
  const [uid, setuid] = useState("");
  const [fuid, setfuid] = useState("");
  const [conversationid, setconversationid] = useState("");
  const [search, setsearch] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);

  return (
    <FriendsContext.Provider
      value={{
        users,
        setusers,
        showchatbox,
        setshowchatbox,
        currentuser,
        setcurrentuser,
        uid,
        setuid,
        fuid,
        setfuid,
        conversationid,
        setconversationid,
        search,
        setsearch,
        onlineUsers,
        setOnlineUsers,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export default FriendsProvider;
