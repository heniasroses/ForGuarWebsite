"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    // FULL RESET (important fix)
    await supabase.auth.getSession();

    router.replace("/");
    router.refresh();
  };

  return (
    <nav
      className="navbar navbar-expand-md fixed-top"
      style={{ background: "#213D22" }}
    >
      <div className="container-fluid">
        <img
          src="/img/AdminNav.png"
          style={{ height: "40px" }}
        />

        <div className="ms-auto">
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "8px 16px",
              borderRadius: "20px",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}