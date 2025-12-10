// src/pages/EarningsOverview.jsx
import React from "react";
import Sidebar from "../../pharmacy/components/Sidebar.jsx";

import bellicon from "../../pharmacy/assets/bellicon.png";
import pharmacyProfile from "../../pharmacy/assets/pharmacyprofile.png";

const categoryRows = [
  {
    category: "Prescription Drugs",
    orders: "1,250",
    revenue: "$25,320.50",
    share: "59.5%",
  },
  {
    category: "Over-the-Counter",
    orders: "890",
    revenue: "$10,150.00",
    share: "23.8%",
  },
  {
    category: "Vitamins & Supplements",
    orders: "620",
    revenue: "$5,109.50",
    share: "12.0%",
  },
  {
    category: "Personal Care",
    orders: "315",
    revenue: "$2,000.00",
    share: "4.7%",
  },
];

function EarningsOverview() {
  return (
    <div className="min-h-screen bg-[#f4f8f7] text-slate-900">
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-100 bg-white px-10 py-5">
            <div>
              <h1 className="text-[20px] font-semibold text-slate-900">
                Earnings Overview
              </h1>
              <p className="mt-1 text-[12px] text-slate-500">
                Review your pharmacy&apos;s financial performance.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 rounded-xl bg-[#00b074] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_12px_30px_rgba(0,176,116,0.45)] hover:bg-[#049662]">
                <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-white/10 text-sm">
                  ⬇
                </span>
                <span>Export Report</span>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <img
                    src={bellicon}
                    alt="Notifications"
                    
                  />
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe9d6]">
                  <img
                    src={pharmacyProfile}
                    alt="Profile"
                    
                  />
                </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-[#f4f8f7] px-10 py-7 space-y-6">
            {/* Top metric cards */}
            <section className="grid grid-cols-4 gap-5">
              {/* Total revenue */}
              <div className="rounded-xl bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                <div className="text-[12px] font-medium text-slate-500">
                  Total Revenue
                </div>
                <div className="mt-3 text-3xl font-semibold text-slate-900">
                  $42,580
                </div>
                <div className="mt-2 text-[12px] font-semibold text-[#00b074]">
                  +5.2%
                </div>
              </div>

              {/* Net profit */}
              <div className="rounded-xl bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                <div className="text-[12px] font-medium text-slate-500">
                  Net Profit
                </div>
                <div className="mt-3 text-3xl font-semibold text-slate-900">
                  $15,230
                </div>
                <div className="mt-2 text-[12px] font-semibold text-[#00b074]">
                  +8.1%
                </div>
              </div>

              {/* AOV */}
              <div className="rounded-xl bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                <div className="text-[12px] font-medium text-slate-500">
                  Average Order Value
                </div>
                <div className="mt-3 text-3xl font-semibold text-slate-900">
                  $85.50
                </div>
                <div className="mt-2 text-[12px] font-semibold text-[#d23434]">
                  -1.5%
                </div>
              </div>

              {/* Monthly growth */}
              <div className="rounded-xl bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                <div className="text-[12px] font-medium text-slate-500">
                  Monthly Growth Rate
                </div>
                <div className="mt-3 text-3xl font-semibold text-slate-900">
                  12.5%
                </div>
                <div className="mt-2 text-[12px] font-semibold text-[#00b074]">
                  +2.0%
                </div>
              </div>
            </section>

            {/* Revenue over time */}
            <section className="rounded-3xl bg-white px-8 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-slate-900">
                  Revenue Over Time
                </h2>

                <div className="flex items-center gap-2 text-[11px]">
                  <button className="rounded-xl bg-[#00b074] px-4 py-1 text-white">
                    Last 7 Days
                  </button>
                  <button className="rounded-xl bg-slate-100 px-4 py-1 text-slate-500">
                    This Month
                  </button>
                  <button className="rounded-xl bg-slate-100 px-4 py-1 text-slate-500">
                    Last Quarter
                  </button>
                  <button className="rounded-xl bg-slate-100 px-4 py-1 text-slate-500">
                    This Year
                  </button>
                  <button className="flex items-center gap-1 rounded-xl bg-slate-100 px-4 py-1 text-slate-500">
                    <span>Custom Range</span>
                    <span>📅</span>
                  </button>
                </div>
              </div>

              <div className="mt-2 rounded-[26px] bg-[#f6fafb] px-6 py-6">
                <div className="mx-auto flex h-64 max-w-xl items-center justify-center rounded-[18px] bg-[#215b7d]">
                  <div className="relative h-56 w-40">
                    <div className="absolute inset-0 border border-white/20" />
                    <div className="absolute inset-y-0 left-1/4 border-l border-white/15" />
                    <div className="absolute inset-y-0 left-2/4 border-l border-white/15" />
                    <div className="absolute inset-y-0 left-3/4 border-l border-white/15" />
                    <svg
                      viewBox="0 0 100 100"
                      className="absolute inset-2 h-[calc(100%-8px)] w-[calc(100%-8px)]"
                    >
                      <polyline
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2"
                        points="0,80 15,70 30,65 45,55 60,45 75,30 90,10"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </section>

            {/* Earnings by category */}
            <section className="rounded-3xl bg-white px-8 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
              <h2 className="mb-4 text-[14px] font-semibold text-slate-900">
                Earnings by Category
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#fbfcff] text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Orders</th>
                      <th className="px-4 py-3">Total Revenue</th>
                      <th className="px-4 py-3">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryRows.map((row, idx) => (
                      <tr
                        key={row.category}
                        className={
                          "text-slate-700 " +
                          (idx !== categoryRows.length - 1
                            ? "border-b border-slate-100"
                            : "")
                        }
                      >
                        <td className="px-4 py-3">{row.category}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.orders}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {row.revenue}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.share}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default EarningsOverview;
