import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";
import FriendsProvider from "./components/FriendsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quick chat",
  description: "Chat with your friends",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FriendsProvider>
          <SessionWrapper>{children}</SessionWrapper>
        </FriendsProvider>
      </body>
    </html>
  );
}
