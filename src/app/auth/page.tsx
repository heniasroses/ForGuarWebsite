"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <div className="authContainer">

      {/* <Navbar /> */}

      <div className="authWrapper">

        {/* ROSE IMAGE */}
        <img
          src="../img/rose.png"
          alt="Rose"
          className="authRose"
        />

        {/* LOGIN BOX */}
        <div className="authBox">

          {/* <h2>Log In</h2> */}

          {/* USERNAME */}
          <div className="authField">
            <label>Username</label>
            <input
              type="text"
              placeholder="Placeholder"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="authField">
            <label>Password</label>
            <input
              type="password"
              placeholder="Placeholder"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* LOGIN BUTTON */}
            <button
                className="loginBtn"
                onClick={() => {
                    if (username === "admin" && password === "admin123") {
                    localStorage.setItem("user", JSON.stringify({
                        username: "admin",
                        role: "admin"
                    }));

                    router.push("/admin");
                    } else {
                    alert("Invalid credentials");
                    }
                }}
                >
                Log In
            </button>

          {/* SIGN UP */}
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