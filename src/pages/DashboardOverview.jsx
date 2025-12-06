// src/pages/DashboardOverview.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

import bellicon from "../assets/bellicon.png";
import pharmacyProfile from "../assets/pharmacyprofile.png";

const ORDERS_STORAGE_KEY = "orders_data";

// Status styles (same everywhere)
const statusStyles = {
  "New Order": "bg-[#E3E8EF] text-[#475569]",
  "Decline Order": "bg-[#FEE2E2] text-[#B91C1C]",
  "Accept Order": "bg-[#E8FFF4] text-[#00B074]",
  Processing: "bg-[#FFF6DD] text-[#D19A1A]",
  "Ready for Delivery": "bg-[#FEF3C7] text-[#B45309]",
  "Out for Delivery": "bg-[#DBEAFE] text-[#1D4ED8]",
  Delivered: "bg-[#F3E8FF] text-[#7C3AED]",
};

// Initial orders – placeholder until your app/backend sends real data
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

// Summary cards on top
const summaryCards = [
  {
    title: "New Orders",
    value: 12,
    linkText: "View Orders",
    linkUrl: "/orders",
    color: "text-emerald-500",
  },
  {
    title: "Processing Orders",
    value: 8,
    linkText: "Track Status",
    linkUrl: "/orders",
    color: "text-amber-600",
  },
  {
    title: "Low Stock Alerts",
    value: 3,
    linkText: "Items are running low",
    linkUrl: "/inventory",
    color: "text-red-500",
    badge: false,
  },
  {
    title: "Out of Stock Alerts",
    value: 1,
    linkText: "Review Inventory",
    linkUrl: "/inventory",
    color: "text-red-700",
    badge: false,
  },
];

const INVENTORY_STORAGE_KEY = "inventory_items";

const defaultInventoryItems = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    sku: "PC500-123",
    stock: 500,
    price: "ƒ,15.99",
    expiry: "12/2025",
    category: "Tablets",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    sku: "AMX250-456",
    stock: 45,
    price: "ƒ,112.50",
    expiry: "08/2024",
    category: "Capsules",
  },
  {
    id: 3,
    name: "Ibuprofen 200mg",
    sku: "IB200-789",
    stock: 1200,
    price: "ƒ,18.25",
    expiry: "05/2026",
    category: "Tablets",
  },
  {
    id: 4,
    name: "Loratadine 10mg",
    sku: "LOR10-101",
    stock: 0,
    price: "ƒ,115.00",
    expiry: "01/2025",
    category: "Syrups",
  },
  {
    id: 5,
    name: "Aspirin 81mg",
    sku: "ASP81-112",
    stock: 80,
    price: "ƒ,14.75",
    expiry: "11/2024",
    category: "Tablets",
  },
];

function getStatusFromStock(stockRaw) {
  const stock = Number(stockRaw || 0);
  if (stock <= 0) return "Out of Stock";
  if (stock <= 200) return "Low Stock";
  return "In Stock";
}

function loadInventoryItems() {
  try {
    const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) {
    console.error("Failed to load inventory items:", e);
  }

  localStorage.setItem(
    INVENTORY_STORAGE_KEY,
    JSON.stringify(defaultInventoryItems)
  );
  return defaultInventoryItems;
}

const totalEarnings = {
  value: "₹84,500",
  title: "Total Earnings (This Month)",
  change: "+12.5%",
  changeColor: "text-emerald-500",
};

const storeProfile = {
  licenseStatus: "Active",
  address: "123 Health St, Medcity",
  contact: "+91 98765 43210",
  deliveryRadius: "10 km",
  bankAccount: "Linked",
};

const chartData = [
  { label: "Mon", value: 60000, type: "light" },
  { label: "Tue", value: 75000, type: "light" },
  { label: "Wed", value: 78000, type: "light" },
  { label: "Thu", value: 90000, type: "dark" },
  { label: "Fri", value: 65000, type: "light" },
  { label: "Sat", value: 95000, type: "dark" },
  { label: "Sun", value: 40000, type: "light" },
];

const maxChartValue = 100000;

