import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";
import { FileText, Sparkles, X, ArrowRight } from "lucide-react";

export default function StartFlowModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!isOpen) return null;

  const markModalAsSeen = async () => {
    try {
      await fetch(`${API_BASE_URL}/users/modal-status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
    } catch (err) {
      console.error("Failed to update modal status:", err);
    }
  };

  const goTo = async (path) => {
    await markModalAsSeen();
    onClose();
    navigate(path);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm
      flex items-center justify-center px-4 py-8 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative">
        {/* Scrollable content wrapper */}
        <div className="p-7 max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header */}
          <div className="mb-6 pr-10">
            <h2 className="text-2xl font-bold text-gray-900">
              What do you want to proceed with?
            </h2>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              Pick a starting point — Abby will guide you either way, and you
              can switch anytime.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {/* Option A */}
            <button
              onClick={() => goTo("/dashboard/compliance")}
              className="group w-full text-left p-5 rounded-2xl border border-gray-200 hover:border-green-600 hover:bg-green-50 transition flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-gray-900">
                    Business documents & funding pathway
                  </p>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-700 transition" />
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  Compliance checklist, structured roadmap, and investor
                  readiness.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    Compliance
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    Funding-ready
                  </span>
                </div>
              </div>
            </button>

            {/* Option B */}
            <button
              onClick={() => goTo("/ai-walkthrough")}
              className="group w-full text-left p-5 rounded-2xl border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-gray-900">
                    Get your business plan & summaries
                  </p>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-700 transition" />
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  Use Abby AI to generate business plans, summaries, decks &
                  more.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                    Abby AI
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                    Business plan
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
