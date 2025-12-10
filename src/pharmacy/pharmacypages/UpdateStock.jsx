// src/pages/UpdateStock.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../pharmacy/components/Sidebar.jsx";

const STORAGE_KEY = "inventory_items";

export default function UpdateStock() {
  const navigate = useNavigate();
  const location = useLocation();
  const medicine = location.state?.medicine;

  const [stock, setStock] = useState(medicine?.stock || 0);

  // Load existing inventory
  const loadItems = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  // Update stock in localStorage
  const updateStock = () => {
    const items = loadItems();

    const updatedItems = items.map((item) =>
      item.id === medicine.id ? { ...item, stock: Number(stock) } : item
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));

    navigate("/inventory");
  };

  if (!medicine) {
    return (
      <div className="p-10 text-center text-red-500">
        Error: No medicine selected.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6fafb] text-slate-900 flex">
      <Sidebar />

      <div className="flex-1 p-10">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
          
          <h1 className="text-2xl font-semibold text-slate-900 mb-6">
            Update Stock
          </h1>

          <div className="space-y-4 text-[14px]">
            <p className="text-slate-700">
              <span className="font-semibold">Medicine Name:</span> {medicine.name}
            </p>

            <p className="text-slate-700">
              <span className="font-semibold">SKU:</span> {medicine.sku}
            </p>

            {/* Input */}
            <div>
              <label className="text-sm text-slate-500 font-medium">
                New Stock Quantity
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full mt-1 h-12 rounded-xl border border-slate-300 bg-slate-50 px-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-8 gap-3">
            <button
              onClick={() => navigate("/inventory")}
              className="px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={updateStock}
              className="px-6 py-2 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 shadow-md"
            >
              Update Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
