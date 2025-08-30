import React from "react";
import { Sidebar } from "./sidebar";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar";

const AppWrapper = () => (
  <div className="flex h-full w-full">
    <Sidebar />
    <div className="flex-1 flex flex-col no-scrollbar">
      <Navbar />
      <main className="flex-1 overflow-hidden h-full no-scrollbar">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AppWrapper;
