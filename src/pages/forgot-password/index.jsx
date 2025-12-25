import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate(); // initialize navigate
  const handleSubmit = () => {
    if (email) {
      console.log("Password reset requested for:", email);
      setSubmitted(true);
    }
  };

  const handleBackToLogin = () => {
    setSubmitted(false);
    setEmail("");
  };

  return (
    <div className="min-h-screen font-mont flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-blue-600/40"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white max-w-md text-center">
            <Shield className="w-20 h-20 mx-auto mb-6 opacity-90" />
            <h1 className="text-5xl font-bold mb-6">Account Recovery</h1>
            <p className="text-xl opacity-90">
              We'll help you get back into your account securely and quickly.
            </p>
            <div className="mt-12 space-y-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span>Secure password reset link</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span>Link expires in 24 hours</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span>Your data stays protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600">
                  No worries! Enter your email and we'll send you reset
                  instructions.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!email}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Send Reset Link
                </button>

                <button
                  //   onClick={handleBackToLogin}
                  onClick={() => navigate("/login")}
                  className="w-full flex items-center cursor-pointer justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors py-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-medium">Back to Login</span>
                </button>
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">💡 Tip:</span> Check your spam
                  folder if you don't see the email within a few minutes.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-600">
                  We've sent password reset instructions to:
                </p>
                <p className="text-gray-800 font-semibold mt-2">{email}</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Next Steps:
                  </h3>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-600">1.</span>
                      <span>
                        Check your email inbox for our password reset message
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-600">2.</span>
                      <span>
                        Click the reset link in the email (valid for 24 hours)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-blue-600">3.</span>
                      <span>
                        Create a new password and sign in to your account
                      </span>
                    </li>
                  </ol>
                </div>

                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    Didn't receive the email?
                  </p>
                  <button
                    onClick={handleSubmit}
                    className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    Resend Email
                  </button>
                </div>

                <button
                  //   onClick={handleBackToLogin}
                  className="w-full flex cursor-pointer items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors py-3 mt-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span
                    onClick={() => navigate("/login")}
                    className="font-medium cursor-pointer "
                  >
                    Back to Login
                  </span>
                </button>
              </div>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              Need more help?{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
