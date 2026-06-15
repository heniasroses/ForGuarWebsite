"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Props = {
  onClose: () => void;
  onLogCreated: (log: any) => void;
};

export default function CreateLogModal({ onClose, onLogCreated }: Props) {
  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [username, setUsername] = useState("Unknown");

  // GET USER (safe)
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        onClose();
        return;
      }

      setUser(data.user);
    };

    getUser();
  }, [onClose]);

  // FETCH CATEGORIES
  useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      onClose();
      return;
    }

    setUser(data.user);

    // ✅ GET USERNAME FROM PROFILES
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

    if (!title || !content || !categoryId) {
      alert("Please complete all fields.");
      return;
    }

    // ✅ SIMPLE INSERT ONLY (no joins, no second fetch)
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
      alert("Failed to create log.");
      return;
    }

    // find category name locally (SAFE)
    const selectedCategory = categories.find(
      (c) => c.id === categoryId
    );

    const formattedLog = {
      id: data.id,
      title: data.title,
      content: data.content,
      username: username,
      category: selectedCategory?.name || "Uncategorized",
    };

    onLogCreated(formattedLog);
    onClose();
  };

  return (
    <div className="createLogOverlay" onClick={onClose}>
      <div className="createLogCard" onClick={(e) => e.stopPropagation()}>

        <h1>Create a Log</h1>

        {/* TITLE */}
        <div className="field">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
        </div>

        {/* CATEGORY */}
        <div className="field">
          <label>Category</label>

          {loadingCategories ? (
            <p style={{ color: "#aaa" }}>Loading categories...</p>
          ) : (
            <div className="categoryRow">
              {categories.map((cat) => (
                <label key={cat.id}>
                  <input
                    type="radio"
                    name="category"
                    checked={categoryId === cat.id}
                    onChange={() => setCategoryId(cat.id)}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="field">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your log..."
          />
        </div>

        {/* BUTTONS */}
        <div className="buttonColumn">
          <button className="cancelBtn" onClick={onClose}>
            Cancel
          </button>

          <button className="submitBtn" onClick={handleSubmit}>
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}