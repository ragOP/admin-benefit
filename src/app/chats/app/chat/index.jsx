import Chat from "./components/Chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const chat = location.state?.chat;

  const user = chat?.participants?.find(
    (p) => p?.role?.toLowerCase() === "user"
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{user?.email || "-"}</h1>
        </div>
      </div>

      <Card className="h-[calc(100vh-180px)]">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Chat with {user?.username}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-full">
          <Chat conversationId={conversationId} user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
