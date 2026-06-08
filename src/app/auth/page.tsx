"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AuthPage() {
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

    // 1. SIGN IN
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

    // 2. FORCE SESSION SYNC (IMPORTANT FIX)
    await supabase.auth.getSession();

    // 3. GET ROLE FROM PROFILES
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      console.log(profileError);
      alert("Failed to get user role");
      setLoading(false);
      return;
    }

    setLoading(false);

    // 4. ROLE-BASED REDIRECT (CLEAN FIX)
    if (profile.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/forest-log");
    }

    router.refresh();
  };

  return (
    <div className="authContainer">
      <div className="authWrapper">
        <img src="/img/rose.png" className="authRose" />

        <div className="authBox">
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
            <span onClick={() => router.push("/auth/signup")}>
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}