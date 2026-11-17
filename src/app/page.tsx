
"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  LayoutDashboard,
  HeartPulse,
  Droplets,
  Thermometer,
  Gauge,
  Users,
  FileText,
  Settings,
  Wifi,
  Battery,
  Search,
  Bell,
  Plus,
  Save,
  Edit3,
  Trash2,
  Printer,
  Menu,
  X,
  UserRound,
  Calendar,
  ShieldCheck,
  Smartphone,
  Download,
  Clock,
  AlertCircle,
  Radio,
  Stethoscope,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// ==========================================
// TYPES
// ==========================================

type Patient = {
  name: string;
  id: string;
  age: string;
  gender: string;
  blood: string;
  height: string;
  weight: string;
  phone: string;
  email: string;
  history: string;
  medication: string;
  allergies: string;
  emergencyContact: string;
};

type Tab =
  | "Dashboard"
  | "Live Monitoring"
  | "Analytics"
  | "Patient Details"
  | "Reports"
  | "Device Settings";

const emptyPatient: Patient = {
  name: "",
  id: "",
  age: "",
  gender: "",
  blood: "",
  height: "",
  weight: "",
  phone: "",
  email: "",
  history: "",
  medication: "",
  allergies: "",
  emergencyContact: "",
};

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-[#111c2b] p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function PageHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
        VITALPATCH / HEALTH MONITORING
      </p>
      <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

function StatusBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-400">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      {children}
    </span>
  );
}

function MetricCard({
  title,
  value,
  unit,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  unit: string;
  description: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Panel className="transition duration-200 hover:border-slate-600">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
        <StatusBadge>Awaiting data</StatusBadge>
      </div>

      <p className="mt-5 text-sm text-slate-400">{title}</p>

      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-sm text-slate-400">{unit}</span>
      </div>

      <p className="mt-3 text-xs text-slate-500">{description}</p>
    </Panel>
  );
}

