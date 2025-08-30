import React, { useEffect, useState } from "react";
import {
  Bell,
  MessageCircle,
  Search,
  ChevronDown,
  Loader2,
  Activity,
  UserCheck,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllChats } from "../helpers/getAllChats";
import { sendChatMessage } from "../helpers/sendChatMessage";
import { truncateStr } from "@/utils/truncateStr";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { useNavigate } from "react-router-dom";

export const ChatsManagement = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [selectedChats, setSelectedChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: "",
    body: "",
  });
  const [sendingNotification, setSendingNotification] = useState(false);
  const limit = 50;

  const sendChatMessageMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: () => {
      toast.success("Message sent successfully");
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    },
  });

  const handleSendMessage = async () => {
    sendChatMessageMutation.mutate({
      text: "",
      userIds: "",
    });
  };

  const { data: chatsData, isLoading: chatsLoading } = useQuery({
    queryKey: ["chats", page],
    queryFn: () => getAllChats(),
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 5000,
    cacheTime: 5000,
    onSuccess: (data) => {
      setChats(data);
    },
    onError: (error) => {
      console.error("Error fetching chats:", error);
    },
  });

  useEffect(() => {
    if (chatsData) {
      console.log("chatsData >>>", chatsData);
      setChats(chatsData);
    }
  }, [chatsData]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setPage(1);
  //   }, 500);

  //   return () => clearTimeout(timer);
  // }, [searchTerm]);

  const handleSelectedChats = (userId) => {
    setSelectedChats((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedChats.length === chats.length) {
      setSelectedChats([]);
    } else {
      setSelectedChats(chats.map((user) => user.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total chats (current page) */}
        <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Conversations (this page)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {chats?.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Fetched with search & pagination
              </p>
            </div>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
              <chats className="w-6 h-6" />
            </div>
          </CardContent>
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-indigo-500/10" />
        </Card>

        {/* Active chats (FCM present on this page) */}
        <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active (FCM on page)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {
                  chats?.filter((u) => u?.fcmToken && u?.fcmToken !== "-")
                    .length
                }
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ready to receive notifications
              </p>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <Activity className="w-6 h-6" />
            </div>
          </CardContent>
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-emerald-500/10" />
        </Card>

        {/* Selected chats */}
        <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Selected chats
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {selectedChats?.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Ready for bulk actions
              </p>
            </div>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-600">
              <UserCheck className="w-6 h-6" />
            </div>
          </CardContent>
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-violet-500/10" />
        </Card>

        {/* Pagination Overview */}
        <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pages
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {totalPages}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Currently on page {page}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <BarChart3 className="w-6 h-6" />
            </div>
          </CardContent>
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-amber-500/10" />
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">
            Manage your chats and their permissions
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Search chats
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>chats ({chats?.length})</CardTitle>
              <CardDescription>
                {selectedChats?.length > 0 &&
                  `${selectedChats?.length} user(s) selected`}
              </CardDescription>
            </div>
            {selectedChats?.length > 0 && (
              <div className="flex gap-2">
                <Dialog
                  open={notificationDialog}
                  onOpenChange={setNotificationDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Bell className="w-4 h-4 mr-2" />
                      Send Notification
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Notification</DialogTitle>
                      <DialogDescription>
                        Send a notification to {selectedChats?.length} selected
                        user(s).
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={notificationData?.title}
                          onChange={(e) =>
                            setNotificationData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder="Enter notification title"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="body">Message Body</Label>
                        <Textarea
                          id="body"
                          value={notificationData?.body}
                          onChange={(e) =>
                            setNotificationData((prev) => ({
                              ...prev,
                              body: e.target.value,
                            }))
                          }
                          placeholder="Enter notification message"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setNotificationDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        disabled={
                          !notificationData.title ||
                          !notificationData.body ||
                          sendingNotification
                        }
                      >
                        {sendingNotification ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedChats?.length === chats?.length &&
                        chats?.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>isActive</TableHead>
                  <TableHead>Last Message</TableHead>
                  <TableHead>Chat Started</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chats.length > 0 ? (
                  chats?.map((chat) => (
                    <TableRow
                      key={chat?._id}
                      onClick={() =>
                        navigate(`/dashboard/chats/${chat?._id}`, {
                          state: {
                            chat: chat,
                          },
                        })
                      }
                      className="cursor-pointer"
                    >
                      <TableCell
                        onClick={(e) => e.stopPropagation()} // prevent row navigation when checkbox clicked
                      >
                        <Checkbox
                          checked={selectedChats?.includes(chat?._id)}
                          onCheckedChange={() => handleSelectedChats(chat?._id)}
                        />
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">
                        {truncateStr(chat?._id)}
                      </TableCell>
                      <TableCell>
                        {chat?.participants
                          ?.map((participant) => participant?.username)
                          .join(", ")}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {chat?.isActive ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-gray-600 break-all max-w-[250px]">
                        {formatTime(chat?.updatedAt)}
                      </TableCell>
                      <TableCell className="text-xs text-gray-600 break-all max-w-[250px]">
                        {formatTime(chat?.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No chats found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={!hasPrevPage || loading}
            >
              Previous
            </Button>
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!hasNextPage || loading}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
