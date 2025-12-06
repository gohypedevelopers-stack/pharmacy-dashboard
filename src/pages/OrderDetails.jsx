// src/pages/OrderDetails.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

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

// Timeline stages in order (Decline is separate)
const ORDER_STAGES = [
  "New Order",
  "Accept Order",
  "Processing",
  "Ready for Delivery",
  "Out for Delivery",
  "Delivered",
];

// Same placeholder set (only used if storage somehow empty)
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

// Dummy items in the order
const orderItems = [
  { name: "Paracetamol 500mg", quantity: 2, price: 5 },
  { name: "Amoxicillin 250mg", quantity: 1, price: 12.5 },
  { name: "Vitamin C 1000mg", quantity: 1, price: 8 },
];

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

// Format timestamp like: "04 Dec 2025, 05:42 pm"
function formatNow() {
  const now = new Date();
  return now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

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

function saveOrders(orders) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("Failed to save orders:", e);
  }
}

function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId: routeOrderId } = useParams();
  const state = location.state || {};

  const [order, setOrder] = useState(null);

  // Load order & ensure "New Order" has a timestamp
  useEffect(() => {
    const allOrders = loadOrders();
    const numericId = Number(routeOrderId || state.orderId);
    let found =
      allOrders.find((o) => o.id === numericId) ||
      (allOrders.length ? allOrders[0] : null);

    if (!found) {
      setOrder(null);
      return;
    }

    if (!found.timeline) {
      found = {
        ...found,
        timeline: {
          "New Order": formatNow(),
        },
      };
      const updated = allOrders.map((o) =>
        o.id === found.id ? found : o
      );
      saveOrders(updated);
    } else if (!found.timeline["New Order"]) {
      found = {
        ...found,
        timeline: {
          ...found.timeline,
          "New Order": formatNow(),
        },
      };
      const updated = allOrders.map((o) =>
        o.id === found.id ? found : o
      );
      saveOrders(updated);
    }

    setOrder(found);
  }, [routeOrderId, state.orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f6fafb] text-slate-900">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-1 items-center justify-center">
            <p className="text-slate-500 text-sm">
              Order not found.{" "}
              <button
                onClick={() => navigate("/orders")}
                className="text-emerald-600 underline"
              >
                Go back to orders
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = orderItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
  const taxes = 2.5;
  const total = subtotal + taxes;

  const patientName =
    state.patientName || order.patientName || "Customer Name";

  const medicineCount =
    state.medicineCount || order.medicineCount || orderItems.length;

  const orderTime =
    state.orderTime || order.time || "24 June 2024, 10:30 AM, Home Delivery";

  const displayOrderCode =
    state.prescriptionId || order.prescriptionId || "PRES-XXXXXX";

  const orderStatus = order.status || "New Order";
  const statusClass =
    statusStyles[orderStatus] || "bg-[#E3E8EF] text-[#475569]";

  // Current timeline index (0 = New Order, 5 = Delivered)
  const currentStatusIndex = ORDER_STAGES.indexOf(orderStatus);
  const safeIndex = currentStatusIndex === -1 ? 0 : currentStatusIndex;

  // Height of green progress line: a bit *past* the current circle
  const greenProgressPercent =
    ORDER_STAGES.length > 1
      ? Math.min(
          100,
          ((safeIndex + (safeIndex > 0 ? 0.35 : 0)) /
            (ORDER_STAGES.length - 1)) *
            100
        )
      : 0;

  // Update status + timeline + persist
  const updateOrderStatus = (newStatus) => {
    const all = loadOrders();
    const nowLabel = formatNow();

    const updated = all.map((o) => {
      if (o.id !== order.id) return o;

      const existingTimeline = o.timeline || {};

      return {
        ...o,
        status: newStatus,
        timeline: {
          ...existingTimeline,
          "New Order":
            existingTimeline["New Order"] || formatNow(),
          [newStatus]: nowLabel,
        },
      };
    });

    saveOrders(updated);
    const justUpdated = updated.find((o) => o.id === order.id);
    setOrder(justUpdated); // re-render with new status & timeline
  };

  const handleDecline = () => updateOrderStatus("Decline Order");
  const handleAccept = () => updateOrderStatus("Accept Order");
  const handleProcessing = () => updateOrderStatus("Processing");
  const handleReady = () => updateOrderStatus("Ready for Delivery");
  const handleOutForDelivery = () =>
    updateOrderStatus("Out for Delivery");
  const handleDelivered = () => updateOrderStatus("Delivered");
  const handleBack = () => navigate("/orders");

  return (
    <div className="min-h-screen bg-[#f6fafb] text-slate-900">
      <div className="flex h-full min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-y-auto px-10 py-8">
          <div className="flex-1 rounded-[40px] bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.1)]">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <h1 className="text-3xl font-semibold text-slate-900">
                  Order {displayOrderCode}
                </h1>
                <p className="text-sm text-slate-500">
                  Placed at {orderTime}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Medicines in prescription:{" "}
                  <span className="font-semibold text-slate-800">
                    {medicineCount}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-4 py-1 text-sm font-semibold ${statusClass}`}
                >
                  {orderStatus}
                </span>
                <button
                  onClick={handleBack}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                  aria-label="Close and go back to orders"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {/* Items */}
              <section className="lg:col-span-2 rounded-[32px] bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">
                    Order Items
                  </h2>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
                  <table className="min-w-full text-left text-[13px]">
                    <thead>
                      <tr className="bg-[#fbfcff] text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <th className="px-6 py-4">Item</th>
                        <th className="px-6 py-4">Quantity</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item) => (
                        <tr
                          key={item.name}
                          className="border-b border-slate-100"
                        >
                          <td className="px-6 py-3 text-slate-700">
                            {item.name}
                          </td>
                          <td className="px-6 py-3 text-slate-700">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-3 text-slate-700">
                            {formatCurrency(item.price)}
                          </td>
                          <td className="px-6 py-3 font-semibold text-slate-900">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="space-y-2 border-t border-slate-100 px-6 py-4 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes &amp; Fees</span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(taxes)}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span className="text-slate-900">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Right side: Customer + Timeline */}
              <div className="flex flex-col gap-6">
                {/* Customer Details */}
                <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Customer Details
                  </h2>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#9f8fff] to-[#6ec6ff]" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {patientName}
                      </p>
                      <p className="text-sm text-slate-500">
                        jane.doe@example.com
                      </p>
                      <p className="text-sm text-slate-500">
                        (555) 123-4567
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">
                      Delivery Address
                    </p>
                    <p>123 Health St, Wellness City, 10001</p>
                  </div>
                </section>

                {/* Order Timeline – line & circles overlapping, live motion */}
                <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Order Timeline
                  </h2>

                  <div className="mt-4 relative">
                    {/* Full grey line */}
                    <div className="absolute left-[31px] top-2 bottom-6 w-[4px] bg-[#e5e7eb] overflow-hidden">
                      {/* Animated green part */}
                      <div
                        className="absolute left-0 top-0 w-full bg-[#00b074] transition-all duration-800 ease-out"
                        style={{
                          height: `${greenProgressPercent}%`,
                        }}
                      />
                    </div>

                    {/* Steps */}
                    <div className="space-y-6 pl-6 text-sm text-slate-600">
                      {ORDER_STAGES.map((stage, idx) => {
                        // Every stage up to and including current index is completed
                        const isCompleted = idx <= safeIndex;

                        return (
                          <div
                            key={stage}
                            className="relative flex items-start gap-3"
                          >
                            {/* Circle exactly on the line */}
                            <span
                              className={
                                "absolute left-[1px] mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 " +
                                (isCompleted
                                  ? "bg-[#00b074] border-[#00b074]"
                                  : "border-[#d4d9e3] bg-white")
                              }
                            />

                            {/* Text block */}
                            <div className="pl-9">
                              <p className="font-semibold text-slate-900">
                                {stage}
                              </p>
                              {order.timeline?.[stage] && (
                                <p className="text-[13px] text-slate-500">
                                  {order.timeline[stage]}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={handleDecline}
                className="rounded-[999px] border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Decline Order
              </button>

              <button
                onClick={handleAccept}
                className="rounded-[999px] bg-[#00b074] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(0,176,116,0.35)] hover:bg-[#049662]"
              >
                Accept Order
              </button>

              <button
                onClick={handleProcessing}
                className="rounded-[999px] bg-[#D19A1A] px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90"
              >
                Processing
              </button>

              <button
                onClick={handleReady}
                className="rounded-[999px] bg-[#B45309] px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90"
              >
                Ready for Delivery
              </button>

              <button
                onClick={handleOutForDelivery}
                className="rounded-[999px] bg-[#1D4ED8] px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90"
              >
                Out for Delivery
              </button>

              <button
                onClick={handleDelivered}
                className="rounded-[999px] bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90"
              >
                Delivered
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
