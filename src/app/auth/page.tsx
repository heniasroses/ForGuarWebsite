"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

    setLoading(false);

    // redirect after login
    router.push("/");
  };

  return (
    <div className="authContainer">
      <div className="authWrapper">
        <img src="/img/rose.png" className="authRose" />

        <div className="authBox">
          <div className="authField">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="authField">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button className="loginBtn" onClick={handleLogin} disabled={loading}>
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