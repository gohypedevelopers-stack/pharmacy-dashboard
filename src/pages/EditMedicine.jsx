// src/pages/EditMedicine.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import bellicon from "../assets/bellicon.png";
import pharmacyProfile from "../assets/pharmacyprofile.png";

function formatRupee(value) {
  if (!value) return "";
  const trimmed = value.toString().trim();
  if (trimmed.startsWith("₹")) return trimmed;
  return `₹${trimmed}`;
}

const STORAGE_KEY = "inventory_items";

function loadInventoryItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load inventory items:", err);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
  return defaultItems;
}

function updateStrengthCombined(value, unit) {
  const v = value || "";
  const u = unit || "mg";
  if (!v) return "";
  return `${v} ${u}`;
}

// SAME default items as InventoryList.jsx (so Edit also knows them)
const defaultItems = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    sku: "PC500-123",
    stock: 500,
    price: "$5.99",
    expiry: "12/2025",
    category: "Tablets",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    sku: "AMX250-456",
    stock: 45,
    price: "$12.50",
    expiry: "08/2024",
    category: "Capsules",
  },
  {
    id: 3,
    name: "Ibuprofen 200mg",
    sku: "IB200-789",
    stock: 1200,
    price: "$8.25",
    expiry: "05/2026",
    category: "Tablets",
  },
  {
    id: 4,
    name: "Loratadine 10mg",
    sku: "LOR10-101",
    stock: 0,
    price: "$15.00",
    expiry: "01/2025",
    category: "Syrups",
  },
  {
    id: 5,
    name: "Aspirin 81mg",
    sku: "ASP81-112",
    stock: 80,
    price: "$4.75",
    expiry: "11/2024",
    category: "Tablets",
  },
];

