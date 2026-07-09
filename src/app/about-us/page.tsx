"use client";

import { motion, type Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import AboutUs from "@/components/AboutUs";
import TrailerAboutUs from "@/components/TrailerAboutUs";
import Team from "@/components/TeamMembers";
import Footer from "@/components/Footer";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function AboutUsPage() {
  return (
    <>
      <Navbar />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <AboutUs />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <TrailerAboutUs />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeUp}
      >
        <Team />
      </motion.div>

      <Footer />
    </>
  );
}