import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../pharmacy/components/Sidebar.jsx";
import bellicon from "../../pharmacy/assets/bellicon.png";
import pharmacyProfile from "../../pharmacy/assets/pharmacyprofile.png";
import { apiRequest } from "../../lib/api.js";
import { getPharmacyToken } from "../../lib/pharmacySession.js";

const statusStyles = {
  "In Stock": "bg-[#e8fff4] text-[#00b074]",
  "Low Stock": "bg-[#fff6dd] text-[#d19a1a]",
  "Out of Stock": "bg-[#fdecec] text-[#d25555]",
};

const statusOptions = ["All", "In Stock", "Low Stock", "Out of Stock"];
const categoryOptions = ["All"];

const formatCurrency = (value) => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  }
  return value ?? "₹0";
};

function deriveStatus(stock) {
  if (stock <= 0) return "Out of Stock";
  if (stock <= 200) return "Low Stock";
  return "In Stock";
}

const InventoryList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = getPharmacyToken();
  const pageSize = 10;

  useEffect(() => {
    if (!token) {
      setItems([]);
      return;
    }
    let cancelled = false;
    const fetchInventory = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await apiRequest("/api/pharmacy/products?limit=100", {
          token,
        });
        if (cancelled) return;
        const fetched = Array.isArray(response?.data?.items)
          ? response.data.items
          : [];
        setItems(fetched);
      } catch (err) {
        console.error("Failed to load inventory", err);
        if (!cancelled) {
          setError(err.message || "Unable to fetch inventory");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchInventory();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const categoryFilters = useMemo(
    () => Array.from(new Set(["All", ...items.map((item) => item.category).filter(Boolean)])),
    [items]
  );

  const filtered = useMemo(() => {
    return items
      .filter((item) => {
        const status = deriveStatus(item.stock ?? item.quantity ?? 0);
        const matchesStatus = activeStatus === "All" || status === activeStatus;
        const matchesCategory =
          activeCategory === "All" ||
          (item.category ?? "").toLowerCase() === activeCategory.toLowerCase();
        const matchesSearch =
          normalizedSearch === "" ||
          item.name?.toLowerCase().includes(normalizedSearch) ||
          item.sku?.toLowerCase().includes(normalizedSearch);
        return matchesStatus && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const parseExpiry = (value) => {
          if (!value) return new Date(0);
          const [month, year] = value.split("/").map(Number);
          if (!month || !year) return new Date(0);
          return new Date(year, month - 1);
        };
        const aDate = parseExpiry(a.expiry ?? a.expiryDate);
        const bDate = parseExpiry(b.expiry ?? b.expiryDate);
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      });
  }, [items, activeStatus, activeCategory, normalizedSearch, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [activeStatus, activeCategory, searchTerm, sortOrder]);

  return (
    <div className="min-h-screen bg-[#f6fafb] text-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-100 bg-white px-10 py-5">
            <h1 className="text-[18px] font-semibold text-slate-900">
              Inventory List
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
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="flex-1 min-w-[220px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
              placeholder="Search by medicine name or SKU..."
            />
              <select
                value={activeStatus}
                onChange={(event) => setActiveStatus(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    Filter by Status: {option}
                  </option>
                ))}
              </select>
              <select
                value={activeCategory}
                onChange={(event) => setActiveCategory(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
              >
                {categoryFilters.map((option) => (
                  <option key={option} value={option}>
                    Filter by Category: {option}
                  </option>
                ))}
              </select>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="asc">Sort by Expiry Date (Asc)</option>
                <option value="desc">Sort by Expiry Date (Desc)</option>
              </select>
              <button
                onClick={() => navigate("/pharmacy/add-medicine")}
                className="ml-auto rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-emerald-600"
              >
                Add New Medicine
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <div className="rounded-xl bg-white shadow-[0_16px_40px_rgba(15,23,42,0.04)] border border-slate-100">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-[#fbfcff] text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-6 py-4">Medicine Name</th>
                      <th className="px-6 py-4">SKU</th>
                      <th className="px-6 py-4">Current Stock</th>
                      <th className="px-6 py-4">Unit Price</th>
                      <th className="px-6 py-4">Expiry Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map((item, index) => {
                      const stockValue = Number(item.stock ?? item.quantity ?? 0);
                      const availabilityStatus = deriveStatus(stockValue);
                      const priceValue =
                        typeof item.price === "number"
                          ? item.price
                          : Number(item.price) || Number(item.mrp) || 0;
                      return (
                        <tr
                          key={item._id ?? item.sku ?? index}
                          className={index % 2 === 0 ? "bg-[#fffefe]" : "bg-[#fdfdfd]"}
                        >
                          <td className="px-6 py-3 font-medium text-slate-700">
                            {item.name}
                          </td>
                          <td className="px-6 py-3 text-slate-500">{item.sku}</td>
                          <td className="px-6 py-3 text-slate-900 font-semibold">
                            {stockValue}
                          </td>
                          <td className="px-6 py-3 text-slate-700">
                            {formatCurrency(priceValue)}
                          </td>
                          <td className="px-6 py-3 text-slate-700">
                            {item.expiry ?? item.expiryDate ?? "—"}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`inline-flex rounded-xl px-3 py-1 text-[11px] font-semibold ${
                                statusStyles[availabilityStatus] || "bg-[#E3E8EF] text-[#475569]"
                              }`}
                            >
                              {availabilityStatus}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <button
                              onClick={() =>
                                navigate(`/pharmacy/edit-medicine/${encodeURIComponent(item._id ?? item.sku)}`)
                              }
                              className="rounded-xl border border-emerald-500 px-3 py-1 text-[12px] font-semibold text-emerald-500 hover:bg-emerald-50"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {!paginatedItems.length && (
                      <tr>
                        <td
                          className="px-6 py-6 text-center text-sm text-slate-500"
                          colSpan="7"
                        >
                          {isLoading
                            ? "Loading inventory..."
                            : "No inventory available yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
              <div>
                Showing {paginatedItems.length} of {filtered.length} items
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 disabled:border-slate-200 disabled:text-slate-300"
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 disabled:border-slate-200 disabled:text-slate-300"
                >
                  Next
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
