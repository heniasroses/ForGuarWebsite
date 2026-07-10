"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { supabase } from "../../lib/supabase";

type Log = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category_id: string;
};

type Category = {
  id: string;
  name: string;
};

type Props = {
  logId: string;
  onClose: () => void;
  onUpdated: (updatedLog: {
    id: string;
    title: string;
    content: string;
    category: string;
  }) => void;
};

type Errors = {
  title: string;
  categoryId: string;
  content: string;
  form: string;
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
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
    transition: { duration: 0.15 },
  },
};

export default function EditLogModal({ logId, onClose, onUpdated }: Props) {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errors, setErrors] = useState<Errors>({
    title: "",
    categoryId: "",
    content: "",
    form: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("forest_logs")
        .select("*")
        .eq("id", logId)
        .single();

      if (error || !data) {
        setErrors((prev) => ({
          ...prev,
          form: "Log not found.",
        }));
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || data.user_id !== user.id) {
        setErrors((prev) => ({
          ...prev,
          form: "You can only edit your own logs.",
        }));
        setLoading(false);
        return;
      }

      setTitle(data.title || "");
      setContent(data.content || "");
      setCategoryId(data.category_id || "");
      setLoading(false);
    };

    fetchLog();
  }, [logId]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("forest_log_categories")
        .select("*")
        .order("name");

      if (!error) {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, []);

  const handleUpdate = async () => {
    const newErrors: Errors = {
      title: "",
      categoryId: "",
      content: "",
      form: "",
    };

    let hasError = false;

    if (!title.trim()) {
      newErrors.title = "Title is required.";
      hasError = true;
    }

    if (!categoryId) {
      newErrors.categoryId = "Please choose a category.";
      hasError = true;
    }

    if (!content.trim()) {
      newErrors.content = "Content cannot be empty.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setSaving(true);

    const { error } = await supabase
      .from("forest_logs")
      .update({
        title,
        content,
        category_id: categoryId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", logId);

    if (error) {
      console.log(error);
      setErrors((prev) => ({
        ...prev,
        form: "Update failed.",
      }));
      setSaving(false);
      return;
    }

    const selectedCategory = categories.find((cat) => cat.id === categoryId);

    onUpdated({
      id: logId,
      title,
      content,
      category: selectedCategory?.name || "Uncategorized",
    });

    setSaving(false);
    onClose();
  };

  if (loading) {
    return (
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
          <p style={{ color: "white" }}>Loading...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="forestLogModalOverlay"
      onClick={onClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="forestLogModalCard editLogModalCard"
        onClick={(e) => e.stopPropagation()}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="forestLogModalHeader">
          <div>
            <h1>Edit Log</h1>
          </div>

          <button className="modalCloseBtn" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        {errors.form && <div className="formErrorBox">{errors.form}</div>}

        <div className="forestLogModalBody">
          <div className="forestLogModalScroll">
            <div className="field">
              <label>Title</label>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: "" }));
                  }
                }}
                placeholder="Enter title"
                className={errors.title ? "inputError" : ""}
              />
              {errors.title && <span className="errorText">{errors.title}</span>}
            </div>

            <div className="field">
              <label>Category</label>
              <div className="categoryRow">
                {categories.map((cat) => (
                  <label key={cat.id}>
                    <input
                      type="radio"
                      name="category"
                      checked={categoryId === cat.id}
                      onChange={() => {
                        setCategoryId(cat.id);
                        if (errors.categoryId) {
                          setErrors((prev) => ({ ...prev, categoryId: "" }));
                        }
                      }}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
              {errors.categoryId && (
                <span className="errorText">{errors.categoryId}</span>
              )}
            </div>

            <div className="field">
              <label>Content</label>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errors.content) {
                    setErrors((prev) => ({ ...prev, content: "" }));
                  }
                }}
                placeholder="Write your log..."
                className={errors.content ? "inputError" : ""}
              />
              {errors.content && <span className="errorText">{errors.content}</span>}
            </div>
          </div>
        </div>

        <div className="logActions modalActions">
          <button className="backBtn" onClick={onClose} type="button">
            Cancel
          </button>

          <button
            className="submitBtn"
            onClick={handleUpdate}
            type="button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}