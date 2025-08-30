"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChat } from "../helpers/getChat"; // adjust import if needed
import { sendChatMessage } from "@/app/chats/helpers/sendChatMessage";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export default function Chat({ conversationId, user = {} }) {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const bottomRef = useRef(null);

  // Fetch chat messages
  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["chat", conversationId],
    queryFn: () => getChat(conversationId),
    refetchInterval: 5000, // auto-refresh every 5s
  });

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(["chat", conversationId]);
      setMessage("");
      toast.success("Message sent!");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to send message");
    },
  });

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (payload) => {
    console.log("payload >>>", payload);
    if (!message.trim()) return;
    sendMutation.mutate(payload);
  };

  return (
    <main className="flex flex-col max-h-[520px] p-4 lg:p-6">
      <Card className="flex flex-col flex-1 overflow-auto no-scrollbar">
        <CardContent className="flex flex-col flex-1 p-0 overflow-auto">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4 z-5  overflow-auto no-scrollbar">
            {isLoading ? (
              <div className="flex justify-center items-center h-full text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : error ? (
              <p className="text-red-500">Error: {error.message}</p>
            ) : messages.length === 0 ? (
              <p className="text-muted-foreground text-center">
                No messages yet.
              </p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isMine = msg?.role?.toLowerCase() !== "user";
                  console.log("isMine >>>", isMine);
                  return (
                    <div
                      key={msg._id}
                      className={cn(
                        "flex w-full",
                        isMine ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-xs rounded-2xl px-4 py-2 text-sm shadow",
                          isMine
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-900"
                        )}
                      >
                        <p>{msg.text}</p>
                        <p className="mt-1 text-[10px] opacity-70 text-right">
                          {formatTime(msg.createdAt)} •{" "}
                          {formatDate(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="sticky bottom-0 p-3 border-t flex gap-2 z-10">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleSend({
                  text: message,
                  conversationId,
                  userId: user._id,
                  adminId: "68b2e2f6254442f9db4ae935",
                  role: "Admin",
                })
              }
              disabled={sendMutation.isLoading}
            />
            <Button
              onClick={() =>
                handleSend({
                  text: message,
                  conversationId,
                  userId: user._id,
                  adminId: "68b2e2f6254442f9db4ae935",
                  role: "Admin",
                })
              }
              disabled={sendMutation.isLoading}
            >
              {sendMutation.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
