"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import CreateLogModal from "@/components/CreateLogModal";
import AuthModal from "@/components/AuthModal";

type Log = {
  id: string;
  title: string;
  content: string;
  username: string;
  category: string;
};

type Category = {
  id: string;
  name: string;
};

export default function ForestLog() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [showCreateLog, setShowCreateLog] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const addNewLog = (newLog: Log) => {
  setLogs((prev) => [newLog, ...prev]);
  };

  useEffect(() => {
  const { data: listener } = supabase.auth.onAuthStateChange(() => {
    // DO NOTHING UI-RELATED HERE
    // only logging or syncing if needed
  });

  return () => {
    listener.subscription.unsubscribe();
  };
  }, []);

  // FETCH CATEGORIES

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("forest_log_categories")
        .select("*");

      setCategories(data || []);
    };

    fetchCategories();
  }, []);

  // FETCH LOGS
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("forest_logs")
        .select(
          `
          id,
          title,
          content,
          user_id,
          category_id,
          profiles:user_id (username),
          forest_log_categories:category_id (name)
          `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.log("FETCH ERROR:", error);
        setLoading(false);
        return;
      }

      const formatted = (data || []).map((log: any) => ({
        id: log.id,
        title: log.title,
        content: log.content,
        username: log.profiles?.username || "Unknown",
        category: log.forest_log_categories?.name || "Uncategorized",
      }));

      setLogs(formatted);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  const handleCreateClick = async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    setShowAuthModal(true);
    return;
  }

  setShowCreateLog(true);
  };

  const filteredLogs =
    selectedCategory === "all"
      ? logs
      : logs.filter((log) => log.category === selectedCategory);

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

        {/* FILTERS */}
        <div className="forestLogFilters">

          <div className="leftFilters">

            <button
              className={`ForGuarButtons ${selectedCategory === "all" ? "activeFilter" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`ForGuarButtons ${
                  selectedCategory === cat.name ? "activeFilter" : ""
                }`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}

          </div>

          <button
            className="ForGuarButtons createLogButton"
            onClick={handleCreateClick}
          >
            + Create Log
          </button>

        </div>

        {/* CONTENT */}
        {loading ? (
          <p style={{ color: "white" }}>Loading logs...</p>
        ) : filteredLogs.length === 0 ? (
          <div className="emptyLogs">
            <h2>No forest whispers found 🌿</h2>
            <p>Try another category or create a new log.</p>
          </div>
        ) : (
          <div className="logsGrid">
            {filteredLogs.map((log) => (
              <div className="forestLogCard" key={log.id}>
                <h2>{log.title}</h2>

                <p className="author">
                  {log.username} • {log.category}
                </p>

                <p className="content">{log.content}</p>

                <Link href={`/forest-log/${log.id}`}>
                  <button className="viewLogButton">View Log</button>
                </Link>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* MODALS */}
      {showCreateLog && (
        <CreateLogModal
          onClose={() => setShowCreateLog(false)}
          onLogCreated={addNewLog}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

    </div>
  );
}