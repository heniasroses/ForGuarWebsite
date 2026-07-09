"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.15,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const button: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function Hero() {
  return (
    <motion.div
      className="play4freeSection"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <div className="LandingScreen">
        <motion.div className="logo-wrapper" variants={item}>
          <img
            src="/img/ForGuarLogo.png"
            className="heroLogo"
            alt="Forest Guardians"
          />
        </motion.div>

        <motion.p className="heroSubtitle" variants={item}>
          Forest Guardians is a 3D wave-based action-defense game where you play as a mystical animal Guardian to defend the
          Panoharra Tree from waves of cute, but destructive robots.
        </motion.p>

        <motion.a
          href="https://drive.google.com/uc?export=download&id=1iM3DU02rxqgy3aQ-byNRwbFuXPJKFHcI"
          className="btn play-btn"
          variants={button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>PLAY FOR FREE</span>
        </motion.a>
      </div>
    </motion.div>
  );
}