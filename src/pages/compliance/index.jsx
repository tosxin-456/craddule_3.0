import {
  Shield,
  FilePlus,
  CheckCircle,
  Loader2,
  FileText,
  Building2,
  Receipt,
  X,
  Upload,
  AlertCircle
} from "lucide-react";

import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../config/apiConfig";
import toast from "react-hot-toast";

export default function Compliance() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [complianceItems, setComplianceItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchComplianceItems();
    fetchAuthorizationStatus();
  }, []);

  const fetchComplianceItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/compliance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log("Compliance items:", data);
      if (data.success) {
        setComplianceItems(data.items);
      }
    } catch (err) {
      console.error("Error fetching compliance items:", err);
    }
    setLoading(false);
  };

  const fetchAuthorizationStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/compliance/authorize`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log("Authorization response:", data);

      if (data.success && data.authorization) {
        // Handle both boolean and integer (1/0) values
        const isAuthorized =
          data.authorization.authorized === true ||
          data.authorization.authorized === 1;
        console.log("Setting authStatus to:", isAuthorized);
        setAuthStatus(isAuthorized);
      }
    } catch (err) {
      console.error("Error fetching auth status:", err);
    }
  };

  const handleSubmitDocument = async (itemId, formData) => {
    try {
      const body = new FormData();
      body.append("itemId", itemId);

      // append all other form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined) {
          body.append(key, formData[key]);
        }
      });

      const res = await fetch(`${API_BASE_URL}/compliance/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Document submitted successfully!");
        setComplianceItems((prev) =>
          prev.map((item) =>
            item.itemId === itemId ? { ...item, ...data.item } : item
          )
        );
        setSelectedItem(null);
      } else {
        toast.error(data.message || "Error submitting document");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit document");
    }
  };

  const completedCount = complianceItems.filter(
    (i) => i.status === "Completed"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <header className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 overflow-hidden p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Regulatory Compliance
              </h1>
              <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Complete your required documents. Once submitted, we process and
                authorize them.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-center min-w-[120px] sm:min-w-[140px] shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {completedCount}/{complianceItems.length}
              </div>
              <div className="text-xs text-blue-100 mt-1 font-medium">
                Completed
              </div>
            </div>
          </div>
        </header>

        {/* Authorization Status Indicator */}
        {authStatus && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              Authorization granted - You can now upload documents
            </span>
          </div>
        )}

        {/* Compliance Items */}
        {loading ? (
          <div className="text-center text-blue-600 py-12 sm:py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <p className="mt-2 text-sm sm:text-base">
              Loading compliance items...
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {complianceItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200"
              >
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 sm:p-5">
                  <div
                    className={`rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-sm ${
                      item.status === "Completed"
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 text-green-600"
                        : item.status === "Pending"
                        ? "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600"
                        : "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600"
                    }`}
                  >
                    {item.icon || <FileText className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-base sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <StatusBadge status={item.complianceStatus} />

                        {/* Show button only if authorized AND status is Not Started */}
                        {authStatus &&
                          item.complianceStatus === "Not Started" && (
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm font-medium w-full sm:w-auto"
                            >
                              <FilePlus className="w-4 h-4" />
                              Upload Document
                            </button>
                          )}

                        {/* Show message if not authorized */}
                        {!authStatus &&
                          item.complianceStatus === "Not Started" && (
                            <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 italic">
                              Grant authorization below to fill this document
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Authorization */}
        {/* {!authStatus && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 w-full">
              <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-lg">
                <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg sm:text-xl text-white">
                  Processing Authorization Required
                </h3>
                <p className="text-blue-50 mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed">
                  Grant Craddule permission to submit documents on your behalf
                  to enable document filling.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="mt-3 sm:mt-4 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-all font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl w-full sm:w-auto"
                >
                  Grant Authorization
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Document Modal */}
      {selectedItem && (
        <DocumentModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSubmit={handleSubmitDocument}
        />
      )}

      {/* Authorization Modal */}
      {showAuthModal && (
        <AuthorizationModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setAuthStatus(true);
            setShowAuthModal(false);
            fetchComplianceItems();
          }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Completed: {
      icon: <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      bg: "bg-gradient-to-r from-green-50 to-emerald-50",
      text: "text-green-700",
      border: "border-green-200"
    },
    Pending: {
      icon: <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />,
      bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
      text: "text-blue-700",
      border: "border-blue-200"
    },
    "Not Started": {
      icon: <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      bg: "bg-gradient-to-r from-slate-50 to-slate-100",
      text: "text-slate-700",
      border: "border-slate-200"
    },
    Rejected: {
      icon: <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />,
      bg: "bg-gradient-to-r from-red-50 to-red-100",
      text: "text-red-700",
      border: "border-red-200"
    }
  };
  const style = config[status] || config["Not Started"];
  return (
    <span
      className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg border ${style.bg} ${style.text} ${style.border} whitespace-nowrap`}
    >
      {style.icon}
      {status}
    </span>
  );
}

// Document Modal
function DocumentModal({ item, onClose, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const firstInputRef = useRef(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
const [documentType, setDocumentType] = useState("");

  useEffect(() => {
    // Focus first input on mount
    firstInputRef.current?.focus();

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const getFormFields = () => [
    {
      name: "businessName",
      label: "Business Name",
      type: "text",
      required: true,
      placeholder: "Enter your business name"
    },
    {
      name: "businessAddress",
      label: "Business Address",
      type: "textarea",
      required: true,
      placeholder: "Enter complete business address"
    },
    {
      name: "contactPerson",
      label: "Contact Person",
      type: "text",
      required: true,
      placeholder: "Full name of contact person"
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      required: true,
      placeholder: "+234 800 000 0000"
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      placeholder: "email@example.com"
    }
  ];

  const validateField = (name, value) => {
    const field = getFormFields().find((f) => f.name === name);

    if (field.required && (!value || value.trim() === "")) {
      return `${field.label} is required`;
    }

    if (name === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    if (name === "phone" && value) {
      const phoneRegex = /^[\d\s+()-]+$/;
      if (!phoneRegex.test(value) || value.replace(/\D/g, "").length < 10) {
        return "Please enter a valid phone number";
      }
    }

    return null;
  };

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg"
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF and image files are allowed");
        return;
      }

      setSelectedFile(file);
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please upload a document");
      return;
    }
    const token = localStorage.getItem("token");

    const fields = getFormFields();
    const errors = {};
    fields.forEach((f) => {
      const error = validateField(f.name, formData[f.name]);
      if (error) errors[f.name] = error;
    });
    if (Object.keys(errors).length) {
      setErrors(errors);
      toast.error("Fix errors before submitting");
      return;
    }

    const body = new FormData();
    body.append("itemId", item.itemId);
    body.append("file", selectedFile);
    body.append("formData", JSON.stringify(formData));

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/compliance/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body
      });
      const data = await res.json();
      if (data.success) {
        // Clear form
        setFormData({});
        setSelectedFile(null);

        // Show success modal
        setShowSuccessModal(true);
      } else {
        // toast.error({
        //   message: data.message || "Submission failed",
        //   type: "error"
        // });
        console.log(data);
      }
    } catch (err) {
      toast.error("Submission failed");
      console.log(err)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center animate-slide-up">
            <CheckCircle className="mx-auto w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold">Document Submitted!</h3>
            <p className="text-sm text-slate-600 mt-2">
              Your document has been successfully submitted.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                onClose(); // close main modal
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex-1 pr-4">
            <h2
              id="modal-title"
              className="text-xl sm:text-2xl font-bold text-slate-900"
            >
              {item.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {item.fullName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/80 transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="overflow-y-auto max-h-[calc(95vh-240px)] sm:max-h-[calc(90vh-240px)] p-4 sm:p-6 space-y-4">
          {getFormFields().map((field, index) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  ref={index === 0 ? firstInputRef : null}
                  rows={3}
                  placeholder={field.placeholder}
                  className={`w-full px-3 py-2 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors[field.name]
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300"
                  }`}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={
                    errors[field.name] ? `${field.name}-error` : undefined
                  }
                />
              ) : (
                <input
                  id={field.name}
                  ref={index === 0 ? firstInputRef : null}
                  type={field.type}
                  placeholder={field.placeholder}
                  className={`w-full px-3 py-2 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    errors[field.name]
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300"
                  }`}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={
                    errors[field.name] ? `${field.name}-error` : undefined
                  }
                />
              )}
              {errors[field.name] && (
                <p
                  id={`${field.name}-error`}
                  className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {/* File Upload */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
              Upload Document
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                aria-label="Upload document"
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3 text-green-600">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                  <Upload className="w-6 h-6" />
                  <p className="text-sm font-medium">
                    Click to upload document
                  </p>
                  <p className="text-xs">PDF, JPG, or PNG (max 10MB)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 sm:px-5 py-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm sm:text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 sm:px-5 py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 text-sm sm:text-base font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Document"
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Authorization Modal
function AuthorizationModal({ onClose, onSuccess }) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleGrant = async () => {
    if (!agreed) {
      toast.error("Please agree to the terms");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/compliance/authorize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      console.log("Authorization grant response:", data);

      if (data.success) {
        toast.success(data.message || "Authorization granted successfully!");
        onSuccess();
      } else {
        toast.error(data.message || "Failed to grant authorization");
      }
    } catch (err) {
      console.error("Authorization error:", err);
      toast.error("Error granting authorization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 rounded-lg p-2">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Grant Processing Authorization
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base">
            By granting authorization, you allow Craddule to submit compliance
            documents and communicate with regulatory bodies on your behalf.
          </p>
          <div className="bg-slate-50 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
            <label className="flex items-start gap-2 sm:gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 sm:mt-1 w-4 h-4 flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-slate-700">
                I authorize Craddule to act as my representative for regulatory
                compliance processing and understand I can revoke this at any
                time.
              </span>
            </label>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-xl sm:rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 sm:px-5 py-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm sm:text-base font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGrant}
            disabled={!agreed || loading}
            className="px-4 sm:px-5 py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Granting..." : "Grant Authorization"}
          </button>
        </div>
      </div>
    </div>
  );
}
