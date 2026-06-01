"use client";

import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const router = useRouter();

  return (
    <nav
      className="navbar navbar-expand-md fixed-top"
      style={{ background: "#213D22" }}
    >
      <div className="container-fluid">

        {/* LEFT SIDE (optional logo) */}
        <img
            src="/img/AdminNav.png"
            alt="Logo"
            style={{
            height: "40px",
            width: "auto",
            objectFit: "contain",
            }}
        />

        {/* RIGHT SIDE */}
        <div className="ms-auto d-flex align-items-center">

          <button
            onClick={() => {
              localStorage.removeItem("user");
              router.push("/auth");
            }}
            style={{
              background: "#213D22",
              color: "white",
              border: "1px solid white",
              padding: "8px 18px",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}