import React, { useEffect, useMemo, useState } from "react";
import { Mail, Lock, User, Phone, Eye, EyeOff, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { API_BASE_URL } from "../../config/apiConfig";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------------------- handlers -------------------- */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  /* -------------------- google auth -------------------- */
  useEffect(() => {
    /* global google */
    if (!window.google) return;

    google.accounts.id.initialize({
      client_id:
        "652982067595-5ib81dgbepeqevr3868739t1bg4phrmm.apps.googleusercontent.com",
      callback: handleGoogleResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("google-signin-btn"),
      {
        theme: "outline",
        size: "large",
        width: "100%"
      }
    );
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/users/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: response.credential })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/onboarding");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- password rules -------------------- */
  const passwordRules = useMemo(() => {
    const password = formData.password;

    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
  }, [formData.password]);

  const isPasswordValid = Object.values(passwordRules).every(Boolean);
  const passwordsMatch =
    formData.password && formData.password === formData.confirmPassword;

  /* -------------------- submit -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Password does not meet requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
          password: formData.password,
          startupName: "My Startup",
          industry: "Tech",
          stage: "Idea",
          country: "Nigeria"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sign up failed");

      navigate("/otp", {
        state: {
          otpId: data.otpId,
          email: formData.email
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- ui helpers -------------------- */
  const Rule = ({ ok, text }) => (
    <div className="flex items-center gap-2 text-xs">
      {ok ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-gray-400" />
      )}
      <span className={ok ? "text-green-600" : "text-gray-500"}>{text}</span>
    </div>
  );

  /* -------------------- render -------------------- */
  return (
    <div className="min-h-screen font-mont flex">
      {/* Left */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&q=80"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-600/40" />
        <div className="absolute inset-0 flex items-center justify-center p-12 text-white">
          <div>
            <h1 className="text-5xl font-bold mb-6">Welcome to Craddule</h1>
            <p className="text-xl opacity-90">
              A structured, end-to-end founder enablement platform
            </p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={logo} className="w-10 h-10 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600">Sign up to get started</p>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div id="google-signin-btn" className="mb-6 flex justify-center" />

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* name */}
            <Input
              icon={User}
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            {/* email */}
            <Input
              icon={Mail}
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            {/* phone */}
            <Input
              icon={Phone}
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            {/* password */}
            <PasswordInput
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />

            {/* rules */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Rule ok={passwordRules.length} text="8+ characters" />
              <Rule ok={passwordRules.uppercase} text="Uppercase letter" />
              <Rule ok={passwordRules.lowercase} text="Lowercase letter" />
              <Rule ok={passwordRules.number} text="Number" />
              <Rule ok={passwordRules.special} text="Special character" />
            </div>

            {/* confirm password */}
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />

            {!passwordsMatch && formData.confirmPassword && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}

            <button
              type="submit"
              disabled={loading || !isPasswordValid || !passwordsMatch}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer font-medium"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------- reusable inputs -------------------- */
function Input({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          {...props}
          required
          className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

function PasswordInput({ label, show, toggle, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          {...props}
          type={show ? "text" : "password"}
          required
          className="w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
