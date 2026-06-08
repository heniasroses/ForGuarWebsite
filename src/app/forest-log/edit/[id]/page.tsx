"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";

export default function EditLogPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // GET USER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);

  // LOAD LOG
  useEffect(() => {
    const fetchLog = async () => {
      const { data, error } = await supabase
        .from("forest_logs")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        alert("Log not found.");
        router.push("/forest-log");
        return;
      }

      // OWNER CHECK
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || data.user_id !== user.id) {
        alert("You can only edit your own logs.");
        router.push(`/forest-log/${id}`);
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setCategoryId(data.category_id);

      setLoading(false);
    };

    if (id) {
      fetchLog();
    }
  }, [id, router]);

  // LOAD CATEGORIES
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
    if (!title || !content || !categoryId) {
      alert("Please complete all fields.");
      return;
    }

    const { error } = await supabase
      .from("forest_logs")
      .update({
        title,
        content,
        category_id: categoryId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      alert("Update failed.");
      return;
    }
    
    router.push(`/forest-log/${id}`);
  };

  if (loading) {
    return (
      <div className="createLogPage">
        <div className="createLogBG">
          <p style={{ color: "white" }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="createLogPage">
      <div className="createLogBG">

        <div className="createLogCard">

          <h1>Edit Log</h1>

          {/* TITLE */}
          <div className="field">
            <label>Title</label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter title"
            />
          </div>

          {/* CATEGORY */}
          <div className="field">
            <label>Category</label>

            <div className="categoryRow">

              {categories.map((cat) => (
                <label key={cat.id}>

                  <input
                    type="radio"
                    name="category"
                    checked={
                      categoryId === cat.id
                    }
                    onChange={() =>
                      setCategoryId(cat.id)
                    }
                  />

                  {cat.name}

                </label>
              ))}

            </div>
          </div>

          {/* CONTENT */}
          <div className="field">
            <label>Content</label>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Write your log..."
            />
          </div>

          {/* BUTTONS */}
          <div className="buttonColumn">

            <button
              className="cancelBtn"
              onClick={() =>
                router.push(
                  `/forest-log/${id}`
                )
              }
            >
              Cancel
            </button>

            <button
              className="submitBtn"
              onClick={handleUpdate}
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}