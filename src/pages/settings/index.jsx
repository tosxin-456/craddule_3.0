import {
  Settings,
  Briefcase,
  ShieldCheck,
  FileText,
  TrendingUp,
  Eye,
  Lock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function FounderSettings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 flex items-start sm:items-center gap-4">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30">
              <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Founder Settings
              </h1>
              <p className="text-sm sm:text-base text-blue-100 mt-2">
                Control editable areas and understand system locks across your
                Craddule journey.
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 opacity-20">
            <Settings className="w-32 h-32 text-white" />
          </div>
        </div>

        {/* Founder Overview Editing */}
        <SettingsSection
          icon={Briefcase}
          title="Founder Overview"
          description="Startup identity fields that may be edited before regulatory onboarding."
          emoji="💼"
          color="blue"
        >
          <SettingRow
            label="Editing Status"
            value="Editable"
            helper="Auto-locks once Phase 1 compliance begins"
            status="enabled"
            icon={<CheckCircle className="w-4 h-4" />}
          />
        </SettingsSection>

        {/* Phase 1 – Compliance */}
        <SettingsSection
          icon={ShieldCheck}
          title="Regulatory Compliance (Phase 1)"
          description="Compliance flow is governed by Craddule and verified partners."
          emoji="🛡️"
          color="indigo"
        >
          <SettingRow
            label="Compliance Status Control"
            value="System-controlled"
            helper="Founders cannot edit compliance states"
            locked
            icon={<Lock className="w-4 h-4" />}
          />
          <SettingRow
            label="Document Upload Window"
            value="Open"
            helper="Closes automatically after submission"
            status="active"
            icon={<AlertCircle className="w-4 h-4" />}
          />
        </SettingsSection>

        {/* Phase 2 – Strategy */}
        <SettingsSection
          icon={FileText}
          title="Strategy & Advisory (Phase 2)"
          description="Strategy outputs are generated, reviewed, and locked."
          emoji="📋"
          color="blue"
        >
          <SettingRow
            label="Strategy Outputs"
            value="Draft"
            helper="Locks once advisory feedback is issued"
            status="draft"
            icon={<FileText className="w-4 h-4" />}
          />
          <SettingRow
            label="AI Regeneration"
            value="One-time allowed"
            helper="Additional regenerations require approval"
            status="limited"
            icon={<AlertCircle className="w-4 h-4" />}
          />
        </SettingsSection>

        {/* Phase 3 – Funding */}
        <SettingsSection
          icon={TrendingUp}
          title="Funding Pathway (Phase 3)"
          description="Funding readiness is eligibility-based, not founder-selected."
          emoji="📈"
          color="indigo"
        >
          <SettingRow
            label="Funding Eligibility"
            value="Not eligible"
            helper="Triggered by Craddule review"
            locked
            icon={<XCircle className="w-4 h-4" />}
          />
          <SettingRow
            label="Investor Visibility"
            value="Hidden"
            helper="Made visible only to curated investors"
            status="private"
            icon={<Eye className="w-4 h-4" />}
          />
        </SettingsSection>

        {/* Visibility */}
        <SettingsSection
          icon={Eye}
          title="Profile Visibility"
          description="Controls external access to your founder profile."
          emoji="👁️"
          color="blue"
        >
          <SettingRow
            label="Profile Access"
            value="Private"
            helper="Shareable read-only links may be enabled later"
            status="private"
            icon={<Lock className="w-4 h-4" />}
          />
        </SettingsSection>

        {/* Audit */}
        <SettingsSection
          icon={Lock}
          title="Audit & System Locks"
          description="Immutable system controls for trust and accountability."
          emoji="🔒"
          color="indigo"
        >
          <SettingRow
            label="Change Log"
            value="Enabled"
            helper="All actions are recorded and auditable"
            locked
            icon={<CheckCircle className="w-4 h-4" />}
          />
          <SettingRow
            label="Active Locks"
            value="None"
            helper="Locks appear here with reasons and authority"
            locked
            icon={<Lock className="w-4 h-4" />}
          />
        </SettingsSection>

        {/* Info Banner */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
          <div className="relative z-10 flex items-start gap-4">
            <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
              <p className="text-sm text-slate-600">
                Contact support if you need clarification on locked settings or
                require special access permissions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
  emoji,
  color
}) {
  const colorClasses = {
    blue: "from-blue-50 to-white border-blue-100",
    indigo: "from-indigo-50 to-white border-indigo-100"
  };

  const iconBgClasses = {
    blue: "bg-blue-100",
    indigo: "bg-indigo-100"
  };

  const iconColorClasses = {
    blue: "text-blue-600",
    indigo: "text-indigo-600"
  };

  return (
    <div
      className={`bg-gradient-to-br ${
        colorClasses[color] || colorClasses.blue
      } rounded-2xl shadow-lg border-2 p-6 sm:p-8 relative overflow-hidden hover:shadow-xl transition-shadow`}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl opacity-30"></div>

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{emoji}</div>
            <div
              className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl ${
                iconBgClasses[color] || iconBgClasses.blue
              } flex items-center justify-center flex-shrink-0 shadow-sm`}
            >
              <Icon
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  iconColorClasses[color] || iconColorClasses.blue
                }`}
              />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mt-1.5">
              {description}
            </p>
          </div>
        </div>

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

function SettingRow({ label, value, helper, locked, status, icon }) {
  const getStatusStyles = () => {
    if (locked) {
      return "bg-slate-100 text-slate-700 border-slate-200";
    }

    switch (status) {
      case "enabled":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "active":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "draft":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "limited":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "private":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50 hover:bg-white/80 transition-colors">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
        </div>
        {helper && (
          <p className="text-xs text-slate-600 leading-relaxed">{helper}</p>
        )}
      </div>

      <span
        className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border-2 whitespace-nowrap self-start shadow-sm ${getStatusStyles()}`}
      >
        {icon}
        {value}
      </span>
    </div>
  );
}