// Small card
const Card = ({ title, value, linkText, linkUrl, color, badge }) => (
  <div className="bg-white p-6 rounded-xl shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100">
    <div className="flex items-start justify-between">
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      {badge && (
        <span className="bg-red-500 text-white rounded-xl text-[10px] w-4 h-4 flex items-center justify-center -mt-1 font-semibold">
          {value}
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-slate-900 mt-1">
      {badge ? "" : value}
    </p>
    <a
      href={linkUrl}
      className={`mt-3 inline-block text-[13px] font-medium ${color} hover:underline`}
    >
      {linkText}
    </a>
  </div>
);

const QuickActionButton = ({ icon, label, colorClass, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-2 rounded-xl ${colorClass} px-5 py-3 text-[13px] font-semibold text-white shadow-md transition hover:opacity-90`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </button>
);

const ChartBar = ({ label, value, type }) => {
  const heightPercent = (value / maxChartValue) * 100;
  const barColor = type === "dark" ? "bg-[#1D4F88]" : "bg-[#4B88D0]";

  return (
    <div className="flex flex-col items-center h-full pt-12">
      <div className="relative flex-1 w-20">
        <div
          className={`absolute bottom-0 w-full rounded-xl ${barColor}`}
          style={{ height: `${heightPercent}%` }}
        ></div>
      </div>
      <span className="text-[11px] text-slate-500 mt-1">{label}</span>
    </div>
  );
};

// Helpers for storage
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
  // seed with initial
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(initialOrders));
  return initialOrders;
}

function DashboardOverview() {
  const [recentOrders, setRecentOrders] = useState(initialOrders);
  const [inventoryItems, setInventoryItems] = useState(defaultInventoryItems);
  const navigate = useNavigate();

  useEffect(() => {
    const orders = loadOrders();
    setRecentOrders(orders);

    const inventory = loadInventoryItems();
    setInventoryItems(inventory);
  }, []);

  const recentSlice = recentOrders.slice(0, 4);

  const newOrdersCount = recentOrders.filter(
    (order) => order.status === "New Order"
  ).length;

  const processingOrdersCount = recentOrders.filter(
    (order) => order.status === "Processing"
  ).length;

  const lowStockAlertsCount = inventoryItems.filter(
    (item) => getStatusFromStock(item.stock) === "Low Stock"
  ).length;

  const outOfStockAlertsCount = inventoryItems.filter(
    (item) => getStatusFromStock(item.stock) === "Out of Stock"
  ).length;

  const summaryValueOverrides = {
    "New Orders": newOrdersCount,
    "Processing Orders": processingOrdersCount,
    "Low Stock Alerts": lowStockAlertsCount,
    "Out of Stock Alerts": outOfStockAlertsCount,
  };

  return (
    <div className="min-h-screen bg-[#f6fafb] text-slate-900">
      <div className="flex h-screen">
        <Sidebar activePage="Dashboard" />

        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-100 bg-white px-10 py-5">
            <h1 className="text-[18px] font-semibold text-slate-900">
              Dashboard Overview
            </h1>

            <div className="flex items-center gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <img src={bellicon} alt="Notifications" />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe9d6]">
                <img src={pharmacyProfile} alt="Profile" />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-[#f6fafb] px-10 py-7">
            {/* Summary + Earnings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {summaryCards.map((card) => {
                  const cardValue = summaryValueOverrides[card.title] ?? card.value;
                  return <Card key={card.title} {...card} value={cardValue} />;
                })}

              <div className="bg-white p-6 rounded-xl shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100">
                <h3 className="text-sm font-medium text-slate-500">
                  {totalEarnings.title}
                </h3>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {totalEarnings.value}
                </p>
                <div className="flex items-center mt-3 text-[13px] font-medium">
                  <span className={totalEarnings.changeColor}>
                    ↑{totalEarnings.change}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Prescription Orders */}
            <div className="mb-8">
              <h2 className="text-[16px] font-semibold text-slate-900 mb-4">
                Recent Prescription Orders
              </h2>
              <div className="rounded-xl bg-white shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-[#fbfcff] text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <th className="px-6 py-4">Patient Name</th>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Medicine Count</th>
                        <th className="px-6 py-4">Order Time &amp; Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSlice.map((order, idx) => (
                        <tr
                          key={order.id}
                          className={
                            idx !== recentSlice.length - 1
                              ? "border-b border-slate-100"
                              : ""
                          }
                        >
                          <td className="px-6 py-3 font-medium text-slate-700">
                            {order.patientName}
                          </td>
                          <td className="px-6 py-3 text-slate-500">
                            {order.prescriptionId}
                          </td>
                          <td className="px-6 py-3">
                            {order.medicineCount}
                          </td>
                          <td className="px-6 py-3 text-slate-500">
                            {order.time}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`inline-flex rounded-xl px-3 py-1 text-[11px] font-semibold ${
                                statusStyles[order.status] ||
                                "bg-[#E3E8EF] text-[#475569]"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
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
                              className="rounded-xl bg-emerald-500 px-4 py-1.5 text-[12px] font-semibold text-white shadow-md hover:bg-emerald-600"
                            >
                              View Order
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Actions + Store Profile + Chart (unchanged UI) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column */}
              <div className="flex flex-col gap-6">
                <div className="bg-white p-6 rounded-xl shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100">
                  <h2 className="text-[16px] font-semibold text-slate-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <QuickActionButton
                      label="Add New Medicine"
                      onClick={() => navigate("/add-medicine")}
                      colorClass="bg-emerald-500 shadow-[0_12px_30px_rgba(16,185,129,0.2)]"
                      icon="💊"
                    />
                    <QuickActionButton
                      label="Update Stock Level"
                      onClick={() => navigate("/inventory")}
                      colorClass="bg-emerald-600 shadow-[0_12px_30px_rgba(16,185,129,0.15)]"
                      icon="📦"
                    />
                    <QuickActionButton
                      label="Generate Invoice"
                      colorClass="bg-emerald-700 shadow-[0_12px_30px_rgba(16,185,129,0.1)]"
                      icon="📄"
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100">
                  <h2 className="text-[16px] font-semibold text-slate-900 mb-4">
                    Store Profile
                  </h2>
                  <div className="text-[13px] space-y-2">
                    <p>
                      <span className="font-medium text-slate-500">
                        License Status:
                      </span>{" "}
                      <span className="text-emerald-500 font-semibold">
                        {storeProfile.licenseStatus}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-500">
                        Address:
                      </span>{" "}
                      <span className="text-slate-700">
                        {storeProfile.address}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-500">
                        Contact:
                      </span>{" "}
                      <span className="text-slate-700">
                        {storeProfile.contact}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-500">
                        Delivery Radius:
                      </span>{" "}
                      <span className="text-slate-700">
                        {storeProfile.deliveryRadius}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-slate-500">
                        Bank Account:
                      </span>{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:underline"
                      >
                        {storeProfile.bankAccount}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100">
                <header className="flex justify-between items-center mb-6">
                  <h2 className="text-[16px] font-semibold text-slate-900">
                    Earnings Analytics
                  </h2>
                  <div className="flex text-[12px] font-medium text-slate-500 space-x-3">
                    <button className="text-emerald-600 font-semibold border-b-2 border-emerald-500">
                      Weekly
                    </button>
                    <button className="hover:text-slate-700">
                      Monthly
                    </button>
                    <button className="hover:text-slate-700">
                      Yearly
                    </button>
                  </div>
                </header>

                <div className="relative h-101 flex items-end">
                  <div className="absolute left-0 bottom-0 top-0 flex flex-col justify-between h-full py-2 pr-3 text-[11px] text-slate-400">
                    <span>100K</span>
                    <span>80K</span>
                    <span>60K</span>
                    <span>40K</span>
                    <span>20K</span>
                    <span>0</span>
                  </div>

                  <div className="flex flex-1 justify-around pl-8 h-full border-l border-b border-slate-100">
                    {chartData.map((data) => (
                      <ChartBar key={data.label} {...data} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
