import { useState } from "react";
import {
  User,
  Briefcase,
  FileText,
  ShieldCheck,
  TrendingUp,
  Calendar
} from "lucide-react";

export default function FounderProfile() {
  const [isEditingOverview, setIsEditingOverview] = useState(false);

  const [founder, setFounder] = useState({
    fullName: "Founder Name",
    email: "founder@email.com",
    startupName: "Startup Name",
    industry: "Industry",
    stage: "Idea / MVP / Early Revenue",
    country: "Nigeria"
  });

  const [phaseData] = useState({
    complianceStatus: "In Progress",
    strategyStatus: "Locked",
    fundingStatus: "Locked"
  });

  const [editedFounder, setEditedFounder] = useState(founder);

  const handleEdit = () => {
    setEditedFounder(founder);
    setIsEditingOverview(true);
  };

  const handleSave = () => {
    setFounder(editedFounder);
    setIsEditingOverview(false);
  };

  const handleCancel = () => {
    setEditedFounder(founder);
    setIsEditingOverview(false);
  };

  const handleChange = (field, value) => {
    setEditedFounder((prev) => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status) => {
    const colors = {
      Completed: "bg-emerald-100 text-emerald-700",
      "In Progress": "bg-amber-100 text-amber-700",
      "Not Started": "bg-gray-100 text-gray-700",
      Locked: "bg-slate-100 text-slate-600",
      Eligible: "bg-blue-100 text-blue-700"
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const currentFounder = isEditingOverview ? editedFounder : founder;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <div className="relative flex-shrink-0">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-emerald-500 rounded-full border-2 sm:border-4 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                {isEditingOverview ? (
                  <input
                    type="text"
                    value={editedFounder.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 border-b-2 border-blue-500 focus:outline-none bg-transparent w-full"
                  />
                ) : (
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 break-words">
                    {founder.fullName}
                  </h1>
                )}
                {isEditingOverview ? (
                  <input
                    type="email"
                    value={editedFounder.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="text-sm sm:text-base text-slate-600 mb-3 border-b-2 border-blue-500 focus:outline-none bg-transparent w-full"
                  />
                ) : (
                  <p className="text-sm sm:text-base text-slate-600 mb-3 break-all">
                    {founder.email}
                  </p>
                )}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {isEditingOverview ? (
                    <>
                      <input
                        type="text"
                        value={editedFounder.country}
                        onChange={(e) =>
                          handleChange("country", e.target.value)
                        }
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border-2 border-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={editedFounder.stage}
                        onChange={(e) => handleChange("stage", e.target.value)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border-2 border-blue-500 focus:outline-none"
                      />
                    </>
                  ) : (
                    <>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                        {founder.country}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {founder.stage}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
              {isEditingOverview ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Founder Overview */}
        <Section
          title="Founder Overview"
          icon={Briefcase}
          gradient="from-violet-500 to-blue-600"
        >
          <Info
            label="Startup Name"
            value={currentFounder.startupName}
            isEditing={isEditingOverview}
            onChange={(val) => handleChange("startupName", val)}
          />
          <Info
            label="Industry"
            value={currentFounder.industry}
            isEditing={isEditingOverview}
            onChange={(val) => handleChange("industry", val)}
          />
          <Info
            label="Business Stage"
            value={currentFounder.stage}
            isEditing={isEditingOverview}
            onChange={(val) => handleChange("stage", val)}
          />
          <Info
            label="Country of Operation"
            value={currentFounder.country}
            isEditing={isEditingOverview}
            onChange={(val) => handleChange("country", val)}
          />
        </Section>

        {/* Journey Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PhaseCard
            phase="1"
            title="Regulatory Compliance"
            status={phaseData.complianceStatus}
            icon={ShieldCheck}
            gradient="from-emerald-500 to-teal-600"
            progress={
              phaseData.complianceStatus === "Completed"
                ? 100
                : phaseData.complianceStatus === "In Progress"
                ? 65
                : 0
            }
          />
          <PhaseCard
            phase="2"
            title="Strategy & Advisory"
            status={phaseData.strategyStatus}
            icon={FileText}
            gradient="from-blue-500 to-cyan-600"
            progress={
              phaseData.strategyStatus === "Completed"
                ? 100
                : phaseData.strategyStatus === "In Progress"
                ? 50
                : 0
            }
          />
          <PhaseCard
            phase="3"
            title="Funding Pathway"
            status={phaseData.fundingStatus}
            icon={TrendingUp}
            gradient="from-amber-500 to-orange-600"
            progress={
              phaseData.fundingStatus === "Completed"
                ? 100
                : phaseData.fundingStatus === "In Progress"
                ? 40
                : phaseData.fundingStatus === "Eligible"
                ? 20
                : 0
            }
          />
        </div>

        {/* Phase 1 Details */}
        <Section
          title="Phase 1 – Regulatory Compliance"
          icon={ShieldCheck}
          gradient="from-emerald-500 to-teal-600"
        >
          <Info
            label="Compliance Status"
            value={phaseData.complianceStatus}
            statusColor={getStatusColor(phaseData.complianceStatus)}
          />
          <Info label="Registered Documents" value="View Documents" isLink />
          <Info label="Next Renewal Date" value="Not scheduled" subtle />
          <Info label="Regulatory Notes" value="Pending submissions" />
        </Section>

        {/* Phase 2 Details */}
        <Section
          title="Phase 2 – Strategy & Advisory"
          icon={FileText}
          gradient="from-blue-500 to-cyan-600"
        >
          <Info
            label="AI Walkthrough"
            value="Completed"
            statusColor={getStatusColor("Completed")}
          />
          <Info label="Executive Summary" value="Generated" />
          <Info
            label="Strategy Session Status"
            value={phaseData.strategyStatus}
            statusColor={getStatusColor(phaseData.strategyStatus)}
          />
          <Info label="Feedback Report" value="Not available" subtle />
        </Section>

        {/* Phase 3 Details */}
        <Section
          title="Phase 3 – Funding Pathway"
          icon={TrendingUp}
          gradient="from-amber-500 to-orange-600"
        >
          <Info
            label="Funding Readiness"
            value={phaseData.fundingStatus}
            statusColor={getStatusColor(phaseData.fundingStatus)}
          />
          <Info label="Target Funding Type" value="Angel / Pre-Seed" />
          <Info label="Craddule Advocacy" value="Not Started" />
          <Info label="Legal Agreement" value="Pending review" subtle />
        </Section>

        {/* Activity Timeline */}
        <Section
          title="Activity Timeline"
          icon={Calendar}
          gradient="from-slate-600 to-slate-800"
        >
          <div className="col-span-full">
            <div className="space-y-4">
              <TimelineItem
                date="Dec 15, 2024"
                title="Founder profile created"
                description="Welcome to Craddule!"
              />
              <TimelineItem
                date="Dec 16, 2024"
                title="Compliance onboarding started"
                description="Phase 1 initiated"
              />
              <TimelineItem
                date="Dec 20, 2024"
                title="AI walkthrough completed"
                description="Strategy analysis in progress"
                isLast
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function PhaseCard({ phase, title, status, icon: Icon, gradient, progress }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md flex-shrink-0`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <span className="text-xs font-bold text-slate-400">PHASE {phase}</span>
      </div>
      <h3 className="font-semibold text-slate-900 mb-2 break-words">{title}</h3>
      <p
        className={`text-xs px-2 py-1 rounded-full inline-block mb-3 ${
          status === "Locked"
            ? "bg-slate-100 text-slate-600"
            : status === "In Progress"
            ? "bg-amber-100 text-amber-700"
            : status === "Completed"
            ? "bg-emerald-100 text-emerald-700"
            : status === "Eligible"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </p>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-600 mb-1">
          <span>Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, gradient, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div
          className={`h-10 w-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm flex-shrink-0`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 break-words">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {children}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  isLink,
  statusColor,
  subtle,
  isEditing,
  onChange
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
        {label}
      </p>
      {isEditing && onChange ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-sm font-medium text-slate-900 border-b-2 border-blue-500 focus:outline-none bg-transparent w-full"
        />
      ) : isLink ? (
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
          {value} →
        </button>
      ) : statusColor ? (
        <span
          className={`text-sm font-medium px-2.5 py-1 rounded-full inline-block ${statusColor}`}
        >
          {value}
        </span>
      ) : (
        <p
          className={`text-sm font-medium ${
            subtle ? "text-slate-500 italic" : "text-slate-900"
          }`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function TimelineItem({ date, title, description, isLast }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="h-3 w-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm"></div>
        {!isLast && <div className="w-0.5 h-full bg-slate-200 mt-1"></div>}
      </div>
      <div className="flex-1 pb-6">
        <p className="text-xs text-slate-500 font-medium mb-1">{date}</p>
        <p className="font-semibold text-slate-900 mb-0.5">{title}</p>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}
