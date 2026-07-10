"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

type SignupFormProps = {
  onLogin: () => void;
  onClose: () => void;
};

type Errors = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  form: string;
};

export default function SignupForm({ onLogin, onClose }: SignupFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Errors>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    form: "",
  });

  const validate = () => {
    const newErrors: Errors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      form: "",
    };

    let hasError = false;

    if (!username.trim()) {
      newErrors.username = "Username is required.";
      hasError = true;
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
      hasError = true;
    }

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
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors((prev) => ({ ...prev, form: "" }));

    try {
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
        setErrors((prev) => ({
          ...prev,
          form: error.message,
        }));
        setLoading(false);
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            username,
            email,
          },
        ]);

        if (profileError) {
          setErrors((prev) => ({
            ...prev,
            form: profileError.message,
          }));
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      onClose();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      }));
      setLoading(false);
    }
  };

  return (
    <div className="authWrapper">
      <div className="authBox signupBox">
        <button className="authCloseBtn" onClick={onClose}>
          ✕
        </button>


        {errors.form && <div className="authErrorBox">{errors.form}</div>}

        <div className="authField">
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) {
                setErrors((prev) => ({ ...prev, username: "" }));
              }
            }}
            className={errors.username ? "inputError" : ""}
            placeholder="Enter your username"
          />
          {errors.username && <span className="errorText">{errors.username}</span>}
        </div>

        <div className="authField">
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: "" }));
              }
            }}
            className={errors.email ? "inputError" : ""}
            placeholder="Enter your email"
          />
          {errors.email && <span className="errorText">{errors.email}</span>}
        </div>

        <div className="authField">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            className={errors.password ? "inputError" : ""}
            placeholder="Create a password"
          />
          {errors.password && <span className="errorText">{errors.password}</span>}
        </div>

        <div className="authField">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }
            }}
            className={errors.confirmPassword ? "inputError" : ""}
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && (
            <span className="errorText">{errors.confirmPassword}</span>
          )}
        </div>

        <button className="loginBtn" onClick={handleSignup} disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="signupText">
          Already have an account?{" "}
          <span style={{ cursor: "pointer" }} onClick={onLogin}>
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}