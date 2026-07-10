"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type LoginFormProps = {
  onClose: () => void;
  onSignup: () => void;
};

type Errors = {
  email: string;
  password: string;
  form: string;
};

export default function LoginForm({
  onClose,
  onSignup,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Errors>({
    email: "",
    password: "",
    form: "",
  });

  const router = useRouter();

  const validate = () => {
    const newErrors: Errors = {
      email: "",
      password: "",
      form: "",
    };

    let hasError = false;

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email.";
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
      hasError = true;
    }

    setErrors(newErrors);

    return !hasError;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, form: "" }));

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrors((prev) => ({
        ...prev,
        form: error.message,
      }));

      setLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      setErrors((prev) => ({
        ...prev,
        form: "Unable to log in.",
      }));

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
      setErrors((prev) => ({
        ...prev,
        form: "Failed to get user role.",
      }));

      setLoading(false);
      return;
    }

    setLoading(false);

    onClose();

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

        <div className="authBox">

          <img
            src="/img/rose.png"
            className="authRose"
            alt="Rose"
          />

          {errors.form && (
            <div className="authErrorBox">
              {errors.form}
            </div>
          )}

          <div className="authField">
            <label>Email</label>

            <input
              value={email}
              placeholder="Enter your email"
              className={errors.email ? "inputError" : ""}
              onChange={(e) => {
                setEmail(e.target.value);

                if (errors.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));
                }
              }}
            />

            {errors.email && (
              <span className="errorText">
                {errors.email}
              </span>
            )}
          </div>

          <div className="authField">
            <label>Password</label>

            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              className={errors.password ? "inputError" : ""}
              onChange={(e) => {
                setPassword(e.target.value);

                if (errors.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));
                }
              }}
            />

            {errors.password && (
              <span className="errorText">
                {errors.password}
              </span>
            )}
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