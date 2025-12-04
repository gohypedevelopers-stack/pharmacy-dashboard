// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardOverview from "./pages/DashboardOverview.jsx";
import NewPrescriptionOrders from "./pages/NewPrescriptionOrders.jsx";
import InventoryList from "./pages/InventoryList.jsx";
import EarningsOverview from "./pages/EarningsOverview.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import EditMedicine from "./pages/EditMedicine.jsx";
import AddNewMedicine from "./pages/AddNewMedicine.jsx";
import UpdateStock from "./pages/UpdateStock.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<DashboardOverview />} />
  <Route path="/dashboard" element={<Navigate to="/" replace />} />
  <Route path="/orders" element={<NewPrescriptionOrders />} />
  <Route path="/orders/:orderId" element={<OrderDetails />} />
  <Route path="/inventory" element={<InventoryList />} />
  <Route path="/inventory/add" element={<AddNewMedicine />} />
  <Route path="/inventory/edit/:id" element={<EditMedicine />} />
  <Route path="/earnings" element={<EarningsOverview />} />
  <Route path="/settings" element={<SettingsPage />} />
  <Route path="/update-stock" element={<UpdateStock />} />

</Routes>

    </BrowserRouter>
  );
}
