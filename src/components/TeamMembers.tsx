"use client";

import { motion, type Variants } from "framer-motion";

export default function Team() {
  const members = [
    {
      name: "Leonabel Alcantara",
      roles: ["UI Designer", "Concept Artist"],
      image: "/img/leonabel.png",
    },
    {
      name: "Andrie Detera",
      roles: ["Game Designer", "Programmer"],
      image: "/img/andrie.png",
    },
    {
      name: "Angel Janica Fabregas",
      roles: ["3D Artist", "Animator"],
      image: "/img/angel.png",
    },
    {
      name: "Heniarose Crishia Guansing",
      roles: ["Project Leader", "Document Specialist"],
      image: "/img/crishia.png",
    },
  ];

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const card: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <div className="container-fluid Team-container">
      <motion.div
        className="row team-row"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {members.map((member, index) => (
          <motion.div
            key={index}
            className="col-xl-3 col-md-6 team-member"
            variants={card}
            whileHover={{ y: -6, scale: 1.02 }}
          >
            <img src={member.image} alt={member.name} className="team-image" />
            <h4>{member.name}</h4>
            <p className="team-roles">
              {member.roles.map((role, i) => (
                <span key={i}>{role}</span>
              ))}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}