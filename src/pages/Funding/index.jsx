import { useState } from "react";
import {
  Upload,
  FileText,
  TrendingUp,
  AlertTriangle,
  Users,
  Scale,
  CheckCircle,
  ArrowRight
} from "lucide-react";

/**
 * Phase 3 – Funding Pathway & Investor Engagement
 * This is the live intake + readiness page for founders entering funding.
 */
export default function FundingPathwayPage() {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 text-slate-900 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* ================= HEADER ================= */}
        <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 space-y-4">
            <div className="inline-block px-4 py-1 bg-blue-500/30 rounded-full text-blue-100 text-sm font-medium mb-2">
              Phase 3
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Funding Pathway
            </h1>
            <p className="text-blue-100 max-w-3xl text-lg">
              This stage prepares your company for external capital. Submission
              confirms that your documentation, strategy, and traction are ready
              for investor review. Funding is not guaranteed.
            </p>
          </div>
          <div className="absolute bottom-0 right-0 opacity-20">
            <TrendingUp className="w-48 h-48 text-white" />
          </div>
        </header>

        {/* ================= FUNDING TARGETS ================= */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            Target Funding Bodies
          </h2>
          <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-8 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-50 rounded-full blur-2xl"></div>
            <p className="text-slate-600 text-lg relative z-10">
              Craddule will map your business against 3–5 relevant funding
              bodies based on stage, sector, and geography.
            </p>
            <ul className="space-y-3 text-slate-600 relative z-10">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Eligibility criteria</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Required documentation</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Pitch and narrative standards</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Traction benchmarks</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Common founder pitfalls</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ================= DOCUMENT UPLOADS ================= */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            Required Documents
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <UploadCard
              title="Pitch Deck"
              description="Problem, solution, market, traction, and funding ask."
              icon="📊"
            />
            <UploadCard
              title="Financial Model"
              description="12–24 month projections with assumptions."
              icon="💰"
            />
            <UploadCard
              title="Cap Table"
              description="Current ownership and expected dilution."
              icon="📈"
            />
            <UploadCard
              title="Legal & Compliance Documents"
              description="Incorporation, shareholder agreements, IP status."
              icon="⚖️"
            />
          </div>
        </section>

        {/* ================= TRACTION & VALIDATION ================= */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            Traction & Validation
          </h2>

          <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-8 grid md:grid-cols-2 gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl"></div>
            <MetricInput
              label="Monthly Revenue (₦ / $)"
              placeholder="e.g., ₦5,000,000"
            />
            <MetricInput
              label="Active Users / Customers"
              placeholder="e.g., 1,500 users"
            />
            <MetricInput
              label="Growth Rate / Retention"
              placeholder="e.g., 15% MoM"
            />
            <MetricInput
              label="Partnerships, Pilots, or LOIs"
              placeholder="e.g., 3 signed LOIs"
            />
          </div>
        </section>

        {/* ================= READINESS CHECKS ================= */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            Funding Readiness Confirmation
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <CheckCard
              icon={<FileText className="w-5 h-5" />}
              title="Documentation Complete"
              text="All required documents are uploaded and accurate."
              color="blue"
            />
            <CheckCard
              icon={<TrendingUp className="w-5 h-5" />}
              title="Traction Aligned"
              text="Metrics reflect investor expectations for this stage."
              color="indigo"
            />
            <CheckCard
              icon={<AlertTriangle className="w-5 h-5" />}
              title="Risks Understood"
              text="Key gaps and risks are acknowledged and addressed."
              color="blue"
            />
          </div>
        </section>

        {/* ================= FOUNDER SELECTION NOTICE ================= */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <p className="text-slate-700 text-lg pt-1">
                Only founders who have completed all prior phases and
                demonstrated strategic clarity, execution discipline, and
                traction will be selected for investor advocacy.
              </p>
            </div>
            <ul className="space-y-2 text-slate-600 ml-14">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Completion of compliance and strategy phases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Implementation of advisory feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Validated assumptions or real traction</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ================= LEGAL AGREEMENT ================= */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
            Funding Agreement
          </h2>

          <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-8 space-y-6 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-3xl"></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-slate-600 text-lg pt-2">
                Before entering the funding pathway, founders must sign a formal
                agreement outlining Craddule's involvement, equity
                participation, and mutual commitments. Participation is
                optional.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 pl-2 relative z-10">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-slate-700 font-medium">
                I understand and agree to the funding pathway terms.
              </span>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="flex justify-end">
          <button
            disabled={!agreed}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg
              ${
                agreed
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
          >
            Submit for Investor Review
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>
      </div>
    </div>
  );
}

/* ================= SUBCOMPONENTS ================= */

function UploadCard({ title, description, icon }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-shadow space-y-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors"></div>
      <div className="flex items-center gap-3 relative z-10">
        <div className="text-3xl">{icon}</div>
        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
          <Upload className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <p className="text-sm text-slate-600 relative z-10">{description}</p>
      <label className="relative z-10 flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
        <span className="text-sm text-blue-600 font-medium">Choose File</span>
        <input type="file" className="hidden" />
      </label>
    </div>
  );
}

function MetricInput({ label, placeholder }) {
  return (
    <div className="space-y-2 relative z-10">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type="text"
        className="w-full rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 text-sm transition-all"
        placeholder={placeholder}
      />
    </div>
  );
}

function CheckCard({ icon, title, text, color }) {
  const colorClasses = {
    blue: "border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-white",
    indigo:
      "border-indigo-200 hover:border-indigo-400 bg-gradient-to-br from-indigo-50 to-white"
  };

  return (
    <div
      className={`rounded-2xl p-6 border-2 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 ${
        colorClasses[color] || colorClasses.blue
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              color === "indigo" ? "bg-indigo-100" : "bg-blue-100"
            }`}
          >
            <div
              className={
                color === "indigo" ? "text-indigo-600" : "text-blue-600"
              }
            >
              {icon}
            </div>
          </div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>
        <p className="text-sm text-slate-600">{text}</p>
      </div>
    </div>
  );
}
