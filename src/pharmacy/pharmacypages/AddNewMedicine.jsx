import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../pharmacy/components/Sidebar.jsx";
import bellicon from "../../pharmacy/assets/bellicon.png";
import pharmacyProfile from "../../pharmacy/assets/pharmacyprofile.png";
import { apiRequest } from "../../lib/api.js";
import { getPharmacyToken } from "../../lib/pharmacySession.js";

const initialFormState = {
  brandName: "",
  genericName: "",
  dosageForm: "Tablet",
  strengthValue: "",
  strengthUnit: "mg",
  mrp: "",
  price: "",
  sku: "",
  quantityInStock: "",
  expiry: "",
  category: "Tablets",
  prescriptionRequired: "Yes",
};

const formatNumber = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return undefined;
  return num;
};

const combineStrength = (value, unit) => {
  if (!value) return "";
  return `${value} ${unit}`;
};

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[12px] text-slate-500">{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-[13px] outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
  />
);

function AddNewMedicine() {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const token = getPharmacyToken();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      setFeedback("Please log in as a pharmacy to add a medicine.");
      return;
    }

    setFeedback("");
    setLoading(true);
    try {
      const payload = {
        name: formData.brandName || formData.genericName,
        sku: formData.sku,
        category: formData.category,
        brand: formData.brandName,
        price: formatNumber(formData.price) ?? 0,
        mrp: formatNumber(formData.mrp),
        stock: Number(formData.quantityInStock) || 0,
        dosageForm: formData.dosageForm,
        strength: combineStrength(formData.strengthValue, formData.strengthUnit),
        tags: [formData.category, formData.dosageForm],
        isPrescriptionRequired: formData.prescriptionRequired === "Yes",
        expiry: formData.expiry,
        images: imagePreview ? [{ url: imagePreview, filename: "upload.jpg" }] : [],
      };
      await apiRequest("/api/pharmacy/products", {
        method: "POST",
        token,
        body: payload,
      });
      navigate("/pharmacy/inventory");
    } catch (error) {
      console.error("Add medicine failed:", error);
      setFeedback(error.message || "Unable to add medicine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fafb] text-slate-900">
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-100 bg-white px-10 py-5">
            <h1 className="text-[18px] font-semibold text-slate-900">Add New Medicine</h1>
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
            <div className="rounded-[40px] border border-slate-100 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              {feedback && (
                <div className="mb-4 rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
                  {feedback}
                </div>
              )}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Brand Name">
                    <Input name="brandName" value={formData.brandName} onChange={handleChange} />
                  </Field>
                  <Field label="Generic Name">
                    <Input name="genericName" value={formData.genericName} onChange={handleChange} />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Dosage Form">
                    <select
                      name="dosageForm"
                      value={formData.dosageForm}
                      onChange={handleChange}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[13px]"
                    >
                      <option>Tablet</option>
                      <option>Capsule</option>
                      <option>Syrup</option>
                      <option>Injection</option>
                    </select>
                  </Field>
                  <Field label="Strength Value">
                    <Input
                      name="strengthValue"
                      value={formData.strengthValue}
                      onChange={handleChange}
                      placeholder="500"
                    />
                  </Field>
                  <Field label="Strength Unit">
                    <select
                      name="strengthUnit"
                      value={formData.strengthUnit}
                      onChange={handleChange}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[13px]"
                    >
                      <option>mg</option>
                      <option>ml</option>
                      <option>g</option>
                    </select>
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="MRP">
                    <Input name="mrp" value={formData.mrp} onChange={handleChange} type="number" min="0" step="0.01" />
                  </Field>
                  <Field label="Unit Selling Price">
                    <Input name="price" value={formData.price} onChange={handleChange} type="number" min="0" step="0.01" />
                  </Field>
                  <Field label="Quantity in Stock">
                    <Input
                      name="quantityInStock"
                      value={formData.quantityInStock}
                      onChange={handleChange}
                      type="number"
                      min="0"
                    />
                  </Field>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="SKU">
                    <Input name="sku" value={formData.sku} onChange={handleChange} />
                  </Field>
                  <Field label="Expiry Date">
                    <Input name="expiry" value={formData.expiry} onChange={handleChange} placeholder="MM/YYYY" />
                  </Field>
                  <Field label="Category">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[13px]"
                    >
                      <option>Tablet</option>
                      <option>Capsule</option>
                      <option>Syrup</option>
                      <option>Suspension</option>
                      <option>Solution</option>
                      <option>Drops</option>
                      <option>Injection</option>
                      <option>Cream</option>
                      <option>Ointment</option>
                      <option>Gel</option>
                      <option>Lotion</option>
                      <option>Powder</option>
                      <option>Granules/Sachet</option>
                      <option>Spray</option>
                      <option>Inhaler</option>
                      <option>Nebulizer Solution</option>
                      <option>Mouthwash/Gargle</option>
                      <option>Lozenge</option>
                      <option>Suppository</option>
                      <option>Patch</option>
                    </select>
                  </Field>
                </div>
                <div>
                  <label className="text-[12px] text-slate-500">Medicine Image (optional)</label>
                  <input type="file" onChange={handleImageChange} className="mt-2 rounded-xl border border-slate-200 px-3 py-2" />
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-3 h-20 w-20 rounded-xl object-cover" />
                  )}
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
                    disabled={loading}
                    className="px-5 py-2 rounded-full bg-emerald-500 text-white font-medium hover:bg-emerald-600 shadow-[0_12px_30px_rgba(0,176,116,0.45)] disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save Medicine"}
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

export default AddNewMedicine;
