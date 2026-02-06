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
  Receipt,
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
      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
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
      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
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
      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
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
  fileUrl
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="hidden"
        id={name}
        accept="image/*"
      />
      <label
        htmlFor={name}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
      >
        <Upload className="w-5 h-5 text-slate-400" />
        <span className="text-sm text-slate-600">
          {fileName || "Choose image to upload"}
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

const FIRSApplicationSummary = ({ application, onViewFull }) => {
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

    const reference = `FIRS-${application.id}-${Date.now()}`;

    const handler = window.PaystackPop.setup({
      key: "pk_test_326283a4813bb26a9b6372c90c393ea21a46aff4",
      email: application.businessEmail || "customer@example.com",
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
                type: "firs",
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
          <Receipt className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            FIRS Tax Registration
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
            <p className="text-xs text-gray-500 mb-1">Company Name</p>
            <p className="text-sm font-medium text-gray-900">
              {application.taxpayerName || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">RC Number</p>
            <p className="text-sm font-medium text-gray-900">
              {application.rcNumber || "N/A"}
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
              Your FIRS tax registration has been approved. Please proceed with
              payment to complete the process.
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
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={onViewFull}
          className="mt-4 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow hover:shadow-md"
        >
          View Full Application
        </button>
      )}
    </div>
  );
};

