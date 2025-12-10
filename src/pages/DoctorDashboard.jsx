// src/pages/DoctorDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { apiRequest } from "../lib/api.js";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const sidebarSections = [
  { id: "2.1", label: "Onboarding" },
  { id: "2.2", label: "Doctor Profile" },
  { id: "2.3", label: "Doctor Calendar & Availability" },
  { id: "2.4", label: "Appointment Management" },
  { id: "2.5", label: "Follow-Up System" },
  { id: "2.6", label: "Patient CRM" },
  { id: "2.7", label: "Consultation Notes" },
  { id: "2.8", label: "Prescription Writing" },
  { id: "2.9", label: "Financial Tools" },
  { id: "2.10", label: "Leads & Referrals" },
  { id: "2.11", label: "Chat & Video" },
  { id: "2.12", label: "Notifications" },
];

const SectionHeader = ({ kicker, title, subtitle, action }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      {kicker && (
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          {kicker}
        </p>
      )}
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const Sidebar = ({ activeSection, setActiveSection, userName }) => {
  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";
  else greeting = "Good evening";

  return (
    <aside className="hidden md:flex md:w-72 xl:w-80 flex-col gap-4 border-r border-slate-200 bg-slate-50 px-4 py-6">
      <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <div
          className="inline-flex items-center rounded-full
            bg-gradient-to-r from-blue-600 to-emerald-500
            px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white
            shadow-[0_0_12px_rgba(37,99,235,1),0_0_20px_rgba(16,185,129,1)]
            animate-pulse"
        >
          Doorspital
        </div>

        <p className="mt-2 text-lg text-slate-500">
            {greeting}, <span className="font-semibold text-slate-900">{userName ?? "Doctor"}</span>
          </p>
      </div>
      <div className="w-full border-t border-transparent bg-gradient-to-r from-emerald-200 via-emerald-300 to-emerald-400 py-0.5"></div>
      <nav className="flex-1 space-y-3 overflow-y-auto px-1 pt-3">
        <div className="space-y-2">
          {sidebarSections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`flex w-full items-center justify-between rounded-[5px] border px-4 py-3 text-sm font-medium leading-tight transition
                  ${isActive
                    ? "border-blue-300 bg-white shadow-sm text-slate-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/40"
                  }
                `}
              >
                <span className="flex-1 text-left text-base font-medium tracking-tight text-slate-900 leading-snug">
                  {section.label}
                </span>
                <span
                  className={`flex h-6 items-center rounded-[5px] px-3 py-1 text-[11px] font-semibold leading-none
                    ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}
                  `}
                >
                  {isActive ? "Active" : "View"}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

const safeArray = (...values) => {
  for (const value of values) {
    if (Array.isArray(value) && value.length) {
      return value;
    }
  }
  return [];
};

const pickValue = (source = {}, keys = [], fallback = undefined) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }
  return fallback;
};

const formatTime = (value) => {
  if (!value) return "TBD";
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return value;
};

const normalizeList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (payload.items && Array.isArray(payload.items)) return payload.items;
  if (payload.data && Array.isArray(payload.data)) return payload.data;
  if (payload.appointments && Array.isArray(payload.appointments)) return payload.appointments;
  if (payload.patients && Array.isArray(payload.patients)) return payload.patients;
  if (payload.notifications && Array.isArray(payload.notifications)) return payload.notifications;
  return [];
};

const weeklySchedule = [];

const extractArrayFromPayload = (payload, keys = []) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (payload?.[key] && Array.isArray(payload[key])) {
      return payload[key];
    }
  }
  return [];
};

const buildSnapshotStats = (overview = {}) => {
  const fallback = [
    {
      label: "Verification tasks",
      value: pickValue(overview, ["verificationTasks", "verificationPending", "verifications"], "—"),
      meta: pickValue(overview, ["verificationMeta", "verificationMessage"], ""),
    },
    {
      label: "Clinics synced",
      value: pickValue(overview, ["clinicsSynced", "clinicCount"], "—"),
      meta: pickValue(overview, ["lastClinicSync"], ""),
    },
    {
      label: "Today’s visits",
      value: pickValue(overview, ["todayVisits", "visitsToday"], "—"),
      meta: pickValue(overview, ["visitMeta"], ""),
    },
    {
      label: "Follow-ups",
      value: pickValue(overview, ["followUps", "followUpsPending"], "—"),
      meta: pickValue(overview, ["followUpMeta"], ""),
    },
  ];

  const metrics = safeArray(overview?.metrics, overview?.stats, overview?.dashboardStats);
  if (metrics.length) {
    return metrics.map((metric) => ({
      label: metric.label ?? metric.title ?? "Metric",
      value: metric.value ?? metric.count ?? metric.total ?? "—",
      meta: metric.meta ?? metric.subtitle ?? metric.description ?? "",
    }));
  }

  return fallback;
};

