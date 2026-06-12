"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type LoginFormProps = {
  onClose: () => void;
  onSignup: () => void;
};

export default function LoginForm({
  onClose,
  onSignup,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      setLoading(false);
      return;
    }

    await supabase.auth.getSession();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      alert("Failed to get user role");
      setLoading(false);
      return;
    }

    setLoading(false);

    // Close the modal first
    onClose();

    // Redirect exactly like your current page
    if (profile.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/forest-log");
    }

    router.refresh();
  };

  return (
    <div
      className="authModalOverlay"
      onClick={onClose}
    >
      <div
        className="authWrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="authCloseBtn"
          onClick={onClose}
        >
          ✕
        </button>

        <img
          src="/img/rose.png"
          className="authRose"
          alt="Rose"
        />

        <div className="authBox">

          <h2>Sign In</h2>

          <div className="authField">
            <label>Email</label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="authField">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="loginBtn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="signupText">
            Don’t have an account?{" "}
            <span
              style={{ cursor: "pointer" }}
              onClick={onSignup}
            >
              Sign Up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}