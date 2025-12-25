import {
  LifeBuoy,
  ShieldCheck,
  FileText,
  TrendingUp,
  Lock,
  Clock
} from "lucide-react";

export default function FounderTickets() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center">
              <LifeBuoy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Support & Requests
              </h1>
              <p className="text-sm text-slate-500">
                Submit structured requests tied to your Craddule journey.
              </p>
            </div>
          </div>
        </div>

        {/* Ticket Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TicketCard
            icon={ShieldCheck}
            title="Compliance Review Request"
            description="Clarify requirements, report blockers, or request review of submitted documents."
            phase="Phase 1"
            status="Available"
          />

          <TicketCard
            icon={FileText}
            title="Strategy Clarification"
            description="Request clarification on AI outputs or advisory feedback."
            phase="Phase 2"
            status="Locked"
          />

          <TicketCard
            icon={TrendingUp}
            title="Funding Eligibility Review"
            description="Request eligibility assessment once prerequisites are met."
            phase="Phase 3"
            status="Locked"
          />

          <TicketCard
            icon={Lock}
            title="Unlock / Exception Request"
            description="Request temporary unlocks or exceptions with justification."
            phase="System"
            status="Restricted"
          />
        </div>

        {/* Active Tickets */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Your Tickets</h2>

          <div className="space-y-4">
            <TicketRow
              title="CAC document clarification"
              phase="Phase 1"
              status="Under Review"
              date="Dec 21, 2024"
            />

            <TicketRow
              title="Request to unlock Founder Overview"
              phase="System"
              status="Resolved"
              date="Dec 18, 2024"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function TicketCard({ icon: Icon, title, description, phase, status }) {
  const locked = status !== "Available";

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <Icon className="w-5 h-5 text-slate-700" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{description}</p>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              {phase}
            </span>

            <span
              className={`text-xs px-2.5 py-1 rounded-full ${
                locked
                  ? "bg-slate-200 text-slate-500"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>

      <button
        disabled={locked}
        className={`mt-6 w-full py-2 rounded-lg text-sm font-medium transition ${
          locked
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {locked ? "Unavailable" : "Create Ticket"}
      </button>
    </div>
  );
}

function TicketRow({ title, phase, status, date }) {
  return (
    <div className="flex items-start justify-between border-b border-slate-100 pb-4 last:border-0">
      <div>
        <p className="font-medium text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {phase} · Submitted {date}
        </p>
      </div>

      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          status === "Under Review"
            ? "bg-amber-100 text-amber-700"
            : status === "Resolved"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {status}
      </span>
    </div>
  );
}
