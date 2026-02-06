import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { API_BASE_URL, IMAGE_URL } from "../config/apiConfig";
import {
  X,
  Upload,
  Plus,
  Trash2,
  Building2,
  Users,
  FileText,
  AlertCircle,
  ExternalLink,
  MapPin,
  DollarSign,
  UserCheck
} from "lucide-react";
import { toWords } from "number-to-words";

// ================= REUSABLE COMPONENTS (OUTSIDE MAIN COMPONENT) =================
const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  className = "",
  value,
  onChange,
  disabled = false
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
      disabled={disabled}
    />
  </div>
);

const TextArea = ({
  label,
  name,
  placeholder,
  required = false,
  rows = 3,
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

const CACApplicationSummary = ({ application, type = "cac", onViewFull }) => {
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

    const reference = `${type.toUpperCase()}-${application.id}-${Date.now()}`;

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
                type,
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
      onClose: function () {
        toast.error("Payment window closed.");
        setLoading(false);
      }
    });

    handler.openIframe();
  };

  return (
    <div className="p-6 bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            CAC 1.1 Application
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

      {/* Content */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Company Name</p>
            <p className="text-sm font-medium text-gray-900">
              {application.companyName || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Company Type</p>
            <p className="text-sm font-medium text-gray-900">
              {application.companyType || "N/A"}
            </p>
          </div>
        </div>
        {application.adminFeedback && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 mb-1">
              Admin Reply
            </p>
            <p className="text-sm text-blue-800 line-clamp-2">
              {application.adminFeedback}
            </p>
          </div>
        )}

        {isApprovedWithPayment && !application.isPaid && (
          <div className="mt-4 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-200">
            <p className="text-sm text-emerald-800 mb-2">
              Your application has been approved. Please proceed with payment.
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-emerald-700">Amount:</span>
              <span className="text-2xl font-bold text-emerald-900">
                ₦{application.price.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
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
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium hover:from-emerald-700 hover:to-teal-700 transition-all shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={onViewFull}
          className="mt-4 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium hover:from-emerald-700 hover:to-teal-700 transition-all shadow hover:shadow-md"
        >
          View Full Application
        </button>
      )}
    </div>
  );
};

// ================= MAIN COMPONENT =================
export function CacComplianceForm() {
  const [formData, setFormData] = useState({
    // Type of Company
    companyType: "",
    companyName: "",

    // Section A: Company Address
    registeredOfficeAddress: "",
    headOfficeAddress: "",
    emailAddress: "",

    // Section B: Authorized Share Capital
    totalShareCapital: 0,
    numberOfShares: 0,
    pricePerShare: 0,
    shareCapitalInWords: "",
    directorSignature: null,
    directorSignatureUrl: "",
    directorNameAndTel: "",

    // Section C: Directors (array)
    directors: [],

    // Section D: Secretary
    secretaryType: "",

    // Individual Secretary
    secretaryName: "",
    secretaryAddress: "",
    secretaryPhone: "",
    secretaryEmail: "",
    secretaryIdType: "",
    secretaryIdNo: "",
    secretarySignature: null,

    // Firm/Corporation Secretary
    firmName: "",
    firmBnRcNo: "",
    firmPhone: "",
    firmEmail: "",
    firmRegisteredAddress: "",
    firmSecretarySeal: null,
    firmSecretaryNameAndTel: "",

    price: 0
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [hasApplication, setHasApplication] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

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

    const fetchCacApplication = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cac-application`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const text = await res.text();
        if (!text) throw new Error("Empty response from server");

        const data = JSON.parse(text);
        console.log(data);

        if (data.success && data.application) {
          const app = data.application;

          setHasApplication(true);
          setApplicationData(app);
          setIsApproved(app.status === "approved");
          setIsPaid(app.paymentStatus === "paid" || app.paymentReference);

          setFormData({
            ...app,
            directors: parseJsonField(app.directors),
            price: app.price || 0
          });
        }
      } catch (err) {
        console.error("Failed to fetch CAC application:", err);
        toast.error("Failed to fetch your CAC application");
      } finally {
        setFetching(false);
      }
    };

    fetchCacApplication();
  }, [isOpen, token]);

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function numberToWords(amount) {
    if (!amount || amount === 0) return "";
    return toWords(amount) + " naira";
  }

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setFormData((prev) => {
      let updated = { ...prev };

      // ===== FILE INPUT =====
      if (files && files[0]) {
        const file = files[0];
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload only image files");
          return prev;
        }
        updated[name] = file;
        updated[`${name}Url`] = URL.createObjectURL(file); // For preview
      }
      // ===== NUMBER INPUT =====
      else if (type === "number") {
        updated[name] = value === "" ? 0 : Number(value);
      }
      // ===== TEXT INPUT =====
      else {
        updated[name] = value;
      }

      // ===== LIVE CALCULATION =====
      const { numberOfShares, pricePerShare } = updated;

      if (numberOfShares && pricePerShare) {
        updated.totalShareCapital = numberOfShares * pricePerShare;
      }

      updated.shareCapitalInWords = numberToWords(updated.totalShareCapital);

      return updated;
    });
  };

  const handleDirectorChange = (index, key, value) => {
    const directors = [...(formData.directors || [])];
    directors[index] = { ...directors[index], [key]: value };
    setFormData((prev) => ({ ...prev, directors }));
  };

  const addDirector = () => {
    setFormData((prev) => ({
      ...prev,
      directors: [
        ...(prev.directors || []),
        {
          fullName: "",
          residentialAddress: "",
          city: "",
          state: "",
          country: "",
          nationality: "",
          idNo: "",
          idType: "",
          email: "",
          phoneNo: "",
          dateOfBirth: "",
          gender: "",
          signature: null,
          consentDate: ""
        }
      ]
    }));
  };

  const removeDirector = (index) => {
    const directors = [...(formData.directors || [])];
    directors.splice(index, 1);
    setFormData((prev) => ({ ...prev, directors }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.companyType) {
      toast.error("Please select company type");
      return;
    }

    if (!formData.companyName) {
      toast.error("Company name is required");
      return;
    }

    if (!formData.registeredOfficeAddress) {
      toast.error("Registered office address is required");
      return;
    }

    if (formData.companyType !== "Unlimited") {
      if (
        !formData.totalShareCapital ||
        !formData.numberOfShares ||
        !formData.pricePerShare
      ) {
        toast.error("Share capital details are required for this company type");
        return;
      }
    }

    if (!formData.directors || formData.directors.length === 0) {
      toast.error("At least one director is required");
      return;
    }

    if (!formData.secretaryType) {
      toast.error("Please specify secretary type");
      return;
    }

    setLoading(true);

    try {
      const body = new FormData();

      // Append top-level simple fields and files
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (Array.isArray(value)) return; // skip directors array for now
        if (value instanceof File) {
          body.append(key, value);
        } else if (value !== null && value !== undefined) {
          body.append(key, value);
        }
      });

      // Append directors individually
   formData.directors.forEach((director, index) => {
     Object.keys(director).forEach((key) => {
       const value = director[key];
       if (value instanceof File) {
         body.append(`directors[${index}][${key}]`, value);
       } else if (value !== null && value !== undefined) {
         if (typeof value === "object") {
           body.append(`directors[${index}][${key}]`, JSON.stringify(value)); // <-- stringify objects
         } else {
           body.append(`directors[${index}][${key}]`, value);
         }
       }
     });
   });


      // Submit the form
      const res = await fetch(`${API_BASE_URL}/cac-application`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body
      });

      const data = await res.json();

      if (data.success) {
        toast.success("CAC application saved successfully!");
        handleClose();
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to save CAC application");
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
          <CACApplicationSummary
            application={applicationData}
            onViewFull={() => setIsOpen(true)}
          />
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Building2 className="w-5 h-5 inline-block mr-2 -mt-0.5" />
            Open CAC 1.1 Application Form
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full relative overflow-hidden max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                  FORM CAC 1.1
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Application for Registration of Company
                </p>
                <p className="text-xs text-amber-600 mt-1 font-medium">
                  ⚠ Form must be typed and not handwritten
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
                  {/* Type of Company */}
                  <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          Type of Company
                        </h4>
                        <p className="text-sm text-slate-600">
                          Select the type of company to register
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-3">
                        {[
                          {
                            value: "Limited by Shares",
                            label: "Limited by Shares"
                          },
                          {
                            value: "Limited by Guarantee",
                            label: "Limited by Guarantee"
                          },
                          { value: "Unlimited", label: "Unlimited" }
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 p-4 bg-white border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 transition-all"
                          >
                            <input
                              type="radio"
                              name="companyType"
                              value={option.value}
                              checked={formData.companyType === option.value}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="font-medium text-slate-700">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>

                      <Input
                        label="Company Name"
                        name="companyName"
                        placeholder="Enter proposed company name"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                      />
                    </div>
                  </section>

                  {/* Section A: Company Address */}
                  <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          Section A: Company Address
                        </h4>
                        <p className="text-sm text-slate-600">
                          Provide company addresses and contact information
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <TextArea
                        label="Registered Office Address"
                        name="registeredOfficeAddress"
                        placeholder="Enter registered office address"
                        required
                        value={formData.registeredOfficeAddress}
                        onChange={handleChange}
                        rows={3}
                      />

                      <TextArea
                        label="Head Office Address (if different from Registered Office)"
                        name="headOfficeAddress"
                        placeholder="Enter head office address"
                        value={formData.headOfficeAddress}
                        onChange={handleChange}
                        rows={3}
                      />

                      <Input
                        label="Email Address"
                        name="emailAddress"
                        type="email"
                        placeholder="company@example.com"
                        required
                        value={formData.emailAddress}
                        onChange={handleChange}
                      />
                    </div>
                  </section>

                  {/* Section B: Authorized Share Capital */}
                  {formData.companyType &&
                    formData.companyType !== "Unlimited" && (
                      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-start gap-3 mb-6">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <DollarSign className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">
                              Section B: Authorized Share Capital
                            </h4>
                            <p className="text-sm text-slate-600">
                              Define the company's share capital structure
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Total Share Capital Amount (₦)"
                            name="totalShareCapital"
                            type="number"
                            placeholder="e.g., 1000000"
                            required
                            value={formData.totalShareCapital}
                            onChange={handleChange}
                          />

                          <Input
                            label="Amount in Words"
                            name="shareCapitalInWords"
                            placeholder="e.g., One Million Naira"
                            required
                            value={formData.shareCapitalInWords}
                            onChange={handleChange}
                            className="md:col-span-2"
                          />

                          <Input
                            label="Number of Shares"
                            name="numberOfShares"
                            type="number"
                            placeholder="e.g., 1000"
                            required
                            value={formData.numberOfShares}
                            onChange={handleChange}
                          />

                          <Input
                            label="Price per Share (₦)"
                            name="pricePerShare"
                            type="number"
                            placeholder="e.g., 1000"
                            required
                            value={formData.pricePerShare}
                            onChange={handleChange}
                          />

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Director's Signature{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="file"
                              name="directorSignature"
                              accept="image/*"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white text-sm"
                              onChange={handleChange}
                            />
                            {formData.directorSignatureUrl && (
                              <a
                                href={`${IMAGE_URL}${formData.directorSignatureUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View uploaded signature
                              </a>
                            )}
                          </div>

                          <Input
                            label="Name of Director & Tel. No."
                            name="directorNameAndTel"
                            placeholder="e.g., John Doe - 08012345678"
                            required
                            value={formData.directorNameAndTel}
                            onChange={handleChange}
                            className="md:col-span-2"
                          />
                        </div>
                      </section>
                    )}

                  {/* Section C: Particulars of First Directors */}
                  <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">
                            Section C: Particulars of First Directors & Consent
                            to Act
                          </h4>
                          <p className="text-sm text-slate-600">
                            Add director details (minimum 1 required)
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addDirector}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Add Director
                      </button>
                    </div>

                    {!formData.directors || formData.directors.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>
                          No directors added yet. Click "Add Director" to get
                          started.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {formData.directors.map((director, index) => (
                          <div
                            key={index}
                            className="border-2 border-slate-200 rounded-xl p-5 bg-slate-50 relative hover:border-indigo-300 transition-all"
                          >
                            <button
                              type="button"
                              onClick={() => removeDirector(index)}
                              className="absolute top-4 right-4 p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                              title="Remove Director"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <h5 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">
                                {index + 1}
                              </span>
                              Director {index + 1}
                            </h5>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="Full Name *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white md:col-span-2"
                                value={director.fullName || ""}
                                onChange={(e) =>
                                  handleDirectorChange(
                                    index,
                                    "fullName",
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                type="text"
                                placeholder="Residential Address *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white md:col-span-2"
                                value={director.residentialAddress || ""}
                                onChange={(e) =>
                                  handleDirectorChange(
                                    index,
                                    "residentialAddress",
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                type="text"
                                placeholder="City *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
                                value={director.city || ""}
                                onChange={(e) =>
                                  handleDirectorChange(
                                    index,
                                    "city",
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                type="text"
                                placeholder="State *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
                                value={director.state || ""}
                                onChange={(e) =>
                                  handleDirectorChange(
                                    index,
                                    "state",
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                type="text"
                                placeholder="Country of Residence *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
                                value={director.country || ""}
                                onChange={(e) =>
                                  handleDirectorChange(
                                    index,
                                    "country",
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                type="text"
                                placeholder="Nationality *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
                                value={director.nationality || ""}
                                onChange={(e) =>
                                  handleDirectorChange(
                                    index,
                                    "nationality",
                                    e.target.value
                                  )
                                }
                              />

                              <select
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
                                value={director.idType || ""}
                                onChange={(e) =>
                                  handleDirectorChange(
                                    index,
                                    "idType",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select ID Type *</option>
                                <option value="NIN">National ID (NIN)</option>
                                <option value="Voters Card">
                                  Voter's Card
                                </option>
                                <option value="Drivers License">
                                  Driver's License
                                </option>
                                <option value="International Passport">
                                  International Passport
                                </option>
                              </select>

                              <input
                                type="text"
                                placeholder="ID Number *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
                                value={director.idNo || ""}
                                onChange={(e) =>
                                  handleDirectorChange(
                                    index,
                                    "idNo",
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                type="email"
                                placeholder="Email Address *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
                                value={director.email || ""}
                                onChange={(e) =>
                                  handleDirectorChange(
                                    index,
                                    "email",
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                type="tel"
                                placeholder="Phone Number *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
                                value={director.phoneNo || ""}
                                onChange={(e) =>
                                  handleDirectorChange(
                                    index,
                                    "phoneNo",
                                    e.target.value
                                  )
                                }
                              />

                              <input
                                type="date"
                                placeholder="Date of Birth *"
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
                                value={director.dateOfBirth || ""}
                                onChange={(e) =>
                                  handleDirectorChange(
                                    index,
                                    "dateOfBirth",
                                    e.target.value
                                  )
                                }
                              />

                              <select
                                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
                                value={director.gender || ""}
                                onChange={(e) =>
                                  handleDirectorChange(
                                    index,
                                    "gender",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select Gender *</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>

                              <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm font-medium text-blue-900 mb-3">
                                  Consent to Act as Director
                                </p>
                                <p className="text-sm text-blue-700 mb-4 italic">
                                  "I Consent to be a Director of the above-named
                                  Company"
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                      Signature *
                                    </label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="w-full px-3 py-2 border ..."
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        if (!file.type.startsWith("image/")) {
                                          toast.error(
                                            "Please upload only image files"
                                          );
                                          return;
                                        }

                                        handleDirectorChange(
                                          index,
                                          "signature",
                                          file
                                        ); // save file
                                        handleDirectorChange(
                                          index,
                                          "signatureUrl",
                                          URL.createObjectURL(file) // save URL for preview
                                        );
                                      }}
                                    />
                                    {director.signatureUrl && (
                                      <a
                                        href={`${IMAGE_URL}${director.signatureUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                        View signature
                                      </a>
                                    )}
                                  </div>

                                  <input
                                    type="date"
                                    placeholder="Date of Consent"
                                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
                                    value={director.consentDate || ""}
                                    onChange={(e) =>
                                      handleDirectorChange(
                                        index,
                                        "consentDate",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Section D: Secretary */}
                  <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-6">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <UserCheck className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          Section D: Particulars of Secretary
                        </h4>
                        <p className="text-sm text-slate-600">
                          Provide secretary details (Individual or
                          Firm/Corporation)
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Secretary Type <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 p-4 bg-slate-50 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-orange-400 transition-all">
                          <input
                            type="radio"
                            name="secretaryType"
                            value="individual"
                            checked={formData.secretaryType === "individual"}
                            onChange={handleChange}
                            className="w-4 h-4 text-orange-600"
                          />
                          <span className="font-medium text-slate-700">
                            Individual
                          </span>
                        </label>
                        <label className="flex items-center gap-2 p-4 bg-slate-50 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-orange-400 transition-all">
                          <input
                            type="radio"
                            name="secretaryType"
                            value="firm"
                            checked={formData.secretaryType === "firm"}
                            onChange={handleChange}
                            className="w-4 h-4 text-orange-600"
                          />
                          <span className="font-medium text-slate-700">
                            Firm/Corporation
                          </span>
                        </label>
                      </div>
                    </div>

                    {formData.secretaryType === "individual" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Full Name"
                          name="secretaryName"
                          placeholder="Secretary's full name"
                          required
                          value={formData.secretaryName}
                          onChange={handleChange}
                          className="md:col-span-2"
                        />

                        <TextArea
                          label="Address"
                          name="secretaryAddress"
                          placeholder="Secretary's address"
                          required
                          value={formData.secretaryAddress}
                          onChange={handleChange}
                          className="md:col-span-2"
                          rows={2}
                        />

                        <Input
                          label="Phone Number"
                          name="secretaryPhone"
                          type="tel"
                          placeholder="Phone number"
                          required
                          value={formData.secretaryPhone}
                          onChange={handleChange}
                        />

                        <Input
                          label="Email Address"
                          name="secretaryEmail"
                          type="email"
                          placeholder="Email address"
                          required
                          value={formData.secretaryEmail}
                          onChange={handleChange}
                        />

                        <Select
                          label="ID Type"
                          name="secretaryIdType"
                          required
                          value={formData.secretaryIdType}
                          onChange={handleChange}
                          options={[
                            { value: "", label: "Select ID Type" },
                            { value: "NIN", label: "National ID (NIN)" },
                            { value: "Voters Card", label: "Voter's Card" },
                            {
                              value: "Drivers License",
                              label: "Driver's License"
                            },
                            {
                              value: "International Passport",
                              label: "International Passport"
                            }
                          ]}
                        />

                        <Input
                          label="ID Number"
                          name="secretaryIdNo"
                          placeholder="ID number"
                          required
                          value={formData.secretaryIdNo}
                          onChange={handleChange}
                        />

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Signature <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            name="secretarySignature"
                            accept="image/*"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none bg-white text-sm"
                            onChange={handleChange}
                          />
                          {formData.secretarySignatureUrl && (
                            <a
                              href={`${IMAGE_URL}${formData.secretarySignatureUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View signature
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {formData.secretaryType === "firm" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Name of Firm/Corporation"
                          name="firmName"
                          placeholder="Firm/Corporation name"
                          required
                          value={formData.firmName}
                          onChange={handleChange}
                          className="md:col-span-2"
                        />

                        <Input
                          label="BN/RC Number"
                          name="firmBnRcNo"
                          placeholder="Business/Registration number"
                          required
                          value={formData.firmBnRcNo}
                          onChange={handleChange}
                        />

                        <Input
                          label="Phone Number"
                          name="firmPhone"
                          type="tel"
                          placeholder="Phone number"
                          required
                          value={formData.firmPhone}
                          onChange={handleChange}
                        />

                        <Input
                          label="Email Address"
                          name="firmEmail"
                          type="email"
                          placeholder="Email address"
                          required
                          value={formData.firmEmail}
                          onChange={handleChange}
                          className="md:col-span-2"
                        />

                        <TextArea
                          label="Registered Address"
                          name="firmRegisteredAddress"
                          placeholder="Firm's registered address"
                          required
                          value={formData.firmRegisteredAddress}
                          onChange={handleChange}
                          className="md:col-span-2"
                          rows={2}
                        />

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Signature/Seal of Secretary{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="file"
                            name="firmSecretarySeal"
                            accept="image/*"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none bg-white text-sm"
                            onChange={handleChange}
                          />
                          {formData.firmSecretarySealUrl && (
                            <a
                              href={`${IMAGE_URL}${formData.firmSecretarySealUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View seal
                            </a>
                          )}
                        </div>

                        <Input
                          label="Name of Secretary & Tel. No."
                          name="firmSecretaryNameAndTel"
                          placeholder="e.g., Jane Smith - 08098765432"
                          required
                          value={formData.firmSecretaryNameAndTel}
                          onChange={handleChange}
                          className="md:col-span-2"
                        />
                      </div>
                    )}
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
                  className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Submit CAC 1.1 Application
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
