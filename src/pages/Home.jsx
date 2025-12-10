// src/pages/Home.jsx
// "About Doorspital Partner Network" home / doctor & pharmacy page.

import React from "react";
import { motion } from "framer-motion";

import doctorHero from "../assets/doctor.jpg";
import diagramImg from "../assets/diagram.png";
import homePhone from "../assets/homephone.png";
import rocketVector from "../assets/rocketVector.png";
import rupeeVector from "../assets/rupeeVector.png";
import signalVector from "../assets/signalVector.png";
import teamVector from "../assets/teamVector.png";
import penVector from "../assets/penVector.png";
import phonebookVector from "../assets/phonebookvector.png";
import tickVector from "../assets/tickvector.png";

// Generic fade-up (bottom → top)
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

// Hero-specific variants
const heroSectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const heroTextItem = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function Home({ onDoctorJoinClick, onPharmacyJoinClick }) {
  const handleDoctorJoin = onDoctorJoinClick ?? (() => {});
  const handlePharmacyJoin = onPharmacyJoinClick ?? (() => {});

  return (
    <div className="bg-white">
      {/* ========== HERO: About Doorspital Partner Network ========== */}
      <motion.section
        className="flex w-full flex-col gap-10 py-16 lg:flex-row lg:items-center lg:gap-16"
        variants={heroSectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left text area – all items animate from bottom to top */}
        <div className="max-w-2xl space-y-6">
          <motion.h1
            className="poppins-bold text-[52px] leading-[58px] tracking-[-1.4px] text-slate-900"
            variants={heroTextItem}
          >
            About Doorspital Partner
            <br />
            Network
          </motion.h1>

          <motion.p
            className="text-lg text-slate-600"
            variants={heroTextItem}
          >
            Connecting Doctors and Medical Shopkeepers for a seamless healthcare
            experience.
          </motion.p>

          {/* Call-to-action buttons */}
          <motion.div
            className="flex flex-wrap gap-4 pt-2"
            variants={heroTextItem}
          >
            <button
              type="button"
              onClick={handleDoctorJoin}
              className="rounded-full bg-blue-700 px-7 py-3 text-base font-semibold text-white shadow hover:bg-blue-800"
            >
              Join as Doctor
            </button>
            <button
              type="button"
              onClick={handlePharmacyJoin}
              className="rounded-full border-2 border-emerald-500 px-7 py-3 text-base font-semibold text-emerald-600 hover:bg-emerald-50"
            >
              Join as Medical Shop
            </button>
          </motion.div>
        </div>

        {/* Right doctor illustration – slides in from right to left */}
        <div className="relative flex flex-1 justify-center lg:justify-end">
          <div className="absolute inset-0 -z-10 rounded-[36px] bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.14)_0%,_rgba(255,255,255,0)_60%)]" />
          <motion.img
            src={doctorHero}
            alt="Doctor holding a tablet"
            className="relative z-10 max-h-[660px] object-contain"
            initial={{ opacity: 0, x: 140, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </motion.section>

      {/* ========== WHAT IS DOORSPITAL PARTNER PLATFORM ========== */}
      <motion.section
        className="w-full py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeUp}
        transition={{ duration: 0.7 }}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* LEFT: image slides in from LEFT → RIGHT */}
          <motion.div
            className="flex justify-center lg:justify-start"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <img
              src={diagramImg}
              alt="Healthcare workflow diagram"
              className="w-full max-w-[620px] rounded-[32px] shadow-lg"
            />
          </motion.div>

          {/* RIGHT: title + text + button slide in from RIGHT → LEFT */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            <h2 className="poppins-bold text-4xl leading-[44px] text-slate-900">
              What is Doorspital
              <br />
              Partner Platform?
            </h2>
            <p className="text-lg leading-[30px] text-slate-600">
              Our platform is a dedicated ecosystem designed to bridge the gap
              between healthcare professionals and pharmacies. We empower
              doctors to manage patient prescriptions digitally and connect them
              with a network of trusted medical shops, ensuring patients get
              timely and efficient access to their medications.
            </p>
            <button className="mt-6 inline-flex rounded-full bg-blue-700 px-7 py-3 text-base font-semibold text-white shadow hover:bg-blue-800">
              Know More
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== HOW TO CONNECT WITH DOORSPITAL ========== */}
      <section className="w-full bg-white pt-16 pb-20 flex flex-col items-center">
        <motion.h2
          className="mb-12 text-center text-3xl font-extrabold text-slate-900 sm:text-[32px] leading-[38px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          How to Connect
          <br className="hidden sm:block" />
          with Doorspital
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-3 justify-items-center w-full">
          {[
            {
              title: "Register",
              desc: "Create your professional profile in minutes.",
              icon: penVector,
            },
            {
              title: "Get Verified",
              desc: "Complete our simple and secure verification process.",
              icon: phonebookVector,
            },
            {
              title: "Start Prescribing",
              desc: "Begin sending digital prescriptions to patients and shops.",
              icon: tickVector,
            },
          ].map((card, index) => (
            <motion.div
              key={card.title}
              className="w-full max-w-[360px] min-h-[220px] rounded-[18px] border border-slate-300 bg-white px-9 py-10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="text-blue-700">
                <img src={card.icon} alt="" className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== APP PROMO ========== */}
      <motion.section
        className="w-full bg-slate-50 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeUp}
        transition={{ duration: 0.7 }}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div
            className="space-y-5"
            variants={fadeUp}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl font-extrabold leading-[38px] text-slate-900">
              Connect Easily with the
              <br />
              Doorspital App
            </h2>
            <p className="text-base leading-7 text-slate-600">
              Manage everything from the palm of your hand. Our dedicated
              partner app allows you to handle prescriptions, communicate with
              patients, and track your business performance on the go.
            </p>
            <div className="mt-2 flex flex-wrap gap-4">
              <button className="rounded-full bg-blue-700 px-6 py-3 text-base font-semibold text-white shadow hover:bg-blue-800">
                Download App
              </button>
              <button className="rounded-full border-2 border-emerald-500 px-6 py-3 text-base font-semibold text-emerald-600 hover:bg-emerald-50">
                Learn More
              </button>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="rounded-[28px] bg-[#f3e6dc] p-6 shadow-lg">
              <img
                src={homePhone}
                alt="Doorspital app on phone"
                className="max-h-[360px] object-contain"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== WHY BECOME A DOORSPITAL PARTNER ========== */}
      <section className="w-full bg-white py-20">
        <motion.h2
          className="mb-12 text-center text-3xl font-extrabold text-slate-900"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          Why Become a Doorspital Partner?
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-4">
          {[
            {
              title: "Fast Digital Onboarding",
              desc: "Get started quickly with our streamlined setup.",
              icon: rocketVector,
            },
            {
              title: "Zero Hidden Charges",
              desc: "Transparent pricing with no surprise fees.",
              icon: rupeeVector,
            },
            {
              title: "Track Earnings",
              desc: "Monitor your earnings with a real-time dashboard.",
              icon: signalVector,
            },
            {
              title: "Reach More Patients",
              desc: "Expand your reach through our growing network.",
              icon: teamVector,
            },
          ].map((card, index) => (
            <motion.div
              key={card.title}
              className="flex h-full flex-col justify-start rounded-[22px] border border-slate-300 bg-white px-8 py-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="text-emerald-600">
                <img src={card.icon} alt="" className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-900">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== CTA ========== */}
      <motion.section
        className="w-full bg-gradient-to-r from-blue-700 to-emerald-500"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
      >
        <div className="w-full py-10 text-center text-white">
          <h2 className="text-2xl font-semibold">
            Join the Doorspital Partner Network Today
          </h2>
          <p className="mt-3 text-sm text-blue-100">
            Become part of the future of healthcare. Start connecting with
            patients and partners now.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={handleDoctorJoin}
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-blue-700"
            >
              Register as Doctor
            </button>
            <button
              type="button"
              onClick={handlePharmacyJoin}
              className="rounded-full border border-white px-5 py-2 text-sm font-semibold text-white"
            >
              Register as Medical Shop
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
