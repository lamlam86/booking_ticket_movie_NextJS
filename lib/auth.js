import jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-change-in-production";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "your-refresh-secret-key-change-in-production";

// Token expiration times
const ACCESS_TOKEN_EXPIRES = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRES = "7d"; // 7 days
const REMEMBER_ME_EXPIRES = "30d"; // 30 days

// Cookie names
const AUTH_COOKIE = "auth_token";
const REFRESH_COOKIE = "refresh_token";
const SESSION_COOKIE = "session_id";

// Hash password
export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Generate unique session ID
export function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Generate Access Token (short-lived)
export function generateAccessToken(payload) {
  return jwt.sign(
    { ...payload, type: "access" },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );
}

// Generate Refresh Token (long-lived)
export function generateRefreshToken(payload, rememberMe = false) {
  return jwt.sign(
    { ...payload, type: "refresh" },
    REFRESH_SECRET,
    { expiresIn: rememberMe ? REMEMBER_ME_EXPIRES : REFRESH_TOKEN_EXPIRES }
  );
}

// Verify Access Token
export function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "access") return null;
    return decoded;
  } catch {
    return null;
  }
}

// Verify Refresh Token
export function verifyRefreshToken(token) {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    if (decoded.type !== "refresh") return null;
    return decoded;
  } catch {
    return null;
  }
}

// Set auth cookies (access + refresh + session)
export async function setAuthCookies(user, rememberMe = false) {
  const cookieStore = await cookies();
  const sessionId = generateSessionId();
  
  const payload = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    roles: user.roles,
    sessionId
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload, rememberMe);
  
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7; // 30 days or 7 days

  // Access token cookie
  cookieStore.set(AUTH_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 minutes
    path: "/",
  });

  // Refresh token cookie
  cookieStore.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  // Session ID cookie (for tracking)
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: false, // Accessible by JS for session tracking
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  return { accessToken, refreshToken, sessionId };
}

// Legacy: Set auth cookie (for backward compatibility)
export async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

// Remove all auth cookies
export async function removeAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  cookieStore.delete(SESSION_COOKIE);
}

// Legacy: Remove auth cookie (for backward compatibility)
export async function removeAuthCookie() {
  return removeAuthCookies();
}

// Refresh access token using refresh token
export async function refreshAccessToken() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  
  if (!refreshToken) return null;
  
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) return null;

  // Generate new access token
  const newPayload = {
    id: decoded.id,
    email: decoded.email,
    fullName: decoded.fullName,
    roles: decoded.roles,
    sessionId: decoded.sessionId
  };
  
  const newAccessToken = generateAccessToken(newPayload);
  
  // Update access token cookie
  cookieStore.set(AUTH_COOKIE, newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15,
    path: "/",
  });

  return newPayload;
}

// Get current user from cookie (with auto-refresh)
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE)?.value;
  
  // Try access token first
  if (accessToken) {
    const user = verifyAccessToken(accessToken);
    if (user) return user;
  }
  
  // Access token invalid/expired, try refresh
  const refreshedUser = await refreshAccessToken();
  return refreshedUser;
}

// Get session info
export async function getSessionInfo() {
  const cookieStore = await cookies();
  return {
    sessionId: cookieStore.get(SESSION_COOKIE)?.value,
    hasAccessToken: !!cookieStore.get(AUTH_COOKIE)?.value,
    hasRefreshToken: !!cookieStore.get(REFRESH_COOKIE)?.value,
  };
}

// Check if session is valid
export async function isSessionValid() {
  const user = await getCurrentUser();
  return !!user;
}

// Legacy: Generate token (for backward compatibility)
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Legacy: Verify token (for backward compatibility)
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}



