import { useState, useEffect, useRef } from "react";
import {
  ClipboardList,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Brain,
  Loader2,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  RefreshCw,
  Home
} from "lucide-react";
import { API_BASE_URL } from "../../config/apiConfig";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    label: "Write briefly about your business",
    hint: "Describe the real-world problem your business addresses.",
    placeholder:
      "Example: Small businesses struggle to manage cash flow because they lack visibility into upcoming expenses and revenue..."
  },
  {
    label: "Who experiences this problem?",
    hint: "Be specific about the customer or market.",
    placeholder:
      "Example: Small business owners with 5-50 employees in the retail and hospitality sectors..."
  },
  {
    label: "How do people currently solve this problem?",
    hint: "Alternatives, workarounds, or competitors.",
    placeholder:
      "Example: Most use spreadsheets or basic accounting software, but these don't provide predictive insights..."
  },
  {
    label:
      "What is the biggest risk or uncertainty in your business right now?",
    hint: "Market, regulation, execution, funding, or something else.",
    placeholder:
      "Example: Customer acquisition cost is higher than expected, and we need to validate our pricing model..."
  },
  {
    label: "What are you building to solve it?",
    hint: "Product, service, or platform.",
    placeholder:
      "Example: A SaaS platform that uses AI to forecast cash flow and provide actionable financial recommendations..."
  },
  {
    label: "What stage is your business currently at?",
    hint: "Idea, MVP, early traction, revenue, etc.",
    placeholder:
      "Example: We have an MVP with 15 beta users and $2K in monthly recurring revenue..."
  },
  {
    label: "What are the key documents of your business that you have?",
    hint: "Include things like business brief, pitch deck, financials, market research, legal docs.",
    placeholder:
      "Example: Business brief for clarity, pitch deck for investors, financial forecast for planning, and legal documents for protection..."
  },
  {
    label: "What traction or validation do you have so far?",
    hint: "Evidence that your product/service has demand.",
    placeholder:
      "Example: 100+ beta signups, 20 paying customers, or partnerships with two local retailers..."
  }
];

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`
});

export default function FounderOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [charCount, setCharCount] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [review, setReview] = useState(null);
  const [isSkipping, setIsSkipping] = useState(false);

  const navigate = useNavigate();
  useEffect(() => setMounted(true), []);

  const maxChars = 500;
  const currentQuestion = questions[currentStep];
  const progress = showReview
    ? 100
    : ((currentStep + 1) / questions.length) * 100;
  const canProceed = answers[currentStep]?.trim().length > 0;

  const saveStep = async (step, answer) => {
    if (isAnalyzing) return true; // 🔒 block autosave during submit

    try {
      await fetch(`${API_BASE_URL}/onboarding/save-step`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          step,
          question: questions[step],
          answer
        })
      });
      return true;
    } catch {
      return false;
    }
  };

  const fetchLatestReview = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/onboarding/review`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setReview(data.aiReview);
        console.log(data.aiReview);
        setShowReview(true);
      } else {
        console.error("Failed to fetch review:", data);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch latest review when component mounts
    fetchLatestReview();
  }, []);

  const submitAll = async () => {
    if (isAnalyzing) return;

    // 🛑 Cancel pending autosave
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
      saveTimeout.current = null;
    }

    setIsAnalyzing(true);

    try {
      const res = await fetch(`${API_BASE_URL}/onboarding`, {
        method: "POST",
        headers: getAuthHeaders()
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Submission failed");
      }

      setReview(data.aiReview);
      setShowReview(true);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveTimeout = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setAnswers({ ...answers, [currentStep]: value });
    setCharCount(value.length);

    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveStep(currentStep, value);
    }, 800);
  };

  const handleNext = async () => {
    if (!canProceed) return;

    setIsAnimating(true);
    setDirection(1);

    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
        setCharCount(answers[currentStep + 1]?.length || 0);
      } else {
        submitAll();
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleBack = () => {
    setIsAnimating(true);
    setDirection(-1);

    setTimeout(() => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
        setCharCount(answers[currentStep - 1]?.length || 0);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleSkip = async () => {
    if (isSkipping) return; // 🔒 block multiple clicks
    setIsSkipping(true);

    const success = await saveStep(currentStep, "No answer provided");
    if (!success) {
      alert("Failed to save your skipped answer. Please try again.");
      setIsSkipping(false);
      return;
    }

    setAnswers({ ...answers, [currentStep]: "No answer provided" });
    await handleNext(); // make sure we wait for handleNext
    setIsSkipping(false);
  };

  const handleReviseAnswers = () => {
    setShowReview(false);
    setReview(null);
    setCurrentStep(0);
    setCharCount(answers[0]?.length || 0);
  };

  const handlePrimaryAction = () => {
    const isApproved = review.status === "ok";
    if (isApproved) {
      navigate("/dashboard");
    } else {
      navigate("/ai-walkthrough");
    }
  };

  // Analyzing State
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="max-w-2xl w-full relative">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 md:p-12 text-center">
            <div className="relative inline-block mb-6 sm:mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl sm:rounded-3xl blur-2xl opacity-50 animate-pulse" />
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center mx-auto">
                <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse" />
              </div>
            </div>

            <div className="mb-6">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
                Analyzing Your Answers
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                Our AI is processing your responses to create a personalized
                experience...
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" />
              <div
                className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="h-2 w-2 bg-pink-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Review State
  if (showReview && review) {
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
        : "from-orange-500 to-red-500";

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-pink-50 p-4 sm:p-6 md:p-8 relative overflow-hidden">
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
                    {isApproved
                      ? "Great Start! 🎉"
                      : "Let's Refine Your Answers"}
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
                  onClick={handleReviseAnswers}
                  className="group relative flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 active:scale-95 overflow-hidden shadow-xl flex-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-pink-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <RefreshCw className="relative w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="relative">Revise Answers</span>
                </button>
              )}

              <button
                onClick={handlePrimaryAction}
                className="group flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95 flex-1"
              >
                {isApproved ? (
                  <>
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Refine with AI</span>
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

  // Onboarding Questions State
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div
        className={`max-w-3xl w-full relative transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="h-2 sm:h-3 bg-gradient-to-r from-slate-100 to-slate-50 relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-blue-600 to-pink-600 transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-10 lg:p-14">
            <div className="flex items-center gap-3 sm:gap-5 mb-6 sm:mb-8 md:mb-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl sm:rounded-2xl blur-lg opacity-50" />
                <div className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center transform hover:scale-105 transition-transform">
                  <ClipboardList className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Founder Onboarding
                </h1>
                <div className="flex items-center gap-2 mt-1 sm:mt-2 flex-wrap">
                  <p className="text-xs sm:text-sm font-medium text-slate-500 whitespace-nowrap">
                    Question {currentStep + 1} of {questions.length}
                  </p>
                  <div className="flex gap-0.5 sm:gap-1">
                    {questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                          idx <= currentStep
                            ? "w-4 sm:w-6 md:w-8 bg-gradient-to-r from-indigo-600 to-blue-600"
                            : "w-1 sm:w-1.5 bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`transition-all duration-300 ${
                isAnimating
                  ? direction === 1
                    ? "opacity-0 -translate-x-8"
                    : "opacity-0 translate-x-8"
                  : "opacity-100 translate-x-0"
              }`}
            >
              <div className="mb-6 sm:mb-8">
                <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <label className="block text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-1.5 sm:mb-2 leading-tight">
                      {currentQuestion.label}
                    </label>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {currentQuestion.hint}
                    </p>
                  </div>
                </div>

                <div className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-pink-600 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                      isFocused ? "opacity-30" : ""
                    }`}
                  />
                  <textarea
                    rows={6}
                    value={answers[currentStep] || ""}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={currentQuestion.placeholder}
                    className={`relative w-full rounded-xl sm:rounded-2xl border-2 p-3 sm:p-4 md:p-5 text-sm sm:text-base focus:outline-none transition-all resize-none bg-white/50 backdrop-blur-sm ${
                      isFocused
                        ? "border-blue-400 shadow-xl ring-2 sm:ring-4 ring-blue-100"
                        : "border-slate-200 hover:border-slate-300 shadow-lg"
                    }`}
                  />
                </div>

                <div className="flex justify-between items-center mt-2 sm:mt-3 px-1">
                  <p className="text-xs text-slate-500 font-medium hidden sm:block">
                    ✨ Be as detailed as you'd like (max ~500 words)
                  </p>
                  <p className="text-xs text-slate-500 font-medium sm:hidden">
                    ✨ Max ~500 words
                  </p>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div
                      className={`h-1 sm:h-1.5 w-12 sm:w-20 rounded-full bg-slate-100 overflow-hidden ${
                        charCount > 0 ? "opacity-100" : "opacity-0"
                      } transition-opacity`}
                    >
                      <div
                        className={`h-full transition-all duration-300 ${
                          charCount > maxChars * 0.9
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-indigo-500 to-blue-500"
                        }`}
                        style={{ width: `${(charCount / maxChars) * 100}%` }}
                      />
                    </div>
                    <p
                      className={`text-xs font-semibold transition-colors ${
                        charCount > maxChars * 0.9
                          ? "text-amber-600"
                          : "text-slate-400"
                      }`}
                    >
                      {charCount} / {maxChars}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 pt-4 sm:pt-6">
              <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="group flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-slate-600 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-100 transition-all disabled:opacity-0 disabled:pointer-events-none transform hover:scale-105 active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>

                <button
                  onClick={handleSkip}
                  disabled={isSkipping}
                  className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-500 hover:text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSkipping && (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                  )}
                  <span>{isSkipping ? "Skipping..." : "Skip question"}</span>
                </button>
              </div>

              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="group relative flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4rounded-xl sm:rounded-2xl font-bold text-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-pink-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative text-sm sm:text-base">
                  {currentStep === questions.length - 1 ? "Submit" : "Next"}
                </span>
                <ArrowRight className="relative w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
