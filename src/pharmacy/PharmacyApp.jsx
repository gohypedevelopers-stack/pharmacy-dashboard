// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardOverview from "./pharmacypages/DashboardOverview.jsx";
import NewPrescriptionOrders from "./pharmacypages/NewPrescriptionOrders.jsx";
import InventoryList from "./pharmacypages/InventoryList.jsx";
import EarningsOverview from "./pharmacypages/EarningsOverview.jsx";
import SettingsPage from "./pharmacypages/SettingsPage.jsx";
import OrderDetails from "./pharmacypages/OrderDetails.jsx";
import EditMedicine from "./pharmacypages/EditMedicine.jsx";
import AddNewMedicine from "./pharmacypages/AddNewMedicine.jsx";
import UpdateStock from "./pharmacypages/UpdateStock.jsx";


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
  <Route path="/add-medicine" element={<AddNewMedicine />} />
  <Route path="/inventory/edit/:id" element={<EditMedicine />} />
  <Route path="/earnings" element={<EarningsOverview />} />
  <Route path="/settings" element={<SettingsPage />} />
  <Route path="/update-stock" element={<UpdateStock />} />

</Routes>

    </BrowserRouter>
  );
}
