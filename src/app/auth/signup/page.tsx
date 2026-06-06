"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("Please complete all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    // 1. Create Auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // 2. OPTIONAL: save profile (if you have profiles table)
    if (data.user) {
      await supabase.from("profiles").insert([
        {
          id: data.user.id,
          username,
          email,
        },
      ]);
    }

    setLoading(false);

    alert("Check your email to confirm your account!");
    router.push("/auth");
  };

  return (
    <div className="authContainer">
      <div className="authWrapper">
        <img src="/img/rose.png" className="authRose" />

        <div className="authBox">
          <div className="authField">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="authField">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="authField">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="authField">
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          <button className="loginBtn" onClick={handleSignup} disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="signupText">
            Already have an account?{" "}
            <span onClick={() => router.push("/auth")}>Log In</span>
          </p>
        </div>
      </div>
    </div>
  );
}