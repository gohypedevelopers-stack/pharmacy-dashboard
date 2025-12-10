// src/pages/Benefits.jsx
// Benefits / partner growth page styled per provided references.
// Now includes Framer Motion animations and counting metrics.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import videoConsultVector from "../assets/video consult vector.png";
import prescriptionUploadVector from "../assets/priscription upload vector.png";
import calendarVector from "../assets/calender vector.png";
import nearbyVector from "../assets/nearby vector.png";
import easyStockSyncVector from "../assets/easy stock sync vector.png";
import directPaymentVector from "../assets/direct payment vector.png";
import noteDeckVector from "../assets/notedeckVector.png";
import arrowGrowthVector from "../assets/arrowgrowthvector.png";
import timeVector from "../assets/timevector.png";
import lockVector from "../assets/lockvector.png";

// ✅ doctor images for the hero bubbles
import benefitdoctor1 from "../assets/benefitdoctor1.png";
import benefitdoctor2 from "../assets/benefitdoctor2.png";
import benefitdoctor3 from "../assets/benefitdoctor3.png";
import benefitdoctor4 from "../assets/benefitdoctor4.png";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

// Small card that counts from 0 → target when it enters viewport
function StatCard({ value, suffix, label, index }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleViewportEnter = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    const duration = 1000; // ms
    const frames = 60;
    const stepTime = duration / frames;
    const increment = value / frames;

    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        clearInterval(interval);
        setDisplayValue(value);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, stepTime);
  };

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onViewportEnter={handleViewportEnter}
    >
      <span className="absolute left-0 top-0 block h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
      <div className="text-4xl font-extrabold text-blue-700">
        {displayValue}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-slate-600">{label}</div>
    </motion.div>
  );
}

