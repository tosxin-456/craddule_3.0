import { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  RefreshCw,
  Home,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OnboardingReview() {
  const [review, setReview] = useState(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);

    // Get the AI review from localStorage
    const storedReview = localStorage.getItem("aiReview");
    if (storedReview) {
      setReview(JSON.parse(storedReview));
    }
  }, []);

  if (!review) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your review...</p>
        </div>
      </div>
    );
  }

  const isApproved = review.status === "ok" || review.status === "approved";
  const scoreColor =
    review.score >= 80
      ? "text-green-600"
      : review.score >= 60
      ? "text-amber-600"
      : "text-orange-600";
  const scoreBgColor =
    review.score >= 80
      ? "from-green-500 to-emerald-500"
      : review.score >= 60
      ? "from-amber-500 to-orange-500"
      : "from-orange-500 to-yellow-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-pink-50 p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div
        className={`max-w-4xl mx-auto relative transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 overflow-hidden mb-6">
          <div className={`h-2 bg-gradient-to-r ${scoreBgColor}`} />

          <div className="p-6 sm:p-8 md:p-10">
            <div className="flex items-start gap-4 sm:gap-6 mb-6">
              <div className="relative flex-shrink-0">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${scoreBgColor} rounded-2xl blur-lg opacity-50`}
                />
                <div
                  className={`relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br ${scoreBgColor} flex items-center justify-center`}
                >
                  {isApproved ? (
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  ) : (
                    <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                  {isApproved ? "Great Start! 🎉" : "Let's Refine Your Answers"}
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">
                  {isApproved
                    ? "Your onboarding answers show promise. Here's what we found:"
                    : "We've reviewed your answers and have some suggestions to strengthen them."}
                </p>
              </div>
            </div>

            {/* Score Display */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl sm:rounded-2xl p-6 border border-slate-200 shadow-lg">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Overall Score
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-4xl sm:text-5xl font-bold ${scoreColor}`}
                    >
                      {review.score}
                    </span>
                    <span className="text-xl text-slate-400 font-semibold">
                      /100
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-5 h-5 ${scoreColor}`} />
                  <div className="h-2 w-32 sm:w-48 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${scoreBgColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${review.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              AI Feedback
            </h2>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {review.feedback}
            </p>
          </div>
        </div>

        {/* Suggestions Card */}
        {review.suggestions && review.suggestions.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Suggestions for Improvement
              </h2>
            </div>

            <div className="space-y-3">
              {review.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100 hover:border-amber-200 transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-slate-700 leading-relaxed text-sm sm:text-base flex-1">
                      {suggestion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {!isApproved && (
              <button
                onClick={() => navigate("/onboarding")}
                className="group relative flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 active:scale-95 overflow-hidden shadow-xl flex-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-pink-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <RefreshCw className="relative w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="relative">Revise Answers</span>
              </button>
            )}

            <button
              onClick={() => navigate("/dashboard")}
              className="group flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95 flex-1"
            >
              {isApproved ? (
                <>
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  <Home className="w-5 h-5" />
                  <span>Move to Ai</span>
                </>
              )}
            </button>
          </div>

          {!isApproved && (
            <p className="text-xs sm:text-sm text-slate-500 text-center mt-4">
              💡 Tip: Refining your answers now will help us provide better
              support later
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
