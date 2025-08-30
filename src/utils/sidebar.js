import { MessageCircleIcon, UsersIcon } from "lucide-react";

export const data = {
  user: {
    name: "Admin User",
    email: "admin@company.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "User Management",
      url: "/dashboard/users",
      icon: UsersIcon,
    },
    {
      title: "Chats",
      url: "/dashboard/chats",
      icon: MessageCircleIcon,
    },
  ],
};
