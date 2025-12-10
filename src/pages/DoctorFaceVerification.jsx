// src/pages/DoctorFaceVerification.jsx
// Selfie verification with live preview + circular progress outline.

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api.js";
import { useRegistration } from "../lib/registrationContext.jsx";

export default function DoctorFaceVerification() {
  const { data, updateFiles, resetRegistration } = useRegistration();
  const [submitState, setSubmitState] = useState({
    loading: false,
    error: "",
    success: "",
  });
  const navigate = useNavigate();
  // Refs for camera & canvas
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Camera / capture state
  const [cameraError, setCameraError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Condition states
  const [lightingOk, setLightingOk] = useState(false);
  const [faceCenteredOk, setFaceCenteredOk] = useState(false);
  const [noMaskGlassesOk, setNoMaskGlassesOk] = useState(false); // manual confirm

  const [avgBrightness, setAvgBrightness] = useState(null);

  // Browser FaceDetector API (if supported)
  const faceDetectorRef = useRef(
    typeof window !== "undefined" && "FaceDetector" in window
      ? new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 })
      : null
  );

  // Progress calculation (3 conditions)
  const totalConditions = 3;
  const passedCount =
    (lightingOk ? 1 : 0) + (faceCenteredOk ? 1 : 0) + (noMaskGlassesOk ? 1 : 0);
  const progressPercent = (passedCount / totalConditions) * 100;

  // Circular outline geometry
  // radius chosen so ring sits right on the edge of the preview circle
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const circleOffset = circumference * (1 - progressPercent / 100);

  // Avoid depending on cameraError for enabling capture
  const canCapture =
    progressPercent === 100 && !isCapturing && !capturedImage;
  const canSave = Boolean(capturedImage || data.files.selfie);
  const authToken =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const dataUrlToFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  useEffect(() => {
    if (data.files.selfie && !capturedImage) {
      const objectUrl = URL.createObjectURL(data.files.selfie);
      setCapturedImage(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    return undefined;
  }, [capturedImage, data.files.selfie]);

  // 1) Start camera on mount
  useEffect(() => {
    let stream;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 640 },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        // clear any previous error once camera works
        setCameraError("");
      } catch (err) {
        console.error(err);
        setCameraError(
          "Unable to access camera. Please allow camera permission and refresh the page."
        );
      }
    }

    startCamera();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // 2) Analyze frames for lighting + face position
  useEffect(() => {
    let intervalId;

    async function analyzeFrame() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      if (video.readyState < 2) return; // not enough data

      const width = video.videoWidth || 640;
      const height = video.videoHeight || 640;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, width, height);

      // ---- Lighting check ----
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      let sum = 0;
      let count = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        sum += brightness;
        count++;
      }

      const avg = sum / count;
      setAvgBrightness(avg);
      setLightingOk(avg >= 80 && avg <= 220); // tweak thresholds if needed

      // ---- Face position check (if FaceDetector exists) ----
      const detector = faceDetectorRef.current;
      if (!detector) {
        // If API not supported, we just mark this as OK and tell user in UI
        setFaceCenteredOk(true);
        return;
      }

      try {
        const faces = await detector.detect(video);
        if (faces.length !== 1) {
          setFaceCenteredOk(false);
          return;
        }

        const face = faces[0].boundingBox;
        const faceCenterX = face.x + face.width / 2;
        const faceCenterY = face.y + face.height / 2;

        const frameCenterX = width / 2;
        const frameCenterY = height / 2;

        const offsetX = Math.abs(faceCenterX - frameCenterX);
        const offsetY = Math.abs(faceCenterY - frameCenterY);
        const sizeRatio = face.width / width;

        // roughly centered & big enough
        const centered = offsetX < width * 0.18 && offsetY < height * 0.18;
        const bigEnough = sizeRatio > 0.33;

        setFaceCenteredOk(centered && bigEnough);
      } catch (err) {
        console.error("FaceDetector error:", err);
        setFaceCenteredOk(false);
      }
    }

    intervalId = setInterval(analyzeFrame, 800); // run every ~0.8s
    return () => clearInterval(intervalId);
  }, []);

  // 3) Capture selfie
  const handleCapture = () => {
    if (!canCapture) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 640;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsCapturing(true);
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);
    setIsCapturing(false);

    const selfieFile = dataUrlToFile(dataUrl, `selfie-${Date.now()}.jpg`);
    updateFiles({ selfie: selfieFile });
  };

  // 4) Retake selfie
  const handleRetake = () => {
  // Clear the captured image so we go back to live preview
  setCapturedImage(null);
  setIsCapturing(false);
  updateFiles({ selfie: null });

  // Make sure the video keeps playing after retake
  const video = videoRef.current;
  if (video && video.srcObject) {
    video
      .play()
      .catch(() => {
        // ignore play error (e.g., user paused manually)
      });
  }
};

  const buildMissingFields = () => {
    const missing = [];
    const { personal, registration, identity, files, doctorId } = data;
    if (!doctorId) missing.push("Doctor ID");
    if (!personal.fullName) missing.push("Full name");
    if (!personal.email) missing.push("Email");
    if (!personal.phoneNumber) missing.push("Phone number");
    if (!personal.medicalSpecialization) missing.push("Specialization");
    if (!personal.yearsOfExperience) missing.push("Experience");
    if (!personal.clinicHospitalName) missing.push("Clinic/Hospital name");
    if (!personal.clinicAddress) missing.push("Clinic address");
    if (!personal.state) missing.push("State");
    if (!personal.city) missing.push("City");
    if (!registration.registrationNumber) missing.push("Registration number");
    if (!registration.issueDate) missing.push("Registration issue date");
    if (!registration.councilName && !registration.councilDisplayName) {
      missing.push("Council name");
    }
    if (!identity.documentType) missing.push("Document type");
    if (!files.mbbsCertificate) missing.push("MBBS certificate");
    if (!files.registrationCertificate) missing.push("Registration certificate");
    if (!files.governmentId) missing.push("Government ID");
    if (!files.selfie) missing.push("Selfie capture");
    return missing;
  };

  const handleSubmitVerification = async () => {
    const missing = buildMissingFields();
    if (missing.length) {
      setSubmitState({
        loading: false,
        error: `Please complete: ${missing.join(", ")}`,
        success: "",
      });
      return;
    }

    setSubmitState({ loading: true, error: "", success: "" });
    const { personal, registration, identity, files, doctorId } = data;
    const councilName = registration.councilName || "State Council";
    const issueDateValue = registration.issueDate;

    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("fullName", personal.fullName);
    formData.append("email", personal.email);
    formData.append("phoneNumber", personal.phoneNumber);
    formData.append("medicalSpecialization", personal.medicalSpecialization);
    formData.append("yearsOfExperience", String(personal.yearsOfExperience || "0"));
    formData.append("clinicHospitalName", personal.clinicHospitalName);
    formData.append("clinicAddress", personal.clinicAddress);
    formData.append("state", personal.state);
    formData.append("city", personal.city);
    formData.append("registrationNumber", registration.registrationNumber);
    formData.append("councilName", councilName);
    formData.append("issueDate", issueDateValue);
    formData.append("documentType", identity.documentType);

    formData.append("mbbsCertificate", files.mbbsCertificate);
    if (files.mdMsBdsCertificate) {
      formData.append("mdMsBdsCertificate", files.mdMsBdsCertificate);
    }
    formData.append("registrationCertificate", files.registrationCertificate);
    formData.append("governmentId", files.governmentId);
    formData.append("selfie", files.selfie);

    try {
      await apiRequest("/api/doctors/verification/submit", {
        method: "POST",
        body: formData,
        isForm: true,
        token: authToken,
      });
      setSubmitState({
        loading: false,
        error: "",
        success: "Verification submitted successfully. We will notify you once reviewed.",
      });
      resetRegistration();
      navigate("/register/verification-submitted");
    } catch (err) {
      setSubmitState({
        loading: false,
        error: err.message || "Unable to submit verification right now.",
        success: "",
      });
    }
  };


  const lightingText =
    avgBrightness == null
      ? "We are checking your lighting..."
      : !lightingOk
      ? "Adjust your lighting so your face is clearly visible."
      : "Lighting looks good.";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="flex w-full items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-700 text-xs font-bold text-white">
              <div className="space-y-0.5">
                <span className="block h-0.5 w-3 rounded bg-white" />
                <span className="block h-0.5 w-3 rounded bg-white" />
                <span className="block h-0.5 w-3 rounded bg-white" />
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              Doorspital Partner
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-xs font-medium text-slate-600 sm:text-sm">
            <button className="hover:text-slate-900">Dashboard</button>
            <button className="hover:text-slate-900">Help</button>
            <button className="text-rose-600 hover:text-rose-700">
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN CARD */}
      <main className="w-full py-8 sm:py-10">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          {/* Title + step bar */}
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <h1 className="text-center text-xl font-semibold text-slate-900 sm:text-2xl">
              Doctor Verification
            </h1>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-600">
                Step 2 of 3: Selfie Verification
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 rounded-full bg-blue-600" />
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                Selfie Verification
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Take a clear selfie to verify your identity.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center gap-8">
              {/* >>> CIRCULAR CAMERA / PREVIEW WITH PROGRESS RING <<< */}
              <div className="relative h-72 w-72">
                {/* Inner live preview circle */}
                <div className="absolute inset-5 flex items-center justify-center overflow-hidden rounded-full bg-slate-100">
                  {capturedImage ? (
                    <img
                      src={capturedImage}
                      alt="Captured selfie"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      className="h-full w-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                  )}
                </div>

                {/* Circular green outline on top (aligned with preview edge) */}
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full rotate-[-90deg]"
                  viewBox="0 0 300 300"
                >
                  {/* grey background ring */}
                  <circle
                    cx="150"
                    cy="150"
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* green progress ring */}
                  <circle
                    cx="150"
                    cy="150"
                    r={radius}
                    stroke="#22c55e"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circleOffset}
                    strokeLinecap="round"
                    className="transition-[stroke-dashoffset] duration-500 ease-out"
                  />
                </svg>
              </div>

              {/* CONDITIONS CARD */}
              <div className="w-full max-w-md rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-700">
                {/* Lighting */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-500">📍</span>
                  <div>
                    <p className="font-medium">Good lighting</p>
                    <p className="text-xs text-slate-500">{lightingText}</p>
                  </div>
                  <span className="ml-auto text-xs">
                    {lightingOk ? "✓" : ""}
                  </span>
                </div>

                <hr className="my-3 border-slate-200" />

                {/* Look directly at camera */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-500">👁️</span>
                  <div>
                    <p className="font-medium">Look directly at the camera</p>
                    <p className="text-xs text-slate-500">
                      Keep your face centered and close to the camera.
                      {faceDetectorRef.current
                        ? ""
                        : " (FaceDetector API not available in this browser, so this is not fully automatic.)"}
                    </p>
                  </div>
                  <span className="ml-auto text-xs">
                    {faceCenteredOk ? "✓" : ""}
                  </span>
                </div>

                <hr className="my-3 border-slate-200" />

                {/* No mask / glasses */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-emerald-500">😷</span>
                  <div className="flex-1">
                    <p className="font-medium">No mask or glasses</p>
                    <p className="text-xs text-slate-500">
                      For reliable selfie verification, please remove any mask
                      or glasses.
                    </p>
                    <label className="mt-2 flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600"
                        checked={noMaskGlassesOk}
                        onChange={(e) => setNoMaskGlassesOk(e.target.checked)}
                      />
                      <span>I confirm I am not wearing a mask or glasses.</span>
                    </label>
                  </div>
                  <span className="ml-auto text-xs">
                    {noMaskGlassesOk ? "✓" : ""}
                  </span>
                </div>
              </div>

              {/* Hidden canvas for analysis */}
              <canvas ref={canvasRef} className="hidden" />

              {/* BUTTONS */}
              <div className="flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center">
                {/* Capture selfie */}
                <button
                  type="button"
                  onClick={handleCapture}
                  disabled={!canCapture}
                  className={`inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm sm:w-auto ${
                    canCapture
                      ? "bg-blue-700 text-white hover:bg-blue-800"
                      : "bg-blue-200 text-blue-800/60 cursor-not-allowed"
                  }`}
                >
                  📷
                  <span className="ml-2">
                    {capturedImage ? "Capture again" : "Capture Selfie"}
                  </span>
                </button>

                {/* Retake */}
                <button
                  type="button"
                  onClick={handleRetake}
                  disabled={!capturedImage}
                  className={`inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm sm:w-auto ${
                    capturedImage
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  ⟳ <span className="ml-2">Retake</span>
                </button>
              </div>

              {/* Save & Continue */}
              <div className="mt-6 flex w-full max-w-md justify-end">
                <button
                  type="button"
                  disabled={!canSave || submitState.loading}
                  onClick={handleSubmitVerification}
                  className={`rounded-md px-6 py-2 text-sm font-semibold shadow-sm ${
                    canSave && !submitState.loading
                      ? "bg-blue-700 text-white hover:bg-blue-800"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {submitState.loading ? "Submitting..." : "Submit verification"}
                </button>
              </div>
              {submitState.error && (
                <p className="mt-2 text-xs text-rose-600">{submitState.error}</p>
              )}
              {submitState.success && (
                <p className="mt-2 text-xs text-emerald-600">{submitState.success}</p>
              )}

              {/* Show error only if we don't actually have a stream */}
              {cameraError && !videoRef.current?.srcObject && (
                <p className="mt-3 text-xs text-rose-600">{cameraError}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}






