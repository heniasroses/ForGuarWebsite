"use client";

import { useState } from "react";

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

      // 🔥 IMPORTANT: read actual response (for debugging)
      const text = await res.text();
      console.log("EDGE FUNCTION RESPONSE:", text);

      if (!res.ok) {
        throw new Error(text || "Failed to send email");
      }

      alert("Message sent successfully!");

      // clear form
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
    <div className="contactUsContainer">
      <div className="contactUsRow">

        {/* LEFT SIDE */}
        <div className="contactLeft">
          <h1>Get in Touch with Us!</h1>

          <p>
            If you have any inquiries or just want to say hi, please use the contact form!
            <br /><br />
            <b>Email:</b> heniasroses@gmail.com
            <br />
            <b>Youtube:</b> Henia's Roses
            <br />
            <b>Facebook:</b> Henia's Roses
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="contactRight">
          <form className="contactForm" onSubmit={handleSubmit}>

            <div className="rowTwoInputs">
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
            </div>

            <div className="fullInput">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="FirstLast@gmail.com"
              />
            </div>

            <div className="fullInput">
              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I love your game!"
              />
            </div>

            <button
              type="submit"
              className="buttonContact"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}