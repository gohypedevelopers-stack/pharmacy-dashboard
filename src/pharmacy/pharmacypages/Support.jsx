import React from "react";
import Sidebar from "../components/Sidebar.jsx";

const supportChannels = [
  { title: "Contact", info: "+91 79856 12345", description: "Call us 9am-9pm IST" },
  { title: "Help Center", info: "help@doorspital.com", description: "We usually respond within 4 hours" },
  { title: "WhatsApp", info: "+91 99856 54321", description: "Send us a WhatsApp to share screenshots" },
];

export default function Support() {
  return (
    <div className="min-h-screen bg-[#f4f8f7] text-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-3xl rounded-3xl bg-white p-6 shadow-lg">
            <h1 className="text-2xl font-semibold text-slate-900">Support</h1>
            <p className="mt-2 text-sm text-slate-500">
              We are here to help you manage your pharmacy smoothly.
            </p>

            <div className="mt-6 space-y-4">
              {supportChannels.map((channel) => (
                <div
                  key={channel.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                    <span>{channel.title}</span>
                    <span>{channel.info}</span>
                  </div>
                  <p className="text-xs text-slate-500">{channel.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-blue-700">
                Open support chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
