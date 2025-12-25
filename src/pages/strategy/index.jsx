import {
  CheckCircle,
  XCircle,
  Brain,
  FileText,
  Users,
  Play,
  Lock,
  Unlock,
  ArrowRight,
  Clock,
  Sparkles,
  X,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

export default function Strategy() {
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [requirements, setRequirements] = useState([
    {
      id: 1,
      title: "Complete Craddule AI Walkthrough",
      description: "Interactive tour of the platform and its features",
      completed: true,
      estimatedTime: "10 mins",
      icon: <Sparkles className="w-5 h-5" />,
      details:
        "Get familiar with Craddule's AI-powered tools and understand how to leverage the platform for your business growth.",
      completedDate: "Jan 15, 2025"
    },
    {
      id: 2,
      title: "Generate Executive Summary",
      description: "AI-powered business overview and analysis",
      completed: false,
      estimatedTime: "15 mins",
      icon: <FileText className="w-5 h-5" />,
      details:
        "Use Craddule AI to generate a comprehensive executive summary of your business, including market position, competitive advantages, and growth opportunities.",
      completedDate: null
    },
    {
      id: 3,
      title: "Founder & Team Questionnaire",
      description: "Detailed information about leadership and structure",
      completed: false,
      estimatedTime: "20 mins",
      icon: <Users className="w-5 h-5" />,
      details:
        "Provide insights about your founding team, organizational structure, key personnel, and team capabilities to help advisors understand your human capital.",
      completedDate: null
    }
  ]);

  const completedCount = requirements.filter((r) => r.completed).length;
  const readyForSession = requirements.every((r) => r.completed);
  const progressPercentage = (completedCount / requirements.length) * 100;

  const handleComplete = (id) => {
    setRequirements((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              completed: true,
              completedDate: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })
            }
          : req
      )
    );
    setSelectedRequirement(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Image */}
        <header className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=300&fit=crop" 
              alt="Strategy session"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-400/90"></div>
          </div>
          <div className="p-4 md:p-6 -mt-16 relative">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-md mb-3">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">Strategy Portal</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Strategy Readiness
                </h1>
                <p className="text-slate-600 mt-2 text-sm md:text-base">
                  Strategy sessions are unlocked after completing the required
                  preparation steps. Get expert guidance once you're ready.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl px-6 py-4 text-center min-w-[140px] shadow-lg">
                <div className="text-3xl font-bold text-white">
                  {completedCount}/{requirements.length}
                </div>
                <div className="text-xs text-blue-100 mt-1 font-medium">Completed</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Overall Progress
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Status Alert */}
        {!readyForSession && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
            <div className="bg-amber-100 rounded-xl p-2">
              <Lock className="w-6 h-6 text-amber-600 flex-shrink-0" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 text-lg">
                Preparation Required
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                Complete {requirements.length - completedCount} more{" "}
                {requirements.length - completedCount === 1 ? "step" : "steps"}{" "}
                to unlock strategy sessions with expert advisors.
              </p>
            </div>
          </div>
        )}

        {readyForSession && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
            <div className="bg-green-100 rounded-xl p-2">
              <Unlock className="w-6 h-6 text-green-600 flex-shrink-0" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 text-lg">You're Ready!</h3>
              <p className="text-sm text-green-700 mt-1">
                All preparation steps completed. You can now request a strategy
                session with our expert advisors.
              </p>
            </div>
          </div>
        )}

        {/* Requirements List */}
        <div className="space-y-4">
          {requirements.map((req, index) => (
            <div
              key={req.id}
              className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                req.completed
                  ? "border-green-200 bg-green-50/30"
                  : "border-blue-100 hover:shadow-xl hover:border-blue-200"
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start gap-0">
                {/* Side Image */}
                {!req.completed && (
                  <div className="w-full lg:w-56 h-48 lg:h-auto relative">
                    <img 
                      src={
                        req.id === 1 
                          ? "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop"
                          : req.id === 2
                          ? "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"
                          : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
                      }
                      alt={req.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r lg:bg-gradient-to-r from-transparent to-white"></div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-start gap-4 p-4 md:p-5 flex-1">
                  {/* Icon */}
                  <div
                    className={`rounded-xl p-3 shadow-sm ${
                      req.completed
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 text-green-600"
                        : "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600"
                    }`}
                  >
                    {req.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-slate-500">
                            Step {index + 1}
                          </span>
                          {req.completed && (
                            <CheckCircle className="text-green-600 w-4 h-4" />
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mt-1">
                          {req.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {req.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {req.estimatedTime}
                          </span>
                          {req.completedDate && (
                            <span className="text-green-600 font-medium">
                              Completed on {req.completedDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {!req.completed && (
                      <button
                        onClick={() => setSelectedRequirement(req)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-sm font-medium mt-3"
                      >
                        <Play className="w-4 h-4" />
                        Start Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Strategy Session Request Card */}
        <div
          className={`rounded-2xl overflow-hidden transition-all ${
            readyForSession
              ? "shadow-xl"
              : "border border-slate-200"
          }`}
        >
          {readyForSession ? (
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=300&fit=crop" 
                alt="Strategy consultation"
                className="w-full h-64 object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 to-blue-500/95"></div>
              <div className="absolute inset-0 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 h-full">
                  <div className="bg-white rounded-xl p-3 shadow-lg">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
                      Strategy Session Access
                      <Unlock className="w-5 h-5" />
                    </h3>
                    <p className="text-sm mt-1 text-blue-50">
                      You're eligible to request a strategy session with our expert advisors. Book your consultation now.
                    </p>

                    {/* Benefits */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-sm font-medium text-white">Expert Guidance</p>
                        <p className="text-xs text-blue-100 mt-1">
                          One-on-one with industry advisors
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-sm font-medium text-white">Tailored Strategy</p>
                        <p className="text-xs text-blue-100 mt-1">
                          Custom roadmap for your business
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-sm font-medium text-white">Actionable Insights</p>
                        <p className="text-xs text-blue-100 mt-1">
                          Clear next steps and priorities
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSessionModal(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl"
                  >
                    Request Session
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100 p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="bg-slate-200 rounded-xl p-3">
                  <Brain className="w-6 h-6 text-slate-400" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-slate-500">
                    Strategy Session Access
                    <Lock className="w-5 h-5" />
                  </h3>
                  <p className="text-sm mt-1 text-slate-500">
                    Complete all preparation steps to unlock personalized strategy sessions with expert advisors.
                  </p>
                </div>

                <button
                  disabled
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap bg-slate-300 text-slate-500 cursor-not-allowed"
                >
                  Request Session
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 rounded-xl p-2">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 text-sm">
                Why These Steps Matter
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Completing these preparation steps ensures our advisors have the
                context they need to provide you with the most valuable,
                personalized strategic guidance. This makes your session more
                productive and impactful.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requirement Detail Modal */}
      {selectedRequirement && (
        <RequirementModal
          requirement={selectedRequirement}
          onClose={() => setSelectedRequirement(null)}
          onComplete={handleComplete}
        />
      )}

      {/* Session Request Modal */}
      {showSessionModal && (
        <SessionRequestModal onClose={() => setShowSessionModal(false)} />
      )}
    </div>
  );
}

function RequirementModal({ requirement, onClose, onComplete }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-2">
              {requirement.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {requirement.title}
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                {requirement.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-5">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">
              What You'll Do
            </h3>
            <p className="text-sm text-slate-700">{requirement.details}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">
                Estimated Time: {requirement.estimatedTime}
              </p>
            </div>
            <p className="text-xs text-blue-700">
              Take your time to provide thorough and accurate information for
              the best results.
            </p>
          </div>

          {requirement.id === 2 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">What to Include:</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  Company overview and mission statement
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  Current market position and competitive landscape
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  Key products/services and value proposition
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  Revenue model and financial highlights
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  Growth strategy and future plans
                </li>
              </ul>
            </div>
          )}

          {requirement.id === 3 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">
                Information Needed:
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  Founder backgrounds and expertise
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  Key leadership team members and roles
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  Team size and organizational structure
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  Core competencies and skill gaps
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  Advisory board and key stakeholders
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onComplete(requirement.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg font-medium text-sm"
          >
            <Play className="w-4 h-4" />
            Begin Step
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionRequestModal({ onClose }) {
  const [formData, setFormData] = useState({
    focus: "",
    challenges: "",
    goals: "",
    preferredDate: "",
    preferredTime: ""
  });

  const handleSubmit = () => {
    if (!formData.focus || !formData.preferredDate || !formData.preferredTime) {
      alert("Please fill in all required fields");
      return;
    }
    alert(
      "Strategy session request submitted! We'll contact you within 24 hours to confirm."
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Request Strategy Session
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Tell us about your priorities for the session
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Primary Focus Area <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.focus}
              onChange={(e) =>
                setFormData({ ...formData, focus: e.target.value })
              }
            >
              <option value="">Select focus area</option>
              <option value="scaling">Business Scaling & Growth</option>
              <option value="funding">Fundraising & Investment</option>
              <option value="operations">Operations & Efficiency</option>
              <option value="market">Market Expansion</option>
              <option value="compliance">Regulatory & Compliance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Key Challenges (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What specific challenges are you facing?"
              value={formData.challenges}
              onChange={(e) =>
                setFormData({ ...formData, challenges: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Session Goals (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What do you hope to achieve from this session?"
              value={formData.goals}
              onChange={(e) =>
                setFormData({ ...formData, goals: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Preferred Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.preferredDate}
                onChange={(e) =>
                  setFormData({ ...formData, preferredDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Preferred Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.preferredTime}
                onChange={(e) =>
                  setFormData({ ...formData, preferredTime: e.target.value })
                }
              />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-900 mb-2">
              What to Expect:
            </h3>
            <ul className="space-y-1 text-xs text-green-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                45-60 minute one-on-one session with an expert advisor
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Personalized strategic recommendations
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Action plan with clear next steps
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Follow-up summary and resources
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-white transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors font-medium text-sm"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
