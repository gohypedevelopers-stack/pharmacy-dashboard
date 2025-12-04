// src/pages/InventoryList.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

import bellicon from "../assets/bellicon.png";
import pharmacyProfile from "../assets/pharmacyprofile.png";

const STORAGE_KEY = "inventory_items";

// Default items (used only first time, then stored to localStorage)
const defaultItems = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    sku: "PC500-123",
    stock: 500,
    price: "₹5.99",
    expiry: "12/2025",
    category: "Tablets",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    sku: "AMX250-456",
    stock: 45,
    price: "₹12.50",
    expiry: "08/2024",
    category: "Capsules",
  },
  {
    id: 3,
    name: "Ibuprofen 200mg",
    sku: "IB200-789",
    stock: 1200,
    price: "₹8.25",
    expiry: "05/2026",
    category: "Tablets",
  },
  {
    id: 4,
    name: "Loratadine 10mg",
    sku: "LOR10-101",
    stock: 0,
    price: "₹15.00",
    expiry: "01/2025",
    category: "Syrups",
  },
  {
    id: 5,
    name: "Aspirin 81mg",
    sku: "ASP81-112",
    stock: 80,
    price: "₹4.75",
    expiry: "11/2024",
    category: "Tablets",
  },
];

const statusStyles = {
  "In Stock": "bg-[#e8fff4] text-[#00b074]",
  "Low Stock": "bg-[#fff6dd] text-[#d19a1a]",
  "Out of Stock": "bg-[#fdecec] text-[#d25555]",
};

const statusOptions = ["All", "In Stock", "Low Stock", "Out of Stock"];
const categoryOptions = ["All", "Tablets", "Capsules", "Syrups"];

// Derive status from stock value
function getStatusFromStock(stockRaw) {
  const stock = Number(stockRaw || 0);

  if (stock <= 0) return "Out of Stock";
  if (stock <= 200) return "Low Stock";
  return "In Stock";
}

// Load items from localStorage or use defaults
function loadItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) {
    console.error("Failed to load inventory items:", e);
  }

  // First time: save defaults
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
  return defaultItems;
}