const buildOnboardingSteps = (overview = {}) =>
  safeArray(overview?.onboardingSteps, overview?.onboarding?.steps, overview?.verificationSteps).map(
    (step, index) => ({
      title: step.title ?? step.name ?? `Step ${index + 1}`,
      type: step.type ?? step.category ?? "Task",
      status: step.status ?? step.state ?? "Pending",
    })
  );

const buildAppointments = (items = []) =>
  normalizeList(items).map((appt) => ({
    patient: pickValue(appt, ["patientName", "patient", "name"], "Patient"),
    mode: pickValue(appt, ["mode", "type"], "Video"),
    time: formatTime(appt.startTime ?? appt.time ?? appt.slot),
    status: pickValue(appt, ["status", "state"], "Pending"),
    notes: pickValue(appt, ["reason", "notes"], ""),
  }));

const buildPatients = (items = []) =>
  normalizeList(items).map((patient) => ({
    name: patient.name ?? patient.fullName ?? "Patient",
    lastVisit: patient.lastVisit ?? patient.recentVisit ?? "—",
    consent: patient.consent ?? patient.hasConsent ?? false,
    prescriptions: patient.prescriptions ?? patient.prescriptionCount ?? 0,
  }));

const buildNotifications = (items = []) =>
  normalizeList(items).map((notification) => ({
    title: notification.title ?? notification.message ?? "Notification",
    detail: notification.detail ?? notification.body ?? "",
    time: notification.time ?? notification.createdAt ?? "",
  }));

