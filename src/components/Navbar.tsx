"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-md fixed-top bg-dark text-end"
      style={{ background: "rgb(255,255,255)" }}
    >
      <div className="container-fluid">
        <img src="/img/LOGO.png" width="94" height="39" alt="Logo" />

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navcol-1"
        >
          <span className="visually-hidden">Toggle navigation</span>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navcol-1">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link
                className="nav-link active d-flex align-items-center"
                href="/"
              >
                <img
                  src="/img/navbarIcon.png"
                  alt="icon"
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "8px",
                  }}
                />
                FOREST GUARDIANS
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center"
                href="/forest-log"
              >
                FOREST LOG
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center"
                href="/about-us"
              >
                ABOUT US
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center"
                href="/contact-us"
              >
                CONTACT US
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center"
                href="/auth"
              >
                PROFILE
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}