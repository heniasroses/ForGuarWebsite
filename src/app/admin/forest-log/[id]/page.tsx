"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import AdminNavbar from "@/components/AdminNavbar";

// FIXED TYPE (Supabase returns arrays for joins)
type Log = {
  id: string;
  title: string;
  content: string;
  user_id: string;

  profiles?: {
    username: string;
  }[] | null;

  forest_log_categories?: {
    name: string;
  }[] | null;
};

export default function AdminForestLogViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [log, setLog] = useState<Log | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);

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
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }

      setLog(data);
      setLoading(false);
    };

    if (id) fetchLog();
  }, [id]);

  if (loading) {
    return <p style={{ color: "white", padding: 40 }}>Loading...</p>;
  }

  if (!log) {
    return <p style={{ color: "white", padding: 40 }}>Log not found</p>;
  }

  const username =
    log.profiles?.[0]?.username ?? "Unknown";

  const category =
    log.forest_log_categories?.[0]?.name ?? "Uncategorized";

  return (
    <>
      <AdminNavbar />

      <div className="adminMain">

        <div className="adminViewCard">

          <h1>{log.title}</h1>

          <p className="adminMeta">
            By {username} • {category}
          </p>

          <div className="adminViewContent">
            {log.content}
          </div>

          <div className="adminButtons">

            <button
              className="viewBtn"
              onClick={() => router.push("/admin")}
            >
              Back
            </button>

            <button
              className="editBtn"
              onClick={() =>
                router.push(`/admin/forest-log/edit/${log.id}`)
              }
            >
              Edit
            </button>

            <button
              className="deleteBtn"
              onClick={() => {
                const confirmed = confirm("Delete this log?");
                if (!confirmed) return;

                supabase
                  .from("forest_logs")
                  .delete()
                  .eq("id", log.id)
                  .then(() => router.push("/admin"));
              }}
            >
              Delete
            </button>

          </div>

        </div>

      </div>
    </>
  );
}