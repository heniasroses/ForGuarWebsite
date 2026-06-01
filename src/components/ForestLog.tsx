"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ForestLog() {
  const defaultLogs = [
  {
    id: 1,
    topic: "First Impressions – Addictive Gameplay Loop",
    username: "Aira V.",
    content:
      "I really enjoyed how the wave system works. The 15-wave structure keeps things intense, especially in later rounds where CuBots start overwhelming you.",
  },
  {
    id: 2,
    topic: "Rajah Bagwis Build Tips (Melee Style)",
    username: "Kagami Hayato",
    content:
      "If you're playing Rajah Bagwis as a melee duelist, focus on stacking his passive early. Try to reach 25 takedowns fast.",
  },
  {
    id: 3,
    topic: "MARI IS OP!!!!! (crowd control play)",
    username: "Thor",
    content:
      "Mari’s abilities are perfect for handling large waves. I recommend using Mindspikes to slow enemies and Psychic Slam.",
  },
  {
    id: 4,
    topic: "Wave 10+ Survival Strategy",
    username: "Kenirot",
    content:
      "From wave 10 onwards, positioning becomes really important. Don’t just attack randomly.",
  },
  {
    id: 5,
    topic: "CUTE ROBOTS!!!",
    username: "mELANCHOLY__",
    content:
      "THE CUBOTS ARE SO SO SO CUTE!!! I REALLY WANT ONE!",
  },
];

const [logs, setLogs] = useState(defaultLogs);

useEffect(() => {
  const savedLogs = localStorage.getItem("forestLogs");

  if (savedLogs) {
    const parsedLogs = JSON.parse(savedLogs);

    setLogs([
      ...parsedLogs,
      ...defaultLogs,
    ]);
  }
}, []);

  return (
    <div className="container-fluid forestLogContainer">

      {/* HERO */}
      <section className="forestLogHero">
        <div className="heroText">
          <h1>Forest Logs</h1>
          <p>Restore the forest. Rewrite tomorrow.</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="forestLogContent">

        <div className="forestLogFilters">

          <div className="leftFilters">
            <button className="ForGuarButtons">All Topics</button>
            <button className="ForGuarButtons">Reviews</button>
            <button className="ForGuarButtons">
              Gameplay Strategy and Tips
            </button>
          </div>

          <Link href="/forest-log/create" className="linkZ">
            <button className="ForGuarButtons createLogButton">
                + Create Log
            </button>
          </Link>

        </div>

        <div className="logsGrid">

          {logs.map((log, index) => (
            <div className="forestLogCard" key={index}>

              <h2>{log.topic}</h2>

              <p className="author">
                {log.username}
              </p>

              <p className="content">
                {log.content}
              </p>

              <button className="viewLogButton">
                View Log
              </button>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}