export default function Benefits() {
  return (
    <div className="bg-white">
      {/* ========== HERO ========== */}
      <motion.section
        className="w-full bg-gradient-to-b from-[#bfcff5] via-[#d6e2ff] to-[#f4f7ff] py-16 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.7 }}
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <motion.h1
            className="text-4xl font-extrabold leading-[46px] text-slate-900 sm:text-5xl sm:leading-[56px]"
            variants={fadeUp}
            transition={{ duration: 0.7 }}
          >
            Grow Your Clinic &amp; Pharmacy
            <br />
            with Smart Digital Tools
          </motion.h1>

          <motion.p
            className="text-base leading-7 text-slate-600 sm:text-lg"
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Join India’s fastest healthcare partner network. Manage appointments,
            accept medicine orders, and boost your earnings — all from one
            dashboard.
          </motion.p>

          <motion.div
            className="pt-2"
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Link
              to="/register"
              className="inline-flex rounded-full bg-gradient-to-r from-blue-700 to-emerald-500 px-8 py-3 text-base font-semibold text-white shadow-lg"
            >
              Join as a Partner
            </Link>
          </motion.div>

          <motion.p
            className="text-xs text-slate-500"
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            No credit card required • Free registration
          </motion.p>

          {/* 👇 Doctor images instead of initials bubbles */}
          <motion.div
            className="mt-4 flex justify-center"
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <div className="flex items-center">
              {[
                { src: benefitdoctor1, alt: "Doctor 1" },
                { src: benefitdoctor2, alt: "Doctor 2" },
                { src: benefitdoctor3, alt: "Doctor 3" },
                { src: benefitdoctor4, alt: "Doctor 4" },
              ].map((doc, index) => (
                <div
                  key={doc.alt}
                  className={`relative h-24 w-24 rounded-full border-[1px] border-white bg-white/80 overflow-hidden shadow-md ${
                    index !== 3 ? "-mr-6" : ""
                  }`}
                >
                  <img
                    src={doc.src}
                    alt={doc.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.p
            className="flex items-center justify-center gap-2 text-xs text-slate-600"
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <span className="text-amber-500 text-base">★</span>
            4.9 | Trusted by 20,000+ Doctors &amp; Medical Stores
          </motion.p>
        </div>
      </motion.section>

      {/* ========== WHY PARTNER ========== */}
      <section className="w-full py-14 bg-[#F8F9FB]">
        <motion.div
          className="space-y-2 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-extrabold text-slate-900">
            Why Partner with Doorspital?
          </h2>
          <p className="text-base text-slate-600">
            We help you focus on care — while we handle the rest.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            {
              title: "Zero Commission for Starters",
              desc: "Keep 100% of your earnings during our introductory period.",
              icon: noteDeckVector,
            },
            {
              title: "Earn More Opportunities",
              desc: "Expand your patient base and reach new customers in your area.",
              icon: arrowGrowthVector,
            },
            {
              title: "Smart Time Management",
              desc: "Organize your schedule with smart calendar tools.",
              icon: timeVector,
            },
            {
              title: "Secure & Transparent Payments",
              desc: "Receive timely payments directly to your account.",
              icon: lockVector,
            },
          ].map((card, index) => (
            <motion.div
              key={card.title}
              className="rounded-[18px] border border-slate-200 bg-white px-7 py-6 text-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
            >
              <div className="mb-3">
                <img src={card.icon} alt="" className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-slate-600">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== DESIGNED FOR PARTNERS ========== */}
      <motion.section
        className="w-full py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={fadeUp}
        transition={{ duration: 0.7 }}
      >
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Designed for Every Healthcare Partner
          </h2>
        </div>
        <div className="mt-8 grid gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-2">
          {/* For Doctors */}
          <motion.div
            className="border-b border-slate-200 px-8 py-8 text-left md:border-b-0 md:border-r"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-lg font-semibold text-blue-700">For Doctors</h3>
            <ul className="mt-5 space-y-4 text-sm text-slate-600">
              {[
                {
                  label:
                    "Video Consult: Connect with patients securely and conveniently from anywhere.",
                  icon: videoConsultVector,
                },
                {
                  label:
                    "Prescription Upload: Easily upload and manage digital prescriptions for your patients.",
                  icon: prescriptionUploadVector,
                },
                {
                  label:
                    "Smart Calendar: Manage your appointments and availability with an intelligent, integrated calendar.",
                  icon: calendarVector,
                },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <img src={item.icon} alt="" className="mt-0.5 h-5 w-5" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* For Pharmacy */}
          <motion.div
            className="px-8 py-8 text-left"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-lg font-semibold text-emerald-600">
              For Pharmacy
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-slate-600">
              {[
                {
                  label:
                    "Nearby Orders: Receive prescription orders from patients in your local area to boost sales.",
                  icon: nearbyVector,
                },
                {
                  label:
                    "Easy Stock Sync: Manage your inventory effortlessly and keep your product listings up-to-date.",
                  icon: easyStockSyncVector,
                },
                {
                  label:
                    "Direct Payments: Get paid quickly and directly for every order fulfilled through the platform.",
                  icon: directPaymentVector,
                },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <img src={item.icon} alt="" className="mt-0.5 h-5 w-5" />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== METRICS STRIP (with counting numbers) ========== */}
      <section className="w-full pb-12 pt-4">
        <motion.h2
          className="mb-6 text-center text-3xl font-extrabold text-slate-900"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          More Growth, Less Hassle
        </motion.h2>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { value: 0, suffix: "%", label: "Commission (Trial Period)" },
            { value: 25, suffix: "%", label: "More Monthly Income" },
            { value: 1000, suffix: "+", label: "Verified Partner Network" },
            { value: 24, suffix: "x7", label: "Support Team" },
          ].map((stat, index) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* ========== CTA ========== */}
      <motion.section
        className="w-full rounded-[24px] overflow-hidden bg-gradient-to-r from-blue-700 to-emerald-500"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
      >
        <div className="w-full py-12 text-center text-white">
          <h2 className="text-3xl font-extrabold leading-tight">
            Start Growing Your Healthcare Business
            <br />
            with Doorspital Today!
          </h2>
          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className="rounded-lg bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-sm"
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
