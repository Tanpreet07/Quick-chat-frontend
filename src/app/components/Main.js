"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import ContectSection from "./ContectSection";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Chatbox from "./Chatbox";
import { useContext } from "react";
import { AccountContext } from "./AccountProvider";
import { FriendsContext } from "./FriendsProvider";

const Main = () => {
  const { setUsername, setemail, setprofilepic } = useContext(AccountContext);
  const { uid, setusers } = useContext(FriendsContext);
  const [show, setshow] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else {
      setUsername(session.user.name);
      setemail(session.user.email);
      setprofilepic(session.user.image);
    }
  }, [session]);

  const postdata = async () => {
    try {
      const res = await fetch("https://quick-chat-cqqi.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: session.user.name,
          email: session.user.email,
          image: session.user.image,
          uid: uid,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      setusers(await res.json());
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  useEffect(() => {
    if (session) {
      postdata();
    }
  }, [session, uid]);

  return (
    <div className="h-full flex w-full">
      <ContectSection setshow={setshow} show={show} />
      <div className="border-l-2 border-black w-full h-full">
        <Chatbox show={show} setshow={setshow} />
      </div>
    </div>
  );
};

export default Main;
