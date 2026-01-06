import {
  Shield,
  FilePlus,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Building2,
  Receipt,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config/apiConfig";

export default function Compliance() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [complianceItems, setComplianceItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const REQUIRED_ITEMS = [
    {
      id: "cac",
      title: "Business Registration (CAC)",
      description: "Corporate Affairs Commission registration certificate",
      status: "Not Started",
      cost: "₦0",
      canFill: true,
      icon: <Building2 className="w-5 h-5" />
    },
    {
      id: "license",
      title: "Industry License",
      description: "Required operational license for your business sector",
      status: "Not Started",
      cost: "₦75,000",
      canFill: true,
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: "tin",
      title: "Tax Identification Number (TIN)",
      description: "Federal Inland Revenue Service tax registration",
      status: "Not Started",
      cost: "₦0",
      canFill: true,
      icon: <Receipt className="w-5 h-5" />
    }
  ];

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchComplianceItems();
  }, []);

  const fetchComplianceItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/compliance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setComplianceItems(data.items);
      }
    } catch (err) {
      console.error("Error fetching compliance items:", err);
    }
    setLoading(false);
  };

  // Add missing items to the state
  const addMissingItems = (items) => {
    setComplianceItems((prev) => [...prev, ...items]);
  };

  const handleSubmitDocument = async (itemId, formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/compliance/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ itemId, formData })
      });
      const data = await res.json();
      if (data.success) {
        setComplianceItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, ...data.item } : item
          )
        );
        setSelectedItem(null);
      } else {
        alert(data.message || "Error submitting document");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit document");
    }
  };

  const handleGrantAuthorization = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/compliance/authorize`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Authorization granted");
        setShowAuthModal(false);
        fetchComplianceItems();
      } else {
        alert("Failed to grant authorization");
      }
    } catch (err) {
      console.error(err);
      alert("Error granting authorization");
    }
  };

  const completedCount = complianceItems.filter(
    (i) => i.status === "Completed"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">
                Regulatory Compliance
              </h1>
              <p className="text-slate-600 mt-2">
                Complete your required documents. Once submitted, we process and
                authorize them.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl px-6 py-4 text-center min-w-[140px] shadow-lg">
              <div className="text-3xl font-bold text-white">
                {completedCount}/{complianceItems.length}
              </div>
              <div className="text-xs text-blue-100 mt-1 font-medium">
                Completed
              </div>
            </div>
          </div>
        </header>

        {/* Missing Items */}
        {REQUIRED_ITEMS.filter(
          (req) => !complianceItems.some((i) => i.id === req.id)
        ).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5 flex items-center justify-between">
            <span className="text-yellow-700 font-semibold">
              Some required compliance items are missing!
            </span>
            <button
              onClick={() =>
                addMissingItems(
                  REQUIRED_ITEMS.filter(
                    (req) => !complianceItems.some((i) => i.id === req.id)
                  )
                )
              }
              className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition"
            >
              Add Missing Items
            </button>
          </div>
        )}

        {/* Compliance Items */}
        {loading ? (
          <div className="text-center text-blue-600 py-20">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <p className="mt-2">Loading compliance items...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complianceItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200"
              >
                <div className="flex items-center gap-4 p-5 flex-1">
                  <div
                    className={`rounded-xl p-3 shadow-sm ${
                      item.status === "Completed"
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 text-green-600"
                        : item.status === "Pending"
                        ? "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600"
                        : "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600"
                    }`}
                  >
                    {item.icon || <FileText className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-lg">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <StatusBadge status={item.status} />
                        {item.canFill && item.status === "Not Started" && (
                          <button
                            onClick={() => setSelectedItem(item)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                          >
                            <FilePlus className="w-4 h-4" />
                            Fill Document
                          </button>
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl overflow-hidden shadow-xl p-6">
          <div className="flex items-start gap-4 w-full">
            <div className="bg-white rounded-xl p-3 shadow-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-xl text-white">
                Processing Authorization
              </h3>
              <p className="text-blue-50 mt-2 text-sm leading-relaxed">
                Grant Craddule permission to submit documents on your behalf.
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="mt-4 px-6 py-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 transition-all font-semibold text-sm shadow-lg hover:shadow-xl"
              >
                Grant Authorization
              </button>
            </div>
          </div>
        </div>
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
          onGrant={handleGrantAuthorization}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Completed: {
      icon: <CheckCircle className="w-4 h-4" />,
      bg: "bg-gradient-to-r from-green-50 to-emerald-50",
      text: "text-green-700",
      border: "border-green-200"
    },
    Pending: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
      text: "text-blue-700",
      border: "border-blue-200"
    },
    "Not Started": {
      icon: <AlertCircle className="w-4 h-4" />,
      bg: "bg-gradient-to-r from-slate-50 to-slate-100",
      text: "text-slate-700",
      border: "border-slate-200"
    }
  };
  const style = config[status];
  return (
    <span
      className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg border ${style.bg} ${style.text} ${style.border}`}
    >
      {style.icon}
      {status}
    </span>
  );
}

