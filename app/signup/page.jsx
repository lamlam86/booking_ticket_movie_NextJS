"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "intl-tel-input/build/css/intlTelInput.css";

export default function SignupPage() {
  const router = useRouter();
  const phoneRef = useRef(null);
  const itiRef = useRef(null);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [policyChecked, setPolicyChecked] = useState(false);

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if user is already logged in - redirect immediately
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        
        if (data.success && data.user) {
          // User is already logged in, redirect to home
          router.replace("/");
        }
      } catch (e) {
        // Not logged in, continue showing signup form
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    (async () => {
      const intlTelInput = (await import("intl-tel-input")).default;
      if (phoneRef.current) {
        itiRef.current = intlTelInput(phoneRef.current, {
          initialCountry: "vn",
          separateDialCode: true,
          preferredCountries: ["vn", "us", "gb", "au", "de", "fr", "jp", "kr"],
          nationalMode: false,
          utilsScript:
            "https://cdn.jsdelivr.net/npm/intl-tel-input@17/build/js/utils.js",
        });
      }
    })();
    return () => {
      if (itiRef.current) {
        itiRef.current.destroy();
      }
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    const fullnameRegex = /^[\p{L}\s]{2,}$/u;
    if (!fullname.trim()) {
      newErrors.fullname = "Vui lòng nhập họ và tên";
    } else if (!fullnameRegex.test(fullname.trim())) {
      newErrors.fullname = "Họ và tên phải hợp lệ, không chứa số.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (phone.trim() && itiRef.current && !itiRef.current.isValidNumber()) {
      newErrors.phone = "Số điện thoại không hợp lệ cho quốc gia đã chọn.";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Mật khẩu ≥8 ký tự, gồm hoa, thường, số, ký tự đặc biệt.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    if (!policyChecked) {
      newErrors.policy = "Bạn phải đồng ý với chính sách.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setGeneralError("");

    try {
      const phoneE164 = itiRef.current?.getNumber() || phone;

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullname.trim(),
          email: email.trim(),
          phone: phoneE164,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/");
      } else {
        setGeneralError(data.message);
      }
    } catch {
      setGeneralError("Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="login-container">
        <div className="login-box">
          <h2>Tạo tài khoản mới</h2>

          {generalError && (
            <div className="general-error">{generalError}</div>
          )}

          <form id="signupForm" noValidate autoComplete="off" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="fullname">Họ và tên</label>
              <input
                id="fullname"
                placeholder="Nhập họ và tên"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                disabled={isLoading}
                className={errors.fullname ? "error" : ""}
              />
              {errors.fullname && <div className="error-message">{errors.fullname}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Địa chỉ Email</label>
              <input
                type="email"
                id="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <div className="phone-group">
                <input
                  ref={phoneRef}
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  className={errors.phone ? "error" : ""}
                />
              </div>
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={errors.password ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className={errors.confirmPassword ? "error" : ""}
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>

            <div className="form-group" style={{ marginTop: 10 }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="policy"
                  checked={policyChecked}
                  onChange={(e) => setPolicyChecked(e.target.checked)}
                  disabled={isLoading}
                  className={errors.policy ? "error" : ""}
                />
                <span>
                  Tôi đồng ý với <a href="/chinhsach" target="_blank">Chính sách bảo mật</a> và{" "}
                  <a href="/dieukhoan" target="_blank">Điều khoản sử dụng</a>.
                </span>
              </label>
              {errors.policy && <div className="error-message">{errors.policy}</div>}
            </div>

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="register-text">
            Đã có tài khoản? <a href="/login">Đăng nhập tại đây</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}


