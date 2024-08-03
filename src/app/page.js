"use client";
import { NextUIProvider } from "@nextui-org/react";
import Main from "./components/Main";
import AccountProvider from "./components/AccountProvider";
export default function Home() {
  return (
    <NextUIProvider>
      <div className="h-screen w-full">
        <AccountProvider>
          <Main />
        </AccountProvider>
      </div>
    </NextUIProvider>
  );
}
