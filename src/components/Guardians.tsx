"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";

export default function Guardians() {
  const [index, setIndex] = useState(0);
  const [guardians, setGuardians] = useState<any[]>([]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchGuardians = async () => {
      const { data, error } = await supabase.from("guardians").select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);

      setGuardians(data || []);
    };

    fetchGuardians();
  }, []);

  const next = () => {
    setIndex((prev) => (prev + 1) % guardians.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + guardians.length) % guardians.length);
  };

  // SWIPE LOGIC
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;

    // threshold (ignore small swipes)
    if (diff > 50) {
      next(); // swipe left
    } else if (diff < -50) {
      prev(); // swipe right
    }
  };

  if (guardians.length === 0) {
    return <p style={{ color: "white" }}>Loading guardians...</p>;
  }

  const g = guardians[index];

  return (
    <div className="container-fluid meetGuardians">
      <h1 className="text-white meet">
        <strong>MEET THE GUARDIANS</strong>
      </h1>

      <section className="carouselSection">

        {/* LEFT ARROW (desktop only via CSS) */}
        <button className="nav-btn left" onClick={prev}>
          <img src="/img/arrow-left.png" />
        </button>

        {/* CARD (SWIPE AREA) */}
        <div
          key={index}
          className="guardian-card animate-card"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="guardian-image">
            <img
              src={g.image_url || "/img/blankGuardian.png"}
              className="img-fluid guardian-img"
              alt="guardian"
            />
          </div>

          <div className="guardian-info">
            <h1 className="guardian-name">{g.name}</h1>

            <img className="line" src="/img/Line 1.png" />

            <h1 className="guardian-title">{g.title}</h1>

            <p className="guardian-specie">
              Species: {g.species_based_on}
            </p>

            <p className="guardian-desc">{g.story}</p>
          </div>
        </div>

        {/* RIGHT ARROW (desktop only via CSS) */}
        <button className="nav-btn right" onClick={next}>
          <img src="/img/arrow-right.png" />
        </button>

      </section>
    </div>
  );
}