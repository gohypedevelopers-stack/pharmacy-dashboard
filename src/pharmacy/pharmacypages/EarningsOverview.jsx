// src/pharmacy/pharmacypages/EarningsOverview.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../../pharmacy/components/Sidebar.jsx";
import { apiRequest } from "../../lib/api.js";
import { getPharmacyToken } from "../../lib/pharmacySession.js";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import bellicon from "../../pharmacy/assets/bellicon.png";
import pharmacyProfile from "../../pharmacy/assets/pharmacyprofile.png";

function EarningsOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [earningsData, setEarningsData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    revenueGrowth: 0,
    recentOrders: [],
    dailyRevenue: [],
  });

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = getPharmacyToken();
        if (!token) {
          setError("Please log in to view earnings");
          setLoading(false);
          return;
        }
        const response = await apiRequest("/api/pharmacy/earnings", { token });
        if (response.success) {
          setEarningsData(response.data);
        } else {
          setError(response.message || "Failed to load earnings");
        }
      } catch (err) {
        console.error("Error fetching earnings:", err);
        setError(err.message || "Failed to load earnings");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatGrowth = (value) => {
    if (value > 0) return `+${value.toFixed(1)}%`;
    if (value < 0) return `${value.toFixed(1)}%`;
    return "0%";
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-green-100 text-green-700",
      shipped: "bg-blue-100 text-blue-700",
      out_for_delivery: "bg-purple-100 text-purple-700",
      processing: "bg-yellow-100 text-yellow-700",
      pending: "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg bg-white px-4 py-3 shadow-lg border border-slate-100">
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <p className="text-lg font-semibold text-[#00b074]">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs text-slate-500">
            {payload[0].payload.orders} orders
          </p>
        </div>
      );
    }
    return null;
  };

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
                <img src={bellicon} alt="Notifications" />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe9d6]">
                <img src={pharmacyProfile} alt="Profile" />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-[#f4f8f7] px-10 py-7 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-slate-500">Loading earnings data...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-red-500">{error}</div>
              </div>
            ) : (
              <>
                {/* Top metric cards */}
                <section className="grid grid-cols-4 gap-5">
                  {/* Total revenue */}
                  <div className="rounded-xl bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                    <div className="text-[12px] font-medium text-slate-500">
                      Total Revenue
                    </div>
                    <div className="mt-3 text-3xl font-semibold text-slate-900">
                      {formatCurrency(earningsData.totalRevenue)}
                    </div>
                    <div
                      className={`mt-2 text-[12px] font-semibold ${earningsData.revenueGrowth >= 0
                          ? "text-[#00b074]"
                          : "text-[#d23434]"
                        }`}
                    >
                      {formatGrowth(earningsData.revenueGrowth)}
                    </div>
                  </div>

                  {/* Total Orders */}
                  <div className="rounded-xl bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                    <div className="text-[12px] font-medium text-slate-500">
                      Total Orders
                    </div>
                    <div className="mt-3 text-3xl font-semibold text-slate-900">
                      {earningsData.totalOrders.toLocaleString()}
                    </div>
                    <div className="mt-2 text-[12px] text-slate-400">
                      Completed orders
                    </div>
                  </div>

                  {/* AOV */}
                  <div className="rounded-xl bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                    <div className="text-[12px] font-medium text-slate-500">
                      Average Order Value
                    </div>
                    <div className="mt-3 text-3xl font-semibold text-slate-900">
                      {formatCurrency(earningsData.averageOrderValue)}
                    </div>
                    <div className="mt-2 text-[12px] text-slate-400">
                      Per order avg
                    </div>
                  </div>

                  {/* Current Month Revenue */}
                  <div className="rounded-xl bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                    <div className="text-[12px] font-medium text-slate-500">
                      This Month Revenue
                    </div>
                    <div className="mt-3 text-3xl font-semibold text-slate-900">
                      {formatCurrency(earningsData.currentMonthRevenue)}
                    </div>
                    <div className="mt-2 text-[12px] text-slate-400">
                      Last month: {formatCurrency(earningsData.lastMonthRevenue)}
                    </div>
                  </div>
                </section>

                {/* Revenue Chart */}
                <section className="rounded-3xl bg-white px-8 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-slate-900">
                      Revenue Over Time (Last 7 Days)
                    </h2>
                  </div>

                  <div className="h-72">
                    {earningsData.dailyRevenue &&
                      earningsData.dailyRevenue.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={earningsData.dailyRevenue}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorRevenue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#00b074"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#00b074"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="day"
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: "#e2e8f0" }}
                          />
                          <YAxis
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                              `₹${(value / 1000).toFixed(0)}k`
                            }
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#00b074"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        No revenue data available
                      </div>
                    )}
                  </div>
                </section>

                {/* Recent Orders Table */}
                <section className="rounded-3xl bg-white px-8 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                  <h2 className="mb-4 text-[14px] font-semibold text-slate-900">
                    Recent Orders
                  </h2>

                  <div className="overflow-x-auto">
                    {earningsData.recentOrders.length === 0 ? (
                      <div className="py-8 text-center text-slate-400">
                        No orders yet
                      </div>
                    ) : (
                      <table className="min-w-full text-left text-[13px]">
                        <thead>
                          <tr className="border-b border-slate-100 bg-[#fbfcff] text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            <th className="px-4 py-3">Order ID</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Items</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {earningsData.recentOrders.map((order, idx) => (
                            <tr
                              key={order._id}
                              className={
                                "text-slate-700 " +
                                (idx !== earningsData.recentOrders.length - 1
                                  ? "border-b border-slate-100"
                                  : "")
                              }
                            >
                              <td className="px-4 py-3 font-mono text-xs">
                                #{order._id.slice(-8).toUpperCase()}
                              </td>
                              <td className="px-4 py-3">
                                {order.customerName}
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {order.itemCount} items
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-900">
                                {formatCurrency(order.total)}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-full px-2 py-1 text-[10px] font-medium ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {order.status.replace(/_/g, " ")}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default EarningsOverview;
