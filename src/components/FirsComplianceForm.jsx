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

// ================= REUSABLE COMPONENTS (OUTSIDE MAIN COMPONENT) =================
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
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}
        >
          {getStatusIcon(application.status)}{" "}
          {application.status?.charAt(0).toUpperCase() +
            application.status?.slice(1)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">
              Business/Individual Name
            </p>
            <p className="text-sm font-medium text-gray-900">
              {application.businessName ||
                `${application.firstName || ""} ${application.lastName || ""}` ||
                "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Registration Type</p>
            <p className="text-sm font-medium text-gray-900">
              {application.registrationType || "N/A"}
            </p>
          </div>
        </div>

        {application.adminFeedback && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium mb-1">
              Admin Feedback
            </p>
            <p className="text-sm text-blue-900">{application.adminFeedback}</p>
          </div>
        )}
      </div>

      <button
        onClick={onViewFull}
        className="mt-4 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow hover:shadow-md"
      >
        View Full Application
      </button>
    </div>
  );
};

// ================= MAIN COMPONENT =================
export function FirsComplianceForm() {
  const [formData, setFormData] = useState({
    registrationType: "",
    taxPayerType: "",
    businessName: "",
    rcNumber: "",
    businessAddress: "",
    businessEmail: "",
    businessPhone: "",
    dateOfIncorporation: "",
    natureOfBusiness: "",
    annualTurnover: "",
    numberOfEmployees: "",

    // Individual fields
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    nin: "",
    bvn: "",
    residentialAddress: "",
    employmentStatus: "",
    employerName: "",
    employerAddress: "",
    monthlyIncome: "",

    // Contact person (for companies)
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    contactPersonDesignation: "",

    // Directors/Partners
    directors: [],
    partners: [],

    // Tax information
    previousTin: "",
    existingTaxOffice: "",
    registeredForVAT: "",
    vatNumber: "",
    registeredForWHT: "",

    // Bank details
    bankName: "",
    accountNumber: "",
    accountName: "",

    // Documents
    cacCertificate: null,
    utilityBill: null,
    validID: null,
    passportPhoto: null,
    bankStatement: null,
    businessPermit: null,

    // Document URLs
    cacCertificateUrl: "",
    utilityBillUrl: "",
    validIDUrl: "",
    passportPhotoUrl: "",
    bankStatementUrl: "",
    businessPermitUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [hasApplication, setHasApplication] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  const token = localStorage.getItem("token");

useEffect(() => {
  setFetching(true);

  // Safe parser for fields that can be array or JSON string
  const parseJsonField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return [];
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
      console.log(data);

      if (data.success && data.application) {
        const app = data.application;
        setHasApplication(true);
        setApplicationData(app);

        setFormData({
          ...app,
          directors: parseJsonField(app.directors),
          partners: parseJsonField(app.partners),

          // Keep file URLs
          cacCertificateUrl: app.cacCertificate || "",
          utilityBillUrl: app.utilityBill || "",
          validIDUrl: app.validID || "",
          passportPhotoUrl: app.passportPhoto || "",
          bankStatementUrl: app.bankStatement || "",
          businessPermitUrl: app.businessPermit || ""
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
      // Validate that it's an image
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
    // Validation
    if (!formData.registrationType) {
      toast.error("Please select a registration type");
      return;
    }

    if (!formData.taxPayerType) {
      toast.error("Please select taxpayer type");
      return;
    }

    if (formData.taxPayerType === "Corporate" && !formData.businessName) {
      toast.error("Business name is required");
      return;
    }

    if (
      formData.taxPayerType === "Individual" &&
      (!formData.firstName || !formData.lastName)
    ) {
      toast.error("First name and last name are required");
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();

      for (const key in formData) {
        if (Array.isArray(formData[key])) {
          body.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] instanceof File) {
          body.append(key, formData[key]);
        } else if (!key.endsWith("Url")) {
          // Don't send URL fields back
          body.append(key, formData[key] || "");
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
        // Refresh the application data
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

  const shouldShowSection = (section) => {
    const { registrationType, taxPayerType } = formData;

    const sectionMap = {
      individual: taxPayerType === "Individual",
      employment: taxPayerType === "Individual",
      corporate: taxPayerType === "Corporate",
      directors:
        taxPayerType === "Corporate" && registrationType === "Company TIN",
      partners:
        taxPayerType === "Corporate" && registrationType === "Partnership TIN",
      vat: registrationType === "VAT Registration",
      wht: registrationType === "WHT Registration"
    };

    return sectionMap[section] || false;
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
                  Complete your Federal Inland Revenue Service registration
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
                  {/* Registration Type Selection */}
                  <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          Registration Information
                        </h4>
                        <p className="text-sm text-slate-600">
                          Select the type of tax registration you need
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Registration Type"
                        name="registrationType"
                        required
                        value={formData.registrationType}
                        onChange={handleChange}
                        options={[
                          { value: "", label: "Select Registration Type" },
                          {
                            value: "TIN Registration",
                            label:
                              "TIN (Tax Identification Number) Registration"
                          },
                          {
                            value: "Company TIN",
                            label: "Company TIN Registration"
                          },
                          {
                            value: "Partnership TIN",
                            label: "Partnership TIN Registration"
                          },
                          {
                            value: "VAT Registration",
                            label: "VAT Registration"
                          },
                          {
                            value: "WHT Registration",
                            label: "Withholding Tax (WHT) Registration"
                          },
                          {
                            value: "PAYE Registration",
                            label: "PAYE (Pay As You Earn) Registration"
                          }
                        ]}
                      />

                      <Select
                        label="Taxpayer Type"
                        name="taxPayerType"
                        required
                        value={formData.taxPayerType}
                        onChange={handleChange}
                        options={[
                          { value: "", label: "Select Taxpayer Type" },
                          { value: "Individual", label: "Individual" },
                          { value: "Corporate", label: "Corporate/Business" }
                        ]}
                      />
                    </div>

                    {formData.registrationType && formData.taxPayerType && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-semibold text-slate-900 mb-1">
                              {formData.registrationType} -{" "}
                              {formData.taxPayerType}
                            </p>
                            <p className="text-slate-600">
                              {formData.taxPayerType === "Individual" &&
                                "For individual taxpayers. Requires personal information and identification documents."}
                              {formData.taxPayerType === "Corporate" &&
                                "For businesses and organizations. Requires company details, directors/partners information, and business documents."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Show sections based on taxpayer type */}
                  {formData.taxPayerType && (
                    <>
                      {/* ================= INDIVIDUAL DETAILS ================= */}
                      {shouldShowSection("individual") && (
                        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                          <div className="flex items-start gap-3 mb-6">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <Users className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">
                                Personal Information
                              </h4>
                              <p className="text-sm text-slate-600">
                                Provide your personal details
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                              label="First Name"
                              name="firstName"
                              placeholder="Enter first name"
                              required
                              value={formData.firstName}
                              onChange={handleChange}
                            />

                            <Input
                              label="Middle Name"
                              name="middleName"
                              placeholder="Enter middle name"
                              value={formData.middleName}
                              onChange={handleChange}
                            />

                            <Input
                              label="Last Name"
                              name="lastName"
                              placeholder="Enter last name"
                              required
                              value={formData.lastName}
                              onChange={handleChange}
                            />

                            <Input
                              label="Date of Birth"
                              name="dateOfBirth"
                              type="date"
                              required
                              value={formData.dateOfBirth}
                              onChange={handleChange}
                            />

                            <Select
                              label="Gender"
                              name="gender"
                              required
                              value={formData.gender}
                              onChange={handleChange}
                              options={[
                                { value: "", label: "Select Gender" },
                                { value: "Male", label: "Male" },
                                { value: "Female", label: "Female" }
                              ]}
                            />

                            <Input
                              label="Nationality"
                              name="nationality"
                              placeholder="Enter nationality"
                              required
                              value={formData.nationality}
                              onChange={handleChange}
                            />

                            <Input
                              label="NIN (National ID Number)"
                              name="nin"
                              placeholder="Enter NIN"
                              required
                              value={formData.nin}
                              onChange={handleChange}
                            />

                            <Input
                              label="BVN (Bank Verification Number)"
                              name="bvn"
                              placeholder="Enter BVN"
                              required
                              value={formData.bvn}
                              onChange={handleChange}
                            />

                            <Input
                              label="Phone Number"
                              name="businessPhone"
                              type="tel"
                              placeholder="Enter phone number"
                              required
                              value={formData.businessPhone}
                              onChange={handleChange}
                            />

                            <Input
                              label="Email Address"
                              name="businessEmail"
                              type="email"
                              placeholder="Enter email address"
                              required
                              className="md:col-span-3"
                              value={formData.businessEmail}
                              onChange={handleChange}
                            />

                            <TextArea
                              label="Residential Address"
                              name="residentialAddress"
                              placeholder="Enter complete residential address"
                              required
                              value={formData.residentialAddress}
                              onChange={handleChange}
                            />
                          </div>
                        </section>
                      )}

                      {/* ================= EMPLOYMENT DETAILS (Individual) ================= */}
                      {shouldShowSection("employment") && (
                        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                          <div className="flex items-start gap-3 mb-6">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <FileText className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">
                                Employment Information
                              </h4>
                              <p className="text-sm text-slate-600">
                                Provide employment and income details
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                              label="Employment Status"
                              name="employmentStatus"
                              value={formData.employmentStatus}
                              onChange={handleChange}
                              options={[
                                {
                                  value: "",
                                  label: "Select Employment Status"
                                },
                                { value: "Employed", label: "Employed" },
                                {
                                  value: "Self-Employed",
                                  label: "Self-Employed"
                                },
                                { value: "Unemployed", label: "Unemployed" },
                                { value: "Student", label: "Student" },
                                { value: "Retired", label: "Retired" }
                              ]}
                            />

                            <Input
                              label="Monthly Income (NGN)"
                              name="monthlyIncome"
                              type="number"
                              placeholder="Enter monthly income"
                              value={formData.monthlyIncome}
                              onChange={handleChange}
                            />

                            <Input
                              label="Employer Name"
                              name="employerName"
                              placeholder="Enter employer name"
                              className="md:col-span-2"
                              value={formData.employerName}
                              onChange={handleChange}
                            />

                            <TextArea
                              label="Employer Address"
                              name="employerAddress"
                              placeholder="Enter employer address"
                              value={formData.employerAddress}
                              onChange={handleChange}
                            />
                          </div>
                        </section>
                      )}

                      {/* ================= CORPORATE DETAILS ================= */}
                      {shouldShowSection("corporate") && (
                        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                          <div className="flex items-start gap-3 mb-6">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <Receipt className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">
                                Business Information
                              </h4>
                              <p className="text-sm text-slate-600">
                                Provide details about your business
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Business/Company Name"
                              name="businessName"
                              placeholder="Enter business name"
                              required
                              className="md:col-span-2"
                              value={formData.businessName}
                              onChange={handleChange}
                            />

                            <Input
                              label="RC Number"
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

                            <Input
                              label="Nature of Business"
                              name="natureOfBusiness"
                              placeholder="E.g., Retail, Manufacturing, Services"
                              required
                              value={formData.natureOfBusiness}
                              onChange={handleChange}
                            />

                            <Input
                              label="Annual Turnover (NGN)"
                              name="annualTurnover"
                              type="number"
                              placeholder="Enter annual turnover"
                              value={formData.annualTurnover}
                              onChange={handleChange}
                            />

                            <Input
                              label="Number of Employees"
                              name="numberOfEmployees"
                              type="number"
                              placeholder="Enter number of employees"
                              value={formData.numberOfEmployees}
                              onChange={handleChange}
                            />

                            <Input
                              label="Business Email"
                              name="businessEmail"
                              type="email"
                              placeholder="business@example.com"
                              required
                              value={formData.businessEmail}
                              onChange={handleChange}
                            />

                            <Input
                              label="Business Phone"
                              name="businessPhone"
                              type="tel"
                              placeholder="Business contact number"
                              required
                              value={formData.businessPhone}
                              onChange={handleChange}
                            />

                            <TextArea
                              label="Business Address"
                              name="businessAddress"
                              placeholder="Enter complete business address"
                              required
                              value={formData.businessAddress}
                              onChange={handleChange}
                            />
                          </div>
                        </section>
                      )}

                      {/* ================= CONTACT PERSON (Corporate) ================= */}
                      {shouldShowSection("corporate") && (
                        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                          <div className="flex items-start gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                              <Users className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">
                                Contact Person
                              </h4>
                              <p className="text-sm text-slate-600">
                                Primary contact for tax matters
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              label="Contact Person Name"
                              name="contactPersonName"
                              placeholder="Enter full name"
                              required
                              value={formData.contactPersonName}
                              onChange={handleChange}
                            />

                            <Input
                              label="Designation/Position"
                              name="contactPersonDesignation"
                              placeholder="E.g., Finance Manager"
                              required
                              value={formData.contactPersonDesignation}
                              onChange={handleChange}
                            />

                            <Input
                              label="Email Address"
                              name="contactPersonEmail"
                              type="email"
                              placeholder="contact@example.com"
                              required
                              value={formData.contactPersonEmail}
                              onChange={handleChange}
                            />

                            <Input
                              label="Phone Number"
                              name="contactPersonPhone"
                              type="tel"
                              placeholder="Contact phone number"
                              required
                              value={formData.contactPersonPhone}
                              onChange={handleChange}
                            />
                          </div>
                        </section>
                      )}

                      {/* ================= DIRECTORS (Company) ================= */}
                      {shouldShowSection("directors") && (
                        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-teal-100 rounded-lg">
                                <Users className="w-5 h-5 text-teal-600" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-slate-900">
                                  Directors
                                </h4>
                                <p className="text-sm text-slate-600">
                                  Add company directors
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => addArrayItem("directors")}
                              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all text-sm font-medium"
                            >
                              <Plus className="w-4 h-4" />
                              Add Director
                            </button>
                          </div>

                          {(formData.directors || []).length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                              <p>
                                No directors added yet. Click "Add Director" to
                                get started.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {formData.directors.map((director, index) => (
                                <div
                                  key={index}
                                  className="border-2 border-slate-200 rounded-xl p-5 bg-slate-50 relative hover:border-teal-300 transition-all"
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeArrayItem("directors", index)
                                    }
                                    className="absolute top-4 right-4 p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                  <h5 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs">
                                      {index + 1}
                                    </span>
                                    Director {index + 1}
                                  </h5>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                      type="text"
                                      placeholder="Full Name *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
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
                                      type="email"
                                      placeholder="Email Address *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={director.email || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "directors",
                                          index,
                                          "email",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="tel"
                                      placeholder="Phone Number *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={director.phoneNumber || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "directors",
                                          index,
                                          "phoneNumber",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="text"
                                      placeholder="NIN (National ID Number) *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={director.nin || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "directors",
                                          index,
                                          "nin",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="text"
                                      placeholder="BVN *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={director.bvn || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "directors",
                                          index,
                                          "bvn",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="text"
                                      placeholder="Designation/Position"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={director.designation || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "directors",
                                          index,
                                          "designation",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="text"
                                      placeholder="Address *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none bg-white md:col-span-2"
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
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </section>
                      )}

                      {/* ================= PARTNERS (Partnership) ================= */}
                      {shouldShowSection("partners") && (
                        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-violet-100 rounded-lg">
                                <Users className="w-5 h-5 text-violet-600" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-slate-900">
                                  Partners
                                </h4>
                                <p className="text-sm text-slate-600">
                                  Add business partners
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => addArrayItem("partners")}
                              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all text-sm font-medium"
                            >
                              <Plus className="w-4 h-4" />
                              Add Partner
                            </button>
                          </div>

                          {(formData.partners || []).length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                              <p>
                                No partners added yet. Click "Add Partner" to
                                get started.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {formData.partners.map((partner, index) => (
                                <div
                                  key={index}
                                  className="border-2 border-slate-200 rounded-xl p-5 bg-slate-50 relative hover:border-violet-300 transition-all"
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeArrayItem("partners", index)
                                    }
                                    className="absolute top-4 right-4 p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                  <h5 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs">
                                      {index + 1}
                                    </span>
                                    Partner {index + 1}
                                  </h5>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                      type="text"
                                      placeholder="Full Name *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={partner.fullName || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "partners",
                                          index,
                                          "fullName",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="email"
                                      placeholder="Email Address *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={partner.email || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "partners",
                                          index,
                                          "email",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="tel"
                                      placeholder="Phone Number *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={partner.phoneNumber || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "partners",
                                          index,
                                          "phoneNumber",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="number"
                                      placeholder="Partnership Share % *"
                                      min="0"
                                      max="100"
                                      step="0.01"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={partner.partnershipShare || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "partners",
                                          index,
                                          "partnershipShare",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="text"
                                      placeholder="NIN (National ID Number)"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={partner.nin || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "partners",
                                          index,
                                          "nin",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="text"
                                      placeholder="BVN"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={partner.bvn || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "partners",
                                          index,
                                          "bvn",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="text"
                                      placeholder="Address *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none bg-white md:col-span-2"
                                      value={partner.address || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "partners",
                                          index,
                                          "address",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </section>
                      )}

                      {/* ================= TAX INFORMATION ================= */}
                      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-start gap-3 mb-6">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Receipt className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">
                              Tax Information
                            </h4>
                            <p className="text-sm text-slate-600">
                              Previous tax registration details (if applicable)
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Previous TIN (if any)"
                            name="previousTin"
                            placeholder="Enter previous TIN"
                            value={formData.previousTin}
                            onChange={handleChange}
                          />

                          <Input
                            label="Existing Tax Office"
                            name="existingTaxOffice"
                            placeholder="E.g., Lagos State Tax Office"
                            value={formData.existingTaxOffice}
                            onChange={handleChange}
                          />

                          <Select
                            label="Registered for VAT?"
                            name="registeredForVAT"
                            value={formData.registeredForVAT}
                            onChange={handleChange}
                            options={[
                              { value: "", label: "Select Option" },
                              { value: "Yes", label: "Yes" },
                              { value: "No", label: "No" }
                            ]}
                          />

                          {formData.registeredForVAT === "Yes" && (
                            <Input
                              label="VAT Number"
                              name="vatNumber"
                              placeholder="Enter VAT number"
                              value={formData.vatNumber}
                              onChange={handleChange}
                            />
                          )}

                          <Select
                            label="Registered for WHT?"
                            name="registeredForWHT"
                            value={formData.registeredForWHT}
                            onChange={handleChange}
                            options={[
                              { value: "", label: "Select Option" },
                              { value: "Yes", label: "Yes" },
                              { value: "No", label: "No" }
                            ]}
                          />
                        </div>
                      </section>

                      {/* ================= BANK DETAILS ================= */}
                      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-start gap-3 mb-6">
                          <div className="p-2 bg-cyan-100 rounded-lg">
                            <FileText className="w-5 h-5 text-cyan-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">
                              Bank Details
                            </h4>
                            <p className="text-sm text-slate-600">
                              Primary bank account information
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input
                            label="Bank Name"
                            name="bankName"
                            placeholder="Enter bank name"
                            required
                            value={formData.bankName}
                            onChange={handleChange}
                          />

                          <Input
                            label="Account Number"
                            name="accountNumber"
                            placeholder="Enter account number"
                            required
                            value={formData.accountNumber}
                            onChange={handleChange}
                          />

                          <Input
                            label="Account Name"
                            name="accountName"
                            placeholder="Enter account name"
                            required
                            value={formData.accountName}
                            onChange={handleChange}
                          />
                        </div>
                      </section>

                      {/* ================= DOCUMENT UPLOADS ================= */}
                      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-start gap-3 mb-6">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <FileText className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">
                              Supporting Documents
                            </h4>
                            <p className="text-sm text-slate-600">
                              Upload required documents (images only)
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {shouldShowSection("corporate") && (
                            <FileUpload
                              label="CAC Certificate"
                              name="cacCertificate"
                              description="Certificate of Incorporation (image)"
                              onChange={handleChange}
                              fileName={formData.cacCertificate?.name}
                              fileUrl={formData.cacCertificateUrl}
                            />
                          )}

                          <FileUpload
                            label="Valid ID"
                            name="validID"
                            description="National ID, Driver's License, or Passport (image)"
                            onChange={handleChange}
                            fileName={formData.validID?.name}
                            fileUrl={formData.validIDUrl}
                          />

                          <FileUpload
                            label="Passport Photograph"
                            name="passportPhoto"
                            description="Recent passport-sized photograph"
                            onChange={handleChange}
                            fileName={formData.passportPhoto?.name}
                            fileUrl={formData.passportPhotoUrl}
                          />

                          <FileUpload
                            label="Utility Bill"
                            name="utilityBill"
                            description="Proof of address (not older than 3 months, image)"
                            onChange={handleChange}
                            fileName={formData.utilityBill?.name}
                            fileUrl={formData.utilityBillUrl}
                          />

                          <FileUpload
                            label="Bank Statement"
                            name="bankStatement"
                            description="Recent bank statement (last 3 months, image)"
                            onChange={handleChange}
                            fileName={formData.bankStatement?.name}
                            fileUrl={formData.bankStatementUrl}
                          />

                          {shouldShowSection("corporate") && (
                            <FileUpload
                              label="Business Permit/License"
                              name="businessPermit"
                              description="Business operating license (image)"
                              onChange={handleChange}
                              fileName={formData.businessPermit?.name}
                              fileUrl={formData.businessPermitUrl}
                            />
                          )}
                        </div>
                      </section>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {!fetching && formData.taxPayerType && (
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
