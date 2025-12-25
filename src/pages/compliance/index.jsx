import {
  Shield,
  FilePlus,
  CheckCircle,
  Clock,
  X,
  AlertCircle,
  FileText,
  Building2,
  Receipt,
  Loader2
} from "lucide-react";
import { useState } from "react";

export default function Compliance() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [complianceItems, setComplianceItems] = useState([
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
  ]);

  const completedCount = complianceItems.filter(
    (i) => i.status === "Completed"
  ).length;

  const handleSubmitDocument = (itemId, formData) => {
    setComplianceItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: "Pending", submittedData: formData }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Image */}
        <header className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400">
            <img
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=300&fit=crop"
              alt="Compliance documents"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-400/90"></div>
          </div>
          <div className="p-6 -mt-16 relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow-md mb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">
                    Compliance Portal
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Regulatory Compliance
                </h1>
                <p className="text-slate-600 mt-2">
                  Complete required documents directly on Craddule. We handle
                  processing and verification.
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
          </div>
        </header>

        {/* Progress Alert */}
        {completedCount < complianceItems.length && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
            <div className="bg-blue-100 rounded-xl p-2">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 text-lg">
                Action Required
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                You have {complianceItems.length - completedCount} pending
                compliance{" "}
                {complianceItems.length - completedCount === 1
                  ? "document"
                  : "documents"}
                . Complete them to ensure full regulatory compliance.
              </p>
            </div>
          </div>
        )}

        {/* Compliance Items */}
        <div className="space-y-4">
          {complianceItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200"
            >
              <div className="flex items-start gap-0">
                {/* Side Image */}
                <div className="w-48 h-full relative hidden md:block">
                  <img
                    src={
                      item.id === "cac"
                        ? "https://images.unsplash.com/photo-1554224311-beee4ece3df0?w=400&h=300&fit=crop"
                        : item.id === "license"
                        ? "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop"
                        : "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=300&fit=crop"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white"></div>
                </div>

                <div className="flex items-start gap-4 p-5 flex-1">
                  {/* Icon */}
                  <div
                    className={`rounded-xl p-3 shadow-sm ${
                      item.status === "Completed"
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 text-green-600"
                        : item.status === "Pending"
                        ? "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600"
                        : "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600"
                    }`}
                  >
                    {item.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-lg">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm font-medium text-slate-700">
                            Cost:{" "}
                            <span className="text-blue-600 font-semibold">
                              {item.cost}
                            </span>
                          </span>
                          {item.completedDate && (
                            <span className="text-sm text-slate-500">
                              Completed {item.completedDate}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
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
            </div>
          ))}
        </div>

        {/* Authorization Block */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl overflow-hidden shadow-xl">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=300&fit=crop"
              alt="Team collaboration"
              className="w-full h-48 object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 to-blue-500/95"></div>
            <div className="absolute inset-0 flex items-center p-6">
              <div className="flex items-start gap-4 w-full">
                <div className="bg-white rounded-xl p-3 shadow-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-white">
                    Processing Authorization
                  </h3>
                  <p className="text-blue-50 mt-2 text-sm leading-relaxed">
                    Grant Craddule permission to submit documents on your behalf
                    to relevant regulatory bodies. This streamlines the
                    compliance process and saves you time.
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
        </div>
      </div>

      {/* Document Form Modal */}
      {selectedItem && (
        <DocumentModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSubmit={handleSubmitDocument}
        />
      )}

      {/* Authorization Modal */}
      {showAuthModal && (
        <AuthorizationModal onClose={() => setShowAuthModal(false)} />
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
    const requiredFields = fields.filter((f) => f.required);
    const missingFields = requiredFields.filter(
      (f) => !formData[f.name] || formData[f.name].trim() === ""
    );

    if (missingFields.length > 0) {
      alert(
        `Please fill in all required fields: ${missingFields
          .map((f) => f.label)
          .join(", ")}`
      );
      return;
    }

    onSubmit(item.id, formData);
    alert("Document submitted successfully! Status changed to Pending.");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
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

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-6 space-y-4">
            {getFormFields().map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.name]: e.target.value })
                    }
                  />
                ) : field.type === "select" ? (
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.name]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mt-6">
              <p className="text-sm text-slate-700 font-medium">
                <strong className="text-blue-700">Processing Fee:</strong>{" "}
                {item.cost}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                This fee will be charged upon submission and covers government
                processing costs.
              </p>
            </div>
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
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg font-medium text-sm"
            >
              Submit Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthorizationModal({ onClose }) {
  const [agreed, setAgreed] = useState(false);

  const handleGrant = () => {
    if (!agreed) {
      alert("Please agree to the terms before proceeding");
      return;
    }
    alert("Authorization granted successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Grant Processing Authorization
          </h2>
          <p className="text-slate-600 mt-2">
            By granting authorization, you allow Craddule to:
          </p>

          <ul className="space-y-2 mt-4 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              Submit compliance documents on your behalf
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              Communicate with regulatory bodies for status updates
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              Receive and forward official documentation to you
            </li>
          </ul>

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
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleGrant}
            disabled={!agreed}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Grant Authorization
          </button>
        </div>
      </div>
    </div>
  );
}
