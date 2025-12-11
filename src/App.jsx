// src/App.jsx

import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import DashboardOverview from "./pharmacy/pharmacypages/DashboardOverview.jsx";
import InventoryList from "./pharmacy/pharmacypages/InventoryList.jsx";
import NewPrescriptionOrders from "./pharmacy/pharmacypages/NewPrescriptionOrders.jsx";
import OrderDetails from "./pharmacy/pharmacypages/OrderDetails.jsx";
import EarningsOverview from "./pharmacy/pharmacypages/EarningsOverview.jsx";
import SettingsPage from "./pharmacy/pharmacypages/SettingsPage.jsx";
import AddNewMedicine from "./pharmacy/pharmacypages/AddNewMedicine.jsx";
import EditMedicine from "./pharmacy/pharmacypages/EditMedicine.jsx";
import UpdateStock from "./pharmacy/pharmacypages/UpdateStock.jsx";
import StoreProfile from "./pharmacy/pharmacypages/StoreProfile.jsx";
import Support from "./pharmacy/pharmacypages/Support.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LoginModal from "./components/LoginModal.jsx";
import SignupModal from "./components/SignupModal.jsx";
import OTPModal from "./components/OTPModal.jsx";
import PharmacyLoginModal from "./pharmacypage/PharmacyLoginModal.jsx";
import PharmacySignupModal from "./pharmacypage/PharmacySignupModal.jsx"; // if you created it

