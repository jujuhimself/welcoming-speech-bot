
import React from "react";
import { FooterVersion } from "@/components/FooterVersion";
import ChatBot from "@/components/ChatBot";
import Navbar from "@/components/Navbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col w-full">
    <Navbar />
    <div className="flex-1">{children}</div>
    <FooterVersion />
    <ChatBot />
  </div>
);

export default AppLayout;
