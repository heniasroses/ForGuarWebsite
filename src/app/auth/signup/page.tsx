"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="authContainer">

      <div className="authWrapper">

        <img src="/img/rose.png" className="authRose" />

        <div className="authBox">

          {/* <h2>Sign Up</h2> */}

          {/* USERNAME */}
          <div className="authField">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* EMAIL */}
          <div className="authField">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="authField">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="authField">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* SIGN UP BUTTON */}
          <button
            className="loginBtn"
            onClick={() => {
              if (!username || !email || !password || !confirmPassword) {
                alert("Please complete all fields.");
                return;
              }

              if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
              }

              alert("Account created (frontend only)");
              router.push("/auth");
            }}
          >
            Sign Up
          </button>

          {/* BACK TO LOGIN */}
          <p className="signupText">
            Already have an account?{" "}
            <span onClick={() => router.push("/auth")}>
              Log In
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}