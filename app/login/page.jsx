"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.user) {
          // User is already logged in, redirect
          if (data.user.roles?.includes("admin") && redirectUrl === "/") {
            router.replace("/admin");
          } else {
            router.replace(redirectUrl);
          }
        }
      } catch {
        // Not logged in, stay on login page
      } finally {
        setUserLoading(false);
      }
    };
    checkAuth();
  }, [router, redirectUrl]);

  const validateForm = () => {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!email.trim()) {
      setEmailError("Vui lòng nhập email");
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Email không hợp lệ");
      valid = false;
    }

    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("Mật khẩu tối thiểu 8 ký tự");
      valid = false;
    }

    return valid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setGeneralError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to where user came from, or admin if admin/staff
        if (data.user?.roles.includes("admin") && redirectUrl === "/") {
          router.push("/admin");
        } else {
          router.push(redirectUrl);
        }
        router.refresh(); // Refresh to update user state in Header
      } else {
        setGeneralError(data.message);
      }
    } catch {
      setGeneralError("Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading) {
    return (
      <>
        <Header />
        <main className="login-container">
          <div className="login-box">
            <h2>Đang tải...</h2>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="login-container">
        <div className="login-box">
          <h2>Đăng nhập tài khoản</h2>

          {redirectUrl !== "/" && (
            <div className="login-notice">
              🎟️ Vui lòng đăng nhập để tiếp tục đặt vé
            </div>
          )}

          {generalError && (
            <div className="general-error">{generalError}</div>
          )}

          <form id="loginForm" autoComplete="off" noValidate onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              {emailError && <div className="error-message">{emailError}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Ghi nhớ đăng nhập (30 ngày)</span>
              </label>
              <a href="/forgot-password" className="forgot-password">Quên mật khẩu?</a>
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="register-text">
            Chưa có tài khoản? <a href="/signup">Đăng ký tại đây</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}


