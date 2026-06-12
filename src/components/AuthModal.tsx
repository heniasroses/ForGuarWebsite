
"use client";

import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";

type AuthModalProps = {
  onClose: () => void;
};

export default function AuthModal({
  onClose,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div
      className="authOverlay"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
      >
        {mode === "login" ? (
          <LoginForm
            onSignup={() => setMode("signup")}
            onClose={onClose}
          />
        ) : (
          <SignupForm
            onLogin={() => setMode("login")}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
