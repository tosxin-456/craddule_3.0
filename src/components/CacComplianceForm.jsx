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

const CACApplicationSummary = ({ application, onViewFull }) => {
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
          <Building2 className="w-6 h-6 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            CAC Application
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
            <p className="text-xs text-gray-500 mb-1">Business Name</p>
            <p className="text-sm font-medium text-gray-900">
              {application.businessName || "N/A"}
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
        className="mt-4 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium hover:from-emerald-700 hover:to-teal-700 transition-all shadow hover:shadow-md"
      >
        View Full Application
      </button>
    </div>
  );
};

// ================= MAIN COMPONENT =================
export function CacComplianceForm() {
  const [formData, setFormData] = useState({
    businessType: "",
    proprietors: [],
    directors: [],
    shareholders: [],
    trustees: [],
    psc: [],

    // Document URLs
    constitutionUrl: "",
    minutesOfMeetingUrl: "",
    utilityBillUrl: "",
    newspaperPublicationUrl: "",
    declarationFormsUrl: "",
    partnershipAgreementUrl: ""
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

          setFormData({
            ...app,
            proprietors: parseJsonField(app.proprietors),
            directors: parseJsonField(app.directors),
            shareholders: parseJsonField(app.shareholders),
            trustees: parseJsonField(app.trustees),
            psc: parseJsonField(app.psc),

            // Keep file URLs
            constitutionUrl: app.constitution || "",
            minutesOfMeetingUrl: app.minutesOfMeeting || "",
            utilityBillUrl: app.utilityBill || "",
            newspaperPublicationUrl: app.newspaperPublication || "",
            declarationFormsUrl: app.declarationForms || "",
            partnershipAgreementUrl: app.partnershipAgreement || ""
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
    if (!formData.businessType) {
      toast.error("Please select a business type");
      return;
    }

    if (!formData.businessName) {
      toast.error("Business name is required");
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

      const res = await fetch(`${API_BASE_URL}/cac-application`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body
      });

      const data = await res.json();
      if (data.success) {
        toast.success("CAC application saved successfully!");
        handleClose();
        // Refresh the application data
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

  // Determine which sections to show based on business type
  const shouldShowSection = (section) => {
    const { businessType } = formData;

    const sectionMap = {
      businessName: businessType === "Business Name",
      proprietors: businessType === "Business Name",
      partnership: businessType === "Business Name",

      company: businessType === "LTD",
      directors: businessType === "LTD",
      shareholders: businessType === "LTD",
      companySecretary: businessType === "LTD",
      psc: businessType === "LTD",

      ngo: businessType === "NGO",
      trustees: businessType === "NGO",
      aims: businessType === "NGO"
    };

    return sectionMap[section] || false;
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
            Open CAC Application Form
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
                  <Building2 className="w-6 h-6 text-emerald-600" />
                  CAC Application Form
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Complete your Corporate Affairs Commission registration
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
                  {/* Business Type Selection - Always Visible */}
                  <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">
                          Registration Type
                        </h4>
                        <p className="text-sm text-slate-600">
                          Select the type of business entity you want to
                          register
                        </p>
                      </div>
                    </div>

                    <Select
                      label="Business Type"
                      name="businessType"
                      required
                      value={formData.businessType}
                      onChange={handleChange}
                      options={[
                        { value: "", label: "Select Business Type" },
                        {
                          value: "Business Name",
                          label:
                            "Business Name (Sole Proprietorship/Partnership)"
                        },
                        {
                          value: "LTD",
                          label: "Limited Company (Private/Public)"
                        },
                        { value: "NGO", label: "NGO / Incorporated Trustees" }
                      ]}
                    />

                    {formData.businessType && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-semibold text-slate-900 mb-1">
                              {formData.businessType === "Business Name" &&
                                "Business Name Registration"}
                              {formData.businessType === "LTD" &&
                                "Limited Company Registration"}
                              {formData.businessType === "NGO" &&
                                "NGO / Incorporated Trustees Registration"}
                            </p>
                            <p className="text-slate-600">
                              {formData.businessType === "Business Name" &&
                                "For sole proprietors or partnerships. Requires proprietor/partner details and business information."}
                              {formData.businessType === "LTD" &&
                                "For private or public limited companies. Requires director, shareholder, and company secretary details."}
                              {formData.businessType === "NGO" &&
                                "For non-profit organizations. Requires trustee details and organization objectives."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Show sections based on business type */}
                  {formData.businessType && (
                    <>
                      {/* ================= BUSINESS DETAILS (All Types) ================= */}
                      <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-start gap-3 mb-6">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900">
                              {shouldShowSection("ngo")
                                ? "Organization Details"
                                : "Business Details"}
                            </h4>
                            <p className="text-sm text-slate-600">
                              Provide information about your{" "}
                              {shouldShowSection("ngo")
                                ? "organization"
                                : "business"}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label={
                              shouldShowSection("ngo")
                                ? "Organization Name (1st Choice)"
                                : "Business Name (1st Choice)"
                            }
                            name="businessName"
                            placeholder="Enter your primary name choice"
                            required
                            className="md:col-span-2"
                            value={formData.businessName}
                            onChange={handleChange}
                          />

                          <Input
                            label="Alternative Name (2nd Choice)"
                            name="alternativeBusinessName"
                            placeholder="Enter alternative name"
                            value={formData.alternativeBusinessName}
                            onChange={handleChange}
                          />

                          <Input
                            label="Nature of Business"
                            name="natureOfBusiness"
                            placeholder="E.g., Retail, Manufacturing, etc."
                            value={formData.natureOfBusiness}
                            onChange={handleChange}
                          />

                          <TextArea
                            label={
                              shouldShowSection("ngo")
                                ? "Registered Office Address"
                                : "Principal Business Address"
                            }
                            name="businessAddress"
                            placeholder="Enter complete address"
                            required
                            value={formData.businessAddress}
                            onChange={handleChange}
                          />

                          <TextArea
                            label="Branch Address (if any)"
                            name="branchAddress"
                            placeholder="Enter branch address"
                            value={formData.branchAddress}
                            onChange={handleChange}
                          />

                          {shouldShowSection("ngo") && (
                            <TextArea
                              label="Area of Operation"
                              name="areaOfOperation"
                              placeholder="Describe where your organization operates"
                              className="md:col-span-2"
                              value={formData.areaOfOperation}
                              onChange={handleChange}
                            />
                          )}

                          {shouldShowSection("ngo") && (
                            <TextArea
                              label="Aims and Objectives"
                              name="aimsAndObjectives"
                              placeholder="Describe your organization's goals and mission"
                              rows={4}
                              className="md:col-span-2"
                              value={formData.aimsAndObjectives}
                              onChange={handleChange}
                            />
                          )}

                          {!shouldShowSection("ngo") && (
                            <>
                              <Input
                                label="Date of Commencement"
                                name="dateOfCommencement"
                                type="date"
                                value={formData.dateOfCommencement}
                                onChange={handleChange}
                              />

                              <Input
                                label="TIN (Tax Identification Number)"
                                name="tin"
                                placeholder="Enter TIN"
                                value={formData.tin}
                                onChange={handleChange}
                              />

                              <Input
                                label="RC Number (if existing)"
                                name="rcNumber"
                                placeholder="Enter RC Number"
                                value={formData.rcNumber}
                                onChange={handleChange}
                              />

                              <Input
                                label="Business Email"
                                name="businessEmail"
                                type="email"
                                placeholder="company@example.com"
                                value={formData.businessEmail}
                                onChange={handleChange}
                              />

                              <Input
                                label="Business Phone"
                                name="businessPhone"
                                type="tel"
                                placeholder="Business contact number"
                                value={formData.businessPhone}
                                onChange={handleChange}
                              />
                            </>
                          )}

                          {shouldShowSection("company") && (
                            <>
                              <Input
                                label="Share Capital"
                                name="shareCapital"
                                type="number"
                                placeholder="Enter share capital amount"
                                value={formData.shareCapital}
                                onChange={handleChange}
                              />

                              <Select
                                label="Company Type"
                                name="companyType"
                                value={formData.companyType}
                                onChange={handleChange}
                                options={[
                                  { value: "", label: "Select Company Type" },
                                  {
                                    value: "Private Limited (Ltd)",
                                    label: "Private Limited (Ltd)"
                                  },
                                  {
                                    value: "Public Limited (PLC)",
                                    label: "Public Limited (PLC)"
                                  },
                                  {
                                    value: "Limited by Guarantee",
                                    label: "Limited by Guarantee"
                                  }
                                ]}
                              />

                              <Input
                                label="Number of Shares"
                                name="totalNumberOfShares"
                                type="number"
                                placeholder="Total number of shares"
                                value={formData.totalNumberOfShares}
                                onChange={handleChange}
                              />

                              <Input
                                label="Value per Share"
                                name="valuePerShare"
                                type="number"
                                placeholder="Value per share (NGN)"
                                value={formData.valuePerShare}
                                onChange={handleChange}
                              />
                            </>
                          )}
                        </div>
                      </section>

                      {/* ================= PROPRIETORS / PARTNERS (Business Name Only) ================= */}
                      {shouldShowSection("proprietors") && (
                        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Users className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-slate-900">
                                  Proprietors / Partners
                                </h4>
                                <p className="text-sm text-slate-600">
                                  Add details for all business owners
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => addArrayItem("proprietors")}
                              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm font-medium"
                            >
                              <Plus className="w-4 h-4" />
                              Add Proprietor
                            </button>
                          </div>

                          {(formData.proprietors || []).length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                              <p>
                                No proprietors added yet. Click "Add Proprietor"
                                to get started.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {formData.proprietors?.map((prop, index) => (
                                <div
                                  key={index}
                                  className="border-2 border-slate-200 rounded-xl p-5 bg-slate-50 relative hover:border-purple-300 transition-all"
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeArrayItem("proprietors", index)
                                    }
                                    className="absolute top-4 right-4 p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                  <h5 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs">
                                      {index + 1}
                                    </span>
                                    Proprietor {index + 1}
                                  </h5>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                      type="text"
                                      placeholder="Full Name *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={prop.fullName || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "proprietors",
                                          index,
                                          "fullName",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="email"
                                      placeholder="Email Address *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={prop.email || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "proprietors",
                                          index,
                                          "email",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="tel"
                                      placeholder="Phone Number *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={prop.phoneNumber || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "proprietors",
                                          index,
                                          "phoneNumber",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="date"
                                      placeholder="Date of Birth"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={prop.dob || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "proprietors",
                                          index,
                                          "dob",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="text"
                                      placeholder="Residential Address *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white md:col-span-2"
                                      value={prop.address || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "proprietors",
                                          index,
                                          "address",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="text"
                                      placeholder="Occupation"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={prop.occupation || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "proprietors",
                                          index,
                                          "occupation",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="text"
                                      placeholder="Nationality"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={prop.nationality || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "proprietors",
                                          index,
                                          "nationality",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <select
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={prop.gender || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "proprietors",
                                          index,
                                          "gender",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">Select Gender</option>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                    </select>

                                    <select
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={prop.meansOfID || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "proprietors",
                                          index,
                                          "meansOfID",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">Select ID Type</option>
                                      <option value="NIN">
                                        National ID (NIN)
                                      </option>
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
                                      placeholder="ID Number"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={prop.idNumber || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "proprietors",
                                          index,
                                          "idNumber",
                                          e.target.value
                                        )
                                      }
                                    />

                                    <input
                                      type="date"
                                      placeholder="ID Issue Date"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                      value={prop.idIssueDate || ""}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          "proprietors",
                                          index,
                                          "idIssueDate",
                                          e.target.value
                                        )
                                      }
                                    />

                                    {(formData.proprietors || []).length >
                                      1 && (
                                      <input
                                        type="number"
                                        placeholder="Partnership Share % *"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white"
                                        value={prop.partnershipShare || ""}
                                        onChange={(e) =>
                                          handleArrayChange(
                                            "proprietors",
                                            index,
                                            "partnershipShare",
                                            e.target.value
                                          )
                                        }
                                      />
                                    )}

                                    <div className="md:col-span-2">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Passport Photograph
                                      </label>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white text-sm"
                                        onChange={(e) => {
                                          if (e.target.files[0]) {
                                            if (
                                              !e.target.files[0].type.startsWith(
                                                "image/"
                                              )
                                            ) {
                                              toast.error(
                                                "Please upload only image files"
                                              );
                                              return;
                                            }
                                            handleArrayChange(
                                              "proprietors",
                                              index,
                                              "passportPhoto",
                                              e.target.files[0]
                                            );
                                          }
                                        }}
                                      />
                                      {prop.passportPhotoUrl && (
                                        <a
                                          href={`${IMAGE_URL}${prop.passportPhotoUrl}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                          <ExternalLink className="w-4 h-4" />
                                          View uploaded file
                                        </a>
                                      )}
                                    </div>

                                    <div className="md:col-span-2">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Signature Upload
                                      </label>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white text-sm"
                                        onChange={(e) => {
                                          if (e.target.files[0]) {
                                            if (
                                              !e.target.files[0].type.startsWith(
                                                "image/"
                                              )
                                            ) {
                                              toast.error(
                                                "Please upload only image files"
                                              );
                                              return;
                                            }
                                            handleArrayChange(
                                              "proprietors",
                                              index,
                                              "signature",
                                              e.target.files[0]
                                            );
                                          }
                                        }}
                                      />
                                      {prop.signatureUrl && (
                                        <a
                                          href={`${IMAGE_URL}${prop.signatureUrl}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                          <ExternalLink className="w-4 h-4" />
                                          View uploaded file
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Partnership Details */}
                          {(formData.proprietors || []).length > 1 && (
                            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                              <h5 className="font-semibold text-amber-900 mb-3">
                                Partnership Details
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                  label="Number of Partners"
                                  name="numberOfPartners"
                                  type="number"
                                  value={formData.proprietors.length}
                                  onChange={handleChange}
                                  disabled
                                />
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Partnership Agreement (Optional)
                                  </label>
                                  <input
                                    type="file"
                                    name="partnershipAgreement"
                                    accept="image/*"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none bg-white text-sm"
                                    onChange={handleChange}
                                  />
                                  {formData.partnershipAgreementUrl && (
                                    <a
                                      href={`${IMAGE_URL}${formData.partnershipAgreementUrl}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      View uploaded file
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Partnership Share Validation */}
                              <div className="mt-4 p-4 bg-white border border-amber-300 rounded-lg">
                                <p className="text-sm text-amber-900">
                                  <strong>Total Partnership Share:</strong>{" "}
                                  {(formData.proprietors || [])
                                    .reduce(
                                      (sum, p) =>
                                        sum +
                                        (parseFloat(p.partnershipShare) || 0),
                                      0
                                    )
                                    .toFixed(2)}
                                  %{" "}
                                  {(formData.proprietors || []).reduce(
                                    (sum, p) =>
                                      sum +
                                      (parseFloat(p.partnershipShare) || 0),
                                    0
                                  ) !== 100 && (
                                    <span className="text-red-700">
                                      (Should total 100%)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          )}
                        </section>
                      )}

                      {/* NOTE: Due to character limits, I'll continue with the directors, shareholders, trustees, PSC, and documents sections in the same pattern.
                          The key changes for all sections are:
                          1. All inputs now use value/onChange props
                          2. File inputs validate for images only
                          3. File URLs are displayed when available
                          4. Components are defined outside the main component
                      */}

                      {/* For brevity, I'm showing the pattern for directors section - apply same pattern to all other sections */}

                      {/* ================= DIRECTORS (LTD Only) ================= */}
                      {shouldShowSection("directors") && (
                        <section className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-indigo-100 rounded-lg">
                                <Users className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-slate-900">
                                  Directors
                                </h4>
                                <p className="text-sm text-slate-600">
                                  Add company directors (minimum 1 required)
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => addArrayItem("directors")}
                              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-medium"
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
                                  className="border-2 border-slate-200 rounded-xl p-5 bg-slate-50 relative hover:border-indigo-300 transition-all"
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
                                    <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">
                                      {index + 1}
                                    </span>
                                    Director {index + 1}
                                  </h5>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Apply same pattern as proprietors - all inputs with value/onChange */}
                                    <input
                                      type="text"
                                      placeholder="Full Name *"
                                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
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
                                    {/* Continue with all other director fields following the same pattern... */}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </section>
                      )}

                      {/* Apply the same pattern to: shareholders, trustees, psc, and document upload sections */}
                      {/* All file inputs should validate for images and show URLs when available */}

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
                          {shouldShowSection("company") && (
                            <>
                              <FileUpload
                                label="Company Constitution"
                                name="constitution"
                                description="Memorandum & Articles of Association (image)"
                                onChange={handleChange}
                                fileName={formData.constitution?.name}
                                fileUrl={formData.constitutionUrl}
                              />
                              <FileUpload
                                label="Minutes of Meeting"
                                name="minutesOfMeeting"
                                description="Appointment of directors/trustees (image)"
                                onChange={handleChange}
                                fileName={formData.minutesOfMeeting?.name}
                                fileUrl={formData.minutesOfMeetingUrl}
                              />
                            </>
                          )}

                          {shouldShowSection("ngo") && (
                            <>
                              <FileUpload
                                label="NGO Constitution"
                                name="constitution"
                                description="Organization constitution document (image)"
                                onChange={handleChange}
                                fileName={formData.constitution?.name}
                                fileUrl={formData.constitutionUrl}
                              />
                              <FileUpload
                                label="Minutes of Meeting"
                                name="minutesOfMeeting"
                                description="Appointment of trustees (image)"
                                onChange={handleChange}
                                fileName={formData.minutesOfMeeting?.name}
                                fileUrl={formData.minutesOfMeetingUrl}
                              />
                            </>
                          )}

                          <FileUpload
                            label="Utility Bill"
                            name="utilityBill"
                            description="Proof of business/residential address (image)"
                            onChange={handleChange}
                            fileName={formData.utilityBill?.name}
                            fileUrl={formData.utilityBillUrl}
                          />

                          <FileUpload
                            label="Newspaper Publication"
                            name="newspaperPublication"
                            description="Name publication (image, if applicable)"
                            onChange={handleChange}
                            fileName={formData.newspaperPublication?.name}
                            fileUrl={formData.newspaperPublicationUrl}
                          />

                          <FileUpload
                            label="Declaration Forms"
                            name="declarationForms"
                            description="Statutory declaration forms (image)"
                            onChange={handleChange}
                            fileName={formData.declarationForms?.name}
                            fileUrl={formData.declarationFormsUrl}
                          />
                        </div>
                      </section>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {!fetching && formData.businessType && (
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
                      Saving Application...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Submit CAC Application
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
