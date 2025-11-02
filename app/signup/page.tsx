"use client";
import { useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "intl-tel-input/build/css/intlTelInput.css";

export default function SignupPage() {
    const phoneRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let iti: any;
        (async () => {
            const intlTelInput = (await import("intl-tel-input")).default;
            if (phoneRef.current) {
                iti = intlTelInput(phoneRef.current, {
                    initialCountry: "vn",
                    separateDialCode: true,
                    preferredCountries: ["vn", "us", "gb", "au", "de", "fr", "jp", "kr"],
                    nationalMode: false,
                    // utils cần URL, dùng CDN cho nhanh. Nếu muốn offline: copy utils.js vào /public và đổi URL.
                    utilsScript:
                        "https://cdn.jsdelivr.net/npm/intl-tel-input@17/build/js/utils.js",
                });
            }
        })();
        return () => { /* unmount cleanup nếu cần */ };
    }, []);

    const togglePassword = (id: string) => {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (el) el.type = el.type === "password" ? "text" : "password";
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const get = (id: string) => document.getElementById(id) as HTMLInputElement;
        const fullname = get("fullname");
        const username = get("username");
        const dob = get("dob");
        const cccd = get("cccd");
        const email = get("email");
        const phone = get("phone");
        const password = get("password");
        const confirm = get("confirm-password");
        const policy = get("policy") as HTMLInputElement;

        // regex giống file signup.js cũ
        const regex = {
            fullname: /^[\p{L}\s]{2,}$/u,
            username: /^[a-zA-Z0-9_]{4,}$/,
            cccd: /^\d{12}$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        };

        // helper
        const setErr = (id: string, msg: string) =>
            ((document.getElementById(id) as HTMLElement).textContent = msg);
        const clearAll = () => {
            document.querySelectorAll("input, select").forEach(el => el.classList.remove("error"));
            document.querySelectorAll(".error-message").forEach(el => (el.textContent = ""));
        };

        clearAll();
        let valid = true;

        if (!regex.fullname.test(fullname.value.trim())) {
            valid = false; fullname.classList.add("error");
            setErr("fullnameError", "Họ và tên phải hợp lệ, không chứa số.");
        }
        if (!regex.username.test(username.value.trim())) {
            valid = false; username.classList.add("error");
            setErr("usernameError", "Tên đăng nhập ≥4 ký tự, chỉ chữ/số/_");
        }
        if (!dob.value) {
            valid = false; dob.classList.add("error");
            setErr("dobError", "Vui lòng chọn ngày sinh.");
        } else {
            const d = new Date(dob.value), today = new Date();
            const age = today.getFullYear() - d.getFullYear();
            if (d > today || age < 13) {
                valid = false; dob.classList.add("error");
                setErr("dobError", "Ngày sinh không hợp lệ (phải trên 13 tuổi).");
            }
        }
        if (!regex.cccd.test(cccd.value.trim())) {
            valid = false; cccd.classList.add("error");
            setErr("cccdError", "CCCD phải đủ 12 số.");
        }
        if (!regex.email.test(email.value.trim())) {
            valid = false; email.classList.add("error");
            setErr("emailError", "Email không hợp lệ.");
        }
        // intl-tel-input validate (dùng API qua window)
        const iti = (window as any).intlTelInputGlobals?.instances?.find((i: any) => i.a === phone);
        if (!phone.value.trim() || !iti || !iti.isValidNumber()) {
            valid = false; phone.classList.add("error");
            setErr("phoneError", "Số điện thoại không hợp lệ cho quốc gia đã chọn.");
        }
        if (!regex.password.test(password.value)) {
            valid = false; password.classList.add("error");
            setErr("passwordError", "Mật khẩu ≥8 ký tự, gồm hoa, thường, số, ký tự đặc biệt.");
        }
        if (password.value !== confirm.value) {
            valid = false; confirm.classList.add("error");
            setErr("confirmPasswordError", "Mật khẩu xác nhận không khớp.");
        }
        if (!policy.checked) {
            valid = false; policy.classList.add("error");
            setErr("policyError", "Bạn phải đồng ý với chính sách.");
        }

        if (!valid) return;

        const phoneE164 = iti.getNumber(); // số chuẩn E.164
        alert(`Đăng ký thành công!\nSố E.164: ${phoneE164}`);
        (e.target as HTMLFormElement).reset();
        iti.setCountry("vn");
    };

    return (
        <>
            <Header />
            <main className="login-container">
                <div className="login-box">
                    <h2>Tạo tài khoản mới</h2>

                    <form id="signupForm" noValidate autoComplete="off" onSubmit={onSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullname">Họ và tên</label>
                            <input id="fullname" placeholder="Nhập họ và tên" required />
                            <div className="error-message" id="fullnameError" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Tên đăng nhập</label>
                            <input id="username" placeholder="Nhập tên đăng nhập" required />
                            <div className="error-message" id="usernameError" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dob">Ngày sinh</label>
                            <input type="date" id="dob" required />
                            <div className="error-message" id="dobError" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cccd">CCCD</label>
                            <input id="cccd" maxLength={12} placeholder="Nhập số CCCD" required />
                            <div className="error-message" id="cccdError" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Địa chỉ Email</label>
                            <input type="email" id="email" placeholder="Nhập email" required />
                            <div className="error-message" id="emailError" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Số điện thoại</label>
                            <div className="phone-group">
                                <input ref={phoneRef} id="phone" type="tel" placeholder="Nhập số điện thoại" required />
                            </div>
                            <div className="error-message" id="phoneError" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <div className="password-wrapper">
                                <input type="password" id="password" placeholder="Nhập mật khẩu" required />
                                <button type="button" className="toggle-btn" onClick={() => togglePassword("password")}>👁</button>
                            </div>
                            <div className="error-message" id="passwordError" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                            <div className="password-wrapper">
                                <input type="password" id="confirm-password" placeholder="Nhập lại mật khẩu" required />
                                <button type="button" className="toggle-btn" onClick={() => togglePassword("confirm-password")}>👁</button>
                            </div>
                            <div className="error-message" id="confirmPasswordError" />
                        </div>

                        <div className="form-group" style={{ marginTop: 10 }}>
                            <label className="checkbox-label">
                                <input type="checkbox" id="policy" required />
                                <span>
                                    Tôi đồng ý với <a href="/chinhsach" target="_blank">Chính sách bảo mật</a> và{" "}
                                    <a href="/dieukhoan" target="_blank">Điều khoản sử dụng</a>.
                                </span>
                            </label>
                            <div className="error-message" id="policyError" />
                        </div>

                        <button type="submit" className="btn-login">Đăng ký</button>
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
