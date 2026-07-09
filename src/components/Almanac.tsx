"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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
  mainImage_url: string;
};

const detailVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
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

  if (!selected) {
    return (
      <div className="container-fluid wildlife-almanc">
        <h1 className="text-white wildlife">
          <strong>WILDLIFE ALMANAC</strong>
        </h1>
        <p style={{ color: "white" }}>Loading entries...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid wildlife-almanc">
      <div className="flex-row justify-content-center align-items-center">
        <motion.h1
          className="text-white wildlife"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={titleVariants}
        >
          <strong>WILDLIFE ALMANAC</strong>
        </motion.h1>

        <div className="book-wrapper d-flex justify-content-center align-items-center book-div">
          <img
            className="img-fluid almanac"
            src="/img/Almanac.png"
            alt="Almanac"
          />

          <div className="leftPageOverlay">
            <div className="row2">
              {entries.slice(0, 2).map((entry) => (
                <motion.button
                  key={entry.id}
                  className={`diamondBtn ${
                    selected.id === entry.id ? "activeBtn" : ""
                  }`}
                  onClick={() => setSelected(entry)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <img
                    src={entry.image_url}
                    alt={entry.common_name}
                    className="almanacBtnImg"
                  />
                </motion.button>
              ))}
            </div>

            <div className="row4">
              {entries.slice(2, 6).map((entry) => (
                <motion.button
                  key={entry.id}
                  className={`diamondBtn ${
                    selected.id === entry.id ? "activeBtn" : ""
                  }`}
                  onClick={() => setSelected(entry)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <img
                    src={entry.image_url}
                    alt={entry.common_name}
                    className="almanacBtnImg"
                  />
                </motion.button>
              ))}
            </div>

            <div className="row3">
              {entries.slice(6, 9).map((entry) => (
                <motion.button
                  key={entry.id}
                  className={`diamondBtn ${
                    selected.id === entry.id ? "activeBtn" : ""
                  }`}
                  onClick={() => setSelected(entry)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <img
                    src={entry.image_url}
                    alt={entry.common_name}
                    className="almanacBtnImg"
                  />
                </motion.button>
              ))}
            </div>

            <div className="row4">
              {entries.slice(9, 13).map((entry) => (
                <motion.button
                  key={entry.id}
                  className={`diamondBtn ${
                    selected.id === entry.id ? "activeBtn" : ""
                  }`}
                  onClick={() => setSelected(entry)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <img
                    src={entry.image_url}
                    alt={entry.common_name}
                    className="almanacBtnImg"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              className="rightPageOverlay"
              variants={detailVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {selected.mainImage_url && (
                <img
                  src={selected.mainImage_url}
                  alt={selected.common_name}
                  className="animalMainImage mobileOnlyImage"
                />
              )}

              <h2>{selected.common_name}</h2>

              <p>
                <i>{selected.scientific_name}</i>
              </p>

              <div className="animalStats">
                <p>
                  <b>Habitat:</b> {selected.habitat}
                </p>
                <p>
                  <b>Population:</b> {selected.population}
                </p>
                <p>
                  <b>Status:</b> {selected.conservation_status}
                </p>
              </div>

              <p className="description">{selected.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}