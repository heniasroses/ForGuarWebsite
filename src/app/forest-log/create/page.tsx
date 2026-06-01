"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function CreateLogPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = () => {
  if (!username || !topic || !content || !category) {
    alert("Please complete all fields.");
    return;
  }

  const newLog = {
    id: Date.now(),
    username,
    topic,
    category,
    content,
  };

  const existingLogs = JSON.parse(
    localStorage.getItem("forestLogs") || "[]"
  );

  existingLogs.unshift(newLog);

  localStorage.setItem(
    "forestLogs",
    JSON.stringify(existingLogs)
  );

  router.push("/forest-log");
  };

  return (
    <div className="createLogPage">

      <Navbar />

      <div className="createLogBG">

        <div className="createLogCard">

          <h1>Create a log</h1>

          {/* USERNAME */}
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              placeholder="Placeholder"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* TOPIC */}
          <div className="field">
            <label>Topic</label>
            <input
              type="text"
              placeholder="Placeholder"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* CATEGORY */}
          <div className="field">
            <label>Log Category</label>

            <div className="categoryRow">
              <label>
                <input
                  type="checkbox"
                  checked={category === "Reviews"}
                  onChange={() => setCategory("Reviews")}
                />
                Game Review
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={category === "Gameplay Strategy / Tips"}
                  onChange={() =>
                    setCategory("Gameplay Strategy / Tips")
                  }
                />
                Game Strategy / Tips
              </label>
            </div>
          </div>

          {/* CONTENT */}
          <div className="field">
            <label>Content</label>
            <textarea
              placeholder="Placeholder"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* BUTTONS */}
          <div className="buttonColumn">

            <button
              type="button"
              className="cancelBtn"
              onClick={() => router.push("/forest-log")}
            >
              Cancel
            </button>

            <button
              type="button"
              className="submitBtn"
              onClick={handleSubmit}
            >
              Submit
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}