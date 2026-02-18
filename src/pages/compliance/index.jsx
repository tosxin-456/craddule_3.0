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
  AlertCircle,
  PlusCircle
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
  const [requestItem, setRequestItem] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMissingDocModal, setShowMissingDocModal] = useState(false);
  const [error, setError] = useState(null);
  const initialFormState = {
    reason: "",
    preferredDelivery: "",
    urgencyLevel: ""
  };

  const [formData, setFormData] = useState(initialFormState);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const init = async () => {
      await fetchComplianceItems();
      await fetchRequests();
      fetchAuthorizationStatus();
    };

    init();
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

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/request`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        const requests = data.data;

        setComplianceItems((prevItems) =>
          prevItems.map((item) => {
            const existingRequest = requests.find(
              (req) => req.userComplianceId === item.id
            );

            return {
              ...item,
              request: existingRequest || null,
              complianceStatus:
                existingRequest?.status === "Pending"
                  ? "Pending"
                  : item.complianceStatus
            };
          })
        );
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleSubmitDocument = async (itemId, formData) => {
    try {
      const body = new FormData();
      body.append("itemId", itemId);

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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Request Missing Document Button */}
              <button
                onClick={() => setShowMissingDocModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg text-sm font-medium whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                Request Missing Compliance
              </button>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-center min-w-[120px] sm:min-w-[140px] shadow-lg">
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {completedCount}/{complianceItems.length}
                </div>
                <div className="text-xs text-blue-100 mt-1 font-medium">
                  Completed
                </div>
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

                        {authStatus && (
                          <div className="flex flex-col gap-3 w-full sm:w-auto">
                            {item.complianceStatus === "Not Started" && (
                              <button
                                onClick={() => setSelectedItem(item)}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm font-medium w-full sm:w-auto"
                              >
                                <FilePlus className="w-4 h-4" />
                                Upload Document
                              </button>
                            )}

                            {item.request &&
                            item.request.status === "Pending" ? (
                              <div className="text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 italic">
                                Craddule will get back to you
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setRequestItem(item);
                                  setShowRequestModal(true);
                                }}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm font-medium w-full sm:w-auto"
                              >
                                Request from Craddule
                              </button>
                            )}
                          </div>
                        )}

                        {!authStatus &&
                          item.complianceStatus === "Not Started" && (
                            <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 italic">
                              Grant authorization below to upload this document
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

        {/* Request from Craddule Modal */}
        {showRequestModal && requestItem && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setShowRequestModal(false);
              setRequestItem(null);
              setFormData(initialFormState);
              setError(null);
            }}
          >
            <div
              className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-1">
                Request from Craddule
              </h2>

              <p className="text-sm text-gray-500 mb-4">
                You are requesting: <strong>{requestItem.title}</strong>
              </p>

              {error && (
                <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-3">
                  {error}
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);

                  try {
                    setLoading(true);

                    const response = await fetch(`${API_BASE_URL}/request`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        userComplianceId: requestItem.id,
                        reason: formData.reason
                      })
                    });

                    const data = await response.json();

                    if (!response.ok) {
                      throw new Error(data.message || "Something went wrong");
                    }

                    toast.success("Request submitted successfully!");
                    await fetchRequests();
                    setShowRequestModal(false);
                    setRequestItem(null);
                    setFormData(initialFormState);
                  } catch (err) {
                    setError(err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-4"
              >
                <textarea
                  placeholder="Why do you need this document?"
                  required
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full border rounded-lg p-2 text-sm"
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRequestModal(false);
                      setRequestItem(null);
                      setFormData(initialFormState);
                      setError(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={!requestItem || loading}
                    className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Authorization */}
        {!authStatus && (
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
        )}
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

      {/* Request Missing Document Modal */}
      {showMissingDocModal && (
        <RequestMissingDocumentModal
          onClose={() => setShowMissingDocModal(false)}
          token={token}
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

// Request Missing Compliance Modal
function RequestMissingDocumentModal({ onClose, token }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    complianceName: "",
    complianceType: "",
    reason: "",
    additionalNotes: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.complianceName.trim()) {
      setError("Compliance name is required.");
      return;
    }
    if (!formData.complianceType.trim()) {
      setError("Please enter a compliance type.");
      return;
    }
    if (!formData.reason.trim()) {
      setError("Please provide a reason for the request.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/request-missing`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success(
        "Your request has been submitted! Craddule will review and get back to you."
      );
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 rounded-lg p-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Request Missing Compliance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Can't find a compliance item in your list? Request it here.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/80 transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-4 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Compliance Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Compliance Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Annual Tax Clearance Certificate"
                value={formData.complianceName}
                onChange={(e) =>
                  setFormData({ ...formData, complianceName: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>

            {/* Compliance Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Compliance Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Tax Compliance, Operating License, Import/Export License..."
                value={formData.complianceType}
                onChange={(e) =>
                  setFormData({ ...formData, complianceType: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Why do you need this document?{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe why this document is required for your compliance..."
                rows={3}
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                required
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Additional Notes{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                placeholder="Any additional context, deadlines, or specific requirements..."
                rows={2}
                value={formData.additionalNotes}
                onChange={(e) =>
                  setFormData({ ...formData, additionalNotes: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Info Banner */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-indigo-700 leading-relaxed">
                After submitting, Craddule will review your request and add the
                compliance item to your list. You will be notified once it's
                available.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 sm:px-5 py-2.5 rounded-lg sm:rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 sm:px-5 py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:from-indigo-700 hover:to-indigo-600 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Submit Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
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

  useEffect(() => {
    firstInputRef.current?.focus();
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

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
        setFormData({});
        setSelectedFile(null);
        setShowSuccessModal(true);
      } else {
        console.log(data);
      }
    } catch (err) {
      toast.error("Submission failed");
      console.log(err);
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
                onClose();
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
              Compliance Document for {item.title}
              <span className="text-red-500 ml-1">*</span>
            </label>

            <p className="text-xs text-slate-500 mb-3">
              Please upload official documentation that demonstrates compliance
              with <span className="font-medium">{item.fullName}</span>. This
              document is required for verification and approval.
            </p>

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
                aria-label={`Upload compliance document for ${item.title}`}
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
                    Click to upload your compliance document
                  </p>
                  <p className="text-xs">
                    Accepted formats: PDF, JPG, or PNG (maximum 10MB)
                  </p>
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
      toast.error("You must agree to the terms to proceed.");
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
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 sm:p-6 border-b border-slate-200">
          <div className="bg-blue-100 rounded-lg p-2">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Authorization, Consent, and Electronic Acceptance
          </h2>
        </div>

        {/* Scrollable Document */}
        <div className="overflow-y-auto p-4 sm:p-6 text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 max-h-[60vh]">
          <p>
            By accessing this website and submitting any information or
            documents, you hereby authorize Craddule to collect, store, process,
            and manage your documents through its document portal.
          </p>
          <p>
            You further grant Craddule the authority to act on your behalf,
            where applicable, for the purpose of preparing, submitting, and
            processing applications for licenses, permits, and related
            administrative requirements.
          </p>
          <p>
            All data and documents shall be processed in accordance with
            applicable Nigerian laws and regulations, including relevant data
            protection and privacy legislation.
          </p>
          <p>
            By selecting the checkbox below and proceeding, you confirm that you
            have read and understood this authorization, agree to its terms, and
            acknowledge that your electronic acceptance constitutes a legally
            binding agreement equivalent to a handwritten signature.
          </p>
        </div>

        {/* Checkbox & Action */}
        <div className="border-t border-slate-200 p-4 sm:p-6 bg-slate-50 rounded-b-xl sm:rounded-b-2xl flex flex-col gap-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 flex-shrink-0"
            />
            <span className="text-sm sm:text-base text-slate-800 leading-relaxed">
              I agree to the Authorization and Consent terms above.
            </span>
          </label>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 mt-2">
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
    </div>
  );
}
