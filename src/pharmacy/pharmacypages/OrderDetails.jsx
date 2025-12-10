import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../pharmacy/components/Sidebar.jsx";
import bellicon from "../../pharmacy/assets/bellicon.png";
import { apiRequest } from "../../lib/api.js";
import { getPharmacyToken } from "../../lib/pharmacySession.js";

const statusOptions = [
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "ready_for_delivery", label: "Ready for Delivery" },
  { id: "out_for_delivery", label: "Out for Delivery" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState("");
  const token = getPharmacyToken();

  useEffect(() => {
    if (!token || !orderId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await apiRequest(`/api/pharmacy/orders/${orderId}`, {
          token,
        });
        if (cancelled) return;
        setOrder(response?.data ?? null);
      } catch (err) {
        console.error("Failed to load order:", err);
        if (!cancelled) setError(err.message || "Unable to load order");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [token, orderId]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    if (!orderId || !token) return;
    setStatusUpdating(true);
    try {
      await apiRequest(`/api/pharmacy/orders/${orderId}/status`, {
        method: "PATCH",
        token,
        body: { status: newStatus },
      });
      setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
    } catch (err) {
      console.error("Failed to update status:", err);
      setError(err.message || "Unable to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const getSubtotal = () => {
    return order?.items?.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6fafb] text-slate-900">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-slate-600">Loading order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f6fafb] text-slate-900">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-1 items-center justify-center">
            <div className="space-y-3 text-center">
              <p className="text-slate-500">Order not found.</p>
              <button
                onClick={() => navigate("/pharmacy/orders")}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Back to orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6fafb] text-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-100 bg-white px-10 py-5">
            <h1 className="text-[18px] font-semibold text-slate-900">
              Order #{orderId}
            </h1>
            <div className="flex items-center gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <img src={bellicon} alt="Notifications" />
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-[#f6fafb] px-10 py-7">
            {error && (
              <div className="mb-4 rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
                {error}
              </div>
            )}

            <div className="rounded-xl bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100 space-y-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-sm text-slate-500">
                  Customer: <span className="font-semibold text-slate-900">{order.shippingAddress?.fullName ?? order.user?.userName}</span>
                </div>
                <div className="text-sm text-slate-500">Status:</div>
                <select
                  value={order.status || "pending"}
                  onChange={handleStatusChange}
                  disabled={statusUpdating}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900"
                >
                  {statusOptions.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-500">
                  {statusUpdating ? "Updating..." : "Drag to change status"}
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-[13px] text-slate-500">Delivery Address</p>
                  <p className="text-slate-800">
                    {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}
                  </p>
                  <p className="text-slate-800">
                    {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                  </p>
                  <p className="text-slate-800">{order.shippingAddress?.phone}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[13px] text-slate-500">Payment</p>
                  <p className="text-slate-900 font-semibold">{order.paymentMethod?.toUpperCase() ?? "COD"}</p>
                  <p className="text-slate-700">Payment Status: {order.paymentStatus}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100 mt-6">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#fbfcff] text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-4">Medicine</th>
                      <th className="px-6 py-4">Qty</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Sub-total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item) => (
                      <tr key={item.product?._id ?? item.product}>
                        <td className="px-6 py-3 text-slate-700">
                          {item.name || item.product?.name}
                        </td>
                        <td className="px-6 py-3">{item.quantity}</td>
                        <td className="px-6 py-3">{currencyFormatter.format(item.price)}</td>
                        <td className="px-6 py-3">
                          {currencyFormatter.format((item.price || 0) * (item.quantity || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end border-t border-slate-100 p-6 text-sm">
                <div className="space-y-2 text-right">
                  <p className="text-slate-500">Subtotal: {currencyFormatter.format(getSubtotal())}</p>
                  <p className="text-slate-900 font-semibold">Total: {currencyFormatter.format(order.total ?? 0)}</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
