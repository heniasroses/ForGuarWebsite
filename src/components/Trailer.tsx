"use client";

import { motion, type Variants } from "framer-motion";

const wrapper: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const left: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const right: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const description: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function Trailer() {
  return (
    <motion.div
      className="container-fluid trailer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={wrapper}
    >
      <div className="trailer-wrapper">
        <motion.div className="video-box" variants={left}>
          <iframe
            className="aspect-ratio-16x9 w-100"
            allowFullScreen
            src="https://www.youtube.com/embed/4bH4rnDsIXo"
          />
        </motion.div>

        <motion.div className="text-box" variants={right}>
          <h1 className="text-center trailerText">
            <img
              className="img-fluid"
              width="54"
              height="54"
              src="/img/FORGAURLOGOGREEN 2.png"
              alt=""
            />
            <br />
            FOREST GUARDIANS TRAILER
            <br />
          </h1>

          <p className="text-center trailerParag">
            Humanity once relied on CuBot Incorporated’s AI-driven robots to
            harvest Sapsis, a rare bio-material found in trees that powered the
            machines.
          </p>
        </motion.div>
      </div>

      <motion.div className="trailerDescription" variants={description}>
        <p>
          Forest Guardians is a 3D educational action game that combines engaging gameplay with environmental advocacy. Designed to raise awareness about wildlife conservation and biodiversity, the game introduces players to nature-inspired characters, ecological concepts, and the importance of protecting the environment. By transforming learning into an interactive experience, Forest Guardians seeks to cultivate appreciation for wildlife and encourage positive attitudes toward conservation.
        </p>
      </motion.div>
    </motion.div>
  );
}