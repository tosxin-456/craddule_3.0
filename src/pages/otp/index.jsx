import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Loader2, RefreshCcw } from "lucide-react";
import { API_BASE_URL } from "../../config/apiConfig";

const OTP_DURATION = 7 * 60; // 7 minutes in seconds

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const { otpId } = location.state || {};

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);

  /* -------------------------------------------------------------------------- */
  /* Countdown Timer                                                            */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const isExpired = timeLeft <= 0;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* -------------------------------------------------------------------------- */
  /* Verify OTP                                                                 */
  /* -------------------------------------------------------------------------- */
  const handleVerify = async () => {
    if (isExpired) {
      return setError("OTP has expired. Please resend.");
    }

    if (code.length !== 6) {
      return setError("OTP must be 6 digits");
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpId, code })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      localStorage.setItem("token", data.token);
      navigate("/onboarding");
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Resend OTP                                                                 */
  /* -------------------------------------------------------------------------- */
  const handleResend = async () => {
    try {
      setResending(true);
      setError("");

      await fetch(`${API_BASE_URL}/otp/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpId })
      });

      setCode("");
      setTimeLeft(OTP_DURATION);
    } catch {
      setError("Failed to resend OTP. Try again.");
    } finally {
      setResending(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* UI                                                                         */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 rounded-xl bg-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-2">
          Verify Your Account
        </h1>
        <p className="text-slate-600 text-center mb-4">
          Enter the 6-digit code sent to you
        </p>

        {/* Timer */}
        <p
          className={`text-center text-sm mb-5 ${
            isExpired ? "text-yellow-500" : "text-slate-500"
          }`}
        >
          {isExpired
            ? "This code has expired"
            : `Code expires in ${formatTime(timeLeft)}`}
        </p>

        {/* OTP Input */}
        <input
          type="text"
          maxLength={6}
          value={code}
          disabled={isExpired}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="w-full text-center tracking-widest text-xl font-semibold px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
          placeholder="••••••"
        />

        {/* Error */}
        {error && (
          <p className="text-yellow-500 text-sm text-center mt-3">{error}</p>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading || isExpired}
          className="mt-6 w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying…
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* Resend */}
        <div className="text-center mt-5">
          <button
            onClick={handleResend}
            disabled={!isExpired || resending}
            className="text-indigo-600 font-semibold hover:underline disabled:opacity-40 flex items-center justify-center gap-2 mx-auto"
          >
            {resending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Resending…
              </>
            ) : (
              <>
                <RefreshCcw className="w-4 h-4" />
                Resend OTP
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
