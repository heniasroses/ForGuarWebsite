"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Guardians() {
  const [index, setIndex] = useState(0);
  const [guardians, setGuardians] = useState<any[]>([]);

  useEffect(() => {
    const fetchGuardians = async () => {
      const { data, error } = await supabase.from("guardians").select("*");

      if (error) {
        console.log(error);
        return;
      }

      setGuardians(data || []);
    };

    fetchGuardians();
  }, []);

  const next = () => {
    if (!guardians.length) return;
    setIndex((prev) => (prev + 1) % guardians.length);
  };

  const prev = () => {
    if (!guardians.length) return;
    setIndex((prev) => (prev - 1 + guardians.length) % guardians.length);
  };

  if (!guardians.length) {
    return <p style={{ color: "white" }}>Loading guardians...</p>;
  }

  const g = guardians[index];

  return (
    <div className="container-fluid meetGuardians">

      <h1 className="meet">
        <strong>MEET THE GUARDIANS</strong>
      </h1>

      <section className="carouselSection">

        {/* LEFT ARROW (desktop only via CSS) */}
        <button className="nav-arrow nav-left" onClick={prev}>
          <img src="/img/arrow-left.png" alt="left" />
        </button>

        {/* CARD */}
        <div className="guardian-card">

          <div className="guardian-image">
            <img
              src={g.image_url || "/img/blankGuardian.png"}
              className="guardian-img"
              alt="guardian"
            />
          </div>

          <div className="guardian-info">
            <h1 className="guardian-name">{g.name}</h1>
            <img className="line" src="/img/Line 1.png" />
            <h1 className="guardian-title">{g.title}</h1>
            <p className="guardian-specie">
              Specie: {g.species_based_on}
            </p>
            <p className="guardian-desc">{g.story}</p>
          </div>

        </div>

        {/* RIGHT ARROW (desktop only via CSS) */}
        <button className="nav-arrow nav-right" onClick={next}>
          <img src="/img/arrow-right.png" alt="right" />
        </button>

      </section>

      {/* BOTTOM ARROWS (mobile only via CSS) */}
      <div className="nav-bottom">
        <button onClick={prev}>
          <img src="/img/arrow-left.png" alt="left" />
        </button>

        <button onClick={next}>
          <img src="/img/arrow-right.png" alt="right" />
        </button>
      </div>

    </div>
  );
}