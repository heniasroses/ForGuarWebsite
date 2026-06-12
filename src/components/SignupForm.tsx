"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

type SignupFormProps = {
  onLogin: () => void;
  onClose: () => void;
};

export default function SignupForm({
  onLogin,
  onClose,
}: SignupFormProps) {
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

    // Create auth user
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

    // Save profile
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

    alert("Account created! Please check your email to verify your account.");

    // Close modal after successful signup
    onClose();
  };

  return (
    <div className="authWrapper">
      <img src="/img/rose.png" className="authRose" />

      <div className="authBox">
        <div className="authField">
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

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

        <div className="authField">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          className="loginBtn"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="signupText">
          Already have an account?{" "}
          <span
            style={{ cursor: "pointer" }}
            onClick={onLogin}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}