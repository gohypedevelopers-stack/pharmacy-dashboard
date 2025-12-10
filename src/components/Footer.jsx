// src/components/Footer.jsx
// Footer styled to match the provided design (Poppins) + animation from bottom to top.

import React from "react";
import { motion } from "framer-motion";
import icon from "../assets/icon.png";

export default function Footer() {
  return (
    <motion.footer
      className="border-t border-slate-100 bg-white mt-12 mb-12"
      initial={{ opacity: 0, y: 40 }}              // start lower + invisible
      whileInView={{ opacity: 1, y: 0 }}           // move up into place
      viewport={{ once: true, amount: 0.2 }}       // trigger when ~20% in view
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-10">
        {/* Top row: brand + 4 columns */}
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand / summary */}
          <div className="space-y-4 md:col-span-3">
            <div className="flex items-center gap-3">
              {/* ✅ keep icon position */}
              <img
                src={icon}
                className="h-9 w-9 object-contain"
                alt="Doorspital logo"
              />
              <span className="text-base font-semibold text-slate-900">
                Doorspital Partner
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Connecting Doctors, Medical Shops &amp; Patients.
            </p>
            <p className="text-xs text-slate-400">
              © 2024 DoOrSPital. All rights reserved.
            </p>

            {/* Social icons */}
            <div className="mt-2 flex gap-3">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                @
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                📷
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                👤
              </button>
            </div>
          </div>

          {/* About */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">About</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>About Us</li>
              <li>Benefits</li>
              <li>Testimonials</li>
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Contact</li>
              <li>Help Center</li>
              <li>FAQs</li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Privacy Policy</li>
              <li>Terms &amp; Conditions</li>
              <li>Cookie Policy</li>
            </ul>
          </div>

          {/* Stay Updated */}
          <div className="space-y-3 md:col-span-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Stay Updated
            </h3>
            <p className="text-sm text-slate-600">
              Get the latest news and updates from our network.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none ring-blue-500 placeholder:text-slate-400 focus:ring-2 sm:w-72"
              />
              <button className="h-10 rounded-md bg-gradient-to-r from-blue-600 to-emerald-500 px-5 text-sm font-semibold text-white hover:opacity-90">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
