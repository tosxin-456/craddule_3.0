import {
  Building2,
  Receipt,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  BadgeCheck
} from "lucide-react";

// ─── Config per document type ────────────────────────────────────────────────
const DOC_CONFIG = {
  CAC: {
    label: "CAC 1.1 Application",
    subtitle: "Company Registration",
    Icon: Building2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accentBar: "bg-emerald-500",
    payBtnClass:
      "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500",
    viewBtnClass:
      "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500",
    fields: (app) => [
      { label: "Company Name", value: app.companyName },
      { label: "Company Type", value: app.companyType }
    ]
  },
  FIRS: {
    label: "TIN Registration",
    subtitle: "Tax Identification Number",
    Icon: Receipt,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    accentBar: "bg-blue-500",
    payBtnClass: "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500",
    viewBtnClass: "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500",
    fields: (app) => [
      { label: "Company", value: app.taxpayerName },
      { label: "RC Number", value: app.rcNumber }
    ]
  },
  SCUML: {
    label: "SCUML Registration",
    subtitle: "Special Control Unit",
    Icon: Shield,
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
    accentBar: "bg-violet-500",
    payBtnClass:
      "bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-500",
    viewBtnClass:
      "bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-500",
    fields: (app) => [
      { label: "Business Name", value: app.businessName },
      { label: "Category", value: app.businessCategory }
    ]
  }
};

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    approved: {
      label: "Approved",
      Icon: CheckCircle,
      cls: "text-emerald-700 bg-emerald-50 border-emerald-200"
    },
    rejected: {
      label: "Rejected",
      Icon: XCircle,
      cls: "text-red-600 bg-red-50 border-red-200"
    },
    pending: {
      label: "Pending",
      Icon: Clock,
      cls: "text-amber-600 bg-amber-50 border-amber-200"
    }
  };

  const s = map[status] ?? map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border tracking-wide ${s.cls}`}
    >
      <s.Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
      {s.label}
    </span>
  );
}

// ─── Field pair ───────────────────────────────────────────────────────────────
function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-800 truncate">
        {value || <span className="text-gray-300 font-normal">—</span>}
      </p>
    </div>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────
export function ApplicationCard({
  type,
  application,
  onViewFull,
  onPay,
  loading
}) {
  const config = DOC_CONFIG[type];
  if (!config) return null;

  const {
    label,
    subtitle,
    Icon,
    iconBg,
    iconColor,
    accentBar,
    payBtnClass,
    viewBtnClass,
    fields
  } = config;
  const isApprovedWithPayment =
    application.status === "approved" && application.price;
  const isPaid = application.isPaid;

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Accent bar */}
      <div className={`h-[3px] w-full ${accentBar}`} />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {label}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-5" />

      {/* Fields */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 py-4">
        {fields(application).map(({ label, value }) => (
          <Field key={label} label={label} value={value} />
        ))}
      </div>

      {/* Spacer — pushes footer to bottom */}
      <div className="flex-1" />

      {/* Admin note */}
      {application.adminFeedback && !isApprovedWithPayment && (
        <div className="mx-5 mb-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Admin Note
          </p>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {application.adminFeedback}
          </p>
        </div>
      )}

      {/* Payment banner */}
      {isApprovedWithPayment && !isPaid && (
        <div className="mx-5 mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <BadgeCheck className="w-4 h-4 text-emerald-600" strokeWidth={2} />
            <p className="text-xs font-bold text-emerald-700 tracking-wide">
              Approved — Payment Required
            </p>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed mb-2">
            Complete payment to finalise your registration.
          </p>
          <p className="text-2xl font-bold text-emerald-900 tracking-tight">
            ₦{application.price.toLocaleString()}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 px-5 pb-5">
        {isApprovedWithPayment ? (
          <>
            <button
              onClick={onViewFull}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
            >
              Details
            </button>

            {isPaid ? (
              <button
                disabled
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" strokeWidth={2} />
                Paid
              </button>
            ) : (
              <button
                onClick={onPay}
                disabled={loading}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${payBtnClass}`}
              >
                {loading ? "Processing…" : "Pay Now"}
              </button>
            )}
          </>
        ) : (
          <button
            onClick={onViewFull}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${viewBtnClass}`}
          >
            View Application
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}
