"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginPage() {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = (document.getElementById("email") as HTMLInputElement).value.trim();
        const password = (document.getElementById("password") as HTMLInputElement).value;
        const setErr = (id: string, msg: string) =>
            ((document.getElementById(id) as HTMLElement).textContent = msg);

        let valid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setErr("emailError", ""); setErr("passwordError", "");

        if (!emailRegex.test(email)) { valid = false; setErr("emailError", "Email không hợp lệ."); }
        if (password.length < 8) { valid = false; setErr("passwordError", "Mật khẩu tối thiểu 8 ký tự."); }
        if (!valid) return;

        alert("Đăng nhập thành công!");
        // TODO: gọi API /auth/login
    };

    return (
        <>
            <Header />
            <main className="login-container">
                <div className="login-box">
                    <h2>Đăng nhập tài khoản</h2>
                    <form id="loginForm" autoComplete="off" noValidate onSubmit={onSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" placeholder="Nhập email" required />
                            <div className="error-message" id="emailError" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input id="password" type="password" placeholder="Nhập mật khẩu" required minLength={8} />
                            <div className="error-message" id="passwordError" />
                        </div>
                        <button type="submit" className="btn-login">Đăng nhập</button>
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
