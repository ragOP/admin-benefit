import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress.jsx";

const PageLoading = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (progress < 100) {
      const timeout = setTimeout(
        () => setProgress((p) => Math.min(p + 5, 100)),
        40
      );
      return () => clearTimeout(timeout);
    } else {
      const timer = setTimeout(
        () => navigate("/login", { replace: true }),
        400
      );
      return () => clearTimeout(timer);
    }
  }, [progress, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full h-full">
      <img src="/admin.webp" alt="Brand Logo" className="w-20 h-20 mb-8" />
      <div className="w-64">
        <Progress value={progress} />
      </div>
    </div>
  );
};

export default PageLoading;
