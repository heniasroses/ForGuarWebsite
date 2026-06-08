"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import Navbar from "@/components/Navbar";

export default function ForestLogViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // GET USER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);

  // FETCH LOG
  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("forest_logs")
        .select(`
          id,
          user_id,
          title,
          content,
          created_at,
          profiles:user_id (
            username
          ),
          forest_log_categories:category_id (
            name
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.log("FETCH LOG ERROR:", error);
      } else {
        setLog(data);
      }

      setLoading(false);
    };

    if (id) fetchLog();
  }, [id]);

  const isOwner = log?.user_id === user?.id;

  // DELETE LOG
  const handleDelete = async () => {
    const { error } = await supabase
      .from("forest_logs")
      .delete()
      .eq("id", log.id);

    if (error) {
      console.log(error);
      alert("Failed to delete log.");
      return;
    }

    setShowDeleteModal(false);
    router.push("/forest-log");
  };

  if (loading) {
    return (
      <div className="forestLogViewContainer">
        <p style={{ color: "white" }}>Loading log...</p>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="forestLogViewContainer">
        <p style={{ color: "white" }}>Log not found.</p>
      </div>
    );
  }

  return (
    <div className="forestLogViewContainer">

      <Navbar />

      <div className="forestLogViewCard">

        <h1>{log.title}</h1>

        <p className="meta">
          By {log.profiles?.username || "Unknown"} •{" "}
          {log.forest_log_categories?.name || "No Category"}
        </p>

        <div className="content">
          {log.content}
        </div>

        <div className="logActions">

          {/* FIXED BACK BUTTON */}
          <button
            className="backBtn"
            onClick={() => router.push("/forest-log")}
          >
            Back
          </button>

          {isOwner && (
            <>
              <button
                className="editBtn"
                onClick={() =>
                  router.push(`/forest-log/edit/${log.id}`)
                }
              >
                Edit
              </button>

              <button
                className="deleteBtn"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </button>
            </>
          )}

        </div>

      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="deleteModalOverlay">

          <div className="deleteModal">

            <h2>Delete Log?</h2>

            <p>
              This action cannot be undone.
            </p>

            <div className="deleteModalActions">

              <button
                className="cancelDeleteBtn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="confirmDeleteBtn"
                onClick={handleDelete}
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}