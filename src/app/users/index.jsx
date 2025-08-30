import React from "react";
import { UserManagement } from "./components/UserManagement";

export default function Users() {
  return (
    <main className="flex-1 p-4 lg:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6"></div>
      <div className="w-full">
        <UserManagement />
      </div>
    </main>
  );
}