// Document Modal
function DocumentModal({ item, onClose, onSubmit }) {
  const [formData, setFormData] = useState({});

  const getFormFields = () => {
    if (item.id === "cac") {
      return [
        {
          name: "businessName",
          label: "Business Name",
          type: "text",
          required: true
        },
        {
          name: "businessType",
          label: "Business Type",
          type: "select",
          options: [
            "Limited Liability Company",
            "Business Name",
            "Incorporated Trustees"
          ],
          required: true
        },
        {
          name: "businessAddress",
          label: "Business Address",
          type: "textarea",
          required: true
        },
        {
          name: "businessNature",
          label: "Nature of Business",
          type: "text",
          required: true
        },
        {
          name: "directors",
          label: "Directors/Proprietors",
          type: "text",
          required: true
        },
        { name: "phone", label: "Phone Number", type: "tel", required: true },
        { name: "email", label: "Email Address", type: "email", required: true }
      ];
    } else if (item.id === "license") {
      return [
        {
          name: "businessName",
          label: "Business Name",
          type: "text",
          required: true
        },
        {
          name: "businessAddress",
          label: "Business Address",
          type: "textarea",
          required: true
        },
        {
          name: "industry",
          label: "Industry Sector",
          type: "select",
          options: ["Technology", "Manufacturing", "Services", "Retail"],
          required: true
        },
        {
          name: "contactPerson",
          label: "Contact Person",
          type: "text",
          required: true
        },
        { name: "phone", label: "Phone Number", type: "tel", required: true },
        { name: "email", label: "Email Address", type: "email", required: true }
      ];
    } else if (item.id === "tin") {
      return [
        {
          name: "businessName",
          label: "Business/Individual Name",
          type: "text",
          required: true
        },
        { name: "rcNumber", label: "RC Number", type: "text", required: true },
        {
          name: "address",
          label: "Registered Address",
          type: "textarea",
          required: true
        },
        { name: "phone", label: "Phone Number", type: "tel", required: true },
        { name: "email", label: "Email Address", type: "email", required: true }
      ];
    }
    return [];
  };

  const handleSubmit = () => {
    const fields = getFormFields();
    const missingFields = fields.filter(
      (f) => f.required && (!formData[f.name] || formData[f.name].trim() === "")
    );
    if (missingFields.length > 0) {
      alert(
        `Please fill all required fields: ${missingFields
          .map((f) => f.label)
          .join(", ")}`
      );
      return;
    }
    onSubmit(item.id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
            <p className="text-sm text-slate-600 mt-1">{item.description}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-4">
          {getFormFields().map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                />
              ) : field.type === "select" ? (
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
          >
            Submit Document
          </button>
        </div>
      </div>
    </div>
  );
}

// Authorization Modal
function AuthorizationModal({ onClose, onGrant }) {
  const [agreed, setAgreed] = useState(false);
  const handleGrant = () => {
    if (!agreed) {
      alert("Please agree to the terms before proceeding");
      return;
    }
    onGrant();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Grant Processing Authorization
          </h2>
          <p className="text-slate-600 mt-2">
            By granting authorization, you allow Craddule to submit compliance
            documents and communicate with regulatory bodies on your behalf.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4"
              />
              <span className="text-sm text-slate-700">
                I authorize Craddule to act as my representative for regulatory
                compliance processing and understand I can revoke this at any
                time.
              </span>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGrant}
            disabled={!agreed}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Grant Authorization
          </button>
        </div>
      </div>
    </div>
  );
}
