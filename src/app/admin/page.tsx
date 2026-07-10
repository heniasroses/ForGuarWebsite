"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { supabase } from "../../../lib/supabase";
import AdminNavbar from "@/components/AdminNavbar";
import AdminForestLogViewModal from "@/components/AdminForestLogViewModal";

type ForestLog = {
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

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [logs, setLogs] = useState<ForestLog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [selectedLog, setSelectedLog] = useState<ForestLog | null>(null);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setPageError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError || profile?.role !== "admin") {
        router.push("/");
        return;
      }

      const { data: catData } = await supabase
        .from("forest_log_categories")
        .select("*");

      setCategories(catData || []);

      const { data, error } = await supabase
        .from("forest_logs")
        .select(
          `
          id,
          title,
          content,
          user_id,
          profiles:user_id (username),
          forest_log_categories:category_id (name)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
        setPageError("Failed to load logs.");
        setLoading(false);
        return;
      }

      const formatted: ForestLog[] = (data || []).map((log: any) => ({
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

    init();
  }, [router]);

  const filteredLogs =
    filter === "all" ? logs : logs.filter((l) => l.category === filter);

  const handleDeleted = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
    setSelectedLog(null);
  };

  return (
    <>
      <AdminNavbar />

      <div className="adminContainer">
        <div className="adminSidebar">
          <h3
            className={`adminSidebarItem ${
              pathname.includes("/admin") ? "activeSidebar" : ""
            }`}
            onClick={() => router.push("/admin")}
          >
            Forest Logs
          </h3>

          <h3
            className={`adminSidebarItem ${
              pathname.includes("/admin/almanac") ? "activeSidebar" : ""
            }`}
            onClick={() => router.push("/admin/almanac")}
          >
            Almanac
          </h3>
        </div>

        <div className="adminMain">
          <div className="forestLogFiltersAdmin">
            <div className="leftFilters AdminForumFilter">
              <button
                className={`ForGuarButtons ${
                  filter === "all" ? "activeFilterAdmin" : ""
                }`}
                onClick={() => setFilter("all")}
              >
                All Topics
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`ForGuarButtons ${
                    filter === cat.name ? "activeFilterAdmin" : ""
                  }`}
                  onClick={() => setFilter(cat.name)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p style={{ color: "white" }}>Loading...</p>
          ) : pageError ? (
            <div className="emptyLogs">
              <h2>Unable to load logs</h2>
              <p>{pageError}</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="emptyLogs">
              <h2>No logs found</h2>
              <p>Try another category.</p>
            </div>
          ) : (
            <motion.div
              className="adminGrid"
              initial="hidden"
              animate="visible"
              variants={gridVariants}
            >
              {filteredLogs.map((log) => (
                <motion.div
                  className="adminCard"
                  key={log.id}
                  variants={cardVariants}
                  whileHover={{ y: -5, scale: 1.01 }}
                >
                  <h2>{log.title}</h2>
                  <p className="adminUser">{log.username}</p>
                  <p className="adminCategory">{log.category}</p>

                  <p className="adminContent">{log.content}</p>

                  <div className="adminButtons">
                    <button
                      className="viewBtn"
                      onClick={() => setSelectedLog(log)}
                    >
                      View
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedLog && (
          <AdminForestLogViewModal
            log={selectedLog}
            onClose={() => setSelectedLog(null)}
            onDeleted={handleDeleted}
          />
        )}
      </AnimatePresence>
    </>
  );
}