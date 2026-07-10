"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { supabase } from "../../lib/supabase";
import CreateLogModal from "@/components/CreateLogModal";
import AuthModal from "@/components/AuthModal";
import ForestLogViewModal from "@/components/ForestLogViewModal";

type Log = {
  id: string;
  title: string;
  content: string;
  username: string;
  category: string;
  user_id: string;
};

type Category = {
  id: string;
  name: string;
};

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const filterRowVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const cardGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const emptyVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function ForestLog() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [showCreateLog, setShowCreateLog] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  const addNewLog = (newLog: Log) => {
    setLogs((prev) => [newLog, ...prev]);
  };

  const removeLog = (id: string) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
    setSelectedLog(null);
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      // keep UI stable; no action needed here
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from("forest_log_categories").select("*");
      setCategories(data || []);
    };

    fetchCategories();
  }, []);

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
        user_id: log.user_id,
        username: log.profiles?.username || "Unknown",
        category: log.forest_log_categories?.name || "Uncategorized",
      }));

      setLogs(formatted);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  const handleCreateClick = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

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
      <motion.section
        className="forestLogHero"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <motion.div className="heroText" variants={heroVariants}>
          <h1>Forest Logs</h1>
          <p>Restore the forest. Rewrite tomorrow.</p>
        </motion.div>
      </motion.section>

      <motion.section
        className="forestLogContent"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={contentVariants}
      >
        <motion.div className="forestLogFilters" variants={filterRowVariants}>
          <div className="leftFilters">
            <motion.button
              className={`ForGuarButtons ${
                selectedCategory === "all" ? "activeFilter" : ""
              }`}
              onClick={() => setSelectedCategory("all")}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              All
            </motion.button>

            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                className={`ForGuarButtons ${
                  selectedCategory === cat.name ? "activeFilter" : ""
                }`}
                onClick={() => setSelectedCategory(cat.name)}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>

          <motion.button
            className="ForGuarButtons createLogButton"
            onClick={handleCreateClick}
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            + Create Log
          </motion.button>
        </motion.div>

        {loading ? (
          <motion.p
            style={{ color: "white" }}
            initial="hidden"
            animate="visible"
            variants={emptyVariants}
          >
            Loading logs...
          </motion.p>
        ) : filteredLogs.length === 0 ? (
          <motion.div
            className="emptyLogs"
            initial="hidden"
            animate="visible"
            variants={emptyVariants}
          >
            <h2>No forest whispers found 🌿</h2>
            <p>Try another category or create a new log.</p>
          </motion.div>
        ) : (
          <motion.div
            className="logsGrid"
            initial="hidden"
            animate="visible"
            variants={cardGridVariants}
          >
            {filteredLogs.map((log) => (
              <motion.div
                className="forestLogCard"
                key={log.id}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.01 }}
              >
                <h2>{log.title}</h2>

                <p className="author">
                  {log.username} • {log.category}
                </p>

                <p className="content">{log.content}</p>

                <button
                  className="viewLogButton"
                  onClick={() => setSelectedLog(log)}
                >
                  View Log
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      <AnimatePresence>
        {selectedLog && (
          <ForestLogViewModal
            log={selectedLog}
            onClose={() => setSelectedLog(null)}
            onDeleted={removeLog}
          />
        )}
      </AnimatePresence>

      {showCreateLog && (
        <CreateLogModal
          onClose={() => setShowCreateLog(false)}
          onLogCreated={addNewLog}
        />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}