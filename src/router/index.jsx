import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PageLoading from "@/components/PageLoading";
// import ProtectedRoute from "@/components/auth/ProtectedRoute";

// const LoginPage = lazy(() => import("./pages/Login"));
// const SignupPage = lazy(() => import("./pages/signup"));
const AppWrapper = lazy(() => import("@/components/app-wrapper"));
const Dashboard = lazy(() => import("@/app/dashboard"));
const UserManagementPage = lazy(() => import("@/app/users"));
const ChatPage = lazy(() => import("@/app/chats"));
const Chat = lazy(() => import("@/app/chats/app/chat"));

const AppRouter = () => (
  <Router>
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} /> */}
        <Route
          path="/dashboard/*"
          element={
            // <ProtectedRoute>
            <AppWrapper />
            // </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="chats" element={<ChatPage />} />
          <Route path="chats/:conversationId" element={<Chat />} />
        </Route>
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  </Router>
);

export default AppRouter;
