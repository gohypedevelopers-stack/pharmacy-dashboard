// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import storePanelLogo from "../assets/storepanellogo.png";
import dashboardIcon from "../assets/dashboard.png";
import orderIcon from "../assets/order.png";
import inventoryIcon from "../assets/inventory.png";
import earningIcon from "../assets/earning.png";
import storeIcon from "../assets/store.png";
import supportIcon from "../assets/support.png";
import settingIcon from "../assets/setting.png";
import { getPharmacySession } from "../../lib/pharmacySession.js";

/* Helper component for navigation items */
const NavItem = ({ label, icon, to }) => {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to !== "/" && to !== "/pharmacy" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`w-full flex items-center gap-3 pl-0 pr-4 py-2.5 rounded-xl transition ${
        isActive
          ? "bg-[#E8FBF3] text-emerald-600 font-medium"
          : "text-slate-500 hover:bg-slate-50"
      }`}
    >
      {/* Placeholder Icon - replace with actual icon components if available */}
      <span className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-[15px] text-slate-400">
        {typeof icon === "string" ? (
          <img
            src={icon}
            alt={`${label} icon`}
            className="h-5 w-5 object-contain"
          />
        ) : (
          icon
        )}
      </span>
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const session = getPharmacySession();
  const pharmacy = session?.pharmacy ?? {};
  const storeName = pharmacy?.storeName || session?.user?.userName || "City Pharmacy";
  const statusLabel = (pharmacy?.status ?? "pending").toUpperCase();
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-100">
      <div className="pl-0 pr-2 pt-6 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
            <img
              src={storePanelLogo}
              alt="City Pharmacy logo"
              className="h-15 w-16 rounded-lg object-contain"
            />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 text-[18px]">
              {storeName}
            </h1>
            
          </div>
        </div>
      </div>

      <nav className="flex-1 pl-0 pr-3 py-9 text-[15px] space-y-2">
        <NavItem label="Dashboard" icon={dashboardIcon} to="/pharmacy" />
        <NavItem label="Orders" icon={orderIcon} to="/pharmacy/orders" />
        <NavItem label="Inventory" icon={inventoryIcon} to="/pharmacy/inventory" />
        <NavItem label="Earnings" icon={earningIcon} to="/pharmacy/earnings" />
        <NavItem label="Store Profile" icon={storeIcon} to="/pharmacy/store-profile" />
        <NavItem label="Support" icon={supportIcon} to="/pharmacy/support" />
        <NavItem label="Settings" icon={settingIcon} to="/pharmacy/settings" />
      </nav>

    </aside>
  );
};

export default Sidebar;
