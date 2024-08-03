"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { FriendsContext } from "../components/FriendsProvider";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const { setusers, uid } = useContext(FriendsContext);

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
      router.push("/");
    }
  }, [session, uid]);

  return (
    <div>
      <div className="flex flex-col items-center min-h-screen bg-[rgb(44,44,44)] text-white">
        <div className="mt-32 flex flex-col items-center">
          <img src="./chat.png" className="w-20 h-20" />
          <h1 className="text-[1.3rem] font-extrabold">Quick chat</h1>
          <h1 className=" mt-5 text-3xl font-bold max-[400px]:text-[17px]">
            Login To Chat With Your Friends...
          </h1>
        </div>
        <button
          onClick={() => {
            signIn("google");
          }}
          className=" my-auto flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Continue with google
        </button>
      </div>
    </div>
  );
};

export default Login;
