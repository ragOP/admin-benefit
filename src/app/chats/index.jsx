import React from "react";
import { ChatsManagement } from "./components/ChatsManagement";

export default function Chats() {
  return (
    <main className="flex-1 p-4 lg:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6"></div>
      <div className="w-full">
        <ChatsManagement />
      </div>
    </main>
  );
}