function InventoryList() {
  const navigate = useNavigate();

  const [items, setItems] = useState(defaultItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  // Load from localStorage when page opens
  useEffect(() => {
    const loaded = loadItems();
    setItems(loaded);
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = items
      .filter((item) => {
        const derivedStatus = getStatusFromStock(item.stock);

        const matchesSearch =
          normalizedSearch === "" ||
          item.name.toLowerCase().includes(normalizedSearch) ||
          item.sku.toLowerCase().includes(normalizedSearch);

        const matchesStatus =
          activeStatus === "All" || derivedStatus === activeStatus;

        const matchesCategory =
          activeCategory === "All" || item.category === activeCategory;

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        const [amonth, ayear] = a.expiry.split("/").map(Number);
        const [bmonth, byear] = b.expiry.split("/").map(Number);
        const aDate = new Date(ayear, amonth - 1);
        const bDate = new Date(byear, bmonth - 1);
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      });

    return filtered;
  }, [items, searchTerm, activeStatus, activeCategory, sortOrder]);

  return (
    <div className="min-h-screen bg-[#f6fafb] text-slate-900">
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-100 bg-white px-10 py-5">
            <h1 className="text-[18px] font-semibold text-slate-900">
              Inventory List
            </h1>

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

          <main className="flex-1 overflow-y-auto bg-[#f6fafb] px-10 py-7">
            {/* Search + filters */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex flex-1 items-center gap-4">
                <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                  <input
                    type="text"
                    placeholder="Search by Medicine Name or SKU..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 text-[12px]">
                  {/* Status filter */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setStatusMenuOpen((open) => !open);
                        setCategoryMenuOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-slate-600 shadow-[0_10px_25px_rgba(15,23,42,0.04)] border border-slate-100"
                    >
                      <span>Filter by Status</span>
                      <span>˅</span>
                    </button>
                    {statusMenuOpen && (
                      <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg">
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setActiveStatus(status);
                              setStatusMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category filter */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setCategoryMenuOpen((open) => !open);
                        setStatusMenuOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-slate-600 shadow-[0_10px_25px_rgba(15,23,42,0.04)] border border-slate-100"
                    >
                      <span>Filter by Category</span>
                      <span>˅</span>
                    </button>
                    {categoryMenuOpen && (
                      <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg">
                        {categoryOptions.map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setActiveCategory(category);
                              setCategoryMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sort by expiry */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setSortOrder((order) =>
                          order === "asc" ? "desc" : "asc"
                        )
                      }
                      className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-slate-600 shadow-[0_10px_25px_rgba(15,23,42,0.04)] border border-slate-100"
                    >
                      <span>
                        Sort by Expiry Date{" "}
                        <span className="font-semibold">
                          ({sortOrder === "asc" ? "Asc" : "Desc"})
                        </span>
                      </span>
                      <span>↕</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/add-medicine")}
                className="ml-4 flex items-center gap-2 rounded-xl bg-[#00b074] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_12px_30px_rgba(0,176,116,0.45)] hover:bg-[#049662]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-white/15 text-lg">
                  +
                </span>
                <span>Add New Medicine</span>
              </button>
            </div>

            {/* Table */}
            <div className="rounded-[32px] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#fbfcff] text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-8 py-4">Medicine Name</th>
                      <th className="px-8 py-4">SKU</th>
                      <th className="px-8 py-4">Current Stock</th>
                      <th className="px-8 py-4">Unit Price</th>
                      <th className="px-8 py-4">Expiry Date</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, idx) => {
                      const derivedStatus = getStatusFromStock(item.stock);
                      const isLow = derivedStatus === "Low Stock";
                      const isOut = derivedStatus === "Out of Stock";
                      const rowBg =
                        isLow || isOut ? "bg-[#fff7e6]" : "bg-white";

                      return (
                        <tr
                          key={item.id}
                          className={
                            rowBg +
                            " text-slate-700 " +
                            (idx !== filteredItems.length - 1
                              ? "border-b border-slate-100"
                              : "")
                          }
                        >
                          <td className="px-8 py-4 text-[13px]">
                            {item.name}
                          </td>
                          <td className="px-8 py-4 text-[13px] text-slate-500">
                            {item.sku}
                          </td>
                          <td className="px-8 py-4 text-[13px]">
                            <span
                              className={
                                isLow || isOut
                                  ? "font-semibold text-[#e59b26]"
                                  : ""
                              }
                            >
                              {item.stock}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-[13px] text-slate-700">
                            {item.price}
                          </td>
                          <td className="px-8 py-4 text-[13px] text-slate-700">
                            {item.expiry}
                          </td>
                          <td className="px-8 py-4">
                            <span
                              className={
                                "inline-flex rounded-xl px-3 py-1 text-[11px] font-semibold " +
                                statusStyles[derivedStatus]
                              }
                            >
                              {derivedStatus}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <button
                                onClick={() =>
                                  navigate("/edit-medicine", {
                                    state: { medicine: item },
                                  })
                                }
                                className="text-[12px] font-semibold text-[#1d4ed8] hover:underline"
                              >
                                Edit Details
                              </button>
                              <button
                                onClick={() =>
                                  navigate("/update-stock", {
                                    state: { medicine: item },
                                  })
                                }
                                className="rounded-xl bg-[#00b074] px-4 py-1.5 text-[12px] font-semibold text-white shadow-[0_6px_16px_rgba(0,176,116,0.45)] hover:bg-[#049662]"
                              >
                                Update Stock
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between rounded-b-[32px] border-t border-slate-100 px-8 py-4 text-[12px] text-slate-500">
                <span>
                  Showing {filteredItems.length} of {items.length} results
                </span>
                <div className="flex items-center gap-1">
                  <button className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-xs text-slate-500 hover:bg-s
                  late-50">
                    {"<"}
                  </button>
                  <button className="h-8 w-8 rounded-md border border-[#00b074] bg-[#00b074] text-xs font-semibold text-white">
                    1
                  </button>
                  <button className="h-8 w-8 rounded-md border border-slate-200 text-xs text-slate-600 hover:bg-slate-50">
                    2
                  </button>
                  <button className="h-8 w-8 rounded-md border border-slate-200 text-xs text-slate-600 hover:bg-slate-50">
                    3
                  </button>
                  <span className="px-1 text-xs text-slate-400">...</span>
                  <button className="h-8 w-8 rounded-md border border-slate-200 text-xs text-slate-600 hover:bg-slate-50">
                    8
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-xs text-slate-500 hover:bg-slate-50">
                    {">"}
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

export default InventoryList;
