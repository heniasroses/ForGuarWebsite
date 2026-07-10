"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";

const rowVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const leftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const rightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

type Errors = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

export default function ContactUs() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Errors = {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    };

    let hasError = false;

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required.";
      hasError = true;
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email.";
      hasError = true;
    }

    if (!message.trim()) {
      newErrors.message = "Message cannot be empty.";
      hasError = true;
    }

    setErrors(newErrors);
    setSuccessMessage("");

    if (hasError) return;

    setLoading(true);

    try {
      const res = await fetch(
        "https://gotkozzzgmkvudofczpz.functions.supabase.co/send-contact-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            message,
          }),
        }
      );

      const text = await res.text();
      console.log("EDGE FUNCTION RESPONSE:", text);

      if (!res.ok) {
        throw new Error(text || "Failed to send email");
      }

      setSuccessMessage("Your message has been sent successfully!");

      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
      setErrors({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.log("FULL ERROR:", error);
      setSuccessMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="contactUsContainer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={rowVariants}
    >
      <div className="contactUsRow">
        {/* LEFT SIDE */}
        <motion.div className="contactLeft" variants={leftVariants}>
          <h1>Get in Touch with Us!</h1>

          <p>
            If you have any inquiries or just want to say hi, please use the contact form!
            <br />
            <br />
            <b>Email:</b> heniasroses@gmail.com
            <br />
            <b>Youtube:</b> Henia&apos;s Roses
            <br />
            <b>Facebook:</b> Henia&apos;s Roses
          </p>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div className="contactRight" variants={rightVariants}>
          <motion.form
            className="contactForm"
            onSubmit={handleSubmit}
            variants={rowVariants}
          >
            {successMessage && (
              <div
                className={
                  successMessage === "Your message has been sent successfully!"
                    ? "formSuccess"
                    : "formErrorBox"
                }
              >
                {successMessage}
              </div>
            )}

            <motion.div className="rowTwoInputs" variants={fieldVariants}>
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (errors.firstName) {
                      setErrors((prev) => ({ ...prev, firstName: "" }));
                    }
                  }}
                  placeholder="Your First Name"
                  className={errors.firstName ? "inputError" : ""}
                />
                {errors.firstName && (
                  <span className="errorText">{errors.firstName}</span>
                )}
              </div>

              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errors.lastName) {
                      setErrors((prev) => ({ ...prev, lastName: "" }));
                    }
                  }}
                  placeholder="Your Last Name"
                  className={errors.lastName ? "inputError" : ""}
                />
                {errors.lastName && (
                  <span className="errorText">{errors.lastName}</span>
                )}
              </div>
            </motion.div>

            <motion.div className="fullInput" variants={fieldVariants}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                placeholder="FirstLast@gmail.com"
                className={errors.email ? "inputError" : ""}
              />
              {errors.email && <span className="errorText">{errors.email}</span>}
            </motion.div>

            <motion.div className="fullInput" variants={fieldVariants}>
              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) {
                    setErrors((prev) => ({ ...prev, message: "" }));
                  }
                }}
                placeholder="Hi! I love your game!"
                className={errors.message ? "inputError" : ""}
              />
              {errors.message && (
                <span className="errorText">{errors.message}</span>
              )}
            </motion.div>

            <motion.button
              type="submit"
              className="buttonContact"
              disabled={loading}
              variants={fieldVariants}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Sending..." : "Send"}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </motion.div>
  );
}