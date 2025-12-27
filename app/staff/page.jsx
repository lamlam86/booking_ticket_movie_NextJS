"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StaffRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Staff và Admin dùng chung panel /admin
    router.replace("/admin");
  }, [router]);

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh",
      background: "#0a0a0f",
      color: "#fff"
    }}>
      <p>Đang chuyển hướng...</p>
    </div>
  );
}
