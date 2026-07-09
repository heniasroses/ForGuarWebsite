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

export default function ContactUs() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

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

      alert("Message sent successfully!");

      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.log("FULL ERROR:", error);

      alert(
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
            <motion.div className="rowTwoInputs" variants={fieldVariants}>
              <div>
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your First Name"
                />
              </div>

              <div>
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Your Last Name"
                />
              </div>
            </motion.div>

            <motion.div className="fullInput" variants={fieldVariants}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="FirstLast@gmail.com"
              />
            </motion.div>

            <motion.div className="fullInput" variants={fieldVariants}>
              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I love your game!"
              />
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