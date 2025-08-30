import React, { useEffect, useState } from "react";
import {
  Bell,
  Users,
  Search,
  Settings,
  ChevronDown,
  Loader2,
  Activity,
  UserPlus,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
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

  const handleSendNotification = async () => {
    setSendingNotification(true);
    try {
      const payload = {
        notificationData,
        userIds: selectedUsers,
      };

      const res = await fetch(
        "https://benifit-ai-app-be.onrender.com/api/v1/send-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (data.success) {
        const { successCount, failureCount, results } = data.data;

        toast.info(
          `Notifications sent: ${successCount} successful, ${failureCount} failed`
        );
        if (failureCount > 0) {
          results.forEach((result) => {
            if (!result.success) {
              const user = users.find((u) => u.id === result.userId);
              toast.error(
                `Failed to send to ${user?.name || result.userId}: ${
                  result.message
                }`
              );
            }
          });
        }
        if (successCount > 0) {
          toast.success(`Successfully sent to ${successCount} user(s)`);
        }

        setNotificationDialog(false);
        setNotificationData({ title: "", body: "" });
        setSelectedUsers([]);
      } else {
        toast.error("Failed to send notifications");
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
      toast.error("Failed to send notifications: Network error");
    } finally {
      setSendingNotification(false);
    }
  };

  const fetchUsers = async (searchQuery = "", pageNum = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search: searchQuery,
        page: pageNum,
        limit: limit,
      }).toString();

      const res = await fetch(
        `https://benifit-ai-app-be.onrender.com/api/v1/users/get-all-user?${queryParams}`
      );
      const json = await res.json();
      if (json.success && json.data) {
        const { users: list, hasNextPage, hasPrevPage, totalPages } = json.data;
        const normalized = list.map((u) => ({
          id: u._id,
          name: u.username || u.email || "-",
          email: u.email || "-",
          fcmToken: u.fcmToken || "-",
          password: u.password || "-",
          version: u.__v || 0,
        }));
        setUsers(normalized);
        setHasNextPage(hasNextPage);
        setHasPrevPage(hasPrevPage);
        setTotalPages(totalPages);
      } else {
        setUsers([]);
      }
    } catch (e) {
      console.error("Failed to fetch users", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers("", page);
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchTerm, 1);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users (current page) */}
        <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Users (this page)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {users.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Fetched with search & pagination
              </p>
            </div>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-indigo-500/10" />
        </Card>

        {/* Active Users (FCM present on this page) */}
        <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active (FCM on page)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {users.filter((u) => u.fcmToken && u.fcmToken !== "-").length}
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

        {/* Selected Users */}
        <Card className="relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Selected users
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">
                {selectedUsers.length}
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
            Manage your users and their permissions
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Search users
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search users..."
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
              <CardTitle>Users ({users.length})</CardTitle>
              <CardDescription>
                {selectedUsers.length > 0 &&
                  `${selectedUsers.length} user(s) selected`}
              </CardDescription>
            </div>
            {selectedUsers.length > 0 && (
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
                        Send a notification to {selectedUsers.length} selected
                        user(s).
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={notificationData.title}
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
                          value={notificationData.body}
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
                        onClick={handleSendNotification}
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
                        selectedUsers.length === users.length &&
                        users.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>FCM Token</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                      />
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {user.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 break-all max-w-[250px]">
                      {user.fcmToken || "-"}
                    </TableCell>
                  </TableRow>
                ))}
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
