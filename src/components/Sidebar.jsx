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

/* Helper component for navigation items */
const NavItem = ({ label, icon, to }) => {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (to === "/" && location.pathname === "/dashboard");

  return (
    <Link
      to={to}
      className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-xl transition ${
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
  return (
    <aside className="hidden lg:flex flex-col w-30 bg-white border-r border-slate-100">
      <div className="px-6 pt-6 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
            <img
              src={storePanelLogo}
              alt="City Pharmacy logo"
              className="h-8 w-8 rounded-lg object-contain"
            />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 text-[18px]">
              City Pharmacy
            </h1>
            <p className="text-[13px] text-slate-400">Store Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 text-[13px] space-y-1">
        <NavItem label="Dashboard" icon={dashboardIcon} to="/" />
        <NavItem label="Orders" icon={orderIcon} to="/orders" />
        <NavItem label="Inventory" icon={inventoryIcon} to="/inventory" />
        <NavItem label="Earnings" icon={earningIcon} to="/earnings" />
        <NavItem label="Store Profile" icon={storeIcon} to="/store-profile" />
        <NavItem label="Support" icon={supportIcon} to="/support" />
        <NavItem label="Settings" icon={settingIcon} to="/settings" />
      </nav>

      <button className="m-3 mb-5 mt-auto flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] text-slate-500 hover:bg-slate-50">
        <span className="rotate-180">{"\u2192"}</span> {/* Logout Arrow */}
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
