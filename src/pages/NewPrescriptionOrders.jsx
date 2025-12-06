// src/pages/NewPrescriptionOrders.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

import bellicon from "../assets/bellicon.png";
import pharmacyProfile from "../assets/pharmacyprofile.png";

const ORDERS_STORAGE_KEY = "orders_data";

const statusStyles = {
  "New Order": "bg-[#E3E8EF] text-[#475569]",
  "Decline Order": "bg-[#FEE2E2] text-[#B91C1C]",
  "Accept Order": "bg-[#E8FFF4] text-[#00B074]",
  Processing: "bg-[#FFF6DD] text-[#D19A1A]",
  "Ready for Delivery": "bg-[#FEF3C7] text-[#B45309]",
  "Out for Delivery": "bg-[#DBEAFE] text-[#1D4ED8]",
  Delivered: "bg-[#F3E8FF] text-[#7C3AED]",
};

// Placeholder orders (real backend/app will feed these)
const initialOrders = [
  {
    id: 1,
    patientName: "Sameer Verma",
    prescriptionId: "PRES-951753",
    medicineCount: 4,
    time: "11:32 AM, Home Delivery",
    status: "New Order",
  },
  {
    id: 2,
    patientName: "Neha Reddy",
    prescriptionId: "PRES-951752",
    medicineCount: 2,
    time: "11:15 AM, In-Store",
    status: "New Order",
  },
  {
    id: 3,
    patientName: "Arjun Desai",
    prescriptionId: "PRES-951751",
    medicineCount: 6,
    time: "10:58 AM, Home Delivery",
    status: "New Order",
  },
  {
    id: 4,
    patientName: "Isha Gupta",
    prescriptionId: "PRES-951750",
    medicineCount: 3,
    time: "10:45 AM, In-Store",
    status: "New Order",
  },
  {
    id: 5,
    patientName: "Rohan Mehra",
    prescriptionId: "PRES-951749",
    medicineCount: 8,
    time: "10:21 AM, Home Delivery",
    status: "New Order",
  },
  {
    id: 6,
    patientName: "Aditi Joshi",
    prescriptionId: "PRES-951748",
    medicineCount: 1,
    time: "09:55 AM, In-Store",
    status: "New Order",
  },
];

function loadOrders() {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) {
    console.error("Failed to load orders:", e);
  }
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(initialOrders));
  return initialOrders;
}

function NewPrescriptionOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Pagination state (15 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    const loaded = loadOrders();
    setOrders(loaded);
  }, []);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === "All" ? true : order.status === activeFilter;

    const matchesSearch =
      normalizedSearch === "" ||
      order.patientName.toLowerCase().includes(normalizedSearch) ||
      order.prescriptionId.toLowerCase().includes(normalizedSearch);

    return matchesFilter && matchesSearch;
  });

  // 🔹 Pagination calculations
  const totalFiltered = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + pageSize
  );

  const goToPageDelta = (delta) => {
    setCurrentPage((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > totalPages) return totalPages;
      return next;
    });
  };

  const filterStatuses = [
    "New Order",
    "Accept Order",
    "Processing",
    "Ready for Delivery",
    "Out for Delivery",
    "Delivered",
    "Decline Order",
  ];

  const statusCounts = orders.reduce(
    (acc, o) => ({ ...acc, [o.status]: (acc[o.status] || 0) + 1 }),
    {}
  );

  return (
    <div className="min-h-screen bg-[#f6fafb] text-slate-900">
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-100 bg-white px-10 py-5">
            <div className="flex items-center gap-4">
              <h1 className="text-[18px] font-semibold text-slate-900">
                New Prescription Orders
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <img
                  src={bellicon}
                  alt="Notifications"
                  className="h-5 w-5 object-contain"
                />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe9d6]">
                <img
                  src={pharmacyProfile}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </div>
            </div>
          </header>

          {/* Body */}
          <main className="flex-1 overflow-y-auto bg-[#f6fafb] px-10 py-7">
            {/* Search + Filters (two horizontal rows) */}
            <div className="mb-6 rounded-[32px] bg-white px-8 py-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)] space-y-6">
              {/* Row 1 — Search orders + search bar */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-start gap-4">
                {/* Label */}
                <p className="text-[12px] font-medium text-slate-500 w-full lg:w-auto">
                  Search orders:
                </p>

                {/* Search bar */}
                <div className="w-full lg:max-w-md">
                  <div className="flex items-center gap-3 rounded-2xl bg-[#f7fafc] px-5 py-4 shadow-[0_8px_25px_rgba(15,23,42,0.03)]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                      <span className="text-slate-400 text-lg">🔍</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by patient name or Order ID..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2 — Filter by status + chips */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-start gap-4">
                {/* Label */}
                <p className="text-[12px] font-medium text-slate-500 w-full lg:w-auto">
                  Filter by status:
                </p>

                {/* Chips */}
                <div className="flex flex-wrap justify-start gap-2">
                  {/* All */}
                  <button
                    onClick={() => setActiveFilter("All")}
                    className={[
                      "rounded-full px-4 py-2 text-[12px] font-semibold border transition",
                      activeFilter === "All"
                        ? "bg-[#00b074] text-white border-[#00b074]"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    All ({orders.length})
                  </button>

                  {/* Each status */}
                  {filterStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setActiveFilter(status)}
                      className={[
                        "rounded-full px-4 py-2 text-[12px] font-semibold border transition",
                        activeFilter === status
                          ? "bg-[#00b074] text-white border-[#00b074]"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {status} ({statusCounts[status] || 0})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-[32px] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#fbfcff] text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-8 py-4">Patient Name</th>
                      <th className="px-8 py-4">Order ID</th>
                      <th className="px-8 py-4">Medicine Count</th>
                      <th className="px-8 py-4">Order Time &amp; Type</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order, idx) => (
                      <tr
                        key={order.id}
                        className={
                          "text-slate-700 " +
                          (idx !== paginatedOrders.length - 1
                            ? "border-b border-slate-100"
                            : "")
                        }
                      >
                        <td className="px-8 py-4 text-[13px]">
                          {order.patientName}
                        </td>
                        <td className="px-8 py-4 text-[13px] text-slate-500">
                          {order.prescriptionId}
                        </td>
                        <td className="px-8 py-4 text-[13px]">
                          {order.medicineCount}
                        </td>
                        <td className="px-8 py-4 text-[13px] text-slate-500">
                          {order.time}
                        </td>
                        <td className="px-8 py-4">
                          <span
                            className={
                              "inline-flex rounded-xl px-3 py-1 text-[11px] font-semibold " +
                              (statusStyles[order.status] ||
                                "bg-[#E3E8EF] text-[#475569]")
                            }
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <Link
                            to={`/orders/${order.id}`}
                            state={{
                              orderId: order.id,
                              patientName: order.patientName,
                              medicineCount: order.medicineCount,
                              orderTime: order.time,
                              status: order.status,
                              prescriptionId: order.prescriptionId,
                            }}
                            className="rounded-xl bg-[#00b074] px-5 py-1.5 text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(0,176,116,0.45)] transition hover:bg-[#049662]"
                          >
                            View Order
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between rounded-b-[32px] border-t border-slate-100 px-8 py-4 text-[12px] text-slate-500">
                <span>
                  Showing {paginatedOrders.length} of {totalFiltered} results
                </span>
                <div className="flex gap-2">
                  <button
                    className="rounded-xl border border-slate-200 px-5 py-1.5 text-[12px] text-slate-500 hover:bg-slate-50"
                    onClick={() => goToPageDelta(-1)}
                  >
                    Previous
                  </button>
                  <button
                    className="rounded-xl border border-slate-200 px-5 py-1.5 text-[12px] text-slate-500 hover:bg-slate-50"
                    onClick={() => goToPageDelta(1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default NewPrescriptionOrders;
