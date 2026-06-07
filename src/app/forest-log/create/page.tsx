"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";

export default function CreateLogPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // GET USER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        // ❌ not logged in → redirect to login
        router.replace("/auth?message=login-required");
        return;
      }

      setUser(data.user);
    };

    getUser();
  }, [router]);

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);

      const { data, error } = await supabase
        .from("forest_log_categories")
        .select("*");

      if (error) {
        console.log("CATEGORY ERROR:", error);
      } else {
        setCategories(data || []);
      }

      setLoadingCategories(false);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      router.replace("/auth?message=login-required");
      return;
    }

    if (!title || !content || !categoryId) {
      alert("Please complete all fields.");
      return;
    }

    const { error } = await supabase.from("forest_logs").insert({
      user_id: user.id,
      title,
      content,
      category_id: categoryId,
      is_approved: true,
      is_hidden: false,
    });

    if (error) {
      console.log("INSERT ERROR:", error);
      alert("Failed to create log.");
      return;
    }

    router.push("/forest-log");
  };

  return (
    <div className="createLogPage">
      <div className="createLogBG">
        <div className="createLogCard">

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

            <button
              className="cancelBtn"
              onClick={() => router.push("/forest-log")}
            >
              Cancel
            </button>

            <button
              className="submitBtn"
              onClick={handleSubmit}
            >
              Submit
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}