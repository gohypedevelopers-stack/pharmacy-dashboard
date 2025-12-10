// src/pages/DashboardOverview.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../pharmacy/components/Sidebar.jsx";
import { apiRequest } from "../../lib/api.js";
import { getPharmacyToken } from "../../lib/pharmacySession.js";

import bellicon from "../../pharmacy/assets/bellicon.png";
import pharmacyProfile from "../../pharmacy/assets/pharmacyprofile.png";

const statusStyles = {
  New: "bg-[#E3E8EF] text-[#475569]",
  "New Order": "bg-[#E3E8EF] text-[#475569]",
  "Pending": "bg-[#E3E8EF] text-[#475569]",
  "Decline Order": "bg-[#FEE2E2] text-[#B91C1C]",
  "Accept Order": "bg-[#E8FFF4] text-[#00B074]",
  Processing: "bg-[#FFF6DD] text-[#D19A1A]",
  "Ready for Delivery": "bg-[#FEF3C7] text-[#B45309]",
  "Out for Delivery": "bg-[#DBEAFE] text-[#1D4ED8]",
  Delivered: "bg-[#F3E8FF] text-[#7C3AED]",
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

const storeProfile = {
  licenseStatus: "Active",
  address: "123 Health St, Medcity",
  contact: "+91 98765 43210",
  deliveryRadius: "10 km",
  bankAccount: "Linked",
};

const maxChartValue = 100000;

const formatCurrency = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "₹0";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatStatusLabel = (value) => {
  if (!value) return "New Order";
  return value
    .toString()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const ChartBar = ({ label, value, type }) => {
  const heightPercent = Math.min((value / maxChartValue) * 100, 100);
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

const Card = ({ title, value, linkText, linkUrl, color, badge = true }) => (
  <div className="bg-white p-6 rounded-xl shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100">
    <div className="flex items-start justify-between">
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      {badge && (
        <span className="bg-red-500 text-white rounded-xl text-[10px] w-4 h-4 flex items-center justify-center -mt-1 font-semibold">
          {value}
        </span>
      )}
    </div>
    <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
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

function DashboardOverview() {
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const sessionToken = getPharmacyToken();

  useEffect(() => {
    if (!sessionToken) return;
    let isCancelled = false;
    const fetchData = async () => {
      setLoadingData(true);
      setErrorMessage("");
      try {
        const [ordersRes, productsRes] = await Promise.all([
          apiRequest("/api/pharmacy/orders/me", { token: sessionToken }),
          apiRequest("/api/pharmacy/products?limit=100", { token: sessionToken }),
        ]);
        if (isCancelled) return;
        setRecentOrders(ordersRes?.data ?? []);
        setInventoryItems(productsRes?.data?.items ?? []);
      } catch (error) {
        console.error("Unable to load pharmacy dashboard data:", error);
        if (!isCancelled) setErrorMessage(error.message || "Failed to load dashboard data.");
      } finally {
        if (!isCancelled) setLoadingData(false);
      }
    };
    fetchData();
    return () => {
      isCancelled = true;
    };
  }, [sessionToken]);

  const ordersForDisplay = useMemo(() => {
    return recentOrders.map((order) => {
      const medicineCount =
        order.medicineCount ??
        order.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ??
        0;
      const createdAt = order.createdAt ? new Date(order.createdAt) : null;
      const timeLabel = order.time
        ? order.time
        : createdAt
        ? `${createdAt.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}, ${order.metadata?.deliveryType ?? "Home Delivery"}`
        : "—";

      return {
        id: order._id ?? order.id,
        patientName:
          order.shippingAddress?.fullName ??
          order.user?.userName ??
          order.customerName ??
          "Patient",
        prescriptionId:
          order.prescriptionId ?? order.orderId ?? `ORD-${order._id?.slice(-6) ?? 0}`,
        medicineCount,
        time: timeLabel,
        status: formatStatusLabel(order.status ?? order.STATUS),
        STATUS_INTERNAL: (order.status ?? order.STATUS ?? "").toLowerCase(),
      };
    });
  }, [recentOrders]);

  const inventoryForDisplay = useMemo(() => {
    return inventoryItems.map((item) => {
      const stockValue = Number(item.stock ?? item.quantity ?? 0);
      return {
        id: item._id ?? item.id ?? item.sku,
        name: item.name,
        sku: item.sku ?? "-",
        stock: Number.isNaN(stockValue) ? 0 : stockValue,
        price: typeof item.price === "number" ? formatCurrency(item.price) : item.price ?? "₹0",
        expiry: item.expiry ?? item.expiryDate ?? "-",
        category: item.category ?? "General",
        status: stockValue <= 0 ? "Out of Stock" : stockValue <= 200 ? "Low Stock" : "In Stock",
      };
    });
  }, [inventoryItems]);

  const newOrdersCount = ordersForDisplay.filter(
    (order) => order.STATUS_INTERNAL === "pending" || order.STATUS_INTERNAL === "new"
  ).length;
  const processingOrdersCount = ordersForDisplay.filter((order) =>
    ["processing", "shipped", "ready_for_delivery", "out_for_delivery"].includes(
      order.STATUS_INTERNAL
    )
  ).length;
  const lowStockAlertsCount = inventoryForDisplay.filter(
    (item) => item.status === "Low Stock"
  ).length;
  const outOfStockAlertsCount = inventoryForDisplay.filter(
    (item) => item.status === "Out of Stock"
  ).length;

  const summaryCardsDynamic = [
    {
      title: "New Orders",
      value: newOrdersCount,
      linkText: "View Orders",
      linkUrl: "/orders",
      color: "text-emerald-500",
    },
    {
      title: "Processing Orders",
      value: processingOrdersCount,
      linkText: "Track Status",
      linkUrl: "/orders",
      color: "text-amber-600",
    },
    {
      title: "Low Stock Alerts",
      value: lowStockAlertsCount,
      linkText: "Items are running low",
      linkUrl: "/inventory",
      color: "text-red-500",
      badge: false,
    },
    {
      title: "Out of Stock Alerts",
      value: outOfStockAlertsCount,
      linkText: "Review Inventory",
      linkUrl: "/inventory",
      color: "text-red-700",
      badge: false,
    },
  ];

  const totalEarningsValue = recentOrders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0
  );
  const earningsSummary = {
    value: totalEarningsValue ? formatCurrency(totalEarningsValue) : "₹0",
    title: "Total Earnings (This Month)",
    change: "+12.5%",
    changeColor: "text-emerald-500",
  };

  const statusMessage = errorMessage
    ? errorMessage
    : !sessionToken
    ? "Login with your pharmacy account to load live data."
    : loadingData
    ? "Syncing with the backend…"
    : "";

  const recentSlice = ordersForDisplay.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f6fafb] text-slate-900">
      <div className="flex h-screen">
        <Sidebar activePage="Dashboard" />

        <div className="flex flex-1 flex-col">
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
            {statusMessage && (
              <div className="mb-6 rounded-xl bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-800 shadow-sm">
                {statusMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {summaryCardsDynamic.map((card) => (
                <Card key={card.title} {...card} />
              ))}

              <div className="bg-white p-6 rounded-xl shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100">
                <h3 className="text-sm font-medium text-slate-500">
                  {earningsSummary.title}
                </h3>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {earningsSummary.value}
                </p>
                <div className="flex items-center mt-3 text-[13px] font-medium">
                  <span className={earningsSummary.changeColor}>
                    ↑{earningsSummary.change}
                  </span>
                </div>
              </div>
            </div>

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
                          key={order.id ?? idx}
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
                          <td className="px-6 py-3">{order.medicineCount}</td>
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
                      {!recentSlice.length && (
                        <tr>
                          <td className="px-6 py-6 text-center text-sm text-slate-500" colSpan="6">
                            No orders yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
                    <span className="font-medium text-slate-500">Address:</span>{" "}
                    <span className="text-slate-700">{storeProfile.address}</span>
                  </p>
                  <p>
                    <span className="font-medium text-slate-500">Contact:</span>{" "}
                    <span className="text-slate-700">{storeProfile.contact}</span>
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
                    <span className="font-medium text-slate-500">Bank Account:</span>{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      {storeProfile.bankAccount}
                    </a>
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100">
                <header className="flex justify-between items-center mb-6">
                  <h2 className="text-[16px] font-semibold text-slate-900">
                    Earnings Analytics
                  </h2>
                  <div className="flex text-[12px] font-medium text-slate-500 space-x-3">
                    <button className="text-emerald-600 font-semibold border-b-2 border-emerald-500">
                      Weekly
                    </button>
                    <button className="hover:text-slate-700">Monthly</button>
                    <button className="hover:text-slate-700">Yearly</button>
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
