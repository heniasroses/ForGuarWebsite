"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";

type ForestLog = {
  id: number;
  username: string;
  topic: string;
  category: string;
  content: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<ForestLog[]>([]);
  const [filter, setFilter] = useState("All Topics");
    const deleteLog = (id: number) => {
  const updated = logs.filter((log) => log.id !== id);
  setLogs(updated);
  localStorage.setItem("forestLogs", JSON.stringify(updated));
};

  const defaultLogs: ForestLog[] = [
  {
    id: 1,
    username: "Aira V.",
    topic: "First Impressions – Addictive Gameplay Loop",
    category: "Reviews",
    content:
      "I really enjoyed how the wave system works. The 15-wave structure keeps things intense."
  },
  {
    id: 2,
    username: "Kagami Hayato",
    topic: "Rajah Bagwis Build Tips",
    category: "Gameplay Strategy / Tips",
    content:
      "Focus on stacking passive early and use Sky Rend aggressively in fights."
  },
  {
    id: 3,
    username: "Thor",
    topic: "MARI IS OP!!!!!",
    category: "Gameplay Strategy / Tips",
    content:
      "Her crowd control abilities are perfect for wave defense situations."
  }
];

        useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (!user || user.role !== "admin") {
            router.push("/auth");
        }

        const saved = JSON.parse(localStorage.getItem("forestLogs") || "[]");

        if (saved.length > 0) {
            setLogs(saved);
        } else {
            setLogs(defaultLogs);
        }
        }, []);

  const filteredLogs = logs.filter((log) => {
    if (filter === "All Topics") return true;
    if (filter === "Reviews") return log.category === "Reviews";
    if (filter === "Gameplay Strategy and Tips")
      return log.category === "Gameplay Strategy / Tips";
    return true;
  });

  return (
    <>
      <AdminNavbar />

      <div className="adminContainer">

        {/* LEFT SIDEBAR */}
        <div className="adminSidebar">

          <h3 onClick={() => router.push("/forums")}>Forums</h3>
          <h3 onClick={() => router.push("/almanac")}>Almanac</h3>

        </div>

        {/* MAIN CONTENT */}
        <div className="adminMain">

          {/* FILTER BUTTONS */}
          <div className="forestLogFilters">

            <div className="leftFilters">
              <button
                className="ForGuarButtons"
                onClick={() => setFilter("All Topics")}
              >
                All Topics
              </button>

              <button
                className="ForGuarButtons"
                onClick={() => setFilter("Reviews")}
              >
                Reviews
              </button>

              <button
                className="ForGuarButtons"
                onClick={() =>
                  setFilter("Gameplay Strategy and Tips")
                }
              >
                Gameplay Strategy and Tips
              </button>
            </div>

          </div>

          {/* LOGS GRID */}
          <div className="adminGrid">

            {filteredLogs.map((log) => (
              <div className="adminCard" key={log.id}>

                <h2>{log.topic}</h2>

                <p className="adminUser">{log.username}</p>

                <p className="adminCategory">{log.category}</p>

                <p className="adminContent">{log.content}</p>

                <div className="adminButtons">

                  <button
                    className="viewBtn"
                    onClick={() =>
                      router.push(`/forest-log/${log.id}`)
                    }
                  >
                    View
                  </button>

                  <button
                    className="deleteBtn"
                    onClick={() => deleteLog(log.id)}
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>
      </div>
    </>
  );
}