function EditMedicine() {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = Number(id);

  const [formData, setFormData] = useState({
    brandName: "",
    genericName: "",
    strengthValue: "",
    strengthUnit: "mg",
    strength: "",
    dosageForm: "Tablet",
    mrp: "",
    sellingPrice: "",
    unitPrice: "",
    sku: "",
    batchNumber: "",
    mfgDate: "",
    expiry: "",
    quantityInStock: "",
    packSize: "",
    manufacturerName: "",
    supplierName: "",
    prescriptionRequired: "Yes",
    indications: "",
    sideEffects: "",
    storageConditions: "Room Temperature",
    substitutionsAvailable: "No",
    imageData: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load existing medicine from localStorage OR default items
  useEffect(() => {
    try {
      const stored = loadInventoryItems();
      let existing = stored.find((item) => item.id === numericId);

      // Fallback to default items if not in localStorage
      if (!existing) {
        existing = defaultItems.find((item) => item.id === numericId);
      }

      if (!existing) {
        // If truly not found anywhere, go back to inventory
        navigate("/inventory");
        return;
      }

      // Try to split strength if needed
      let strengthValue = existing.strengthValue || "";
      let strengthUnit = existing.strengthUnit || "mg";

      if ((!strengthValue || !strengthUnit) && existing.strength) {
        const parts = existing.strength.split(" ");
        strengthValue = parts[0] || "";
        strengthUnit = parts[1] || "mg";
      }

      setFormData({
        brandName: existing.brandName || "",
        genericName: existing.genericName || existing.name || "",
        strengthValue: strengthValue,
        strengthUnit: strengthUnit,
        strength:
          existing.strength || updateStrengthCombined(strengthValue, strengthUnit),
        dosageForm: existing.dosageForm || existing.category || "Tablet",
        mrp: existing.mrp || "",
        sellingPrice: existing.sellingPrice || existing.price || "",
        unitPrice: existing.unitPrice || "",
        sku: existing.sku || "",
        batchNumber: existing.batchNumber || "",
        mfgDate: existing.mfgDate || "",
        expiry: existing.expiry || "",
        quantityInStock:
          existing.quantityInStock ?? existing.stock ?? "",
        packSize: existing.packSize || "",
        manufacturerName: existing.manufacturerName || "",
        supplierName: existing.supplierName || "",
        prescriptionRequired: existing.prescriptionRequired || "Yes",
        indications: existing.indications || "",
        sideEffects: existing.sideEffects || "",
        storageConditions: existing.storageConditions || "Room Temperature",
        substitutionsAvailable:
          existing.substitutionsAvailable || "No",
        imageData: existing.imageData || "",
      });

      setImagePreview(existing.imageData || null);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load medicine:", err);
      navigate("/inventory");
    }
  }, [numericId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStrengthValueChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      strengthValue: value,
      strength: updateStrengthCombined(value, prev.strengthUnit),
    }));
  };

  const handleStrengthUnitChange = (e) => {
    const unit = e.target.value;
    setFormData((prev) => ({
      ...prev,
      strengthUnit: unit,
      strength: updateStrengthCombined(prev.strengthValue, unit),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setImagePreview(dataUrl);
      setFormData((prev) => ({
        ...prev,
        imageData: dataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const displayName =
      formData.brandName || formData.genericName || "Unnamed Medicine";

    const price = formatRupee(
      formData.sellingPrice || formData.mrp
    );
    const stock = Number(formData.quantityInStock || 0);
    const category = formData.dosageForm || "Other";

    const updatedItem = {
      id: numericId,
      name: displayName,
      brandName: formData.brandName,
      genericName: formData.genericName,
      strength: formData.strength,
      strengthValue: formData.strengthValue,
      strengthUnit: formData.strengthUnit,
      dosageForm: formData.dosageForm,
      mrp: formatRupee(formData.mrp),
      sellingPrice: formatRupee(formData.sellingPrice),
      unitPrice: formatRupee(formData.unitPrice),
      sku: formData.sku,
      batchNumber: formData.batchNumber,
      mfgDate: formData.mfgDate,
      expiry: formData.expiry,
      quantityInStock: stock,
      packSize: formData.packSize,
      manufacturerName: formData.manufacturerName,
      supplierName: formData.supplierName,
      prescriptionRequired: formData.prescriptionRequired,
      indications: formData.indications,
      sideEffects: formData.sideEffects,
      storageConditions: formData.storageConditions,
      substitutionsAvailable: formData.substitutionsAvailable,
      imageData: formData.imageData,

      // Used by InventoryList.jsx
      stock,
      price,
      category,
    };

    try {
      const existing = loadInventoryItems();

      // Replace existing inventory entry or append if missing
      const existsIndex = existing.findIndex(
        (item) => item.id === numericId
      );

      let updatedList;
      if (existsIndex !== -1) {
        updatedList = existing.map((item) =>
          item.id === numericId ? updatedItem : item
        );
      } else {
        updatedList = [...existing, updatedItem];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (err) {
      console.error("Failed to update medicine:", err);
    }

    navigate("/inventory");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6fafb] text-slate-900">
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex flex-1 items-center justify-center">
            <p className="text-slate-500 text-sm">Loading medicine...</p>
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
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-100 bg-white px-10 py-5">
            <div>
              <h1 className="text-[20px] font-semibold text-slate-900">
                Edit Medicine Details
              </h1>
              <p className="mt-1 text-[12px] text-slate-500">
                Update the details of this medicine in your inventory.
              </p>
            </div>

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

          {/* Content */}
          <main className="flex-1 overflow-y-auto bg-[#f6fafb] px-10 py-7">
            <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.04)] border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Brand & Generic */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Brand Name">
                    <Input
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleChange}
                      placeholder="Calpol 500"
                    />
                  </Field>
                  <Field label="Generic / Active Ingredient Name">
                    <Input
                      name="genericName"
                      value={formData.genericName}
                      onChange={handleChange}
                      placeholder="Paracetamol"
                    />
                  </Field>
                </div>

                {/* Image upload + preview */}
                <div className="grid gap-4 md:grid-cols-[2fr,1.2fr] items-start">
                  <Field label="Medicine Image (optional)">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-[13px] text-slate-700 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-[12px] file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
                    />
                    <p className="mt-1 text-[11px] text-slate-400">
                      Upload or replace the medicine image.
                    </p>
                  </Field>

                  {imagePreview && (
                    <div className="flex flex-col items-start gap-2">
                      <span className="text-[11px] text-slate-500">
                        Preview:
                      </span>
                      <div className="w-full max-w-xs rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                        <img
                          src={imagePreview}
                          alt="Medicine preview"
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Strength & Dosage Form */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Strength / Concentration">
                    <div className="relative">
                      <input
                        type="number"
                        name="strengthValue"
                        value={formData.strengthValue || ""}
                        onChange={handleStrengthValueChange}
                        placeholder="500"
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-3 pr-24 text-[13px] outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                      />

                      <select
                        name="strengthUnit"
                        value={formData.strengthUnit || "mg"}
                        onChange={handleStrengthUnitChange}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 rounded-lg border border-slate-200 bg-white px-2 text-[12px] text-slate-700 outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="mg">mg</option>
                        <option value="mcg">mcg</option>
                        <option value="g">g</option>
                        <option value="mL">mL</option>
                        <option value="%">%</option>
                        <option value="IU">IU</option>
                      </select>
                    </div>
                  </Field>

                  <Field label="Dosage Form">
                    <select
                      name="dosageForm"
                      value={formData.dosageForm}
                      onChange={handleChange}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-[13px] outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option>Tablet</option>
                      <option>Capsule</option>
                      <option>Syrup</option>
                      <option>Injection</option>
                      <option>Cream</option>
                      <option>Ointment</option>
                      <option>Drops</option>
                      <option>Suspension</option>
                      <option>Other</option>
                    </select>
                  </Field>
                </div>

                {/* Prices */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Retail Price (MRP)">
                    <Input
                      name="mrp"
                      value={formData.mrp}
                      onChange={handleChange}
                      placeholder="₹100.00"
                    />
                  </Field>
                  <Field label="Selling Price">
                    <Input
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleChange}
                      placeholder="₹85.00"
                    />
                  </Field>
                  <Field label="Unit Price">
                    <Input
                      name="unitPrice"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      placeholder="₹8.50"
                    />
                  </Field>
                </div>

                {/* SKU, Batch, Pack Size */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Stock Keeping Unit (SKU)">
                    <Input
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="PC500-123"
                    />
                  </Field>
                  <Field label="Batch / Lot Number">
                    <Input
                      name="batchNumber"
                      value={formData.batchNumber}
                      onChange={handleChange}
                      placeholder="BATCH-2024-01"
                    />
                  </Field>
                  <Field label="Pack Size (e.g., Strip of 10)">
                    <Input
                      name="packSize"
                      value={formData.packSize}
                      onChange={handleChange}
                      placeholder="Strip of 10"
                    />
                  </Field>
                </div>

                {/* Dates & Quantity */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Manufacturing Date">
                    <Input
                      name="mfgDate"
                      value={formData.mfgDate}
                      onChange={handleChange}
                      placeholder="01/2024"
                    />
                  </Field>
                  <Field label="Expiry Date (EXP)">
                    <Input
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      placeholder="12/2025"
                    />
                  </Field>
                  <Field label="Quantity in Stock">
                    <Input
                      name="quantityInStock"
                      type="number"
                      min="0"
                      value={formData.quantityInStock}
                      onChange={handleChange}
                      placeholder="500"
                    />
                  </Field>
                </div>

                {/* Manufacturer & Supplier */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Manufacturer Name">
                    <Input
                      name="manufacturerName"
                      value={formData.manufacturerName}
                      onChange={handleChange}
                      placeholder="ABC Pharma Ltd."
                    />
                  </Field>
                  <Field label="Supplier / Distributor Name">
                    <Input
                      name="supplierName"
                      value={formData.supplierName}
                      onChange={handleChange}
                      placeholder="XYZ Distributors"
                    />
                  </Field>
                </div>

                {/* Prescription, Storage, Substitutions */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Prescription Required">
                    <select
                      name="prescriptionRequired"
                      value={formData.prescriptionRequired}
                      onChange={handleChange}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-[13px] outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </Field>

                  <Field label="Storage Conditions">
                    <select
                      name="storageConditions"
                      value={formData.storageConditions}
                      onChange={handleChange}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-[13px] outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option>Room Temperature</option>
                      <option>Refrigerate</option>
                      <option>Keep away from light</option>
                      <option>Store in a cool, dry place</option>
                      <option>Other</option>
                    </select>
                  </Field>

                  <Field label="Substitutions Available">
                    <select
                      name="substitutionsAvailable"
                      value={formData.substitutionsAvailable}
                      onChange={handleChange}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-[13px] outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </Field>
                </div>

                {/* Indications */}
                <Field label="Indications / Use">
                  <textarea
                    name="indications"
                    value={formData.indications}
                    onChange={handleChange}
                    placeholder="Used for relief of fever, mild to moderate pain, etc."
                    className="min-h-[70px] w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </Field>

                {/* Side Effects & Warnings */}
                <Field label="Side Effects & Warnings">
                  <textarea
                    name="sideEffects"
                    value={formData.sideEffects}
                    onChange={handleChange}
                    placeholder="May cause nausea, dizziness. Avoid overdose. Consult physician before use."
                    className="min-h-[70px] w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </Field>

                {/* Footer buttons */}
                <div className="mt-4 flex justify-end gap-3 text-[13px]">
                  <button
                    type="button"
                    onClick={() => navigate("/inventory")}
                    className="px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#00b074] text-white font-medium hover:bg-[#049662] shadow-[0_12px_30px_rgba(0,176,116,0.45)]"
                  >
                    Save Changes
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

/* Helper components */
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

export default EditMedicine;
