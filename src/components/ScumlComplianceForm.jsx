import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL, IMAGE_URL } from "../config/apiConfig";
import {
  X,
  Upload,
  Plus,
  Trash2,
  FileText,
  Users,
  AlertCircle,
  Shield,
  Building2,
  ExternalLink
} from "lucide-react";

// ================= REUSABLE COMPONENTS =================
const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  className = "",
  value,
  onChange
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type={type}
      name={name}
      placeholder={placeholder || label}
      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
      value={value || ""}
      onChange={onChange}
      required={required}
    />
  </div>
);

const TextArea = ({
  label,
  name,
  placeholder,
  required = false,
  rows = 3,
  value,
  onChange
}) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <textarea
      name={name}
      placeholder={placeholder || label}
      rows={rows}
      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none resize-none"
      value={value || ""}
      onChange={onChange}
      required={required}
    />
  </div>
);

const Select = ({
  label,
  name,
  options,
  required = false,
  value,
  onChange
}) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      name={name}
      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
      value={value || ""}
      onChange={onChange}
      required={required}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const FileUpload = ({
  label,
  name,
  description,
  onChange,
  fileName,
  fileUrl,
  required = false
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="hidden"
        id={name}
        accept="image/*,.pdf"
      />
      <label
        htmlFor={name}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
      >
        <Upload className="w-5 h-5 text-slate-400" />
        <span className="text-sm text-slate-600">
          {fileName || "Choose file to upload"}
        </span>
      </label>
    </div>
    {description && (
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    )}
    {fileUrl && (
      <a
        href={`${IMAGE_URL}${fileUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
      >
        <ExternalLink className="w-4 h-4" />
        View uploaded file
      </a>
    )}
  </div>
);

const SCUMLApplicationSummary = ({ application, onViewFull }) => {
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "✓";
      case "pending":
        return "⏳";
      case "rejected":
        return "✗";
      default:
        return "•";
    }
  };

  const isApprovedWithPayment =
    application.status?.toLowerCase() === "approved" && application.price > 0;

  const handlePay = () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("You must be logged in to make a payment.");

    setLoading(true);

    const reference = `SCUML-${application.id}-${Date.now()}`;

    const handler = window.PaystackPop.setup({
      key: "pk_test_326283a4813bb26a9b6372c90c393ea21a46aff4",
      email: application.email || "customer@example.com",
      amount: application.price * 100,
      ref: reference,
      callback: function (response) {
        (async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/payment/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                reference: response.reference,
                type: "scuml",
                verified: true,
                applicationId: application.id,
                amount: application.price
              })
            });

            const data = await res.json();
            if (data.success) toast.success("Payment recorded successfully!");
            else toast.error("Failed to record payment.");
          } catch (err) {
            console.error(err);
            toast.error("Error saving payment.");
          }
        })();
      },
      onClose: () => {
        toast.error("Payment window closed.");
        setLoading(false);
      }
    });

    handler.openIframe();
  };

  return (
    <div className="p-6 bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            SCUML Registration
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
            application.status
          )}`}
        >
          {getStatusIcon(application.status)}{" "}
          {application.status?.charAt(0).toUpperCase() +
            application.status?.slice(1)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Business Name</p>
            <p className="text-sm font-medium text-gray-900">
              {application.businessName || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Business Category</p>
            <p className="text-sm font-medium text-gray-900">
              {application.businessCategory || "N/A"}
            </p>
          </div>
        </div>

        {isApprovedWithPayment && !application.isPaid && (
          <div className="mt-4 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎉</span>
              <p className="text-sm font-semibold text-emerald-900">
                Application Approved!
              </p>
            </div>
            <p className="text-sm text-emerald-800 mb-2">
              Your SCUML registration has been approved. Please proceed with
              payment to complete the registration.
            </p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-xs text-emerald-700">Amount:</span>
              <span className="text-2xl font-bold text-emerald-900">
                ₦{application.price.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {application.adminFeedback && !isApprovedWithPayment && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium mb-1">
              Admin Feedback
            </p>
            <p className="text-sm text-blue-900">{application.adminFeedback}</p>
          </div>
        )}
      </div>

      {isApprovedWithPayment ? (
        <div className="mt-4 flex gap-2">
          <button
            onClick={onViewFull}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all"
          >
            View Details
          </button>

          {application.isPaid ? (
            <button
              disabled
              className="flex-1 px-4 py-2 rounded-lg bg-gray-300 text-white text-sm font-medium cursor-not-allowed"
            >
              Paid ✅
            </button>
          ) : (
            <button
              onClick={handlePay}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={onViewFull}
          className="mt-4 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow hover:shadow-md"
        >
          View Full Application
        </button>
      )}
    </div>
  );
};

// ================= MAIN COMPONENT =================
export function ScumlComplianceForm() {
  const [formData, setFormData] = useState({
    // 1. Business Identification
    businessName: "",
    rcNumber: "",
    bnNumber: "",
    tin: "",
    dateOfIncorporation: "",
    businessCategory: "",

    // 2. Contact Information
    registeredOfficeAddress: "",
    branchOfficeAddress: "",
    email: "",
    phoneNumber: "",

    // 3. Ownership & Management
    directors: [],
    bankers: "",

    // 4. Compliance Officer Details
    complianceOfficerName: "",
    complianceOfficerDesignation: "",
    complianceOfficerPhone: "",
    complianceOfficerEmail: "",

    // 5. Required Documents
    certificateOfIncorporation: null,
    cacForm1_1: null,
    memart: null,
    tinPrintout: null,
    professionalCertificate: null,
    companyProfile: null,

    // Document URLs
    certificateOfIncorporationUrl: "",
    cacForm1_1Url: "",
    memartUrl: "",
    tinPrintoutUrl: "",
    professionalCertificateUrl: "",
    companyProfileUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [hasApplication, setHasApplication] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setFetching(true);

    const parseJsonSafe = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      try {
        return JSON.parse(field);
      } catch {
        return [];
      }
    };

    const fetchScumlApplication = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/scuml-application`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const text = await res.text();
        if (!text) throw new Error("Empty response from server");

        const data = JSON.parse(text);

        if (data.success && data.application) {
          const app = data.application;
          setHasApplication(true);
          setApplicationData(app);

          setFormData({
            ...app,
            directors: parseJsonSafe(app.directors),

            // Keep file URLs
            certificateOfIncorporationUrl: app.certificateOfIncorporation || "",
            cacForm1_1Url: app.cacForm1_1 || "",
            memartUrl: app.memart || "",
            tinPrintoutUrl: app.tinPrintout || "",
            professionalCertificateUrl: app.professionalCertificate || "",
            companyProfileUrl: app.companyProfile || ""
          });
        }
      } catch (err) {
        console.error("Failed to fetch SCUML application:", err);
        toast.error("Failed to fetch your SCUML application");
      } finally {
        setFetching(false);
      }
    };

    fetchScumlApplication();
  }, [isOpen, token]);

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf"
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload only image or PDF files");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field, index, key, value) => {
    const arr = [...(formData[field] || [])];
    arr[index] = { ...arr[index], [key]: value };
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] || []), {}] }));
  };

  const removeArrayItem = (field, index) => {
    const arr = [...(formData[field] || [])];
    arr.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: arr }));
  };

  const handleSubmit = async () => {
    // ================= VALIDATION =================
    const requiredFields = [
      "businessName",
      "tin",
      "dateOfIncorporation",
      "businessCategory",
      "registeredOfficeAddress",
      "bankers",
      "complianceOfficerName",
      "complianceOfficerDesignation",
      "complianceOfficerPhone",
      "complianceOfficerEmail"
    ];

    // RC Number or BN Number check
    if (!formData.rcNumber && !formData.bnNumber) {
      toast.error("RC Number or BN Number is required");
      return;
    }

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        toast.error(`${field.replace(/([A-Z])/g, " $1")} is required`);
        return;
      }
    }

    setLoading(true);
    try {
      const body = new FormData();

      for (const key in formData) {
        // JSON stringify arrays or objects
        if (Array.isArray(formData[key]) || typeof formData[key] === "object") {
          body.append(key, JSON.stringify(formData[key]));
        }
        // File inputs
        else if (formData[key] instanceof File) {
          body.append(key, formData[key]);
        }
        // Regular string/number fields
        else if (!key.endsWith("Url")) {
          const value = formData[key] === "" ? null : formData[key];
          body.append(key, value);
        }
      }

      const res = await fetch(`${API_BASE_URL}/scuml-application`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body
      });

      const data = await res.json();
      if (data.success) {
        toast.success("SCUML application saved successfully!");
        handleClose();
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to save SCUML application");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while saving your application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center my-6">
        {hasApplication && applicationData ? (
          <SCUMLApplicationSummary
            application={applicationData}
            onViewFull={() => setIsOpen(true)}
          />
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Shield className="w-5 h-5 inline-block mr-2 -mt-0.5" />
            Open SCUML Registration Form
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full relative overflow-hidden max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                  SCUML Registration Form
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Special Control Unit Against Money Laundering
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-slate-100 transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {fetching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-purple-600 font-medium">
                    Loading your application...
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* 1. Business Identification */}
                  <section className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          1. Business Identification
                        </h4>
                        <p className="text-sm text-slate-600">
                          Provide your business registration details
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Business Name"
                        name="businessName"
                        placeholder="Full registered business name"
                        required
                        className="md:col-span-2"
                        value={formData.businessName}
                        onChange={handleChange}
                      />

                      <Input
                        label="RC Number"
                        name="rcNumber"
                        placeholder="CAC Registration Number"
                        value={formData.rcNumber}
                        onChange={handleChange}
                      />

                      <Input
                        label="BN Number"
                        name="bnNumber"
                        placeholder="Business Name Number"
                        value={formData.bnNumber}
                        onChange={handleChange}
                      />

                      <Input
                        label="Tax Identification Number (TIN)"
                        name="tin"
                        placeholder="Enter TIN"
                        required
                        value={formData.tin}
                        onChange={handleChange}
                      />

                      <Input
                        label="Date of Incorporation"
                        name="dateOfIncorporation"
                        type="date"
                        required
                        value={formData.dateOfIncorporation}
                        onChange={handleChange}
                      />

                      <Select
                        label="Business Category"
                        name="businessCategory"
                        required
                        className="md:col-span-2"
                        value={formData.businessCategory}
                        onChange={handleChange}
                        options={[
                          { value: "", label: "Select Business Category" },
                          { value: "Real Estate", label: "Real Estate" },
                          { value: "Car Dealers", label: "Car Dealers" },
                          {
                            value: "NGOs",
                            label: "NGOs (Non-Governmental Organizations)"
                          },
                          { value: "Law Firms", label: "Law Firms" },
                          {
                            value: "Accounting Firms",
                            label: "Accounting Firms"
                          },
                          {
                            value: "Jewelry Dealers",
                            label: "Jewelry Dealers"
                          },
                          { value: "Casinos", label: "Casinos/Gaming" },
                          {
                            value: "Money Service Business",
                            label: "Money Service Business"
                          },
                          {
                            value: "Trust and Company Service Providers",
                            label: "Trust and Company Service Providers"
                          },
                          {
                            value: "Dealers in Precious Metals",
                            label: "Dealers in Precious Metals"
                          },
                          {
                            value: "Dealers in Precious Stones",
                            label: "Dealers in Precious Stones"
                          },
                          { value: "Other", label: "Other" }
                        ]}
                      />
                    </div>
                  </section>

                  {/* 2. Contact Information */}
                  <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          2. Contact Information
                        </h4>
                        <p className="text-sm text-slate-600">
                          Business location and contact details
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextArea
                        label="Registered Office Address"
                        name="registeredOfficeAddress"
                        placeholder="Physical location of business (P.O. Box not accepted)"
                        required
                        value={formData.registeredOfficeAddress}
                        onChange={handleChange}
                      />

                      <TextArea
                        label="Branch Office Address"
                        name="branchOfficeAddress"
                        placeholder="If you have more than one location"
                        value={formData.branchOfficeAddress}
                        onChange={handleChange}
                      />

                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="official@business.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />

                      <Input
                        label="Phone Number"
                        name="phoneNumber"
                        type="tel"
                        placeholder="Reachable phone number"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </section>

                  {/* 3. Ownership & Management */}
                  <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">
                            3. Ownership & Management
                          </h4>
                          <p className="text-sm text-slate-600">
                            Directors/Proprietors particulars
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => addArrayItem("directors")}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Add Director
                      </button>
                    </div>

                    {(formData.directors || []).length === 0 ? (
                      <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>
                          No directors added yet. Click "Add Director" to get
                          started.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.directors.map((director, index) => (
                          <div
                            key={index}
                            className="border-2 border-slate-200 rounded-xl p-5 bg-slate-50 relative"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                removeArrayItem("directors", index)
                              }
                              className="absolute top-4 right-4 p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <h5 className="font-semibold text-slate-700 mb-4">
                              Director/Proprietor {index + 1}
                            </h5>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="Full Name *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={director.fullName || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "directors",
                                    index,
                                    "fullName",
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                type="text"
                                placeholder="Address *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={director.address || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "directors",
                                    index,
                                    "address",
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                type="text"
                                placeholder="Nationality *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={director.nationality || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "directors",
                                    index,
                                    "nationality",
                                    e.target.value
                                  )
                                }
                              />

                              <select
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={director.idType || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "directors",
                                    index,
                                    "idType",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select ID Type *</option>
                                <option value="International Passport">
                                  International Passport
                                </option>
                                <option value="Driver's License">
                                  Driver's License
                                </option>
                                <option value="National ID Card">
                                  National ID Card
                                </option>
                                <option value="Voter's Card">
                                  Voter's Card
                                </option>
                              </select>

                              <input
                                type="text"
                                placeholder="ID Number *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white md:col-span-2"
                                value={director.idNumber || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "directors",
                                    index,
                                    "idNumber",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-6">
                      <Input
                        label="Bankers"
                        name="bankers"
                        placeholder="Names of banks where business maintains accounts"
                        required
                        value={formData.bankers}
                        onChange={handleChange}
                      />
                    </div>
                  </section>

                  {/* 4. Compliance Officer Details */}
                  <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Shield className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          4. Compliance Officer Details
                        </h4>
                        <p className="text-sm text-slate-600">
                          Designated compliance officer information
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Compliance Officer Name"
                        name="complianceOfficerName"
                        placeholder="Full name"
                        required
                        value={formData.complianceOfficerName}
                        onChange={handleChange}
                      />

                      <Input
                        label="Designation/Position"
                        name="complianceOfficerDesignation"
                        placeholder="Position within company"
                        required
                        value={formData.complianceOfficerDesignation}
                        onChange={handleChange}
                      />

                      <Input
                        label="Direct Phone Number"
                        name="complianceOfficerPhone"
                        type="tel"
                        placeholder="Direct contact number"
                        required
                        value={formData.complianceOfficerPhone}
                        onChange={handleChange}
                      />

                      <Input
                        label="Email Address"
                        name="complianceOfficerEmail"
                        type="email"
                        placeholder="officer@business.com"
                        required
                        value={formData.complianceOfficerEmail}
                        onChange={handleChange}
                      />
                    </div>
                  </section>

                  {/* 5. Required Documents */}
                  <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          5. Required Documents
                        </h4>
                        <p className="text-sm text-slate-600">
                          Upload all necessary documents (PDF or JPEG format)
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FileUpload
                        label="Certificate of Incorporation"
                        name="certificateOfIncorporation"
                        description="Issued by CAC"
                        required
                        onChange={handleChange}
                        fileName={formData.certificateOfIncorporation?.name}
                        fileUrl={formData.certificateOfIncorporationUrl}
                      />

                      <FileUpload
                        label="Form CAC 1.1"
                        name="cacForm1_1"
                        description="Application for registration"
                        required
                        onChange={handleChange}
                        fileName={formData.cacForm1_1?.name}
                        fileUrl={formData.cacForm1_1Url}
                      />

                      <FileUpload
                        label="Memorandum and Articles of Association"
                        name="memart"
                        description="MEMART for limited liability companies"
                        required
                        onChange={handleChange}
                        fileName={formData.memart?.name}
                        fileUrl={formData.memartUrl}
                      />

                      <FileUpload
                        label="TIN Printout"
                        name="tinPrintout"
                        description="Certificate or printout from FIRS portal"
                        required
                        onChange={handleChange}
                        fileName={formData.tinPrintout?.name}
                        fileUrl={formData.tinPrintoutUrl}
                      />

                      <FileUpload
                        label="Professional Certificate"
                        name="professionalCertificate"
                        description="If applicable (Call to Bar, Accounting certificate, etc.)"
                        onChange={handleChange}
                        fileName={formData.professionalCertificate?.name}
                        fileUrl={formData.professionalCertificateUrl}
                      />

                      <FileUpload
                        label="Company Profile"
                        name="companyProfile"
                        description="Brief document outlining business activities"
                        required
                        onChange={handleChange}
                        fileName={formData.companyProfile?.name}
                        fileUrl={formData.companyProfileUrl}
                      />
                    </div>
                  </section>
                </div>
              )}
            </div>

            {/* Footer */}
            {!fetching && (
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving Application...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Submit SCUML Application
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