// ================= MAIN COMPONENT =================
export function FirsComplianceForm() {
  const [formData, setFormData] = useState({
    // Section 1: Company Identification
    taxpayerName: "",
    rcNumber: "",
    dateOfIncorporation: "",
    registeredOfficeAddress: "",
    businessAddress: "",

    // Section 2: Operational Details
    natureOfBusiness: "",
    commencementDate: "",
    accountingYearEnd: "",
    bankers: "",

    // Section 3: Ownership & Management
    shareholders: [],
    principalOfficers: {
      chairman: { name: "", contact: "" },
      managingDirector: { name: "", contact: "" },
      companySecretary: { name: "", contact: "" }
    },

    // New Taxpayer Questionnaire
    taxOffice: "",
    auditorsOrTaxConsultants: "",
    sourceOfIncome: "",
    vatLiability: "",
    previousTin: "",

    // Documents
    applicationLetter: null,
    cacCertificate: null,
    cac1_1Form: null,
    proofOfAddress: null,

    // Document URLs
    applicationLetterUrl: "",
    cacCertificateUrl: "",
    cac1_1FormUrl: "",
    proofOfAddressUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [hasApplication, setHasApplication] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setFetching(true);

    const parseJsonField = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      try {
        return JSON.parse(field);
      } catch {
        return [];
      }
    };

    const parsePrincipalOfficers = (field) => {
      if (!field) {
        return {
          chairman: { name: "", contact: "" },
          managingDirector: { name: "", contact: "" },
          companySecretary: { name: "", contact: "" }
        };
      }
      if (typeof field === "object") return field;
      try {
        return JSON.parse(field);
      } catch {
        return {
          chairman: { name: "", contact: "" },
          managingDirector: { name: "", contact: "" },
          companySecretary: { name: "", contact: "" }
        };
      }
    };

    const fetchFirsApplication = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/firs-application`, {
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
            shareholders: parseJsonField(app.shareholders),
            principalOfficers: parsePrincipalOfficers(app.principalOfficers),

            // Keep file URLs
            applicationLetterUrl: app.applicationLetter || "",
            cacCertificateUrl: app.cacCertificate || "",
            cac1_1FormUrl: app.cac1_1Form || "",
            proofOfAddressUrl: app.proofOfAddress || ""
          });
        }
      } catch (err) {
        console.error("Failed to fetch FIRS application:", err);
        toast.error("Failed to fetch your FIRS application");
      } finally {
        setFetching(false);
      }
    };

    fetchFirsApplication();
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
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload only image files");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePrincipalOfficerChange = (role, field, value) => {
    setFormData((prev) => ({
      ...prev,
      principalOfficers: {
        ...prev.principalOfficers,
        [role]: {
          ...prev.principalOfficers[role],
          [field]: value
        }
      }
    }));
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
      "taxpayerName",
      "rcNumber",
      "dateOfIncorporation",
      "registeredOfficeAddress",
      "natureOfBusiness",
      "commencementDate",
      "accountingYearEnd",
      "bankers",
      "taxOffice",
      "sourceOfIncome",
      "vatLiability"
    ];

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
        if (key === "principalOfficers" || key === "shareholders") {
          body.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] instanceof File) {
          body.append(key, formData[key]);
        } else if (!key.endsWith("Url")) {
          // Convert empty strings to null for optional fields only
          const optionalFields = [
            "businessAddress",
            "auditorsOrTaxConsultants",
            "previousTin"
          ];
          const value =
            formData[key] === "" && optionalFields.includes(key)
              ? null
              : formData[key];
          body.append(key, value);
        }
      }

      const res = await fetch(`${API_BASE_URL}/firs-application`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body
      });

      const data = await res.json();
      if (data.success) {
        toast.success("FIRS application saved successfully!");
        handleClose();
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to save FIRS application");
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
          <FIRSApplicationSummary
            application={applicationData}
            onViewFull={() => setIsOpen(true)}
          />
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Receipt className="w-5 h-5 inline-block mr-2 -mt-0.5" />
            Open FIRS Tax Registration Form
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
                  <Receipt className="w-6 h-6 text-blue-600" />
                  FIRS Tax Registration Form
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Form TRIF/2006/001 - Federal Inland Revenue Service
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
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-blue-600 font-medium">
                    Loading your application...
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Section 1: Company Identification */}
                  <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          Section 1: Company Identification
                        </h4>
                        <p className="text-sm text-slate-600">
                          As registered with the Corporate Affairs Commission
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Taxpayer Name"
                        name="taxpayerName"
                        placeholder="Full registered company name"
                        required
                        className="md:col-span-2"
                        value={formData.taxpayerName}
                        onChange={handleChange}
                      />

                      <Input
                        label="Registration Number (RC No)"
                        name="rcNumber"
                        placeholder="CAC Registration Number"
                        required
                        value={formData.rcNumber}
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

                      <TextArea
                        label="Registered Office Address"
                        name="registeredOfficeAddress"
                        placeholder="Official address submitted to CAC"
                        required
                        value={formData.registeredOfficeAddress}
                        onChange={handleChange}
                      />

                      <TextArea
                        label="Business Address"
                        name="businessAddress"
                        placeholder="If different from registered office"
                        value={formData.businessAddress}
                        onChange={handleChange}
                      />
                    </div>
                  </section>

                  {/* Section 2: Operational Details */}
                  <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Receipt className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          Section 2: Operational Details
                        </h4>
                        <p className="text-sm text-slate-600">
                          Business operations and financial information
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nature of Business"
                        name="natureOfBusiness"
                        placeholder="E.g., Software Development, Retail, Consultancy"
                        required
                        value={formData.natureOfBusiness}
                        onChange={handleChange}
                      />

                      <Input
                        label="Commencement Date"
                        name="commencementDate"
                        type="date"
                        required
                        value={formData.commencementDate}
                        onChange={handleChange}
                      />

                      <Input
                        label="Accounting Year End"
                        name="accountingYearEnd"
                        type="date"
                        required
                        value={formData.accountingYearEnd}
                        onChange={handleChange}
                      />

                      <Input
                        label="Bankers"
                        name="bankers"
                        placeholder="Bank names and branches"
                        required
                        value={formData.bankers}
                        onChange={handleChange}
                      />
                    </div>
                  </section>

                  {/* Section 3: Ownership & Management */}
                  <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          Section 3: Ownership & Management
                        </h4>
                        <p className="text-sm text-slate-600">
                          Shareholders and principal officers
                        </p>
                      </div>
                    </div>

                    {/* Principal Officers */}
                    <div className="mb-6">
                      <h5 className="font-semibold text-slate-800 mb-4">
                        Principal Officers
                      </h5>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                          <Input
                            label="Chairman - Name"
                            name="chairmanName"
                            placeholder="Full name"
                            value={
                              formData.principalOfficers.chairman.name || ""
                            }
                            onChange={(e) =>
                              handlePrincipalOfficerChange(
                                "chairman",
                                "name",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            label="Chairman - Contact"
                            name="chairmanContact"
                            placeholder="Phone/Email"
                            value={
                              formData.principalOfficers.chairman.contact || ""
                            }
                            onChange={(e) =>
                              handlePrincipalOfficerChange(
                                "chairman",
                                "contact",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                          <Input
                            label="Managing Director - Name"
                            name="mdName"
                            placeholder="Full name"
                            value={
                              formData.principalOfficers.managingDirector
                                .name || ""
                            }
                            onChange={(e) =>
                              handlePrincipalOfficerChange(
                                "managingDirector",
                                "name",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            label="Managing Director - Contact"
                            name="mdContact"
                            placeholder="Phone/Email"
                            value={
                              formData.principalOfficers.managingDirector
                                .contact || ""
                            }
                            onChange={(e) =>
                              handlePrincipalOfficerChange(
                                "managingDirector",
                                "contact",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                          <Input
                            label="Company Secretary - Name"
                            name="secretaryName"
                            placeholder="Full name"
                            value={
                              formData.principalOfficers.companySecretary
                                .name || ""
                            }
                            onChange={(e) =>
                              handlePrincipalOfficerChange(
                                "companySecretary",
                                "name",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            label="Company Secretary - Contact"
                            name="secretaryContact"
                            placeholder="Phone/Email"
                            value={
                              formData.principalOfficers.companySecretary
                                .contact || ""
                            }
                            onChange={(e) =>
                              handlePrincipalOfficerChange(
                                "companySecretary",
                                "contact",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shareholders */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="font-semibold text-slate-800">
                          Shareholders
                        </h5>
                        <button
                          type="button"
                          onClick={() => addArrayItem("shareholders")}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add Shareholder
                        </button>
                      </div>

                      {(formData.shareholders || []).length === 0 ? (
                        <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg">
                          <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>No shareholders added yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {formData.shareholders.map((shareholder, index) => (
                            <div
                              key={index}
                              className="border-2 border-slate-200 rounded-xl p-5 bg-slate-50 relative"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  removeArrayItem("shareholders", index)
                                }
                                className="absolute top-4 right-4 p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <h5 className="font-semibold text-slate-700 mb-4">
                                Shareholder {index + 1}
                              </h5>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                  type="text"
                                  placeholder="Name *"
                                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                                  value={shareholder.name || ""}
                                  onChange={(e) =>
                                    handleArrayChange(
                                      "shareholders",
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />

                                <input
                                  type="text"
                                  placeholder="Address *"
                                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                                  value={shareholder.address || ""}
                                  onChange={(e) =>
                                    handleArrayChange(
                                      "shareholders",
                                      index,
                                      "address",
                                      e.target.value
                                    )
                                  }
                                />

                                <input
                                  type="number"
                                  placeholder="Shareholding % *"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                                  value={shareholder.percentage || ""}
                                  onChange={(e) =>
                                    handleArrayChange(
                                      "shareholders",
                                      index,
                                      "percentage",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>

                  {/* New Taxpayer Questionnaire */}
                  <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          New Taxpayer Questionnaire
                        </h4>
                        <p className="text-sm text-slate-600">
                          Tax liability determination
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Tax Office"
                        name="taxOffice"
                        placeholder="FIRS Integrated Tax Office (MSTO or GTO)"
                        required
                        value={formData.taxOffice}
                        onChange={handleChange}
                      />

                      <Input
                        label="Auditors/Tax Consultants"
                        name="auditorsOrTaxConsultants"
                        placeholder="Name and address of firm"
                        value={formData.auditorsOrTaxConsultants}
                        onChange={handleChange}
                      />

                      <Select
                        label="Source of Income"
                        name="sourceOfIncome"
                        required
                        value={formData.sourceOfIncome}
                        onChange={handleChange}
                        options={[
                          { value: "", label: "Select Source" },
                          {
                            value: "Nigeria",
                            label: "Income derived within Nigeria"
                          },
                          {
                            value: "Foreign",
                            label: "Foreign trade/income"
                          },
                          { value: "Both", label: "Both" }
                        ]}
                      />

                      <Select
                        label="VAT Liability"
                        name="vatLiability"
                        required
                        value={formData.vatLiability}
                        onChange={handleChange}
                        options={[
                          { value: "", label: "Select Option" },
                          {
                            value: "Yes",
                            label: "Will reach VAT threshold"
                          },
                          {
                            value: "No",
                            label: "Will not reach VAT threshold"
                          }
                        ]}
                      />

                      <Input
                        label="Previous TIN (if already on certificate)"
                        name="previousTin"
                        placeholder="Enter TIN for activation"
                        className="md:col-span-2"
                        value={formData.previousTin}
                        onChange={handleChange}
                      />
                    </div>
                  </section>

                  {/* Required Documents */}
                  <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          Required Documents
                        </h4>
                        <p className="text-sm text-slate-600">
                          Upload all necessary attachments (images only)
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FileUpload
                        label="Application Letter"
                        name="applicationLetter"
                        description="Formal request on company letterhead"
                        onChange={handleChange}
                        fileName={formData.applicationLetter?.name}
                        fileUrl={formData.applicationLetterUrl}
                      />

                      <FileUpload
                        label="CAC Certificate of Incorporation"
                        name="cacCertificate"
                        description="Copy of incorporation certificate"
                        onChange={handleChange}
                        fileName={formData.cacCertificate?.name}
                        fileUrl={formData.cacCertificateUrl}
                      />

                      <FileUpload
                        label="CAC 1.1 Form"
                        name="cac1_1Form"
                        description="Completed CAC form 1.1"
                        onChange={handleChange}
                        fileName={formData.cac1_1Form?.name}
                        fileUrl={formData.cac1_1FormUrl}
                      />

                      <FileUpload
                        label="Proof of Address"
                        name="proofOfAddress"
                        description="Utility bill or tenancy agreement"
                        onChange={handleChange}
                        fileName={formData.proofOfAddress?.name}
                        fileUrl={formData.proofOfAddressUrl}
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
                  className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving Application...
                    </>
                  ) : (
                    <>
                      <Receipt className="w-5 h-5" />
                      Submit FIRS Application
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