// ==========================================
// MAIN APPLICATION
// ==========================================

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Dashboard");

  const [patient, setPatient] = useState<Patient>(emptyPatient);
  const [profileSaved, setProfileSaved] = useState(false);
  const [editingPatient, setEditingPatient] = useState(true);

  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [deviceConnected] = useState(false);

  // Load patient profile
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vitalpatch_patient");

      if (saved) {
        const parsed = JSON.parse(saved);

        setPatient({ ...emptyPatient, ...parsed });
        setProfileSaved(true);
        setEditingPatient(false);
      }
    } catch {
      console.error("Unable to load patient profile");
    }
  }, []);

  // Save patient profile
  function savePatient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!patient.name.trim() || !patient.id.trim()) {
      alert("Patient name and Patient ID are required.");
      return;
    }

    try {
      localStorage.setItem(
        "vitalpatch_patient",
        JSON.stringify(patient)
      );

      setProfileSaved(true);
      setEditingPatient(false);

      alert("Patient profile saved successfully!");
    } catch {
      alert("Unable to save patient information.");
    }
  }

  function updatePatient(field: keyof Patient, value: string) {
    setPatient((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function deletePatient() {
    if (!confirm("Are you sure you want to delete this patient profile?")) {
      return;
    }

    localStorage.removeItem("vitalpatch_patient");

    setPatient(emptyPatient);
    setProfileSaved(false);
    setEditingPatient(true);
  }

  const navigation: {
    name: Tab;
    icon: React.ElementType;
  }[] = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Live Monitoring", icon: HeartPulse },
    { name: "Analytics", icon: Activity },
    { name: "Patient Details", icon: Users },
    { name: "Reports", icon: FileText },
    { name: "Device Settings", icon: Settings },
  ];

  const patientFields: {
    label: string;
    key: keyof Patient;
    placeholder: string;
    type?: string;
    options?: string[];
  }[] = [
    {
      label: "Full Name",
      key: "name",
      placeholder: "Enter patient's full name",
    },
    {
      label: "Patient ID",
      key: "id",
      placeholder: "Enter unique patient ID",
    },
    {
      label: "Age",
      key: "age",
      placeholder: "Enter age",
      type: "number",
    },
    {
      label: "Gender",
      key: "gender",
      placeholder: "Select gender",
      options: ["Male", "Female", "Other", "Prefer not to say"],
    },
    {
      label: "Blood Group",
      key: "blood",
      placeholder: "Select blood group",
      options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    {
      label: "Height",
      key: "height",
      placeholder: "e.g. 175 cm",
    },
    {
      label: "Weight",
      key: "weight",
      placeholder: "e.g. 70 kg",
    },
    {
      label: "Phone Number",
      key: "phone",
      placeholder: "Enter phone number",
      type: "tel",
    },
    {
      label: "Email Address",
      key: "email",
      placeholder: "Enter email address",
      type: "email",
    },
    {
      label: "Medical History",
      key: "history",
      placeholder: "Enter relevant medical history",
    },
    {
      label: "Current Medication",
      key: "medication",
      placeholder: "Enter current medication",
    },
    {
      label: "Known Allergies",
      key: "allergies",
      placeholder: "Enter known allergies",
    },
    {
      label: "Emergency Contact",
      key: "emergencyContact",
      placeholder: "Enter emergency contact",
    },
  ];

  // ==========================================
  // PATIENT REGISTRATION PAGE
  // ==========================================

  function PatientDetailsPage() {
    return (
      <>
        <PageHeading
          title="Patient Management"
          description="Register and manage patient information."
        />

        <Panel>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {editingPatient
                  ? profileSaved
                    ? "Edit Patient Profile"
                    : "New Patient Registration"
                  : "Patient Profile"}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Patient information is entered and managed by the user.
              </p>
            </div>

            {profileSaved ? (
              <span className="rounded-full bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
                Profile Saved
              </span>
            ) : (
              <span className="rounded-full bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
                Not Registered
              </span>
            )}
          </div>

          {!editingPatient && profileSaved ? (
            <>
              <div className="mb-7 flex items-center gap-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                <div className="rounded-xl bg-cyan-500/10 p-4 text-cyan-400">
                  <UserRound size={30} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {patient.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Patient ID: {patient.id}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {patientFields.map((field) => (
                  <div key={field.key}>
                    <p className="text-xs text-slate-500">
                      {field.label}
                    </p>

                    <p className="mt-2 break-words text-sm text-slate-200">
                      {patient[field.key] || "Not provided"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setEditingPatient(true)}
                  className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
                >
                  <Edit3 size={16} />
                  Edit Details
                </button>

                <button
                  onClick={deletePatient}
                  className="flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 text-sm text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                  Delete Profile
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={savePatient}>
              <div className="mb-5">
                <h3 className="font-semibold text-cyan-400">
                  Personal Information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Fields marked with * are mandatory.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {patientFields.slice(0, 9).map((field) => (
                  <div key={field.key}>
                    <label className="mb-2 block text-xs font-medium text-slate-400">
                      {field.label}

                      {(field.key === "name" || field.key === "id") && (
                        <span className="text-red-400"> *</span>
                      )}
                    </label>

                    {field.options ? (
                      <select
                        value={patient[field.key]}
                        onChange={(e) =>
                          updatePatient(field.key, e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-700 bg-[#0B1422] px-4 py-3 text-sm text-white"
                      >
                        <option value="">
                          {field.placeholder}
                        </option>

                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || "text"}
                        min={field.type === "number" ? 0 : undefined}
                        required={
                          field.key === "name" || field.key === "id"
                        }
                        value={patient[field.key]}
                        placeholder={field.placeholder}
                        onChange={(e) =>
                          updatePatient(field.key, e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-700 bg-[#0B1422] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mb-5 mt-9">
                <h3 className="font-semibold text-cyan-400">
                  Medical Information
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {patientFields.slice(9).map((field) => (
                  <div key={field.key}>
                    <label className="mb-2 block text-xs font-medium text-slate-400">
                      {field.label}
                    </label>

                    <textarea
                      rows={3}
                      value={patient[field.key]}
                      placeholder={field.placeholder}
                      onChange={(e) =>
                        updatePatient(field.key, e.target.value)
                      }
                      className="w-full resize-y rounded-xl border border-slate-700 bg-[#0B1422] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-400"
                >
                  <Save size={17} />
                  Save Patient Profile
                </button>

                {profileSaved && (
                  <button
                    type="button"
                    onClick={() => {
                      const saved = localStorage.getItem("vitalpatch_patient");

                      if (saved) {
                        setPatient(JSON.parse(saved));
                      }

                      setEditingPatient(false);
                    }}
                    className="rounded-xl border border-slate-700 px-6 py-3 text-sm text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </Panel>
      </>
    );
  }

  // ==========================================
  // DASHBOARD PAGE
  // ==========================================

  function DashboardPage() {
    return (
      <>
        <PageHeading
          title="Health Dashboard"
          description="Monitor patient vitals and wearable device status."
        />

        <div className="mb-6 grid gap-4 lg:grid-cols-3">
          <Panel>
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                <Radio size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400">Wearable Device</p>
                <p className="font-semibold text-white">ESP32-S3</p>
              </div>

              <span className="text-xs text-amber-400">
                Not connected
              </span>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Wifi size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400">Communication</p>
                <p className="font-semibold text-white">Wi-Fi</p>
              </div>

              <span className="text-xs text-amber-400">
                Awaiting data
              </span>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
                <Battery size={23} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400">Power Status</p>
                <p className="font-semibold text-white">Unavailable</p>
              </div>

              <span className="text-xs text-slate-500">
                No telemetry
              </span>
            </div>
          </Panel>
        </div>

        <Panel className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-cyan-500/10 p-4 text-cyan-400">
                <UserRound size={28} />
              </div>

              <div>
                <p className="text-xs text-slate-400">Current Patient</p>

                <h2 className="text-xl font-bold text-white">
                  {profileSaved
                    ? patient.name
                    : "No patient registered"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {profileSaved
                    ? `Patient ID: ${patient.id}`
                    : "Register a patient to begin monitoring."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab("Patient Details")}
              className="rounded-xl border border-cyan-500/30 px-4 py-2.5 text-sm text-cyan-400 hover:bg-cyan-500/10"
            >
              {profileSaved ? "View Profile" : "Register Patient"}
            </button>
          </div>
        </Panel>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="ECG / Heart Rate"
            value="--"
            unit="BPM"
            description="Awaiting ECG sensor data"
            icon={HeartPulse}
            color="bg-cyan-500/10 text-cyan-400"
          />

          <MetricCard
            title="Blood Oxygen"
            value="--"
            unit="% SpO₂"
            description="Awaiting MAX30102 data"
            icon={Droplets}
            color="bg-blue-500/10 text-blue-400"
          />

          <MetricCard
            title="Temperature"
            value="--"
            unit="°C"
            description="Awaiting temperature sensor data"
            icon={Thermometer}
            color="bg-orange-500/10 text-orange-400"
          />

          <MetricCard
            title="Motion Sensor"
            value="--"
            unit="MPU6050"
            description="Awaiting accelerometer data"
            icon={Activity}
            color="bg-purple-500/10 text-purple-400"
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <Panel>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">ECG Waveform</h3>
                <p className="mt-1 text-xs text-slate-500">
                  MAX30001 / ECG monitoring
                </p>
              </div>

              <span className="rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-400">
                ECG
              </span>
            </div>

            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 text-center">
              <HeartPulse size={35} className="mb-3 text-cyan-400" />

              <p className="text-sm text-slate-300">
                Waiting for ECG signal
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Connect the wearable hardware to display live readings.
              </p>
            </div>
          </Panel>

          <Panel>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Motion Analysis</h3>
                <p className="mt-1 text-xs text-slate-500">
                  MPU6050 accelerometer and gyroscope
                </p>
              </div>

              <span className="rounded-lg bg-purple-500/10 px-3 py-1.5 text-xs text-purple-400">
                MPU6050
              </span>
            </div>

            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 text-center">
              <Activity size={35} className="mb-3 text-purple-400" />

              <p className="text-sm text-slate-300">
                Waiting for motion data
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Accelerometer and gyroscope data will appear here.
              </p>
            </div>
          </Panel>
        </div>
      </>
    );
  }

  // ==========================================
  // LIVE MONITORING PAGE
  // ==========================================

  function LiveMonitoringPage() {
    return (
      <>
        <PageHeading
          title="Live Monitoring"
          description="Real-time wearable sensor monitoring."
        />

        <Panel className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white">
                Monitoring Session
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {profileSaved
                  ? `${patient.name} · ${patient.id}`
                  : "No patient selected"}
              </p>
            </div>

            <StatusBadge>Device offline</StatusBadge>
          </div>
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard
            title="ECG / Heart Rate"
            value="--"
            unit="BPM"
            description="MAX30001 sensor"
            icon={HeartPulse}
            color="bg-cyan-500/10 text-cyan-400"
          />

          <MetricCard
            title="SpO₂"
            value="--"
            unit="%"
            description="MAX30102 sensor"
            icon={Droplets}
            color="bg-blue-500/10 text-blue-400"
          />

          <MetricCard
            title="Temperature"
            value="--"
            unit="°C"
            description="Temperature sensor"
            icon={Thermometer}
            color="bg-orange-500/10 text-orange-400"
          />

          <MetricCard
            title="Motion"
            value="--"
            unit="MPU6050"
            description="Accelerometer / gyroscope"
            icon={Activity}
            color="bg-purple-500/10 text-purple-400"
          />
        </div>

        <Panel className="mt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-amber-400" size={22} />

            <div>
              <h3 className="text-sm font-semibold text-white">
                Hardware connection required
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Live monitoring will begin when the ESP32-S3 sends sensor
                data over Wi-Fi.
              </p>
            </div>
          </div>
        </Panel>
      </>
    );
  }

  // ==========================================
  // ANALYTICS PAGE
  // ==========================================

  function AnalyticsPage() {
    return (
      <>
        <PageHeading
          title="Health Analytics"
          description="Historical trends and sensor performance."
        />

        <Panel>
          <div className="mb-5">
            <h3 className="font-semibold text-white">
              ECG Trend Analysis
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Historical ECG measurements
            </p>
          </div>

          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 text-center">
            <Activity size={36} className="mb-3 text-cyan-400" />

            <p className="text-sm text-slate-300">
              No historical data available
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Analytics will be generated from actual recorded sensor data.
            </p>
          </div>
        </Panel>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {[
            ["SpO₂ Trends", Droplets],
            ["Temperature Trends", Thermometer],
          ].map(([label, Icon]) => {
            const SensorIcon = Icon as React.ElementType;

            return (
              <Panel key={label as string}>
                <SensorIcon size={25} className="mb-4 text-cyan-400" />

                <h3 className="font-semibold text-white">
                  {label as string}
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  No recorded measurements yet.
                </p>
              </Panel>
            );
          })}
        </div>
      </>
    );
  }

  // ==========================================
  // REPORTS PAGE
  // ==========================================

  function ReportsPage() {
    return (
      <>
        <PageHeading
          title="Patient Reports"
          description="Patient records and monitoring reports."
        />

        <Panel>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white">
                Patient Information Report
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Generate a printable patient information summary.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              disabled={!profileSaved}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-40"
            >
              <Printer size={17} />
              Print Report
            </button>
          </div>

          {!profileSaved ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
              <FileText size={35} className="mx-auto mb-3 text-slate-500" />

              <p className="text-sm text-slate-300">
                No patient registered
              </p>

              <button
                onClick={() => setActiveTab("Patient Details")}
                className="mt-4 text-sm text-cyan-400"
              >
                Register a patient
              </button>
            </div>
          ) : (
            <div className="space-y-5 text-sm">
              <div className="border-b border-slate-800 pb-5">
                <p className="text-xs text-slate-500">PATIENT NAME</p>
                <p className="mt-1 text-xl font-bold text-white">
                  {patient.name}
                </p>
                <p className="mt-1 text-slate-400">
                  Patient ID: {patient.id}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {patientFields.map((field) => (
                  <div key={field.key}>
                    <p className="text-xs text-slate-500">
                      {field.label}
                    </p>
                    <p className="mt-1 text-slate-200">
                      {patient[field.key] || "Not provided"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300">
                No clinical sensor measurements have been recorded.
                This is a patient information report, not a clinical report.
              </div>
            </div>
          )}
        </Panel>
      </>
    );
  }

  // ==========================================
  // DEVICE SETTINGS PAGE
  // ==========================================

  function DeviceSettingsPage() {
    return (
      <>
        <PageHeading
          title="Device Settings"
          description="Configure wearable hardware and communication."
        />

        <Panel className="mb-5">
          <div className="mb-5 flex items-center gap-3">
            <Smartphone size={25} className="text-cyan-400" />
            <h3 className="font-semibold text-white">
              Hardware Configuration
            </h3>
          </div>

          <div className="divide-y divide-slate-800">
            {[
              ["Microcontroller", "ESP32-S3 WROOM N16R8"],
              ["ECG Sensor", "MAX30001"],
              ["PPG Sensor", "MAX30102"],
              ["Motion Sensor", "MPU6050"],
              ["Communication", "Wi-Fi"],
              ["Dashboard Hosting", "Vercel"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex flex-wrap justify-between gap-3 py-4"
              >
                <span className="text-sm text-slate-400">{label}</span>
                <span className="text-sm font-medium text-white">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center gap-3">
            <Wifi size={24} className="text-cyan-400" />

            <div>
              <h3 className="font-semibold text-white">
                Wi-Fi Communication
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                ESP32-S3 wireless communication status
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-sm text-amber-400">
              {deviceConnected
                ? "Device connected"
                : "Waiting for ESP32-S3 connection"}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              The live connection endpoint and data protocol will be
              configured during hardware integration.
            </p>
          </div>
        </Panel>
      </>
    );
  }

  // ==========================================
  // PAGE ROUTER
  // ==========================================

  function renderPage() {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardPage />;

      case "Live Monitoring":
        return <LiveMonitoringPage />;

      case "Analytics":
        return <AnalyticsPage />;

      case "Patient Details":
        return <PatientDetailsPage />;

      case "Reports":
        return <ReportsPage />;

      case "Device Settings":
        return <DeviceSettingsPage />;

      default:
        return <DashboardPage />;
    }
  }

  // ==========================================
  // APPLICATION LAYOUT
  // ==========================================

  return (
    <div className="min-h-screen bg-[#080e19] text-white">

      {/* MOBILE OVERLAY */}

      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#0c1523] transition-transform duration-300 ${
          mobileMenu
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400">
              <Activity size={25} />
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-wide text-white">
                VITAL<span className="text-cyan-400">PATCH</span>
              </h2>

              <p className="text-[10px] tracking-[0.2em] text-slate-500">
                HEALTH MONITORING
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileMenu(false)}
            className="text-slate-400 lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-4 px-3 text-[10px] font-semibold tracking-[0.2em] text-slate-500">
            WORKSPACE
          </p>

          <nav className="space-y-2">
            {navigation.map(({ name, icon: Icon }) => {
              const selected = activeTab === name;

              return (
                <button
                  key={name}
                  onClick={() => {
                    setActiveTab(name);
                    setMobileMenu(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm transition ${
                    selected
                      ? "border border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                      : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  <span>{name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-800 p-2 text-slate-300">
              <UserRound size={20} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {patient.name || "No patient registered"}
              </p>

              <p className="truncate text-xs text-slate-500">
                {profileSaved ? patient.id : "Registration required"}
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-[10px] text-slate-600">
            VITALPATCH © 2026
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="min-h-screen lg:ml-64">

        {/* TOP HEADER */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800 bg-[#080e19]/95 px-5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenu(true)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-sm font-semibold text-white">
                Patient Monitoring System
              </p>

              <p className="text-xs text-slate-500">
                Wearable Health Monitoring Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-slate-800 px-3 py-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-xs text-slate-400">
                {deviceConnected ? "Connected" : "Device Offline"}
              </span>
            </div>

            <button
              onClick={() => setActiveTab("Device Settings")}
              className="rounded-xl border border-slate-800 p-2.5 text-slate-400 hover:bg-slate-800"
              aria-label="Device settings"
            >
              <Bell size={19} />
            </button>

            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 sm:flex">
              <UserRound size={19} />
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}

        <div className="mx-auto max-w-[1600px] p-5 md:p-8">
          {renderPage()}

          <footer className="mt-10 border-t border-slate-800 py-6 text-center text-xs text-slate-600">
            VitalPatch Wearable Health Monitoring System · ESP32-S3 · Wi-Fi
          </footer>
        </div>
      </main>
    </div>
  );
}
