"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { supabase } from "../../lib/supabase";

type Log = {
  id: string;
  title: string;
  content: string;
  username: string;
  category: string;
  user_id: string;
};

type Props = {
  log: Log;
  currentUserId: string | null;
  authReady: boolean;
  onClose: () => void;
  onDeleted: (id: string) => void;
  onEdit: (log: Log) => void;
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 20,
    transition: {
      duration: 0.15,
    },
  },
};

export default function ForestLogViewModal({
  log,
  currentUserId,
  authReady,
  onClose,
  onDeleted,
  onEdit,
}: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isOwner = authReady && currentUserId === log.user_id;

  const handleDelete = async () => {
    setDeleteLoading(true);

    const { error } = await supabase
      .from("forest_logs")
      .delete()
      .eq("id", log.id);

    if (error) {
      console.log(error);
      setDeleteLoading(false);
      return;
    }

    setDeleteLoading(false);
    setShowDeleteModal(false);
    onDeleted(log.id);
    onClose();
  };

  return (
    <>
      <motion.div
        className="forestLogModalOverlay"
        onClick={onClose}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="forestLogModalCard"
          onClick={(e) => e.stopPropagation()}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="forestLogModalHeader">
            <div>
              <h1>{log.title}</h1>

              <p className="meta">
                By {log.username || "Unknown"} • {log.category || "No Category"}
              </p>
            </div>

            <button className="modalCloseBtn" onClick={onClose} type="button">
              ✕
            </button>
          </div>

          <div className="forestLogModalBody">
            <div className="forestLogModalScroll">
              <div className="forestLogModalContent">{log.content}</div>
            </div>
          </div>

          <div className="logActions modalActions">
            <button className="backBtn" onClick={onClose} type="button">
              Back
            </button>

            {!authReady ? (
              <p style={{ color: "#cfcfcf", marginTop: "12px" }}>
                Checking permissions...
              </p>
            ) : isOwner ? (
              <>
                <button
                  className="editBtn"
                  onClick={() => onEdit(log)}
                  type="button"
                >
                  Edit
                </button>

                <button
                  className="deleteBtn"
                  onClick={() => setShowDeleteModal(true)}
                  type="button"
                >
                  Delete
                </button>
              </>
            ) : null}
          </div>
        </motion.div>
      </motion.div>

      {showDeleteModal && (
        <div
          className="deleteModalOverlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="deleteModal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Log?</h2>
            <p>This action cannot be undone.</p>

            <div className="deleteModalActions">
              <button
                className="cancelDeleteBtn"
                onClick={() => setShowDeleteModal(false)}
                type="button"
              >
                Cancel
              </button>

              <button
                className="confirmDeleteBtn"
                onClick={handleDelete}
                type="button"
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}