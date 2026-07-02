"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import AdminNavbar from "@/components/AdminNavbar";

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

export default function AdminPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [logs, setLogs] = useState<ForestLog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // ================= AUTH + LOAD =================
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      // GET USER
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      // CHECK ROLE
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        router.push("/");
        return;
      }

      // FETCH CATEGORIES
      const { data: catData } = await supabase
        .from("forest_log_categories")
        .select("*");

      setCategories(catData || []);

      // FETCH LOGS
      const { data, error } = await supabase
        .from("forest_logs")
        .select(`
          id,
          title,
          content,
          user_id,
          profiles:user_id (username),
          forest_log_categories:category_id (name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.log(error);
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
  }, []);

  // ================= DELETE =================
  const deleteLog = async (id: string) => {
    const confirmed = confirm("Delete this log?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("forest_logs")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Delete failed");
      return;
    }

    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  // ================= FILTER =================
  const filteredLogs =
    filter === "all"
      ? logs
      : logs.filter((l) => l.category === filter);

  return (
    <>
      <AdminNavbar />

      <div className="adminContainer">

        {/* ================= SIDEBAR FIXED ================= */}
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
              pathname.includes("/almanac") ? "activeSidebar" : ""
            }`}
            onClick={() => router.push("/almanac")}
          >
            Almanac
          </h3>

        </div>

        {/* ================= MAIN ================= */}
        <div className="adminMain">

          {/* FILTERS */}
          <div className="forestLogFilters">

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

          {/* LOADING */}
          {loading ? (
            <p style={{ color: "white" }}>Loading...</p>
          ) : (
            <div className="adminGrid">

              {filteredLogs.map((log) => (
                <div className="adminCard" key={log.id}>

                  <h2>{log.title}</h2>
                  <p className="adminUser">{log.username}</p>
                  <p className="adminCategory">{log.category}</p>

                  <p className="adminContent">
                    {log.content}
                  </p>

                  <div className="adminButtons">

                    <button
                      className="viewBtn"
                      onClick={() =>
                        router.push(`/admin/forest-log/${log.id}`)
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
          )}

        </div>
      </div>
    </>
  );
}