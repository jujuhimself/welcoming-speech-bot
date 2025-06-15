
import React from "react";
import { OperationalStatus } from "@/components/OperationalStatus";
import { FooterVersion } from "@/components/FooterVersion";
import ChatBot from "@/components/ChatBot";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <div className="w-full flex justify-center py-1 bg-gray-100 border-b">
      <OperationalStatus />
    </div>
    <div className="flex-1">{children}</div>
    <FooterVersion />
    <ChatBot />
  </div>
);

export default AppLayout;
