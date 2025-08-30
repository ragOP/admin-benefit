import React from "react";
import { ChatsManagement } from "./components/ChatsManagement";

export default function Chats() {
  return (
    <main className="flex-1 p-4 lg:p-6 no-scrollbar">
      <div className="w-full no-scrollbar">
        <ChatsManagement />
      </div>
    </main>
  );
}
