"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type AlmanacEntry = {
  id: string;
  common_name: string;
  scientific_name: string;
  slug: string;
  habitat: string;
  population: string;
  conservation_status: string;
  description: string;
  image_url: string;
};

export default function Almanac() {
  const [entries, setEntries] = useState<AlmanacEntry[]>([]);
  const [selected, setSelected] = useState<AlmanacEntry | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("wildlife_entries")
        .select("*");

      if (error) {
        console.log("Almanac fetch error:", error);
        return;
      }

      setEntries(data || []);
      setSelected(data?.[0] || null);
    };

    fetchEntries();
  }, []);

  return (
    <div className="container-fluid wildlife-almanc">

      <div className="flex-row justify-content-center align-items-center">

        <h1 className="text-white wildlife">
          <strong>WILDLIFE ALMANAC</strong>
        </h1>

        {/* BOOK WRAPPER */}
        <div className="book-wrapper d-flex justify-content-center align-items-center book-div">

          {/* BOOK IMAGE (unchanged) */}
          <img
            className="img-fluid almanac"
            src="/img/Almanac.png"
            alt="Almanac"
          />

          {/* LEFT PAGE - PNG BUTTONS */}
          <div className="leftPageOverlay">

            {entries.map((entry) => (
              <button
                key={entry.id}
                className={`diamondBtn ${
                  selected?.id === entry.id ? "activeBtn" : ""
                }`}
                onClick={() => setSelected(entry)}
              >
                <img
                  src={entry.image_url}
                  alt={entry.common_name}
                  className="almanacBtnImg"
                />
              </button>
            ))}

          </div>

          {/* RIGHT PAGE - INFO */}
          <div className="rightPageOverlay">

            {selected && (
              <>
                <h2>{selected.common_name}</h2>

                <p>
                  <i>{selected.scientific_name}</i>
                </p>

                <p>{selected.description}</p>

                <p><b>Habitat:</b> {selected.habitat}</p>
                <p><b>Population:</b> {selected.population}</p>
                <p><b>Status:</b> {selected.conservation_status}</p>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}