import Home from "./pages/Home.jsx";
import Benefits from "./pages/Benefits.jsx";
import DoctorPersonalDetails from "./pages/DoctorPersonalDetails.jsx";
import DoctorQualifications from "./pages/DoctorQualifications.jsx";
import DoctorRegistration from "./pages/DoctorRegistration.jsx";
import DoctorIdentity from "./pages/DoctorIdentity.jsx";
import DoctorFaceVerification from "./pages/DoctorFaceVerification.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import DoctorVerificationSubmitted from "./pages/DoctorVerificationSubmitted.jsx";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegisterFlow = location.pathname.startsWith("/register");

  const [isLoginOpen, setIsLoginOpen] = useState(false); // doctor login
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken"));
  const [authUser, setAuthUser] = useState(() => {
    try {
      const stored = localStorage.getItem("authUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [pharmacySession, setPharmacySession] = useState(() => {
    try {
      const stored = localStorage.getItem("pharmacySession");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Pharmacy auth UI state
  const [isPharmacyLoginOpen, setIsPharmacyLoginOpen] = useState(false);
  const [isPharmacySignupOpen, setIsPharmacySignupOpen] = useState(false);

  useEffect(() => {
    if (!authToken && location.pathname.startsWith("/dashboard")) {
      setIsLoginOpen(true);
    }
  }, [authToken, location.pathname]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authToken]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem("authUser", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [authUser]);

  useEffect(() => {
    if (pharmacySession) {
      localStorage.setItem("pharmacySession", JSON.stringify(pharmacySession));
    } else {
      localStorage.removeItem("pharmacySession");
    }
  }, [pharmacySession]);

  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const handleLoginSuccess = ({ user, token }) => {
    setAuthUser(user || null);
    setAuthToken(token || null);
    setIsLoginOpen(false);
    navigate("/dashboard");
  };

  const handlePharmacyLoginSuccess = (session) => {
    setPharmacySession(session ?? null);
    setIsPharmacyLoginOpen(false);
    if (session?.token) {
      navigate("/pharmacy");
    }
  };

  const handlePharmacyLogout = () => {
    setPharmacySession(null);
    navigate("/");
  };

  const handleSignupSuccess = (email) => {
    setIsSignupOpen(false);
    setOtpEmail(email);
    setIsOtpOpen(true);
  };

  const handleLogout = () => {
    setAuthUser(null);
    setAuthToken(null);
    navigate("/");
  };

  // Home hero / CTA handlers
  const handleDoctorJoinClick = () => {
    if (authToken) {
      navigate("/dashboard");
    } else {
      setIsLoginOpen(true);
    }
  };

  const handlePharmacyJoinClick = () => {
    setIsPharmacyLoginOpen(true);
  };

  const ProtectedRoute = ({ children, onRequireAuth }) => {
    if (!authToken) {
      onRequireAuth?.();
      return (
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
          Please log in to continue.
          <button
            type="button"
            onClick={() => setIsLoginOpen(true)}
            className="ml-3 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Open login
          </button>
        </div>
      );
    }
    return children;
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-[50px]">
      {!isRegisterFlow && (
        <>
          <Navbar
            onLoginClick={() => setIsLoginOpen(true)}
            isAuthenticated={Boolean(authUser)}
            onLogout={handleLogout}
            onSignupClick={() => setIsSignupOpen(true)}
            pharmacySession={pharmacySession}
            onPharmacyLogout={handlePharmacyLogout}
          />

          {/* Doctor auth modals */}
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setIsSignupOpen(true)}
          />
          <SignupModal
            isOpen={isSignupOpen}
            onClose={() => setIsSignupOpen(false)}
            onSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setIsLoginOpen(true)}
          />
          <OTPModal
            isOpen={isOtpOpen}
            onClose={() => setIsOtpOpen(false)}
            email={otpEmail}
            onVerified={() => {
              setIsOtpOpen(false);
              setIsLoginOpen(true);
            }}
          />

          {/* Pharmacy auth modals */}
          <PharmacyLoginModal
            isOpen={isPharmacyLoginOpen}
            onClose={() => setIsPharmacyLoginOpen(false)}
            onSuccess={handlePharmacyLoginSuccess}
            onSwitchToSignup={() => {
              setIsPharmacyLoginOpen(false);
              setIsPharmacySignupOpen(true);
            }}
            onForgotPassword={() => {
              navigate("/pharmacy/settings"); // placeholder for future flow
            }}
          />

          <PharmacySignupModal
            isOpen={isPharmacySignupOpen}
            onClose={() => setIsPharmacySignupOpen(false)}
            onSuccess={(email) => {
              setIsPharmacySignupOpen(false);
              setIsPharmacyLoginOpen(true);
            }}
            onSwitchToLogin={() => {
              setIsPharmacySignupOpen(false);
              setIsPharmacyLoginOpen(true);
            }}
          />
        </>
      )}

      <main className="flex-1">
        <Routes>
          {/* Marketing pages */}
          <Route
            path="/"
            element={
              <Home
                onDoctorJoinClick={handleDoctorJoinClick}
                onPharmacyJoinClick={handlePharmacyJoinClick}
              />
            }
          />
          <Route path="/benefits" element={<Benefits />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute onRequireAuth={() => setIsLoginOpen(true)}>
                <DoctorDashboard token={authToken} user={authUser} />
              </ProtectedRoute>
            }
          />

          {/* Registration + KYC flow */}
          <Route path="/register" element={<DoctorPersonalDetails />} />
          <Route
            path="/register/qualifications"
            element={<DoctorQualifications />}
          />
          <Route
            path="/register/registration"
            element={<DoctorRegistration />}
          />
          <Route path="/register/identity" element={<DoctorIdentity />} />
          <Route
            path="/register/face-verification"
            element={<DoctorFaceVerification />}
          />
          <Route
            path="/register/verification-submitted"
            element={<DoctorVerificationSubmitted />}
          />
          <Route path="/pharmacy" element={<DashboardOverview />} />
          <Route path="/pharmacy/inventory" element={<InventoryList />} />
          <Route path="/pharmacy/orders" element={<NewPrescriptionOrders />} />
          <Route path="/pharmacy/orders/:orderId" element={<OrderDetails />} />
          <Route path="/pharmacy/add-medicine" element={<AddNewMedicine />} />
          <Route
            path="/pharmacy/edit-medicine/:id"
            element={<EditMedicine />}
          />
          <Route path="/pharmacy/update-stock" element={<UpdateStock />} />
          <Route path="/pharmacy/settings" element={<SettingsPage />} />
          <Route path="/pharmacy/earnings" element={<EarningsOverview />} />
          <Route path="/pharmacy/store-profile" element={<StoreProfile />} />
          <Route path="/pharmacy/support" element={<Support />} />
          <Route path="/orders" element={<NewPrescriptionOrders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/inventory" element={<InventoryList />} />
          <Route path="/inventory/add" element={<AddNewMedicine />} />
          <Route path="/inventory/edit/:id" element={<EditMedicine />} />
          <Route path="/earnings" element={<EarningsOverview />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/update-stock" element={<UpdateStock />} />
          <Route path="/add-medicine" element={<AddNewMedicine />} />
          <Route path="/store-profile" element={<StoreProfile />} />
          <Route path="/support" element={<Support />} />

        </Routes>
      </main>

      {!isRegisterFlow && <Footer />}
    </div>
  );
}
