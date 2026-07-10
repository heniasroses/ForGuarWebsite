"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Props = {
  onClose: () => void;
  onLogCreated: (log: any) => void;
};

type Errors = {
  title: string;
  categoryId: string;
  content: string;
  form: string;
};

export default function CreateLogModal({ onClose, onLogCreated }: Props) {
  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [username, setUsername] = useState("Unknown");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Errors>({
    title: "",
    categoryId: "",
    content: "",
    form: "",
  });

  // GET USER + USERNAME
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        onClose();
        return;
      }

      setUser(data.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .single();

      if (profile?.username) {
        setUsername(profile.username);
      }
    };

    getUser();
  }, [onClose]);

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);

      const { data, error } = await supabase
        .from("forest_log_categories")
        .select("*");

      if (error) {
        console.log("CATEGORY ERROR:", error);
        setCategories([]);
      } else {
        setCategories(data || []);
      }

      setLoadingCategories(false);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!user) return;

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
      newErrors.categoryId = "Please select a category.";
      hasError = true;
    }

    if (!content.trim()) {
      newErrors.content = "Content cannot be empty.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("forest_logs")
      .insert({
        user_id: user.id,
        title,
        content,
        category_id: categoryId,
        is_approved: true,
        is_hidden: false,
      })
      .select("id, title, content")
      .single();

    if (error || !data) {
      console.log(error);
      setErrors((prev) => ({
        ...prev,
        form: "Failed to create log.",
      }));
      setLoading(false);
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);

    const formattedLog = {
      id: data.id,
      title: data.title,
      content: data.content,
      username: username,
      category: selectedCategory?.name || "Uncategorized",
    };

    onLogCreated(formattedLog);
    setLoading(false);
    onClose();
  };

  return (
    <div className="createLogOverlay" onClick={onClose}>
      <div className="createLogCard" onClick={(e) => e.stopPropagation()}>
        <h1>Create a Log</h1>

        {errors.form && <div className="formErrorBox">{errors.form}</div>}

        {/* TITLE */}
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

        {/* CATEGORY */}
        <div className="field">
          <label>Category</label>

          {loadingCategories ? (
            <p style={{ color: "#aaa" }}>Loading categories...</p>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* CONTENT */}
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

        {/* BUTTONS */}
        <div className="buttonColumn">
          <button className="cancelBtn" onClick={onClose} type="button">
            Cancel
          </button>

          <button
            className="submitBtn"
            onClick={handleSubmit}
            type="button"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}