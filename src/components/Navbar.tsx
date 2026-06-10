"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NavbarProfile from "@/components/NavbarProfile";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const renderLink = (href: string, label: string) => {
    const active = isActive(href);

    return (
      <Link className="nav-link d-flex align-items-center" href={href}>

        {/* ICON ONLY SHOWS IF ACTIVE */}
        {active && (
          <img
            src="/img/navbarIcon.png"
            alt="icon"
            style={{
              width: "18px",
              height: "18px",
              marginRight: "8px",
            }}
          />
        )}

        <span
          style={{
            color: active ? "#90FF67" : "white",
            fontWeight: active ? 700 : 400,
          }}
        >
          {label}
        </span>

      </Link>
    );
  };

  return (
    <nav
      className="navbar navbar-expand-md fixed-top bg-dark text-end"
      style={{ background: "rgb(255,255,255)" }}
    >
      <div className="container-fluid">

        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <img
            src="/img/LOGO.png"
            width="94"
            height="39"
            alt="Logo"
            style={{
              cursor: "pointer",
            }}
          />
        </Link>
        <button
          className="mobileMenuButton"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div
            className={`navbar-collapse-custom ${
              menuOpen ? "show-menu" : ""
            }`}
          >
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              {renderLink("/", "FOREST GUARDIANS")}
            </li>

            <li className="nav-item">
              {renderLink("/forest-log", "FOREST LOG")}
            </li>

            <li className="nav-item">
              {renderLink("/about-us", "ABOUT US")}
            </li>

            <li className="nav-item">
              {renderLink("/contact-us", "CONTACT US")}
            </li>

            <li className="nav-item d-flex align-items-center">
              <NavbarProfile />
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}