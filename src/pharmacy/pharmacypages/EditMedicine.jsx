import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Sidebar from "../../pharmacy/components/Sidebar.jsx";
import bellicon from "../../pharmacy/assets/bellicon.png";
import pharmacyProfile from "../../pharmacy/assets/pharmacyprofile.png";
import { apiRequest } from "../../lib/api.js";
import { getPharmacyToken } from "../../lib/pharmacySession.js";

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[12px] text-slate-500">{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[13px] outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
  />
);

function EditMedicine() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = getPharmacyToken();
  const routeId =
    id ??
    location.state?.productId ??
    new URLSearchParams(location.search).get("productId");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    mrp: "",
    stock: "",
    category: "Tablets",
    dosageForm: "Tablet",
    strength: "",
    images: [],
    status: "active",
    expiry: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !routeId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const resp = await apiRequest(`/api/pharmacy/products/${encodeURIComponent(routeId)}`, {
          token,
        });
        if (cancelled) return;
        const product = resp?.data;
        if (!product) throw new Error("Product not found");
        setFormData({
          name: product.name ?? "",
          sku: product.sku ?? "",
          price: product.price ?? "",
          mrp: product.mrp ?? "",
          stock: product.stock ?? "",
          category: product.category ?? "Tablets",
          dosageForm: product.dosageForm ?? product.category ?? "Tablet",
          strength: product.strength ?? "",
          images: product.images ?? [],
          status: product.status ?? "active",
          expiry: product.expiry ?? "",
        });
      } catch (err) {
        console.error("Failed to load product", err);
        if (!cancelled) {
          setError(err.message || "Unable to load product");
          navigate("/inventory");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProduct();
    return () => (cancelled = true);
  }, [routeId, token, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token || !routeId) {
      return;
    }
    setSaving(true);
    setError("");
    try {
      await apiRequest(`/api/pharmacy/products/${routeId}`, {
        method: "PUT",
        token,
        body: {
          name: formData.name,
          sku: formData.sku,
          price: Number(formData.price) || 0,
          mrp: Number(formData.mrp) || 0,
          stock: Number(formData.stock) || 0,
          category: formData.category,
          dosageForm: formData.dosageForm,
          strength: formData.strength,
          expiry: formData.expiry,
          status: formData.status,
        },
      });
      navigate("/inventory");
    } catch (err) {
      console.error("Failed to update product", err);
      setError(err.message || "Unable to update medicine");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6fafb] text-slate-900">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-slate-600">Loading medicine details…</p>
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
              Edit Medicine
            </h1>
            <div className="flex gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <img src={bellicon} alt="Notifications" />
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffe9d6]">
                <img src={pharmacyProfile} alt="Profile" />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-[#f6fafb] px-10 py-7">
            <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)] space-y-6">
              {error && (
                <div className="rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
                  {error}
                </div>
              )}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Medicine Name">
                    <Input name="name" value={formData.name} onChange={handleChange} />
                  </Field>
                  <Field label="SKU">
                    <Input name="sku" value={formData.sku} onChange={handleChange} />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Category">
                    <Input name="category" value={formData.category} onChange={handleChange} />
                  </Field>
                  <Field label="Dosage Form">
                    <Input name="dosageForm" value={formData.dosageForm} onChange={handleChange} />
                  </Field>
                  <Field label="Strength">
                    <Input name="strength" value={formData.strength} onChange={handleChange} />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Unit Price">
                    <Input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </Field>
                  <Field label="MRP">
                    <Input
                      name="mrp"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.mrp}
                      onChange={handleChange}
                    />
                  </Field>
                  <Field label="Stock">
                    <Input
                      name="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                    />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Expiry">
                    <Input name="expiry" value={formData.expiry} onChange={handleChange} />
                  </Field>
                  <Field label="Status">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </Field>
                </div>
                <div className="flex justify-end gap-3 text-[13px]">
                  <button
                    type="button"
                    onClick={() => navigate("/pharmacy/inventory")}
                    className="px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 rounded-full bg-emerald-500 text-white font-medium shadow-[0_12px_30px_rgba(0,176,116,0.45)] hover:bg-emerald-600 disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default EditMedicine;
