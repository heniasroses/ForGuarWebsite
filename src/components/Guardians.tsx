"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { supabase } from "../../lib/supabase";
import GuardianModel from "../components/GuardianModel";

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    x: -30,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function Guardians() {
  const [index, setIndex] = useState(0);
  const [guardians, setGuardians] = useState<any[]>([]);

  useEffect(() => {
    const fetchGuardians = async () => {
      const { data, error } = await supabase.from("guardians").select("*");

      if (error) {
        console.log("GUARDIANS ERROR:", error);
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
    <motion.div
      className="container-fluid meetGuardians"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={titleVariants}
    >
      <h1 className="meet">
        <strong>MEET THE GUARDIANS</strong>
      </h1>

      <section className="carouselSection">
        <button className="nav-arrow nav-left" onClick={prev}>
          <img src="/img/arrow-left.png" alt="left" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={g.id ?? index}
            className="guardian-card"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="guardian-image">
              <img
                src={g.image_url || "/img/blankGuardian.png"}
                className="guardian-img"
                alt={g.name}
              />

              {g.model_url && (
                <div className="guardian-model-overlay">
                  <GuardianModel
                    url={g.model_url}
                    modelScale={
                      g.model_url.includes("MariWebsiteIDLE")
                        ? 1.2
                        : 2.2
                    }
                    modelOffset={
                      g.model_url.includes("MariWebsiteIDLE")
                        ? [0, -0.1, 0]
                        : [0, 0, 0]
                    }
                  />
                </div>
              )}
            </div>

            <div className="guardian-info">
              <h1 className="guardian-name">{g.name}</h1>

              <img className="line" src="/img/Line 1.png" alt="" />

              <h1 className="guardian-title">{g.title}</h1>

              <p className="guardian-specie">
                <strong>Species:</strong> {g.species_based_on}
              </p>

              <p className="guardian-abilities">
                <strong>Abilities:</strong> {g.abilities}
              </p>

              <p className="guardian-desc">
                <strong>Story: </strong>{g.story}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button className="nav-arrow nav-right" onClick={next}>
          <img src="/img/arrow-right.png" alt="right" />
        </button>
      </section>

      <div className="nav-bottom">
        <button onClick={prev}>
          <img src="/img/arrow-left.png" alt="left" />
        </button>

        <button onClick={next}>
          <img src="/img/arrow-right.png" alt="right" />
        </button>
      </div>
    </motion.div>
  );
}