export default function DoctorDashboard({ token, user }) {
  const [activeSection, setActiveSection] = useState("2.1");
  const [overview, setOverview] = useState(null);
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [availabilitySchedule, setAvailabilitySchedule] = useState([]);
  const [availabilityError, setAvailabilityError] = useState("");
  const [pharmacyProducts, setPharmacyProducts] = useState([]);
  const [pharmacyProductError, setPharmacyProductError] = useState("");
  const [pharmacyOrders, setPharmacyOrders] = useState([]);
  const [pharmacyOrdersError, setPharmacyOrdersError] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verificationError, setVerificationError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const resolvedDoctorId = useMemo(() => {
    const fromProfile = pickValue(profile, ["doctorId", "_id", "id"]);
    if (fromProfile) return fromProfile;
    const overviewDoctor = overview?.doctor ?? {};
    const fromOverviewDoctor = pickValue(overviewDoctor, ["_id", "id"]);
    return fromOverviewDoctor || pickValue(overview, ["doctorId"]);
  }, [overview, profile]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    const load = async () => {
      try {
        const [overviewResp, appointmentsResp, patientsResp, notificationsResp, profileResp] =
          await Promise.all([
            apiRequest("/api/doctors/dashboard/overview", { token }),
            apiRequest("/api/doctors/dashboard/appointments?limit=6", { token }),
            apiRequest("/api/doctors/dashboard/patients?limit=6", { token }),
            apiRequest("/api/notifications?limit=6", { token }),
            apiRequest("/api/profile/me", { token }),
          ]);
        if (cancelled) return;
        setOverview(overviewResp);
        setAppointments(normalizeList(appointmentsResp));
        setPatients(normalizeList(patientsResp));
        setNotifications(normalizeList(notificationsResp));
        setProfile(profileResp);
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token || !resolvedDoctorId) {
      setAvailabilitySchedule([]);
      setAvailabilityError("");
      return;
    }
    let cancelled = false;
    setAvailabilityError("");

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
    const start = new Date().toISOString();

    const loadAvailability = async () => {
      try {
        const data = await apiRequest(
          `/api/doctors/${resolvedDoctorId}/availability/schedule?start=${encodeURIComponent(
            start
          )}&days=7&tz=${encodeURIComponent(timezone)}`,
          { token }
        );
        if (cancelled) return;
        const schedule = extractArrayFromPayload(data, [
          "schedule",
          "availability",
          "slots",
          "days",
          "data",
        ]);
        setAvailabilitySchedule(schedule);
      } catch (err) {
        if (!cancelled) {
          setAvailabilityError(err.message);
        }
      }
    };

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [token, resolvedDoctorId]);

  useEffect(() => {
    if (!token || !resolvedDoctorId) {
      setVerificationStatus(null);
      setVerificationError("");
      return;
    }

    let cancelled = false;
    setVerificationError("");

    const loadVerification = async () => {
      try {
        const data = await apiRequest(`/api/doctors/verification/${resolvedDoctorId}`, { token });
        if (cancelled) return;
        setVerificationStatus(data);
      } catch (err) {
        if (!cancelled) {
          setVerificationError(err.message);
        }
      }
    };

    loadVerification();

    return () => {
      cancelled = true;
    };
  }, [token, resolvedDoctorId]);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const data = await apiRequest("/api/pharmacy/products?limit=6");
        if (cancelled) return;
        setPharmacyProducts(normalizeList(data));
      } catch (err) {
        if (!cancelled) {
          setPharmacyProductError(err.message);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setPharmacyOrders([]);
      setPharmacyOrdersError("");
      return;
    }

    let cancelled = false;

    const loadOrders = async () => {
      try {
        const data = await apiRequest("/api/pharmacy/orders/me?limit=5", { token });
        if (cancelled) return;
        setPharmacyOrders(normalizeList(data));
      } catch (err) {
        if (!cancelled) {
          setPharmacyOrdersError(err.message);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const snapshotStats = useMemo(() => buildSnapshotStats(overview), [overview]);
  const onboardingSteps = useMemo(() => buildOnboardingSteps(overview), [overview]);
  const appointmentQueue = useMemo(() => buildAppointments(appointments), [appointments]);
  const crmPatients = useMemo(() => buildPatients(patients), [patients]);
  const notificationList = useMemo(() => buildNotifications(notifications), [notifications]);

  const calendarRows = useMemo(() => {
    const source = availabilitySchedule.length ? availabilitySchedule : weeklySchedule;
    return source.map((day, index) => {
      const label =
        day.day ??
        day.label ??
        day.weekday ??
        day.name ??
        day.date ??
        `Day ${index + 1}`;
      const entries = safeArray(
        day.slots,
        day.times,
        day.blocks,
        day.entries,
        day.availability,
        day.schedule
      );
      const slots = entries.map((slot) => {
        if (typeof slot === "string") return slot;
        if (slot.startTime || slot.from) {
          const start = slot.startTime ?? slot.from ?? "TBD";
          const end = slot.endTime ?? slot.to ?? "TBD";
          const descriptor = slot.mode ?? slot.type ?? slot.label ?? slot.activity ?? "";
          return `${start} - ${end}${descriptor ? ` (${descriptor})` : ""}`;
        }
        if (slot.time) {
          const descriptor = slot.mode ? ` (${slot.mode})` : "";
          return `${formatTime(slot.time)}${descriptor}`;
        }
        return slot.label ?? slot.title ?? "Slot";
      });
      return { label, slots };
    });
  }, [availabilitySchedule, weeklySchedule]);

  const availabilitySourceLabel = availabilitySchedule.length ? "Live availability" : "Planned schedule";

  const pharmacyOrderStats = useMemo(() => {
    if (!pharmacyOrders.length) return null;
    const statuses = {};
    let totalAmount = 0;
    pharmacyOrders.forEach((order) => {
      const status = pickValue(order, ["status", "state"], "unknown");
      statuses[status] = (statuses[status] ?? 0) + 1;
      const amount = Number(pickValue(order, ["total", "amount", "grandTotal"], 0));
      if (Number.isFinite(amount)) {
        totalAmount += amount;
      }
    });
    return { total: pharmacyOrders.length, statuses, totalAmount };
  }, [pharmacyOrders]);

  const pharmacyProductCatalog = useMemo(() => pharmacyProducts, [pharmacyProducts]);

  const profileSummary = useMemo(
    () => ({
      name: pickValue(profile, ["name", "fullName", "userName"], "Doctor"),
      specialty: pickValue(profile, ["specialty", "specialization"], "General"),
      experience: pickValue(profile, ["experienceYears", "experience"], "-"),
      languages: profile?.languages ?? [],
    }),
    [profile]
  );

  const welcomeName = useMemo(
    () => profileSummary.name || user?.userName || "Doctor",
    [profileSummary.name, user?.userName]
  );

  const verificationNotes = pickValue(verificationStatus, ["reviewNotes", "notes", "remark"], "");

  const activeLabel =
    sidebarSections.find((section) => section.id === activeSection)?.label ?? "Focus area";

  const loadingOverlay = (
    <div className="rounded-[5px] border border-blue-100 bg-white/90 px-6 py-4 shadow-sm text-sm text-slate-600">
      {error ? <span className="text-rose-500">{error}</span> : "Fetching dashboard data..."}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userName={welcomeName}
      />
      <main className="flex-1 px-4 pb-16 pt-6 md:px-6 lg:px-10">
        {loading && loadingOverlay}

        <motion.section
          className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {snapshotStats.map((stat) => (
            <div key={stat.label} className="rounded-[5px] border border-slate-100 bg-white px-6 py-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
              <p className="mt-3 text-4xl font-semibold text-slate-900">{stat.value}</p>
              {stat.meta && <p className="text-sm text-slate-500">{stat.meta}</p>}
            </div>
          ))}
        </motion.section>

        {activeSection === "2.1" && (
          <motion.section
            className="mt-4 rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <SectionHeader
              kicker="2.1 Onboarding"
              title="Verification Workspace"
              subtitle="Monitor doc uploads and verification states."
            />
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {onboardingSteps.length ? (
                onboardingSteps.map((step) => (
                  <div key={step.title} className="rounded-[5px] border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900">{step.title}</p>
                      <span className="text-xs uppercase text-slate-400">{step.type}</span>
                    </div>
                    <span className="mt-2 inline-flex rounded-[5px] bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                      {step.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No onboarding steps were returned by the API.</p>
              )}
            </div>
            {verificationStatus?.status && (
              <p className="mt-4 text-xs text-slate-500">
                Verification status: {verificationStatus.status}
                {verificationNotes ? ` — ${verificationNotes}` : ""}
              </p>
            )}
            {verificationError && (
              <p className="mt-2 text-xs text-rose-500">
                Failed to load verification details: {verificationError}
              </p>
            )}
          </motion.section>
        )}

        {activeSection === "2.2" && (
          <motion.section
            className="mt-4 rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <SectionHeader
              kicker="2.2 Doctor Profile"
              title="Professional Identity"
              subtitle="Profile data pulled from /api/profile/me"
            />
            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap items-center gap-4 rounded-[5px] bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{profileSummary.name}</p>
                  <p className="text-sm text-slate-600">{profileSummary.specialty}</p>
                  <p className="text-xs text-slate-500">Experience: {profileSummary.experience}</p>
                </div>
                <div className="ml-auto text-right text-xs text-slate-500">
                  {profileSummary.languages.length ? profileSummary.languages.join(", ") : "Languages pending"}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {activeSection === "2.3" && (
          <motion.section
            className="mt-4 rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <SectionHeader
              kicker="2.3 Doctor Calendar & Availability"
              title="Weekly slots"
              subtitle="This view reflects the live schedule plus fallback planning."
            />
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              {availabilitySourceLabel}
            </p>
            {availabilityError && (
              <p className="text-xs text-rose-500 mt-1">
                Unable to load live schedule: {availabilityError}.
              </p>
            )}
            <div className="mt-4 space-y-3">
              {calendarRows.length ? (
                calendarRows.map((day) => {
                  const normalizedSlots =
                    day.slots.length > 0 ? day.slots : ["No slots published"];
                  const highlightOff = normalizedSlots.some((slot) =>
                    slot.toLowerCase?.().includes("off")
                  );

                  return (
                    <div
                      key={day.label}
                      className={`flex flex-col rounded-[5px] border px-4 py-3 ${
                        highlightOff ? "border-rose-100 bg-rose-50" : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">{day.label}</p>
                        <p className="text-xs text-slate-500">
                          {normalizedSlots.length === 0 ? "No slots" : `${normalizedSlots.length} block(s)`}
                        </p>
                      </div>
                      <div className="mt-1 space-y-1 text-xs text-slate-600">
                        {normalizedSlots.map((slot) => (
                          <p key={slot}>{slot}</p>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">
                  No availability data published yet.
                </p>
              )}
            </div>
          </motion.section>
        )}

        {activeSection === "2.4" && (
          <motion.section
            className="mt-4 rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <SectionHeader
              kicker="2.4 Appointment Management"
              title="Upcoming Appointments"
              subtitle="Appointments synced from the doctor dashboard API."
            />
            <div className="mt-4 space-y-3">
              {appointmentQueue.length ? (
                appointmentQueue.map((appt) => (
                  <div key={`${appt.patient}-${appt.time}`} className="rounded-[5px] border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{appt.patient}</p>
                        <p className="text-xs text-slate-500">{appt.notes || "No notes"}</p>
                      </div>
                      <span className="rounded-[5px] bg-white px-2 py-0.5 text-xs font-semibold text-slate-700">
                        {appt.mode}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-[5px] bg-blue-700 px-3 py-1 text-xs font-semibold text-white">
                        {appt.status}
                      </span>
                      <span className="text-xs text-slate-500">Time: {appt.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No appointments are scheduled yet.</p>
              )}
            </div>
          </motion.section>
        )}

        {activeSection === "2.5" && (
          <motion.section
            className="mt-4 rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <SectionHeader
              kicker="2.5 Follow-Up System"
              title="Follow-up reminders"
              subtitle="Automated follow-up data is part of the dashboard overview."
            />
            <p className="text-sm text-slate-500">
              Follow-up details will be displayed here once the backend publishes them.
            </p>
          </motion.section>
        )}

        {activeSection === "2.6" && (
          <motion.section
            className="mt-4 rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <SectionHeader
              kicker="2.6 Patient CRM"
              title="Recent Patients"
              subtitle="Patient data synced from the doctor dashboard patients endpoint."
            />
            <div className="mt-4 space-y-3">
              {crmPatients.length ? (
                crmPatients.map((patient) => (
                  <div key={patient.name} className="rounded-[5px] border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{patient.name}</p>
                        <p className="text-xs text-slate-500">Last visit: {patient.lastVisit}</p>
                      </div>
                      <span
                        className={`rounded-[5px] px-3 py-1 text-xs font-semibold ${
                          patient.consent ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {patient.consent ? "Consent" : "No consent"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Prescriptions: {patient.prescriptions}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">We are awaiting CRM data from the backend.</p>
              )}
            </div>
          </motion.section>
        )}

        {activeSection === "2.7" && (
          <motion.section
            className="mt-4 rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <SectionHeader
              kicker="2.7 Consultation Notes"
              title="Verification Narrative"
              subtitle="Doctor verification narrative pulled from the backend."
            />
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>
                Status:{" "}
                <span className="font-semibold text-slate-900">
                  {verificationStatus?.status ?? "Pending"}
                </span>
              </p>
              {verificationNotes && (
                <p>Notes: {verificationNotes}</p>
              )}
              {(verificationStatus?.submittedAt || verificationStatus?.createdAt) && (
                <p className="text-xs text-slate-500">
                  Submitted:{" "}
                  {verificationStatus.submittedAt ?? verificationStatus.createdAt}
                </p>
              )}
              <p className="text-xs text-slate-400">
                Endpoint: <code>/api/doctors/verification/{resolvedDoctorId ?? "<doctorId>"}</code>
              </p>
              {verificationError && (
                <p className="text-xs text-rose-500">
                  Failed to fetch verification data: {verificationError}
                </p>
              )}
            </div>
          </motion.section>
        )}

        {activeSection === "2.8" && (
          <motion.section
            className="mt-4 rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <SectionHeader
              kicker="2.8 Prescription Writing"
              title="Medication Catalog"
              subtitle="Public pharmacy catalog pulled from /api/pharmacy/products."
            />
            <div className="mt-4 space-y-3">
              {pharmacyProductCatalog.length ? (
                pharmacyProductCatalog.map((product) => (
                  <div
                    key={product.id ?? product._id ?? product.name}
                    className="flex items-center justify-between rounded-[5px] border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {product.name ?? product.title ?? "Unnamed product"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {product.category ?? "General"} • Stock: {product.stock ?? "N/A"}
                      </p>
                    </div>
                    <span className="rounded-[5px] bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      ₹{product.price ?? product.mrp ?? "—"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Product catalog will load once the backend provides the list.
                </p>
              )}
              {pharmacyProductError && (
                <p className="text-xs text-rose-500">Failed to load catalog: {pharmacyProductError}</p>
              )}
            </div>
          </motion.section>
        )}

        {activeSection === "2.9" && (
          <motion.section
            className="mt-4 rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <SectionHeader
              kicker="2.9 Financial Tools"
              title="Pharmacy Orders"
              subtitle="Orders pulled from /api/pharmacy/orders/me."
            />
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {pharmacyOrderStats ? (
                <>
                  <div className="rounded-[5px] border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs uppercase text-slate-500">Orders</p>
                    <p className="text-2xl font-semibold text-slate-900">{pharmacyOrderStats.total}</p>
                    <p className="text-xs text-slate-500">Last 5 orders</p>
                  </div>
                  <div className="rounded-[5px] border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs uppercase text-slate-500">Revenue</p>
                    <p className="text-2xl font-semibold text-slate-900">
                      ₹{pharmacyOrderStats.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">sum of reported totals</p>
                  </div>
                  <div className="rounded-[5px] border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs uppercase text-slate-500">Statuses</p>
                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      {Object.entries(pharmacyOrderStats.statuses).map(([status, count]) => (
                        <p key={status}>
                          <span className="font-semibold text-slate-900">{count}</span> {status}
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-500 col-span-3">
                  Orders will appear once the backend returns your pharmacy history.
                </p>
              )}
            </div>
            {pharmacyOrdersError && (
              <p className="mt-3 text-xs text-rose-500">Unable to fetch orders: {pharmacyOrdersError}</p>
            )}
          </motion.section>
        )}

        {activeSection === "2.10" && (
          <motion.section
            className="mt-4 rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <SectionHeader
              kicker="2.10 Admin Actions"
              title="Doctor & Pharmacy APIs"
              subtitle="Documented protected endpoints you can call next."
            />
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold">Verification list:</span>{" "}
                <code>/api/doctors/verification</code> (admin only).
              </p>
              <p>
                <span className="font-semibold">Approve/reject:</span>{" "}
                <code>/api/admin/doctors/verification/:verificationId/approve</code>
              </p>
              <p>
                <span className="font-semibold">Availability:</span>{" "}
                <code>/api/doctors/:doctorId/availability/schedule</code>
              </p>
              <p>
                <span className="font-semibold">Pharmacy products:</span>{" "}
                <code>/api/pharmacy/products</code>
              </p>
              <p>
                <span className="font-semibold">Orders:</span>{" "}
                <code>/api/pharmacy/orders/me</code>
              </p>
            </div>
          </motion.section>
        )}

        {activeSection === "2.11" && (
          <motion.section
            className="mt-4 rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <SectionHeader
              kicker="2.11 Chat & Video"
              title="Live Consultation Room"
              subtitle="Chat state is still pending backend support."
            />
            <div className="mt-4 rounded-[5px] border border-slate-100 bg-slate-50 p-4 text-sm text-slate-500">
              <p>No chat data available from the API yet.</p>
            </div>
          </motion.section>
        )}

        {activeSection === "2.12" && (
          <motion.section
            className="mt-4 rounded-[5px] border border-slate-100 bg-white p-6 shadow-sm"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
          >
            <SectionHeader
              kicker="2.12 Notifications"
              title="Signal Center"
              subtitle="Real-time alerts from the backend notifications endpoint."
            />
            <div className="mt-4 space-y-3">
              {notificationList.length ? (
                notificationList.map((notification) => (
                  <div key={`${notification.title}-${notification.time}`} className="rounded-[5px] border border-slate-100 bg-slate-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                      <span className="text-xs text-slate-500">{notification.time}</span>
                    </div>
                    <p className="text-xs text-slate-600">{notification.detail}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No notifications have arrived yet.</p>
              )}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
}
