import "./App.css";
import { Toaster } from "sonner";
import AppRouter from "./router";
import { SidebarProvider } from "@/components/ui/sidebar";

function App() {
  return (
    <SidebarProvider>
      <Toaster position="top-right" />
      <AppRouter />
    </SidebarProvider>
  );
}

export default App;
